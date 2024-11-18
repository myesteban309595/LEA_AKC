import cron from 'node-cron';
import { sendEmailData } from './mailer';
import { obtenerProductosAProximoVencer, obtenerProductosVencidos } from './data/data';

console.log("El cron job script está corriendo...");

cron.schedule('* * * * *', async () => {  // Aquí cada minuto, puedes cambiar a '* */5 * * *' si quieres cada 5 minutos
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
      //sendEmailData('Aviso de vencimiento', body);
    });
  } catch (error) {
    console.error('Error al ejecutar las funciones:', error);
  }
});
