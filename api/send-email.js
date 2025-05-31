import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

export default async (req, res) => {
   // Configuración de CORS (permitir solicitudes desde localhost:3000)
   res.setHeader(
      "Access-Control-Allow-Origin",
      "https://www.joancompany.es"
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
          <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Mensaje Recibido</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f9;
                        color: #333;
                        margin: 0;
                        padding: 20px;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #fafeff;
                        padding: 25px;
                        border-radius: 8px;
                        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                        text-align: left;
                    }
                    h1 {
                        color: #f76008;
                        font-size: 24px;
                        margin-bottom: 15px;
                    }
                    p {
                        font-size: 16px;
                        line-height: 1.6;
                        margin: 10px 0;
                    }
                    .info {
                        background-color: #f9f9f9;
                        padding: 15px;
                        margin: 20px 0;
                        border-left: 5px solid #f76008;
                        border-radius: 5px;
                    }
                    .info p {
                        margin: 5px 0;
                    }
                    hr {
                        border: none;
                        border-top: 1px solid #ddd;
                        margin: 20px 0;
                    }
                    .footer {
                        font-size: 12px;
                        color: gray !important;
                        text-align: center;
                        margin-top: 20px;
                    }
                    .pdf-notice {
                        background-color: #f0f8ff;
                        padding: 15px;
                        margin: 20px 0;
                        border-left: 5px solid #f76008;
                        border-radius: 5px;
                    }
                    
                    .pdf-notice p {
                        margin: 5px 0;
                        color: #333;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>¡Gracias por tu mensaje, ${name}!</h1>
                    <p>He recibido tu mensaje y me pondré en contacto contigo lo antes posible.</p>
                    <div class="pdf-notice">
                        <p><strong>Información importante:</strong></p>
                        <p>He adjuntado a este correo un documento PDF con toda la información detallada sobre mis servicios, precios y condiciones.</p>
                        <p>Te recomiendo revisarlo y no dudes en responderme este correo si tienes alguna duda adicional.</p>
                    </div>
                    <div class="info">
                        <p><strong>Correo:</strong> ${email}</p>
                        <p><strong>Teléfono:</strong> ${
                           phone || "No proporcionado"
                        }</p>
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
         attachments: [
            {
               filename: "InfoServicios - Joan Company.pdf", // Nombre del archivo en el correo
               path: path.join(__dirname, "public", "services.pdf"), // Ruta al archivo PDF
               contentType: "application/pdf",
            },
         ],
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
