import mongoose from 'mongoose';
import Producto from '../../models/dataModels.js'; // Asegúrate de tener el modelo adecuado para Producto

// Función para calcular la diferencia en meses entre dos fechas
const calcularDiferenciaEnMeses = (fechaInicio, fechaFin) => {
  const diferencia = fechaFin.getTime() - fechaInicio.getTime();
  const meses = diferencia / (1000 * 3600 * 24 * 30); // Convertir de milisegundos a meses
  return Math.floor(meses); // Redondear hacia abajo
};

// Función para obtener productos próximos a vencer
export const obtenerProductosAProximoVencer = async () => {
  return [
    {
      nombre: "Producto A",
      lote: "L12345",
      fechaVencimiento: "2024-12-15",  // Fecha de vencimiento en formato YYYY-MM-DD
      marca: "Marca X",
      estado: "próximo a vencer"
    },
    {
      nombre: "Producto B",
      lote: "L67890",
      fechaVencimiento: "2024-11-25",
      marca: "Marca Y",
      estado: "próximo a vencer"
    }
  ];
}

// Función para obtener productos vencidos
export const obtenerProductosVencidos = async () => {
  return [
    {
      nombre: "Producto C",
      lote: "L11111",
      fechaVencimiento: "2023-06-10",  // Producto vencido
      marca: "Marca Z",
      estado: "vencido"
    }
  ];
}


// Función para obtener productos que ya están vencidos
// export const obtenerProductosVencidos = async () => {
//   try {
//     const fechaActual = new Date();
//     const productosVencidos = await Producto.find({
//       fechaVencimiento: { $lt: fechaActual }, // Compara si la fecha de vencimiento es anterior a la fecha actual
//     });
//     return productosVencidos;
//   } catch (error) {
//     console.error('Error al obtener productos vencidos:', error);
//     throw error;
//   }
// };

// Función para obtener productos próximos a vencer (dentro del rango de "mesesRestantes")
// export const obtenerProductosAProximoVencer = async () => {
//   try {
//     const fechaActual = new Date();
//     const productosProximosAVencer = await Producto.find();
    
//     // Filtrar los productos que están próximos a vencer
//     const productosFiltrados = productosProximosAVencer.filter((producto) => {
//       const fechaVencimiento = new Date(producto.fechaVencimiento); // Asegúrate de que sea un objeto Date
//       const mesesRestantes = parseInt(producto.mesesRestantes, 10); // Convertir el valor de mesesRestantes a número
//       const mesesDeDiferencia = calcularDiferenciaEnMeses(fechaActual, fechaVencimiento);

//       // Si la diferencia en meses es menor o igual a mesesRestantes, está próximo a vencer
//       return mesesDeDiferencia <= mesesRestantes;
//     });

//     return productosFiltrados;
//   } catch (error) {
//     console.error('Error al obtener productos próximos a vencer:', error);
//     throw error;
//   }
// };

