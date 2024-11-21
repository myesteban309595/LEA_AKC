// Función para enviar los datos de los productos al backend
import axios from 'axios'

export const sendProductData = async (productData) => {

  console.log("product data en sendProductData: ", productData);
  
  // try {
  //   const response = await axios.post('http://localhost:4041/api/email/sendemail', productData, {
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   });

  //   const data = await response.json();
  //   console.log('Datos enviados con éxito:', data);
  // } catch (error) {
  //   console.error('Error al enviar los datos:', error);
  // }
};

// Ejemplo de productos que podrían estar por vencer o vencidos
const productos = [
  {
    nombre: 'Reactivo A',
    lote: '12345',
    fechaVencimiento: '2024-11-20',
  },
  {
    nombre: 'Reactivo B',
    lote: '67890',
    fechaVencimiento: '2024-10-15',
  },
];

// Llamar a la función para enviar los productos al backend
