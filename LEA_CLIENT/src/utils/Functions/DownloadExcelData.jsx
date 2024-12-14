import React from 'react';
import * as XLSX from 'xlsx';

export const ExportExcelWithTemplate = async ({ data, module }) => {

  console.log("modulo que envia:", module);
  
  console.log("data que llega a exportar excel:", data);
  
  // Función para exportar los datos a Excel usando la plantilla
  try {
    // Cargar la plantilla directamente desde la carpeta public
    //const response = await fetch('public/XLSX_BASE/BASEXLXMSGMRC.xlsx'); // Ruta al archivo en la carpeta public
    const FileLoaded = (module === "dataTableColors") ? '/BASEXLSMCODCOLOR.xlsx' : '/XLSX_BASE/BASEXLXMSGMRC.xlsx';
    const response = await fetch(FileLoaded); //& sin public para subir a netlify
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
    const ws = XLSX.utils.sheet_add_json(sheet, dataToInsert, { origin: (module === "dataTableColors") ? 10:3, skipHeader: true });

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
