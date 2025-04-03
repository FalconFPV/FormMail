import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export default async (req, res) => {
   // Configuración de CORS (permitir solicitudes desde localhost:3000)
   res.setHeader(
      "Access-Control-Allow-Origin",
      "https://falconfpv.github.io"
   );
   res.setHeader("Access-Control-Allow-Methods", "POST");
   res.setHeader("Access-Control-Allow-Headers", "Content-Type");

   // Si la solicitud es OPTIONS (pre-flight request de CORS), responde inmediatamente
   if (req.method === "OPTIONS") {
      return res.status(200).end();
   }

   if (req.method !== "POST") {
      return res
         .status(405)
         .json({ success: false, message: "Método no permitido" });
   }

   const { name, email, phone, message } = req.body;

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
         subject: "Gracias por contactar con Joan Company | FalconFPV",
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
                color: #f76008;
              }
              p {
                font-size: 16px;
                line-height: 1.6;
                color: #0d0d0d;
              }
              .info {
                background-color: #f9f9f9;
                padding: 10px;
                margin: 10px 0;
                border-left: 5px solid #f76008;
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
                <p><strong>Teléfono:</strong> ${phone || "No proporcionado"}</p>
                <p><strong>Mensaje:</strong></p>
                <p>${message}</p>
              </div>
              <hr />
              <div class="footer">
                <p>Joan Company | Copyright © 2025</p>
              </div>
            </div>
          </body>
        </html>
      `,
      };

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
};
