import React from 'react';
import * as XLSX from 'xlsx';

export const ExportExcelWithTemplate = async ({ data, module }) => {
  console.log("modulo que envia:", module);
  console.log("data que llega a exportar excel:", data);
  
  try {
    // Ruta al archivo dependiendo del módulo
    const FileLoaded = (module === "dataTableColors") ? '/BASEXLSMCODCOLOR.xlsx' : '/XLSX_BASE/BASEXLXMSGMRC.xlsx';
    console.log("FileLoaded:", FileLoaded);
    
    // Intentar cargar el archivo
    const response = await fetch(FileLoaded);
    
    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      throw new Error(`Error al cargar el archivo: ${response.statusText}`);
    }

    // Comprobar el tipo de contenido de la respuesta (debe ser Excel)
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
      throw new Error('El archivo descargado no es un archivo Excel válido.');
    }

    // Leer el archivo Excel
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
          item.Color
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
    const ws = XLSX.utils.sheet_add_json(sheet, dataToInsert, { origin: (module === "dataTableColors") ? 10 : 3, skipHeader: true });

    // Crear un nuevo libro de trabajo (workbook) para evitar modificar la plantilla original
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, workbook.SheetNames[0]);

    // Descargar el archivo modificado
    XLSX.writeFile(wb, (module === "dataTableColors") ? 
      'MLE-SEG-F-01-01 CODIFICACION DE COLOR PARA ALMACENAMIENTO DE REACTIVOS.xlsx' 
      :
      'MLE-CAA-F-06-01 SEGUIMIENTO GENERAL MATERIAL DE REFERENCIA.xlsx');

  } catch (error) {
    console.error("Error al cargar o procesar la plantilla: ", error);
  }
};
