// cronJob.js
import cron from 'node-cron';
import { sendEmailData } from './mailer';
import { obtenerProductosAProximoVencer, obtenerProductosVencidos } from './data/data'; // Debes crear estas funciones

// Programar un cron job para que se ejecute todos los días a las 8 AM
cron.schedule('*/5 * * * *', async () => {
  try {
    // Obtener productos próximos a vencer
    const productosProximos = await obtenerProductosAProximoVencer();

    productosProximos.forEach((producto) => {
      const body = `El producto ${producto.nombre} con lote ${producto.lote} está a punto de vencer el ${producto.fechaVencimiento}.`;
      sendEmailData('Aviso de vencimiento', body);
    });

    // Obtener productos vencidos
    const productosVencidos = await obtenerProductosVencidos();

    productosVencidos.forEach((producto) => {
      const body = `El producto ${producto.nombre} con lote ${producto.lote} ha vencido el ${producto.fechaVencimiento}.`;
      sendEmailData('Aviso de vencimiento', body);
    });
  } catch (error) {
    console.error('Error al enviar los correos:', error);
  }
});
