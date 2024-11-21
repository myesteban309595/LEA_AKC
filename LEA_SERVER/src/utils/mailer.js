import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { obtenerProductosAProximoVencer, obtenerProductosVencidos } from './data/data.js';

// Cargar variables de entorno
dotenv.config();

console.log("hola enejcutando en mailer.js");
console.log('Email User:', process.env.NODE_EMAIL_USER);
console.log('Email Pass:', process.env.NODE_EMAIL_PASS);


cron.schedule('* * * * *', async () => {  // Ejecutar cada minuto
  console.log("Ejecutando node-cron cada minuto");

  try {
    // Obtener productos próximos a vencer
    console.log('Obteniendo productos próximos a vencer...');
    const productosProximos = await obtenerProductosAProximoVencer();
    console.log("productosProximos:", productosProximos);

    productosProximos.forEach((producto) => {
      const body = `El producto ${producto.nombre} con lote ${producto.lote} está a punto de vencer el ${producto.fechaVencimiento}.`;
      console.log(body);
      //sendEmailData('Aviso de vencimiento', body);
    });

    // Obtener productos vencidos
    console.log('Obteniendo productos vencidos...');
    const productosVencidos = await obtenerProductosVencidos();
    console.log("productosVencidos:", productosVencidos);

    productosVencidos.forEach((producto) => {
      const body = `El producto ${producto.nombre} con lote ${producto.lote} ha vencido el ${producto.fechaVencimiento}.`;
      console.log(body);  // Agrega un log aquí para verificar
      //sendEmailData('Aviso de vencimiento', body);
    });
  } catch (error) {
    console.error('Error al ejecutar las funciones:', error);
  }
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODE_EMAIL_USER,  // Tu dirección de correo
    pass: process.env.NODE_EMAIL_PASS,  // Contraseña de la cuenta o contraseña de aplicación
  },
  tls: {
    rejectUnauthorized: false, // Esto permite conexiones con certificados autofirmados, si es necesario
  },
  // Puedes cambiar el puerto si es necesario:
  // port: 587,
  // secure: false, // Si usas STARTTLS
});

export const sendEmailData = async (subject, body) => {
  const mailOptions = {
    from: process.env.NODE_EMAIL_USER,
    to: process.env.NODE_TO,
    subject,
    text: body,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.response);
    return info;
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw error;
  }
};
