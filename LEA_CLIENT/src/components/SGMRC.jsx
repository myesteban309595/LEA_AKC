import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, IconButton } from '@mui/material';
import Swal from 'sweetalert2'
import { Snackbar, Alert } from '@mui/material'

import ModalComponent from '../utils/modals/ViewPdf';
import FileUpload from '../components/UploadFile';

import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import PushPinIcon from '@mui/icons-material/PushPin';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const SGMRC = () => {
  // Estado para la fecha y hora actual
  const [fechaHoraActual, setFechaHoraActual] = useState('');
  const [data, setData] = useState([]);
  const [editingCell, setEditingCell] = useState({ rowIndex: null, column: null });
  const [tempValue, setTempValue] = useState('');
  const [ColumValue, setColumValue] = useState();
  // propiedades del snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);  // Estado para controlar el Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState("");  // Mensaje del Snackbar
  const [snackbarSeverity, setSnackbarSeverity] = useState('');  // 'success' o 'error'

  // carga de data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    // Realizar la solicitud GET a la API
    axios.get('http://localhost:4041/api/table/data')
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Error al cargar los datos');
        setLoading(false);
      });
  }, []);
  
    if (error) {
      return <div>{error}</div>;
    }

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

  const DownloadPdf = async (rowIndex) => {    
    try {
        const response = await axios.get(`http://localhost:4041/api/pdfs/${rowIndex}`);

        const fileName = response.data.filename; // Obtén el nombre del archivo
        const pdfBlob = new Blob([response.data.data], { type: 'application/pdf' }); // Crea un blob del PDF

        // Crea una URL para el blob
        const url = window.URL.createObjectURL(pdfBlob);
        
        // Crea un enlace de descarga
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName); // Usa el nombre original

        // Agrega el enlace al documento y simula un clic
        document.body.appendChild(link);
        link.click();

        // Elimina el enlace del documento
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error al obtener el PDF:', error);
        Swal.fire({
            icon: "error",
            title: "Error al descargar el archivo",
            text: "No hay archivo asociado a este material de referencia!",
            footer: `<a href="/upload/${rowIndex}">Subir archivo</a>`,
        });
     }
};

