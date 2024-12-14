import React, { useState, useEffect, Suspense, lazy } from 'react';
import axios from 'axios';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  Tooltip, 
  TableHead, 
  TableRow, 
  Paper, 
  TextField, 
  Button, 
  IconButton ,
  Snackbar,
  Alert
  } from '@mui/material';

import Swal from 'sweetalert2'

import {ExportExcelWithTemplate} from '../utils/Functions/DownloadExcelData'
const FileUploadExcel = lazy(() => import('../utils/Functions/UploadExcelDataMasive')); //& aplicando lazy a este componente

import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import PostAddIcon from '@mui/icons-material/PostAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CircularProgress from '@mui/material/CircularProgress';
import HomeIcon from '@mui/icons-material/Home';

const CodificacionDeColoresComponent = React.memo(() => {
  // Estado para la fecha y hora actual
  const [data, setDataColors] = useState([]);
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
  // Abrir modal para carga masiva
  const [openUploadExcelModal, setOpenUploadExcelModal] = useState(false);

  useEffect(() => {
    // Realizar la solicitud GET a la API
    axios.get('https://sgmrcbackend-production.up.railway.app/api/tableColors/dataColors')
      .then(response => {
        setDataColors(response.data);
        setLoading(false);
      })
      .catch(err => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error al cargar los datos",
          footer: '<a href="#">Why do I have this issue?</a>'
        });
        //setError('Error al cargar los datos');
        setLoading(false);
      });
  }, []); // Este useEffect depende de la data, pero solo se ejecuta cuando data cambia.
  
    if (error) {
      return <div>{error}</div>;
    }

  const handleBlur = async () => {
    
    // Crea una copia de los datos y actualiza el valor modificado
    const newData = [...data];
    newData[editingCell.rowIndex][editingCell.column] = tempValue;
  
    // TAN PRONTO DESENFOQUE LA CASILLA, GUARDA LOS DATOS
    try {
      // Usar `newData` para enviar los datos modificados al servidor
      const response = await axios.post('https://sgmrcbackend-production.up.railway.app/api/tableColors/dataColorsreplaceall', newData);
      console.log("ejecutando desde handleBlur");
  
      // Si la solicitud es exitosa
      if (response.status === 200) {
        setSnackbarMessage('Datos actualizados correctamente');
        setSnackbarSeverity('success'); 
        setSnackbarOpen(true);
        // Actualiza el estado de `data` con los datos retornados por el servidor
        setDataColors(response.data); // Aquí asumimos que el servidor devuelve los datos actualizados
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Hubo un error al guardar los datos");
      setSnackbarOpen(true);
      setSnackbarSeverity("error");
    }
  };

  const agregarDataFila = () => {
    const newFile = {
      Reactivo: '----',
      Marca: '----',
      Codigo: '----',
      Lote: '----',
      fechaVencimiento: '--/--/--', 
      CAS: '----', 
      Color: '----',
      Accion: '----'
    };
    axios.post('https://sgmrcbackend-production.up.railway.app/api/tableColors/dataColors', newFile)
      .then(response => {
        // Una vez agregada la fila en la base de datos, agregarla al estado local para que se muestre
        console.log("response en agregar fila:",response);
        setDataColors(prevData => [response.data, ...prevData]);
      })
      .catch(err => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: `Error al agregar la fila: ${err.response ? err.response.data.message : err.message}`,
          showConfirmButton: false,
          timer: 1500
        });
        console.error(err);
      });
  };
  

const deleteRowData = (rowId) => {
  // Primero, mostramos una alerta de confirmación utilizando SweetAlert
  Swal.fire({
    title: "¿Estás seguro?",
    text: "¡No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar",
  }).then((result) => {
    // Si el usuario confirma la eliminación
    if (result.isConfirmed) {
      // Realizamos la eliminación de la fila
      axios.delete(`https://sgmrcbackend-production.up.railway.app/api/tableColors/dataColors/${rowId}`)
        .then(() => {
          // Si la eliminación es exitosa, obtenemos los datos actualizados
          axios.get('https://sgmrcbackend-production.up.railway.app/api/tableColors/dataColors')
            .then(updatedDataResponse => {
              setDataColors(updatedDataResponse.data); // Actualizamos el estado con los nuevos datos
              setSnackbarMessage('Datos eliminados correctamente');
              setSnackbarSeverity('success');
              setSnackbarOpen(true); // Mostrar mensaje de éxito

              // Mostramos una notificación de éxito con SweetAlert
              Swal.fire({
                icon: 'success',
                title: 'Fila eliminada',
                text: 'La fila se ha eliminado correctamente.',
              });
            })
            .catch(err => {
              const errorMessage = err.response ? err.response.data.message : err.message;
              setSnackbarMessage(`Error al obtener datos: ${errorMessage}`);
              setSnackbarSeverity('error');
              setSnackbarOpen(true);
              // Notificación de error en caso de que no se puedan obtener los datos
              Swal.fire({
                icon: 'error',
                title: 'Error al obtener los datos',
                text: errorMessage,
              });
            });
        })
        .catch(err => {
          const errorMessage = err.response ? err.response.data.message : err.message;
          setSnackbarMessage(`Error al eliminar la fila: ${errorMessage}`);
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
          // Notificación de error si la eliminación falla
          Swal.fire({
            icon: 'error',
            title: 'Error al eliminar la fila',
            text: errorMessage,
          });
        });
    }
  });
};

