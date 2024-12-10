// FileUploadExcel.jsx (o tu componente de carga)
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

export const FileUploadExcel = ({ open, onClose }) => {

  const [file, setFile] = useState(null);

  //? Cuando el usuario selecciona un archivo
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  //? Subir el archivo
  const handleFileUpload = async () => {
    if (!file) {
      alert('Por favor selecciona un archivo');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        // Leemos el archivo Excel
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Obtener la primera hoja del archivo Excel
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        // Convertir los datos de la hoja a un formato JSON (omitimos las dos primeras filas)
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 3 });

        // Formatear los datos según tu modelo de Mongoose
        const formattedData = jsonData.map(item => ({
          fechaSolicitud: item.fechaSolicitud || '----',
          codigoInventario: item.codigoInventario || '----',
          nombre: item.nombre || '----',
          marca: item.marca || '----',
          lote: item.lote || '----',
          tipo: item.tipo || '----',
          area: item.area || '----',
          fechaIngreso: item.fechaIngreso || '----',
          fechaVencimiento: item.fechaVencimiento || '----',
          fechaActualizacionInformacion: item.fechaActualizacionInformacion || '----',
          cantidadIngreso: item.cantidadIngreso || 0,
          manipulacion: item.manipulacion || 'Sin especificar',
          almacenamiento: item.almacenamiento || '----',
          certificadoAnalisis: item.certificadoAnalisis || false,
          responsable: item.responsable || '----',
          observaciones: item.observaciones || 'Ninguna',
          vencimiento: item.vencimiento || '----',
          mesesRestantes: item.mesesRestantes,
          estado: item.estado || '----',
          notificado: item.notificado || false,
        }));

        console.log("formatted data:", formattedData);
        

        //? Enviar los datos al backend para guardarlos en la base de datos
        await axios.post('http://localhost:4041/api/table/datareplaceall', formattedData);
        alert('Datos cargados correctamente');
        onClose();  // Cerrar el modal después de la carga
        //window.location.reload();
      } catch (error) {
        console.error('Error al procesar el archivo:', error);
        alert('Error al procesar el archivo');
      }
    };

    //? Leer el archivo como ArrayBuffer
    reader.readAsArrayBuffer(file);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Carga Masiva Excel</DialogTitle>
      <DialogContent>
        <input 
          type="file" 
          onChange={handleFileChange}  // Manejamos el cambio de archivo directamente aquí
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button 
          onClick={handleFileUpload} 
          color="primary" 
          disabled={!file} // Deshabilitar si no hay archivo seleccionado
        >
          Cargar Datos
        </Button>
      </DialogActions>
    </Dialog>
  );
};