const DeletePdf = async (rowIndex) => {
  try {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    // Verifica si el usuario confirmó la acción
    if (result.isConfirmed) {
      const response = await axios.delete(`http://localhost:4041/api/pdfs/${rowIndex}`);

      // Notificación de éxito
      Swal.fire({
        icon: 'success',
        title: 'PDF eliminado',
        text: response.data.message,
      });

      // Aquí puedes realizar cualquier acción adicional, como actualizar el estado de la lista de PDFs
    }
   } catch (error) {
     console.error('Error al eliminar el PDF:', error);
    // Notificación de error
    Swal.fire({
      icon: 'error',
      title: 'Error al eliminar el PDF',
      text: error.response?.data?.message || 'Ocurrió un error inesperado.',
    });
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

  const handleBlur = async () => {
    // Crea una copia de los datos y actualiza el valor modificado
    const newData = [...data];
    newData[editingCell.rowIndex][editingCell.column] = tempValue;
  
    // TAN PRONTO DESENFOQUE LA CASILLA, GUARDA LOS DATOS
    try {
      // Usar `newData` para enviar los datos modificados al servidor
      const response = await axios.post('http://localhost:4041/api/table/datareplaceall', newData);
  
      // Si la solicitud es exitosa
      if (response.status === 200) {
        setSnackbarMessage('Datos actualizados correctamente');
        setSnackbarSeverity('success'); 
        setSnackbarOpen(true);
        // Actualiza el estado de `data` con los datos retornados por el servidor
        setData(response.data); // Aquí asumimos que el servidor devuelve los datos actualizados
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Hubo un error al guardar los datos");
      setSnackbarOpen(true);
      setSnackbarSeverity("error");
    }
  }  

  const agregarDataFila = ()=> {

    const newFile = {
      fechaSolicitud: '--/--/--',
      codigoInventario: '',
      nombre: '',
      marca: '',
      lote: '',
      tipo: '',
      area: '',
      fechaIngreso: '--/--/--',
      fechaVencimiento: '--/--/--',
      fechaActualizacionInformacion: '--/--/--',
      cantidadIngreso: null,
      manipulacion: '',
      almacenamiento: '',
      certificadoAnalisis: null,
      responsable: '',
      observaciones: '',
      vencimiento: '--/--/--',
      mesesRestantes: null
    }

    axios.post('http://localhost:4041/api/table/data', newFile)
    .then(response => {
      // Una vez agregada la fila en la base de datos, agregarla al estado local para que se muestre
      setData(prevData => [response.data, ...prevData]);
    })
    .catch(err => {
      setError(`Error al agregar la fila: ${err.response ? err.response.data.message : err.message}`);
      console.error(err);
    });
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const filterData = (row) => {
    // Campos a excluir de la data
    const excludedFields = ['_id', 'createdAt', 'updatedAt', '__v'];
  
    // Filtrar las propiedades que no quieres mostrar
    return Object.keys(row)
      .filter((key) => !excludedFields.includes(key)) // Excluye los campos no deseados
      .reduce((obj, key) => {
        obj[key] = row[key]; // Solo incluye los campos que quieres
        return obj;
      }, {});
  };
  const renderPdfButtons = (rowIndex) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: 10, marginRight: 10 }}>
      <IconButton
        style={{ outline: "none", color: "#f5d131" }}
        onClick={() => fetchPdf(rowIndex)}
      >
        <RemoveRedEyeIcon />
      </IconButton>
      <IconButton
        style={{ outline: "none", color: "#3172f5" }}
        onClick={() => handleUploadIndex(rowIndex)}
      >
        <CloudUploadIcon />
      </IconButton>
      <IconButton
        style={{ outline: "none", color: "#0f9638" }}
        onClick={() => DownloadPdf(rowIndex)}
      >
        <DownloadForOfflineIcon />
      </IconButton>
      <IconButton
        style={{ outline: "none", color: "#ed1111" }}
        onClick={() => DeletePdf(rowIndex)}
      >
        <DeleteIcon />
      </IconButton>
    </div>
  );
  

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
            <TableCell colSpan={18} style={{ fontSize: '25px', fontWeight: 'bold' }}>
              <div>{fechaHoraActual}</div>
              <Button onClick={agregarDataFila}>AGREGAR</Button>
            </TableCell>
          </TableRow>
          <TableRow style={{background: "#82ccdd" }}>
            <TableCell colSpan={18} style={{ fontSize: '18px', textAlign: 'center', fontWeight: 'bold', border: '1px solid rgba(224, 224, 224, 1)' }}>
              Seguimiento General Material de referencia
            </TableCell>
          </TableRow>
          <TableRow style={{position: 'sticky', top: 0, zIndex: 1, }}>
            <TableCell colSpan={2} style={{ background: "#78e08f", textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
              Seguimiento inventario
            </TableCell>
            <TableCell colSpan={4} style={{ background: "#eabbfa", textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
              Identificacion del MR O MRC
            </TableCell>
            <TableCell colSpan={5} style={{ background: "#fbfc92",textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
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

          <TableCell 
            style={
              ColumValue == 0 ? 
              {position: 'sticky', left: 0, top:55, zIndex: 2, textAlign: 'center', background: "#bbfad1", width: '200px',} 
              : 
              { position: 'sticky',top:55, background: "#bbfad1", width: '200px', textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
              Fecha Solicitud
              <IconButton
                size="small"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  outline: "none",
                 
                }}
                onClick={()=> {setColumValue(0)}}
              >
                <PushPinIcon fontSize="small" sx={ColumValue == 0 ?{color:"red", transform: "rotate(45deg)", transition: "transform 0.2s"}: {outline: "none"}} />
              </IconButton>
            </TableCell>
            <TableCell 
              style={
              ColumValue == 1 ? 
              {position: 'sticky', left: 0,top:55, zIndex: 2, textAlign: 'center', background: "#bbfad1", width: '200px',} 
              : 
              {position: 'sticky',top:55, background: "#bbfad1", width: '200px', textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', }}>    
              Código de inventario
              <IconButton
                size="small"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  outline: "none"
                }}
                onClick={()=> {setColumValue(1)}}
              >
                <PushPinIcon fontSize="small" sx={ColumValue == 1 ?{color:"red", transform: "rotate(45deg)", transition: "transform 0.2s"}: {outline: "none"}} />
              </IconButton>
            </TableCell>
            <TableCell 
              style={
                ColumValue == 2 ? 
                {position: 'sticky', left: 0,top:55, zIndex: 2, textAlign: 'center', background: "#f5d9ff"} 
                : 
                {position: 'sticky',top:55, background: "#f5d9ff", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', }}>            
              Nombre
              <IconButton
                size="small"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  outline: "none"
                }}
                onClick={()=> {setColumValue(2)}}
              >
               <PushPinIcon fontSize="small" sx={ColumValue == 2 ?{color:"red", transform: "rotate(45deg)", transition: "transform 0.2s"}: {outline: "none"}} />
              </IconButton>
            </TableCell>
            <TableCell 
              style={
                ColumValue == 3 ? 
                {position: 'sticky', left: 0,top:55, zIndex: 2, textAlign: 'center', background: "#f5d9ff"} 
                : 
                {position: 'sticky',top:55, background: "#f5d9ff", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', }}>    
              Marca
              <IconButton
                size="small"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  outline: "none"
                }}
                onClick={()=> {setColumValue(3)}}
              >
               <PushPinIcon fontSize="small" sx={ColumValue == 3 ?{color:"red", transform: "rotate(45deg)", transition: "transform 0.2s"}: {outline: "none"}} />
              </IconButton>
            </TableCell>
            <TableCell 
              style={
                ColumValue == 4 ? 
                {position: 'sticky', left: 0,top:55, zIndex: 2, textAlign: 'center', background: "#f5d9ff"} 
                : 
                {position: 'sticky',top:55, background: "#f5d9ff", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', }}>                 
              No. Lote
              <IconButton
                size="small"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  outline: "none"
                }}
                onClick={()=> {setColumValue(4)}}
              >
               <PushPinIcon fontSize="small" sx={ColumValue == 4 ?{color:"red", transform: "rotate(45deg)", transition: "transform 0.2s"}: {outline: "none"}} />
              </IconButton>
            </TableCell>
            <TableCell 
               style={
                ColumValue == 5 ? 
                {position: 'sticky', left: 0,top:55, zIndex: 2, textAlign: 'center', background: "#f5d9ff",} 
                : 
                { position: 'sticky',top:55, background: "#f5d9ff", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)',}}>                 
              TIPO
              <IconButton
                size="small"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  outline: "none"
                }}
                onClick={()=> {setColumValue(5)}}
              >
                <PushPinIcon fontSize="small" sx={ColumValue == 5 ?{color:"red", transform: "rotate(45deg)", transition: "transform 0.2s"}: {outline: "none"}} />
              </IconButton>
            </TableCell>
            <TableCell 
              style={
                ColumValue == 6 ? 
                {position: 'sticky', left: 0,top:55, zIndex: 2, textAlign: 'center',  background: "#feffcf",} 
                : 
                {position: 'sticky',top:55, background: "#feffcf", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', }}>                 
              AREA
              <IconButton
                size="small"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  outline: "none"
                }}
                onClick={()=> {setColumValue(6)}}
              >
                 <PushPinIcon fontSize="small" sx={ColumValue == 6 ?{color:"red", transform: "rotate(45deg)", transition: "transform 0.2s"}: {outline: "none"}} />
                </IconButton>
            </TableCell>
            <TableCell 
              style={
                ColumValue == 7 ? 
                {position: 'sticky', left: 0,top:55, zIndex: 2, textAlign: 'center',   background: "#feffcf",} 
                : 
                {position: 'sticky',top:55, background: "#feffcf", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)',}}>                 
              Fecha de ingreso al laboratorio
              <IconButton
                size="small"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  outline: "none"
                }}
                onClick={()=> {setColumValue(7)}}
              >
                 <PushPinIcon fontSize="small" sx={ColumValue == 7 ?{color:"red", transform: "rotate(45deg)", transition: "transform 0.2s"}: {outline: "none"}} />
                </IconButton>
            </TableCell>
            <TableCell 
              style={
                ColumValue == 8 ? 
                {position: 'sticky', left: 0,top:55, zIndex: 2, textAlign: 'center', background: "#feffcf"} 
                : 
                {position: 'sticky',top:55, background: "#feffcf", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)',}}>                    
              Fecha de vencimiento
              <IconButton
                size="small"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  outline: "none"
                }}
                onClick={()=> {setColumValue(8)}}
              >
                <PushPinIcon fontSize="small" sx={ColumValue == 8 ?{color:"red", transform: "rotate(45deg)", transition: "transform 0.2s"}: {outline: "none"}} />
                </IconButton>
            </TableCell>
            <TableCell 
              style={
                ColumValue == 9 ? 
                {position: 'sticky', left: 0,top:55, zIndex: 2, textAlign: 'center', background: "#feffcf"} 
                : 
                {position: 'sticky',top:55, background: "#feffcf", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)',}}>                    
              Fecha actualización de la información
              <IconButton
                size="small"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  outline: "none"
                }}
                onClick={()=> {setColumValue(9)}}
              >
                  <PushPinIcon fontSize="small" sx={ColumValue == 9 ?{color:"red", transform: "rotate(45deg)", transition: "transform 0.2s"}: {outline: "none"}} />
                </IconButton>
            </TableCell>
            <TableCell style={{position: 'sticky',top:55, background: "#feffcf", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', zIndex: 2 }}>Cantidad de ingreso</TableCell>
            <TableCell style={{position: 'sticky',top:55, background: "#c9c5fc", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', zIndex: 2 }}>Consideración de la manipulación</TableCell>
            <TableCell style={{position: 'sticky',top:55, background: "#c9c5fc", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', zIndex: 2 }}>Almacenamiento</TableCell>
            <TableCell style={{position: 'sticky',top:55, background: "#c9c5fc", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', zIndex: 2 }}>Certificado de análisis</TableCell>
            <TableCell style={{position: 'sticky',top:55, background: "#c9c5fc", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', zIndex: 2 }}>Responsable de la manipulación</TableCell>
            <TableCell style={{position: 'sticky',top:55, background: "#c9c5fc", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', zIndex: 2 }}>Observaciones</TableCell>
            <TableCell style={{position: 'sticky',top:55, background: "#d9ffd9", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', zIndex: 2 }}>Vencimiento</TableCell>
            <TableCell style={{position: 'sticky',top:55, background: "#d9ffd9", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', zIndex: 2 }}>Fecha actual</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
  {
    loading ? (
      <TableRow>
        <TableCell
          colSpan={Object.keys(data[0] || {}).length}
          sx={{
            marginLeft: "600px",
            textAlign: 'center',
            padding: 3,
            height: '50vh', // Asegura que ocupe toda la altura de la fila
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center', // Centrado vertical y horizontal
          }}
        >
          <CircularProgress size={150} /> {/* Aumenta el tamaño aquí */}
        </TableCell>
      </TableRow>
    ) : (
      Array.isArray(data) && data.length > 0 ? (
        data.map((row, rowIndex) => {
          const filteredRow = filterData(row); // Filtrar la fila
          return (
            <TableRow key={rowIndex}>
              {Object.keys(filteredRow).map((column, colIndex) => (
                <TableCell
                  key={colIndex}
                  style={
                    colIndex === ColumValue ? {
                      position: 'sticky',
                      left: 0,
                      zIndex: 0,
                      padding: 0,
                      margin: 0,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      textAlign: 'center',
                      fontSize: "14px"
                    } : {
                      textAlign: 'center',
                      fontSize: "14px"
                    }
                  }
                  onDoubleClick={() => handleDoubleClick(rowIndex, column)}
                >
                  {editingCell.rowIndex === rowIndex && editingCell.column === column && colIndex !== 13 ? (
                    <TextField
                      sx={{
                        width: '100%',
                        height: '42px',
                        padding: 0,
                        margin: 0,
                        borderRadius: "1px",
                        backgroundColor: '#f9fcfe',
                        textAlign: 'center',
                        fontSize: '15px',
                        lineHeight: "normal",
                        border: 'none',
                        '& .MuiInputBase-input': {
                          height: '42px',
                          padding: '0px',
                          fontSize: '15px',
                          textAlign: 'center',
                        },
                      }}
                      value={tempValue}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  ) : colIndex === 13 ? (
                    renderPdfButtons(rowIndex) // Mostrar botones solo para la columna 13
                  ) : (
                    filteredRow[column] // Mostrar el valor de la celda filtrada
                  )}
                </TableCell>
              ))}
            </TableRow>
          );
        })
      ) : (
        <TableRow>
          <TableCell colSpan={Object.keys(data[0] || {}).length} sx={{ textAlign: 'center' }}>
            No data available
          </TableCell>
        </TableRow>
      )
    )
  }
</TableBody>

 </Table>
 
   {/* Componente Modal visualizar Pdf */}
   <ModalComponent isOpen={isModalOpen} onClose={handleCloseModal} pdfUrl={pdfUrl} />

   {/* Condicional para mostrar el componente FileUpload */}
      {uploadRowIndex !== null && (
        <FileUpload rowIndex={uploadRowIndex} />
      )}

    {/* Snackbar para mostrar mensajes */}
    <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={snackbarOpen}
        autoHideDuration={3000} // Se cierra automáticamente después de 3 segundos
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
</TableContainer>

);
};

export default SGMRC;