const exportExcelDataTable =()=> {
  ExportExcelWithTemplate({data:data, module:"dataTableColors"}) //? se envia la data para exportar el excel
}

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

const handleKeyDown = (event) => {
  if (event.key === 'Enter') {
    // Al presionar Enter, desenfocamos el campo y luego guardamos los datos
    event.target.blur(); // Esto activará el `onBlur` de inmediato
    // Usamos setTimeout para asegurar que el blur se complete antes de guardar
    setTimeout(() => {
      handleBlur();
    }, 100);  // Retraso de 100 ms para asegurarnos que el evento de blur haya pasado
  }
};

const handleSnackbarClose = () => {
  setSnackbarOpen(false);
};

const clickColumFixed = (columnClicked) => {
  if(columnClicked == ColumValue)
  {
    setColumValue(100000); // se fija un valor de columna que nunca vaya a existir
  }else{
    setColumValue(columnClicked); // se fija un valor de columna que nunca vaya a existir
  }
};

  const filterData = (row) => {
    // Campos a excluir de la data
   // const excludedFields = ['_id', 'createdAt', 'updatedAt', '__v'];
    const excludedFields = ['_id', 'updatedAt', 'createdAt', '__v']; // elimino createAt ya que es el ultimo en el objeto en la DB
  
    // Filtrar las propiedades que no quieres mostrar
    return Object.keys(row)
      .filter((key) => !excludedFields.includes(key)) // Excluye los campos no deseados
      .reduce((obj, key) => {
        obj[key] = row[key]; // Solo incluye los campos que quieres
        return obj;
      }, {});
  };

    //? Función para abrir el modal
    const handleOpenModalUploadExcel = () => {     
      setOpenUploadExcelModal(true);
    };
  
    //? Función para cerrar el modal
    const handleCloseModalUploadExcel = () => {
      setOpenUploadExcelModal(false);
    };

  return (
    <TableContainer component={Paper}
        style={{
          height: '100vh', // Ocupa el 100% de la altura de la ventana
          overflow: 'auto', // Permite el desplazamiento vertical y horizontal
        }}
      >
      <Table style={{ width: '100%' }}>
        <TableHead>
          <TableRow style={{background: "#82ccdd" }}>
            <TableCell colSpan={7} style={{ fontSize: '18px', textAlign: 'center', fontWeight: 'bold', border: '1px solid rgba(224, 224, 224, 1)' }}>
              CODIFICACION DE COLOR PARA ALMACENAMIENTO DE REACTIVOS								
            </TableCell>
            <TableCell colSpan={1} style={{ fontSize: '18px', textAlign: 'center', fontWeight: 'bold', border: '1px solid rgba(224, 224, 224, 1)' }}>
             <Tooltip title="Nueva Fila" enterDelay={100}>
               <IconButton
                style={{ outline: "none", color: "black" }}
                onClick={() => agregarDataFila()}
               >
                <PostAddIcon/>
               </IconButton>
              </Tooltip>								
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3} style={{ background: "#78e08f", textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
             <strong>Area</strong>: Físicoquímica		
            </TableCell>
            <TableCell colSpan={4} style={{ background: "#eabbfa", textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
             <strong>Revisado y aprobado</strong>: Paula Julia Blanco - Líder Laboratorio						
            </TableCell>
            <TableCell colSpan={1} style={{ background: "#eabbfa", textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
             <Tooltip title="Subir Data" enterDelay={100}>
              <IconButton
               style={{ outline: "none", color: "black" }}
               onClick={() => handleOpenModalUploadExcel()}
              >
               <UploadIcon/>
              </IconButton>
             </Tooltip>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3} style={{ background: "#78e08f", textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
              <strong>Fecha de actualización</strong>: 2024-10-18		
            </TableCell>
            <TableCell colSpan={4} style={{ background: "#eabbfa", textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
              <strong>Responsable actualización</strong>: Gloria Emilse Almeida Gonzalez - Coordinadora Area Físico- Química					
            </TableCell>
            <TableCell colSpan={1} style={{ background: "#eabbfa", textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
             <Tooltip title="Descargar Data" enterDelay={100}>
               <IconButton
                style={{ outline: "none", color: "black" }}
                onClick={() => exportExcelDataTable()}
               >
                <DownloadIcon/>
               </IconButton>
             </Tooltip>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{position: 'sticky',top:0, background: "#feffcf", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', zIndex: 1 }}>Reactivo</TableCell>
            <TableCell style={{position: 'sticky',top:0, background: "#f569fc", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', zIndex: 1 }}>Marca</TableCell>
            <TableCell style={{position: 'sticky',top:0, background: "#c9c5fc", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', zIndex: 1 }}>Codigo</TableCell>
            <TableCell style={{position: 'sticky',top:0, background: "#69fc8f", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', zIndex: 1 }}>No. Lote</TableCell>
            <TableCell style={{position: 'sticky',top:0, background: "#fcae69", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', zIndex: 1 }}>Fecha de vencimiento</TableCell>
            <TableCell style={{position: 'sticky',top:0, background: "#c069fc", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', zIndex: 1 }}>No. CAS</TableCell>
            <TableCell style={{position: 'sticky',top:0, background: "#f6fe7b", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', zIndex: 1 }}>Color</TableCell>
            <TableCell style={{position: 'sticky',top:0, background: "#f8a0fc", textAlign: 'center', borderRight: '1px solid rgb(224, 224, 224)', zIndex: 1 }}>Accion</TableCell>
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
            height: '50vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress size={150} />
        </TableCell>
      </TableRow>
    ) : (
      Array.isArray(data) && data.length > 0 ? (

        data.map((row, rowIndex) => {
          const filteredRow = filterData(row); // Filtrar la fila
          const backgroundColor = "transparent"
          const color = "black"

          const colorMapping = {
            VERDE: '#89e273',  // Color verde
            ROJO: '#f39278',   // Color rojo
            AZUL: '#78a4f3',   // Color azul
            AMARILLO: '#fafc69', // Color amarillo
            BLANCORAYADO: 'repeating-linear-gradient(45deg, #ffffff 0px, #ffffff 10px,rgb(231, 235, 238) 10px,rgb(214, 218, 221) 20px)', // Blanco con rayas grises
            BLANCO: '#ffffff'   // Color blanco
          };          

          return (
            <TableRow key={rowIndex}>

              {Object.keys(filteredRow).map((column, colIndex) => (
                <TableCell
                  key={colIndex}
                  sx={{
                    textAlign: 'center',
                    fontSize: "14px",
                    background: colIndex === 6 
                    // Eliminar todos los espacios antes de buscar el color en el objeto colorMapping
                    ? colorMapping[filteredRow[column].replace(/\s+/g, '').toUpperCase()] // Mapeo de color sin espacios
                    : backgroundColor, // Color de fondo predeterminado                    
                    color: color, // Color de texto
                  }}
                  onClick={() => handleDoubleClick(rowIndex, column)}
                >
                  {editingCell.rowIndex === rowIndex && editingCell.column === column && colIndex !== 7 ? (
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
                      onBlur={()=>handleBlur()}
                      onKeyDown={handleKeyDown}
                    />
                  ) : colIndex === 7 ? (
                    <IconButton
                      style={{ outline: "none", color: "#fc5a4e" }}
                      onClick={() => deleteRowData(row._id)}
                    >
                      <HighlightOffIcon />
                    </IconButton>
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

{/* Botón en la esquina superior derecha */}
  <Tooltip title="INICIO" enterDelay={100}>
     <IconButton
        style={{
          position: 'absolute',
          top: '18px',
          right: '120px',
          zIndex: 1,  // Para asegurarse de que esté por encima de otros elementos
          outline: "none"
        }}
        onClick={() => window.location="/"}
      >
        <HomeIcon />
      </IconButton>
    </Tooltip>

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
      {/* Componente con el modal de carga de Excel */}
      {/* Suspense envuelve el componente lazy */}
       <Suspense fallback={<CircularProgress />}>
         <FileUploadExcel 
           open={openUploadExcelModal} 
           onClose={handleCloseModalUploadExcel} 
           module="dataTableColors"
          />
       </Suspense>

</TableContainer>

);
});

export default CodificacionDeColoresComponent;
