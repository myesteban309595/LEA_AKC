
import {sendEmailData} from '../utils/mailer.js'

export const sendEmail = async (req, res) => {
    const productos = req.body;

    console.log("productos que llegan al backend:", productos);
    
    try {
      productos.forEach((producto) => {
        const body = `El producto ${producto.nombre} con lote ${producto.lote} vence el ${producto.fechaVencimiento}.`;
        sendEmailData('Recordatorio de vencimiento', body);
      });
  
      res.status(200).json({ message: 'Avisos enviados correctamente' });
    } catch (error) {
      console.error('Error al procesar los avisos:', error);
      res.status(500).json({ message: 'Error al procesar los datos' });
    }
  };
  