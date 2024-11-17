// src/utils/mailer.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Configuración de Nodemailer con Gmail (o el servicio que prefieras)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODE_EMAIL_USER,  // Correo electrónico desde el que enviarás
    pass: process.env.NODE_EMAIL_PASS,  // Contraseña de la cuenta o contraseña de aplicación
  },
});

// Función para enviar el correo
export const sendEmailData = async (subject, body) => {
  const mailOptions = {
    from: process.env.NODE_EMAIL_USER,  // Correo desde el que se enviará
    to: process.env.NODE_TO,  // Receptor del correo
    subject,                  // Asunto del correo
    text: body,               // Cuerpo del mensaje
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.response);  // Mostrar respuesta del correo
    return info;  // Retornar la información si el correo fue enviado exitosamente
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw error;  // Lanza el error para que el controlador lo capture
  }
};
