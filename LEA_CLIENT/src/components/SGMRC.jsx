import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, IconButton } from '@mui/material';
import Swal from 'sweetalert2'

import ModalComponent from '../utils/modals/ViewPdf';
import FileUpload from '../components/UploadFile';

import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import PushPinIcon from '@mui/icons-material/PushPin';

const SGMRC = () => {
  // Estado para la fecha y hora actual
  const [fechaHoraActual, setFechaHoraActual] = useState('');
  const [data, setData] = useState([]);
  const [editingCell, setEditingCell] = useState({ rowIndex: null, column: null });
  const [tempValue, setTempValue] = useState('');
  const [ColumValue, setColumValue] = useState();
  // Visualizador de Pdf
  const [isModalOpen, setModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');

  const [uploadRowIndex, setUploadRowIndex] = useState(null); // Estado para el rowIndex a subir

  const handleUploadIndex = (rowIndex) => {
    setUploadRowIndex(rowIndex); // Establecer el rowIndex seleccionado
    window.location = `/upload/${rowIndex}`; // Incluye el rowIndex en la URL
  };

  useEffect(() => {
    const mostrarFechaYHora = () => {
      const fechaActual = new Date();
      const opciones = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
      };
      const fechaFormateada = fechaActual.toLocaleString('es-ES', opciones);
      setFechaHoraActual(fechaFormateada);
    };

    mostrarFechaYHora();
    const intervalId = setInterval(mostrarFechaYHora, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const initialData = Array.from({ length: 10 }, (_, index) => ({
      fechaSolicitud: `2024-11-0${index + 1}`,
      codigoInventario: `INV-${index + 1}`,
      col3: `Certipur® Buffer solution pH 6.00 (25°C). Certified Reference Material for pH measurement`,
      col4: `Fila ${index + 1} Col 4`,
      col5: `Fila ${index + 1} Col 5`,
      col6: `Fila ${index + 1} Col 6`,
      col7: `Fila ${index + 1} Col 7`,
      col8: `Fila ${index + 1} Col 8`,
      col9: `Fila ${index + 1} Col 9`,
      col10: `Fila ${index + 1} Col 10`,
      col11: `Fila ${index + 1} Col 11`,
      col12: `Fila ${index + 1} Col 12`,
      col13: `Fila ${index + 1} Col 13`,
      col14: `Fila ${index + 1} Col 14`,
      col15: `Fila ${index + 1} Col 15`,
      col16: `Fila ${index + 1} Col 16`,
      col17: `Fila ${index + 1} Col 17`,
      col18: `Fila ${index + 1} Col 18`,
    }));
    setData(initialData);
  }, []);

  const DownloadPdf = async (rowIndex) => {

    console.log("dentro de download");
    
    try {
      const response = await axios.get(`http://localhost:4041/api/pdfs/${rowIndex}`, {
        responseType: 'blob', // Asegúrate de recibir el blob
      });
  
      // Crea un blob y una URL para el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Crea un enlace de descarga
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `archivo-${rowIndex}.pdf`); // Nombre del archivo
  
      // Agrega el enlace al documento y simula un clic
      document.body.appendChild(link);
      link.click();
  
      // Elimina el enlace del documento
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error al obtener el PDF:', error);
      Swal.fire({
        icon: "error",
        title: "Error al descargar el archivo",
        text: "No hay archivo asociado a este material de referencia!",
        footer: `<a href="/upload/${rowIndex}">Subir archivo</a>`, // Usa comillas invertidas (backticks)
      });
    }
  };

  const fetchPdf = async (rowIndex) => {
    try {
        const response = await axios.get(`http://localhost:4041/api/pdfs/${rowIndex}`, {
            responseType: 'blob', // Importante para recibir un blob
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        setPdfUrl(url); // Establecer la URL del PDF para el modal
        setModalOpen(true); // Abrir el modal
    } catch (error) {
        console.error('Error al obtener el PDF:', error);
    }
};

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleDoubleClick = (rowIndex, column) => {
    setEditingCell({ rowIndex, column });
    setTempValue(data[rowIndex][column]);
  };

  const handleChange = (event) => {
    setTempValue(event.target.value);
  };


  const handleBlur = () => {
    const newData = [...data];
    newData[editingCell.rowIndex][editingCell.column] = tempValue;
    setData(newData);
    setEditingCell({ rowIndex: null, column: null });
  };

  const setColumnValue =(columIndex)=> {
    setColumValue(columIndex)
  }

  return (
    <TableContainer component={Paper}
        style={{
          height: '100vh', // Ocupa el 100% de la altura de la ventana
          overflow: 'auto', // Permite el desplazamiento vertical y horizontal
        }}
      >
      <Table style={{ width: 'max-content' }}>
        <TableHead>
          <TableRow style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
            <TableCell colSpan={4} style={{ fontSize: '25px', fontWeight: 'bold' }}>
              <div>{fechaHoraActual}</div>
            </TableCell>
          </TableRow>
          <TableRow style={{ background: "#82ccdd" }}>
            <TableCell colSpan={18} style={{ fontSize: '18px', textAlign: 'center', fontWeight: 'bold', border: '3px solid rgba(224, 224, 224, 1)' }}>
              Seguimiento General Material de referencia
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2} style={{ background: "#78e08f", textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
              Seguimiento inventario
            </TableCell>
            <TableCell colSpan={4} style={{ background: "#eabbfa", textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
              Identificacion del MR O MRC
            </TableCell>
            <TableCell colSpan={5} style={{ background: "#fbfc92", textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
              Seguimiento a su uso
            </TableCell>
            <TableCell colSpan={5} style={{ background: "#b8b3fc", textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
              Condiciones especiales de manipulacion y almacenamiento
            </TableCell>
            <TableCell colSpan={2} style={{ background: "#c5fcc5", textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
              Seguimiento Consumo
            </TableCell>
          </TableRow>
          <TableRow>

          <TableCell style={{ background: "#bbfad1", width: '200px', textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', position: 'relative' }}>
              Fecha Solicitud
              <IconButton
                size="small"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  outline: "none"
                }}
                onClick={()=> {setColumnValue(0)}}
              >
                <PushPinIcon fontSize="small" sx={ColumValue == 0 ?{color:"red", transform: "rotate(45deg)", transition: "transform 0.2s"}: {outline: "none"}} />
              </IconButton>
            </TableCell>
            <TableCell style={{ background: "#bbfad1", width: '150px', textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', position: 'relative' }}>
              Código de inventario
              <IconButton
                size="small"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  outline: "none"
                }}
                onClick={()=> {setColumnValue(1)}}
              >
                <PushPinIcon fontSize="small" sx={ColumValue == 1 ?{color:"red", transform: "rotate(45deg)", transition: "transform 0.2s"}: {outline: "none"}} />
              </IconButton>
            </TableCell>
            <TableCell style={{ background: "#f5d9ff", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', position: 'relative' }}>
              Nombre
              <IconButton
                size="small"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  outline: "none"
                }}
                onClick={()=> {setColumnValue(2)}}
              >
               <PushPinIcon fontSize="small" sx={ColumValue == 2 ?{color:"red", transform: "rotate(45deg)", transition: "transform 0.2s"}: {outline: "none"}} />
              </IconButton>
            </TableCell>
            <TableCell style={{ background: "#f5d9ff", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', position: 'relative' }}>
              Marca
              <IconButton
                size="small"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  outline: "none"
                }}
                onClick={()=> {setColumnValue(3)}}
              >
               <PushPinIcon fontSize="small" sx={ColumValue == 3 ?{color:"red", transform: "rotate(45deg)", transition: "transform 0.2s"}: {outline: "none"}} />
              </IconButton>
            </TableCell>
            <TableCell style={{ background: "#f5d9ff", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', position: 'relative' }}>
              No. Lote
              <IconButton
                size="small"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  outline: "none"
                }}
                onClick={()=> {setColumnValue(4)}}
              >
               <PushPinIcon fontSize="small" sx={ColumValue == 4 ?{color:"red", transform: "rotate(45deg)", transition: "transform 0.2s"}: {outline: "none"}} />
              </IconButton>
            </TableCell>
            <TableCell style={{ background: "#f5d9ff", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', position: 'relative' }}>
              TIPO
              <IconButton
                size="small"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  outline: "none"
                }}
                onClick={()=> {setColumnValue(5)}}
              >
                <PushPinIcon fontSize="small" sx={ColumValue == 5 ?{color:"red", transform: "rotate(45deg)", transition: "transform 0.2s"}: {outline: "none"}} />
              </IconButton>
            </TableCell>
            <TableCell style={{ background: "#feffcf", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', position: 'relative' }}>
              AREA
              <IconButton
                size="small"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  outline: "none"
                }}
                onClick={()=> {setColumnValue(6)}}
              >
                 <PushPinIcon fontSize="small" sx={ColumValue == 6 ?{color:"red", transform: "rotate(45deg)", transition: "transform 0.2s"}: {outline: "none"}} />
                </IconButton>
            </TableCell>
            <TableCell style={{ background: "#feffcf", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', position: 'relative' }}>
              Fecha de ingreso al laboratorio
              <IconButton
                size="small"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  outline: "none"
                }}
                onClick={()=> {setColumnValue(7)}}
              >
                 <PushPinIcon fontSize="small" sx={ColumValue == 7 ?{color:"red", transform: "rotate(45deg)", transition: "transform 0.2s"}: {outline: "none"}} />
                </IconButton>
            </TableCell>
            <TableCell style={{ background: "#feffcf", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', position: 'relative' }}>
              Fecha de vencimiento
              <IconButton
                size="small"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  outline: "none"
                }}
                onClick={()=> {setColumnValue(8)}}
              >
                <PushPinIcon fontSize="small" sx={ColumValue == 8 ?{color:"red", transform: "rotate(45deg)", transition: "transform 0.2s"}: {outline: "none"}} />
                </IconButton>
            </TableCell>
            <TableCell style={{ background: "#feffcf", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', position: 'relative' }}>
              Fecha actualización de la información
              <IconButton
                size="small"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  outline: "none"
                }}
                onClick={()=> {setColumnValue(9)}}
              >
                  <PushPinIcon fontSize="small" sx={ColumValue == 9 ?{color:"red", transform: "rotate(45deg)", transition: "transform 0.2s"}: {outline: "none"}} />
                </IconButton>
            </TableCell>
            <TableCell style={{ background: "#feffcf", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Cantidad de ingreso</TableCell>
            <TableCell style={{ background: "#c9c5fc", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Consideración de la manipulación</TableCell>
            <TableCell style={{ background: "#c9c5fc", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Almacenamiento</TableCell>
            <TableCell style={{ background: "#c9c5fc", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Certificado de análisis</TableCell>
            <TableCell style={{ background: "#c9c5fc", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Responsable de la manipulación</TableCell>
            <TableCell style={{ background: "#c9c5fc", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Observaciones</TableCell>
            <TableCell style={{ background: "#d9ffd9", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Vencimiento</TableCell>
            <TableCell style={{ background: "#d9ffd9", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Fecha actual</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
  {data.map((row, rowIndex) => (
    <TableRow key={rowIndex}>
      {Object.keys(row).map((column, colIndex) => (
        <TableCell
          key={colIndex}
          style={ colIndex == ColumValue ? {position: 'sticky', left: 0, zIndex: 1, background: 'white', textAlign: 'center'} : {textAlign: 'center'} }
          onDoubleClick={() => handleDoubleClick(rowIndex, column)}
        >
          {editingCell.rowIndex === rowIndex && editingCell.column === column ? (
            <TextField
              sx={{
                width: "100%",
                transform: 'scale(0.9)',
                padding: 0,
                marginLeft: 0
              }}
              value={tempValue}
              onChange={handleChange}
              onBlur={handleBlur}
              autoFocus
            />
          ) : colIndex === 13 ? ( // Cambia aquí para la columna 8 (índice 7)
            <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft:10, marginRight:10 }}>
             <IconButton
              style={{outline:"none"}}
              variant="contained"
              color="primary"
              onClick={()=> fetchPdf(rowIndex)}
             >
              <RemoveRedEyeIcon />
            </IconButton>
             <IconButton
              style={{outline:"none"}}
              variant="contained"
              color="primary"
              onClick={() => handleUploadIndex(rowIndex)}
             >
              <CloudUploadIcon />
            </IconButton>
            <IconButton
              style={{outline:"none"}}
              variant="contained"
              color="primary"
              onClick={() => DownloadPdf(rowIndex)}
            >
              <DownloadForOfflineIcon />
           </IconButton>       
            </div>
            ) : (
            row[column]
          )}
        </TableCell>
      ))}
    </TableRow>
   ))}
  </TableBody>
 </Table>
 
   {/* Componente Modal visualizar Pdf */}
   <ModalComponent isOpen={isModalOpen} onClose={handleCloseModal} pdfUrl={pdfUrl} />

   {/* Condicional para mostrar el componente FileUpload */}
      {uploadRowIndex !== null && (
        <FileUpload rowIndex={uploadRowIndex} />
      )}
</TableContainer>

);
};

export default SGMRC;
