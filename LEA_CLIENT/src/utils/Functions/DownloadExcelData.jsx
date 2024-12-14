import React from 'react';
import * as XLSX from 'xlsx';

export const ExportExcelWithTemplate = async ({ data, module }) => {
  console.log("Modulo que se envía:", module);
  console.log("Datos que llegan a exportar Excel:", data);

  try {
    // Determina el archivo según el módulo
    let filePath;
    if (module === "dataTableColors") {
      filePath = '/XLSX_BASE/BASEXLSMCODCOLOR.xlsx';
    } else if (module === "dataTable") {
      filePath = '/XLSX_BASE/BASEXLXMSGMRC.xlsx';
    } else {
      throw new Error('Módulo no válido.');
    }

    console.log("Ruta del archivo a cargar:", filePath);

    // Realiza la solicitud fetch para cargar el archivo Excel
    const response = await fetch(filePath);
    
    // Verifica si la respuesta es exitosa
    if (!response.ok) {
      throw new Error(`Error al cargar el archivo: ${response.statusText}`);
    }

    // Comprobar el tipo de contenido de la respuesta (debe ser Excel)
    const contentType = response.headers.get('Content-Type');
    console.log("Tipo de contenido:", contentType); // Verifica el tipo de contenido en los logs

    if (!contentType || !contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
      throw new Error('El archivo descargado no es un archivo Excel válido.');
    }

    // Leer el archivo Excel como arrayBuffer
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    // Obtener la primera hoja de la plantilla
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    // Los datos que quieres insertar en la plantilla (solo valores, sin claves)
    const dataToInsert = data.map(item => {
      if (module === "dataTableColors") {
        return [
          item.Reactivo,
          item.Marca,
          item.Codigo,
          item.Lote,
          item.fechaVencimiento,
          item.CAS,
          item.Color,
        ];
      } else {
        return [
          item.fechaSolicitud,
          item.codigoInventario,
          item.marca,
          item.nombre,
          item.lote,
          item.tipo,
          item.area,
          item.fechaIngreso,
          item.fechaVencimiento,
          item.fechaActualizacionInformacion,
          item.cantidadIngreso,
          item.manipulacion,
          item.almacenamiento,
          "----",  // CertificadoAnalisis
          item.responsable,
          item.observaciones,
        ];
      }
    });

    // Insertar los datos en la hoja a partir de la fila 2 (después de los encabezados)
    const ws = XLSX.utils.sheet_add_json(sheet, dataToInsert, {
      origin: (module === "dataTableColors") ? 10 : 3,
      skipHeader: true,
    });

    // Crear un nuevo libro de trabajo para evitar modificar la plantilla original
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, workbook.SheetNames[0]);

    // Descargar el archivo modificado
    const fileName = (module === "dataTableColors") 
      ? 'MLE-SEG-F-01-01 CODIFICACION DE COLOR PARA ALMACENAMIENTO DE REACTIVOS.xlsx' 
      : 'MLE-CAA-F-06-01 SEGUIMIENTO GENERAL MATERIAL DE REFERENCIA.xlsx';

    XLSX.writeFile(wb, fileName);

  } catch (error) {
    console.error("Error al cargar o procesar la plantilla: ", error);
  }
};
