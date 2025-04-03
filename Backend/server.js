require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;

// Verificar si las variables de entorno están definidas
if (
   !process.env.EMAIL_USER ||
   !process.env.EMAIL_PASS ||
   !process.env.RECIPIENT_EMAIL
) {
   console.error("❌ ERROR: Faltan variables de entorno en el archivo .env");
   process.exit(1);
}

// Middlewares
app.use(
   cors({
      origin: "*", // Solo permitir solicitudes desde este origen
      methods: ["POST", "OPTIONS"], // Permitir los métodos POST y OPTIONS
      allowedHeaders: ["Content-Type", "Authorization"], // Permitir estos encabezados
   })
);

app.use((req, res, next) => {
   console.log("Solicitud recibida:", req.method, req.url); // Debugging para ver si llega la solicitud
   next();
});

// Middleware para analizar JSON
app.use(express.json());

// Ruta para enviar correos
app.post("/send-email", async (req, res) => {
   const { name, email, phone, message } = req.body;

   // Validar que los campos obligatorios estén presentes
   if (!name || !email || !message) {
      return res.status(400).json({
         success: false,
         message:
            "Faltan datos obligatorios. Asegúrese de que 'Nombre', 'Correo electrónico' y 'Mensaje' estén completos.",
      });
   }

   try {
      const transporter = nodemailer.createTransport({
         service: "gmail",
         auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
         },
      });

      const mailOptions = {
         from: process.env.EMAIL_USER,
         to: email,
         cc: process.env.RECIPIENT_EMAIL,
         subject: "Gracias por contactar con Joan Company | FalconFPV",
         html: `
         <html>
            <head>
               <style>
                  body {
                     font-family: Arial, sans-serif;
                     background-color: #f4f4f9;
                     color: #333;
                     padding: 20px;
                  }
                  .container {
                     max-width: 600px;
                     margin: 0 auto;
                     background-color: #fafeff;
                     padding: 20px;
                     border-radius: 8px;
                     box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  }
                  h1 {
                     color: #F76008;
                  }
                  p {
                     font-size: 16px;
                     line-height: 1.6;
                 	color: #0D0D0D
                  }
                  .info {
                     background-color: #f9f9f9;
                     padding: 10px;
                     margin: 10px 0;
                     border-left: 5px solid #F76008;
                  }
                  .footer {
                     font-size: 12px;
                     color: #777;
                     text-align: center;
                     margin-top: 20px;
                  }
               </style>
            </head>
            <body>
               <div class="container">
                  <h1>Gracias por tu mensaje, ${name}!</h1>
                  <p>He recibido tu mensaje y me pondré en contacto contigo lo antes posible.</p>
                  <div class="info">
                     <p><strong>Correo:</strong> ${email}</p>
                     <p><strong>Teléfono:</strong> ${
                        phone || "No proporcionado"
                     }</p>
                     <p><strong>Mensaje:</strong></p>
                     <p>${message}</p>
                  </div>
                 <hr/>
                  <div class="footer">
                     <p>Joan Company | Copyright ©  2025</p>
                  </div>
               </div>
            </body>
         </html>
         `,
      };

      // Enviar el correo
      await transporter.sendMail(mailOptions);

      res.status(200).json({
         success: true,
         message: "Correo enviado con éxito",
      });
   } catch (error) {
      console.error("❌ ERROR al enviar correo:", error.message);
      res.status(500).json({
         success: false,
         message: "Error al enviar el correo",
      });
   }
});

// Responder a solicitudes OPTIONS (Preflight)
app.options("*", (req, res) => {
   res.sendStatus(200); // Aceptar solicitudes OPTIONS sin problemas
});

app.get("/", (req, res) => {
   res.send("Servidor funcionando 🚀");
});

// Iniciar servidor
app.listen(PORT, () => {
   console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
});