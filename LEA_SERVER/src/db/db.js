import { mongoose } from 'mongoose';
import { URI } from '../keys/key.js';
import bcrypt from 'bcrypt';
import moment from 'moment';
import Data from '../models/dataModels.js'; // Asegúrate de que este modelo esté importado correctamente

const db = (async () => {
  try {
    // Conectar a la base de datos
    await mongoose.connect(URI);
    console.log("Conectado a la base de datos");

    // Verificar si existe algún registro en la colección
    const count = await Data.countDocuments(); // Verifica si hay registros en la colección 'Data'

    if (count === 0) {
      // Si no hay registros, crear un registro por defecto
      const defaultData = new Data({
        fechaSolicitud: '2024/10/31',
        codigoInventario: 'ABC123456',
        nombre: 'Producto Ejemplo',
        marca: 'Producto Ejemplo',
        lote: 'PRK32KJJ',
        tipo: 'Producto químico',
        area: 'Laboratorio',
        fechaIngreso: '2024/10/31',
        fechaVencimiento: '2024/10/31',
        fechaActualizacionInformacion: '2024/10/31',
        cantidadIngreso: 150,
        manipulacion: 'Seguridad estándar',
        almacenamiento: 'A temperatura controlada',
        certificadoAnalisis: true,
        responsable: 'Juan Pérez',
        observaciones: 'Producto sin daños',
        vencimiento: '2024/11/31',
        mesesRestantes: 12
      });

      // Guardar el registro por defecto
      await defaultData.save();
      console.log("Se creó un registro por defecto en la base de datos");
    } else {
      console.log("Ya existen registros en la base de datos");
    }
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
  }
})();

export default db;
