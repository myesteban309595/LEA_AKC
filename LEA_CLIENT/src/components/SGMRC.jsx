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

import {calcularDiferenciaEnMeses} from '../utils/Functions/CalcularDiferenciaFechas'
import {ExportExcelWithTemplate} from '../utils/Functions/DownloadExcelData'
import ModalFilterData from '../utils/modals/ModalFilterData';
const FileUploadExcel = lazy(() => import('../utils/Functions/UploadExcelDataMasive')); //& aplicando lazy a este componente


import ModalComponent from '../utils/modals/ViewPdf';
import FileUpload from '../components/UploadFile';
import SpeedDialComponent from '../utils/speedDial/SpeedDial';

import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import PushPinIcon from '@mui/icons-material/PushPin';
import DeleteIcon from '@mui/icons-material/Delete';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CircularProgress from '@mui/material/CircularProgress';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import SearchIcon from '@mui/icons-material/Search';

const SGMRC = React.memo(() => {
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
  // Abrir modal para carga masiva
  const [openUploadExcelModal, setOpenUploadExcelModal] = useState(false);
  // Abrir modal para filtrar data
  const [isModalFilterOpen, setIsModalFilterOpen] = useState(false);


  const [uploadRowIndex, setUploadRowIndex] = useState(null); // Estado para el rowIndex a subir

  const handleUploadIndex = (rowId) => {
    setUploadRowIndex(rowId); // Establecer el rowId seleccionado
    window.location = `/upload/${rowId}`; // Incluye el rowId en la URL
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
    console.log('Componente montado');
    // Realizar la solicitud GET a la API
    axios.get('https://sgmrcbackend-production.up.railway.app/api/table/data')
      .then(response => {
        setData(response.data);
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

    const fetchPdf = async (rowId) => {
      try {
          const response = await axios.get(`https://sgmrcbackend-production.up.railway.app/api/pdfs/${rowId}`, {
              responseType: 'blob',  // Especifica que esperas un blob (archivo binario)
          });
  
          const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
          const pdfUrl = window.URL.createObjectURL(pdfBlob);
  
          // Abre el PDF en una nueva pestaña o en un modal
          const newTab = window.open(pdfUrl, '_blank');

          if (newTab) newTab.focus();
  
      } catch (error) {
          console.error('Error al obtener el PDF:', error);
      }
  };

  const DownloadPdf = async (rowId) => {
    try {
        // Realiza la solicitud para obtener el archivo PDF
        const response = await axios.get(`https://sgmrcbackend-production.up.railway.app/api/pdfs/download/${rowId}`);

        // Extraer el nombre del archivo desde los datos JSON
        const { filename, data } = response.data;

        if (!filename || !data) {
            throw new Error("Nombre del archivo o datos no disponibles.");
        }

        // Convertir los datos base64 a un Blob
        const byteCharacters = atob(data); // Decodificar el base64
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
            const slice = byteCharacters.slice(offset, offset + 1024);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            byteArrays.push(new Uint8Array(byteNumbers));
        }

        const pdfBlob = new Blob(byteArrays, { type: 'application/pdf' });

        // Crear una URL para el Blob
        const url = window.URL.createObjectURL(pdfBlob);

        // Crear un enlace para descargar el archivo
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename); // Asigna el nombre del archivo

        // Agregar el enlace al DOM y simular un clic para iniciar la descarga
        document.body.appendChild(link);
        link.click();

        // Eliminar el enlace después de descargar el archivo
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error al obtener el PDF:', error);

        // Si ocurre un error, muestra una alerta
        Swal.fire({
            icon: "error",
            title: "Error al descargar el archivo",
            text: "No hay archivo asociado a este material de referencia!",
            footer: `<a href="/upload/${rowId}">Subir archivo</a>`,
        });
    }
};


const DeletePdf = async (rowId) => {
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
      const response = await axios.delete(`https://sgmrcbackend-production.up.railway.app/api/pdfs/${rowId}`);

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

const NotificarAlerta = async (params) => {

  try {
    const result = await Swal.fire({
      title: params.notificado ? "Activar Notificaciones":"Notificar Enterado",
      text: params.notificado ? 
            "Recibirá correos electronicos de alerta sobre este reactivo"
            :
            "Una vez notificado, se desactivará la alerta y no se recibirán emails para este reactivo",
      icon:  params.notificado ? "question" :"warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: params.notificado ? "Sí, enviame alertas al email": "Sí, Notifica el Enterado",
    });

    // Verifica si el usuario confirmó la acción
    if (result.isConfirmed) {
      const response = await axios.get(`https://sgmrcbackend-production.up.railway.app/api/email/notificar-producto/${params._id}`);

      // Notificación de éxito
      Swal.fire({
        icon: 'success',
        title: 'Nofiticado',
        text: response.data.message,
      });

      window.location.reload(); //? recargamos la pagina para actualizazr

    }
   } catch (error) {
     console.error('Error al notificar sobre la alerta:', error);
    // Notificación de error
    Swal.fire({
      icon: 'error',
      title: 'Error al notificar la alerta',
      text: error.response?.data?.message || 'Ocurrió un error inesperado.',
    });
  }
};

  const handleBlur = async () => {
    
    // Crea una copia de los datos y actualiza el valor modificado
    const newData = [...data];
    newData[editingCell.rowIndex][editingCell.column] = tempValue;
  
    // TAN PRONTO DESENFOQUE LA CASILLA, GUARDA LOS DATOS
    try {
      // Usar `newData` para enviar los datos modificados al servidor
      const response = await axios.post('https://sgmrcbackend-production.up.railway.app/api/table/datareplaceall', newData);
      console.log("ejecutando desde handleBlur");
  
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
  };
  

  const agregarDataFila = ()=> {

    const newFile = {
      fechaSolicitud: '--/--/--',
      codigoInventario: '----',
      nombre: '----',
      marca: '----',
      lote: '----',
      tipo: '----',
      area: '----',
      fechaIngreso: '--/--/--',
      fechaVencimiento: '--/--/--',
      fechaActualizacionInformacion: '--/--/--',
      cantidadIngreso: null,
      manipulacion: 'Sin especificar',
      almacenamiento: '----',
      certificadoAnalisis: null,
      responsable: '----',
      observaciones: 'Ninguna',
      vencimiento: '--/--/--',
      mesesRestantes: null,
      notificado: false
    }

    axios.post('https://sgmrcbackend-production.up.railway.app/api/table/data', newFile)
    .then(response => {
      // Una vez agregada la fila en la base de datos, agregarla al estado local para que se muestre
      setData(prevData => [response.data, ...prevData]);
    })
    .catch(err => {
      Swal.fire({
        position: "center",
        icon: "error",
        title: `Error al agregar la fila: ${err.response ? err.response.data.message : err.message}`,
        showConfirmButton: false,
        timer: 1500
      });
      //setError(`Error al agregar la fila: ${err.response ? err.response.data.message : err.message}`);
      console.error(err);
    });
  }

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
      axios.delete(`https://sgmrcbackend-production.up.railway.app/api/table/data/${rowId}`)
        .then(() => {
          // Si la eliminación es exitosa, obtenemos los datos actualizados
          axios.get('https://sgmrcbackend-production.up.railway.app/api/table/data')
            .then(updatedDataResponse => {
              setData(updatedDataResponse.data); // Actualizamos el estado con los nuevos datos
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
  ExportExcelWithTemplate({data:data, module:"dataTable"}) //? se envia la data para exportar el excel
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
    const excludedFields = ['_id', 'updatedAt', 'createdAt']; // elimino createAt ya que es el ultimo en el objeto en la DB
  
    // Filtrar las propiedades que no quieres mostrar
    return Object.keys(row)
      .filter((key) => !excludedFields.includes(key)) // Excluye los campos no deseados
      .reduce((obj, key) => {
        obj[key] = row[key]; // Solo incluye los campos que quieres
        return obj;
      }, {});
  };

  
    //? Función para Descargar el manual

    const DescargarManual = async () => {
      try {
        // Solicitar el archivo con la respuesta como 'blob'
        const response = await axios.get('https://sgmrcbackend-production.up.railway.app/api/download/downloadmanual', {
          responseType: 'blob',  // Especificamos que la respuesta es un archivo binario
        });
    
        // Verificamos si la respuesta fue exitosa
        if (response.status === 200) {
          // Crear un enlace temporal para descargar el archivo
          const blob = response.data; // El archivo PDF recibido
          const link = document.createElement('a');
          
          // Crear una URL para el blob y asignarlo al enlace
          const url = window.URL.createObjectURL(new Blob([blob]));
          link.href = url;
          link.setAttribute('download', 'manualAPPLABAKC.pdf');  // El nombre con el que se descargará el archivo
          document.body.appendChild(link);
          
          // Simular un clic en el enlace para descargar el archivo
          link.click();
          
          // Limpiar la URL del blob después de la descarga
          window.URL.revokeObjectURL(url);
          
          // Mostrar mensaje de éxito
          setSnackbarMessage('Manual Descargado');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error(error);
        setSnackbarMessage("Hubo un error al Descargar el manual");
        setSnackbarOpen(true);
        setSnackbarSeverity("error");
      }
    };
    
    
    //? Función para abrir el modal
    const handleOpenModalUploadExcel = () => {      
      setOpenUploadExcelModal(true);
    };
  
    //? Función para cerrar el modal
    const handleCloseModalUploadExcel = () => {
      setOpenUploadExcelModal(false);
    };

    const openFilterModal = () => {
      setIsModalFilterOpen(true);
    };
  
    const closeFilterModal = () => {
      setIsModalFilterOpen(false);
    };

  const renderPdfButtons = (rowId) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: 10, marginRight: 10 }}>
      <IconButton
        style={{ outline: "none", color: "#f5d131" }}
        onClick={() => fetchPdf(rowId)}
      >
        <RemoveRedEyeIcon />
      </IconButton>
      <IconButton
        style={{ outline: "none", color: "#3172f5" }}
        onClick={() => handleUploadIndex(rowId)}
      >
        <CloudUploadIcon />
      </IconButton>
      <IconButton
        style={{ outline: "none", color: "#0f9638" }}
        onClick={() => DownloadPdf(rowId)}
      >
        <DownloadForOfflineIcon />
      </IconButton>
      <IconButton
        style={{ outline: "none", color: "#ed1111" }}
        onClick={() => DeletePdf(rowId)}
      >
        <DeleteIcon />
      </IconButton>
    </div>
  );
  
  const renderNotificationsButtons = (params) => (

    <div style={{ display: 'flex', justifyContent: 'center', marginLeft: 10, marginRight: 10 }}>
      {params.notificado ? 
       <Tooltip title="Alerta Desactivada" enterDelay={1000}>
         <IconButton
          style={{ outline: "none", color: "#5d6d7e" }}
          onClick={() => NotificarAlerta(params)}
         >
          <NotificationsOffIcon />
         </IconButton>
        </Tooltip>
        :
        <Tooltip title="Recibir Alerta" >
         <IconButton
          style={{ outline: "none", color: "#212f3c" }}
          onClick={() => NotificarAlerta(params)}
         >
          <NotificationsActiveIcon />
         </IconButton>
        </Tooltip>
      }
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
            <TableCell colSpan={21} style={{ fontSize: '25px', fontWeight: 'bold' }}>
              <div>{fechaHoraActual}</div>
            </TableCell>
          </TableRow>
          <TableRow style={{background: "#82ccdd" }}>
            <TableCell colSpan={21} style={{ fontSize: '18px', textAlign: 'center', fontWeight: 'bold', border: '1px solid rgba(224, 224, 224, 1)' }}>
             {/* Botón de filtro al inicio de la fila */}
             <Tooltip title="Filtro" enterDelay={100}>
              <IconButton
               style={{
                position: 'absolute',  // Posicionamos el botón dentro de la celda
                top: '65px',            // A 15px del borde superior de la celda
                left: '10px',           // A 10px del borde izquierdo de la celda
                zIndex: 1,           // Asegura que el botón esté por encima de otros elementos
                outline: 'none'
                }}
                  onClick={() => openFilterModal()}  // Aquí puedes agregar la lógica para abrir el filtro
                 >
                  <SearchIcon /> {/* Este es el ícono para el filtro */}
               </IconButton>
              </Tooltip>
              Seguimiento General Material de referencia
            </TableCell>
          </TableRow>
          <TableRow style={{position: 'sticky', top: 0, zIndex: 1, }}>
            <TableCell colSpan={3} style={{ background: "#78e08f", textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
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
            <TableCell colSpan={3} style={{ background: "#c5fcc5", textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
              Seguimiento Consumo
            </TableCell>
            <TableCell colSpan={1} style={{ background: "#f1c40f", textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
              Operaciones
            </TableCell>
          </TableRow>
          <TableRow>
          <TableCell style={{position: 'sticky',top:55, border: 'white 3px groove', background: "#e1dffd", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', zIndex: 2 }}>N°</TableCell>
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
                onClick={()=> {clickColumFixed(0)}}
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
                onClick={()=> {clickColumFixed(1)}}
              >
                <PushPinIcon fontSize="small" sx={ColumValue == 1 ?{color:"red", transform: "rotate(45deg)", transition: "transform 0.2s"}: {outline: "none"}} />
              </IconButton>
            </TableCell>
            <TableCell 
              style={
                ColumValue == 2 ? 
                {position: 'sticky', minWidth: '200px', left: 0,top:55, zIndex: 2, textAlign: 'center', background: "#f5d9ff"} 
                : 
                {position: 'sticky', minWidth: '200px',top:55, background: "#f5d9ff", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', }}>            
              Nombre
              <IconButton
                size="small"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  outline: "none"
                }}
                onClick={()=> {clickColumFixed(2)}}
              >
               <PushPinIcon fontSize="small" sx={ColumValue == 2 ?{color:"red", transform: "rotate(45deg)", transition: "transform 0.2s"}: {outline: "none"}} />
              </IconButton>
            </TableCell>
            <TableCell 
              style={
                ColumValue == 3 ? 
                {position: 'sticky', minWidth: '100px', left: 0,top:55, zIndex: 2, textAlign: 'center', background: "#f5d9ff"} 
                : 
                {position: 'sticky', minWidth: '100px',top:55, background: "#f5d9ff", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', }}>    
              Marca
              <IconButton
                size="small"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  outline: "none"
                }}
                onClick={()=> {clickColumFixed(3)}}
              >
               <PushPinIcon fontSize="small" sx={ColumValue == 3 ?{color:"red", transform: "rotate(45deg)", transition: "transform 0.2s"}: {outline: "none"}} />
              </IconButton>
            </TableCell>
            <TableCell 
              style={
                ColumValue == 4 ? 
                {position: 'sticky',  minWidth: '100px',left: 0,top:55, zIndex: 2, textAlign: 'center', background: "#f5d9ff"} 
                : 
                {position: 'sticky', minWidth: '100px',top:55, background: "#f5d9ff", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', }}>                 
              No. Lote
              <IconButton
                size="small"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  outline: "none"
                }}
                onClick={()=> {clickColumFixed(4)}}
              >
               <PushPinIcon fontSize="small" sx={ColumValue == 4 ?{color:"red", transform: "rotate(45deg)", transition: "transform 0.2s"}: {outline: "none"}} />
              </IconButton>
            </TableCell>
            <TableCell 
               style={
                ColumValue == 5 ? 
                {position: 'sticky',  minWidth: '100px',left: 0,top:55, zIndex: 2, textAlign: 'center', background: "#f5d9ff",} 
                : 
                { position: 'sticky',  minWidth: '100px',top:55, background: "#f5d9ff", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)',}}>                 
              TIPO
              <IconButton
                size="small"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  outline: "none"
                }}
                onClick={()=> {clickColumFixed(5)}}
              >
                <PushPinIcon fontSize="small" sx={ColumValue == 5 ?{color:"red", transform: "rotate(45deg)", transition: "transform 0.2s"}: {outline: "none"}} />
              </IconButton>
            </TableCell>
            <TableCell 
              style={
                ColumValue == 6 ? 
                {position: 'sticky',  minWidth: '100px', left: 0,top:55, zIndex: 2, textAlign: 'center',  background: "#feffcf",} 
                : 
                {position: 'sticky',  minWidth: '100px', top:55, background: "#feffcf", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', }}>                 
              AREA
              <IconButton
                size="small"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  outline: "none"
                }}
                onClick={()=> {clickColumFixed(6)}}
              >
                 <PushPinIcon fontSize="small" sx={ColumValue == 6 ?{color:"red", transform: "rotate(45deg)", transition: "transform 0.2s"}: {outline: "none"}} />
                </IconButton>
            </TableCell>
            <TableCell 
              style={
                ColumValue == 7 ? 
                {position: 'sticky', left: 0, minWidth: '100px',top:55, zIndex: 2, textAlign: 'center',   background: "#feffcf",} 
                : 
                {position: 'sticky',top:55,  minWidth: '100px', background: "#feffcf", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)',}}>                 
              Fecha de ingreso al laboratorio
              <IconButton
                size="small"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  outline: "none"
                }}
                onClick={()=> {clickColumFixed(7)}}
              >
                 <PushPinIcon fontSize="small" sx={ColumValue == 7 ?{color:"red", transform: "rotate(45deg)", transition: "transform 0.2s"}: {outline: "none"}} />
                </IconButton>
            </TableCell>
            <TableCell 
              style={
                ColumValue == 8 ? 
                {position: 'sticky', left: 0,  minWidth: '100px', top:55, zIndex: 2, textAlign: 'center', background: "#feffcf"} 
                : 
                {position: 'sticky',top:55,  minWidth: '100px', background: "#feffcf", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)',}}>                    
              Fecha de vencimiento
              <IconButton
                size="small"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  outline: "none"
                }}
                onClick={()=> {clickColumFixed(8)}}
              >
                <PushPinIcon fontSize="small" sx={ColumValue == 8 ?{color:"red", transform: "rotate(45deg)", transition: "transform 0.2s"}: {outline: "none"}} />
                </IconButton>
            </TableCell>
            <TableCell 
              style={
                ColumValue == 9 ? 
                {position: 'sticky', left: 0,  minWidth: '100px', top:55, zIndex: 2, textAlign: 'center', background: "#feffcf"} 
                : 
                {position: 'sticky',top:55,  minWidth: '100px', background: "#feffcf", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)',}}>                    
              Fecha actualización de la información
              <IconButton
                size="small"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  outline: "none"
                }}
                onClick={()=> {clickColumFixed(9)}}
              >
                  <PushPinIcon fontSize="small" sx={ColumValue == 9 ?{color:"red", transform: "rotate(45deg)", transition: "transform 0.2s"}: {outline: "none"}} />
                </IconButton>
            </TableCell>
            <TableCell style={{position: 'sticky',top:55, background: "#feffcf", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', zIndex: 1 }}>Cantidad de ingreso</TableCell>
            <TableCell style={{position: 'sticky',top:55, background: "#c9c5fc", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', zIndex: 1 }}>Consideración de la manipulación</TableCell>
            <TableCell style={{position: 'sticky',top:55, background: "#c9c5fc", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', zIndex: 1 }}>Almacenamiento</TableCell>
            <TableCell style={{position: 'sticky',top:55, background: "#c9c5fc", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', zIndex: 1 }}>Certificado de análisis</TableCell>
            <TableCell style={{position: 'sticky',top:55, background: "#c9c5fc", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', zIndex: 1 }}>Responsable de la manipulación</TableCell>
            <TableCell style={{position: 'sticky',top:55, background: "#c9c5fc", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', zIndex: 1 }}>Observaciones</TableCell>
            <TableCell style={{position: 'sticky',top:55, background: "#d9ffd9", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', zIndex: 1 }}>Vencimiento</TableCell>
            <TableCell style={{position: 'sticky',top:55, background: "#d9ffd9", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', zIndex: 1 }}>Alerta [Meses]</TableCell>
            <TableCell style={{position: 'sticky',top:55, background: "#f7dc6f", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', zIndex: 1 }}>Notificacion</TableCell>
            <TableCell style={{position: 'sticky',top:55, background: "#fcb6b1", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', zIndex: 1 }}>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
  {
    loading ? (
      <TableRow>
       <TableCell
        colSpan={Object.keys(data[0] || {}).length}
        sx={{
             position: 'relative', // Establecer posición relativa para que el z-index se pueda aplicar
             zIndex: 1, // Asegurar que la tabla tenga un z-index inferior al spinner
        }}
       >
       {/* CircularProgress centrado en la página */}
        <div
         style={{
           position: 'fixed', // Posición fija respecto a la ventana del navegador
           top: '50%', // Centrado verticalmente
           left: '50%', // Centrado horizontalmente
           transform: 'translate(-50%, -50%)', // Ajuste para centrar exactamente
           zIndex: 9999, // Asegura que esté por encima de la tabla
          }}
        >
          <CircularProgress size={150} />
        </div>
       </TableCell>
      </TableRow>
    ) : (
      Array.isArray(data) && data.length > 0 ? (
        data.map((row, rowIndex) => {

          const filteredRow = filterData(row); // Filtrar la fila
          const fechaVencimiento = row.fechaVencimiento;  // Fecha de vencimiento (string)
          const mesesRestantes = parseInt(row.mesesRestantes, 10);  // Convertir mesesRestantes a número

          // Convertimos la fecha de vencimiento a un objeto Date para asegurarnos de que sea válida
          const fechaVencimientoDate = new Date(fechaVencimiento); // Convertir a Date
          const fechaActual = new Date(); // Fecha actual
          
          // Calcular la diferencia en meses entre la fecha actual y la fecha de vencimiento
          const diferenciaMeses = calcularDiferenciaEnMeses(fechaActual, fechaVencimientoDate);

          // Comprobar si la fecha de vencimiento está dentro del rango de mesesRestantes
          const esProximoAVencer = diferenciaMeses <= mesesRestantes;
          const materialVencido = fechaVencimientoDate < fechaActual; // Comprobar si la fecha ya ha pasado

          // Establecer los colores de fondo
          let backgroundColor = 'transparent';
          let color = 'inherit'; // Color por defecto para el texto

          // Si la fecha de vencimiento ya ha pasado (producto vencido)
          if (materialVencido) {
            backgroundColor = 'rgba(255, 87, 34, 0.2)'; // Rojo claro
            color = '#fc5a4e'; // Rojo para el texto
          }
          // Si la fecha está próxima a vencer (dentro de los meses restantes)
          else if (esProximoAVencer) {
            backgroundColor = 'rgba(255, 235, 59, 0.3)'; // Amarillo claro
            color = '#ff9800'; // Naranja para el texto
          }

          return (
            <TableRow key={rowIndex}>
               {/* {Object.keys(filteredRow).forEach((column, colIndex) => {
                 console.log(`Columna: ${column}, Índice: ${colIndex}`);
              })} esta linea me muestra el valor de la columna y su indice asi se en que indice se va pintasr cada dato */}
              <TableCell
                style={{                  
                   textAlign: 'center',
                  fontSize: "14px",
                  backgroundColor: 'rgba(246, 247, 247, 0.85)', // Color de fondo
                  color: color, 
                  border: 'white 3px groove',
                  zIndex: 3
                }}              
              >
               {rowIndex+1}
              </TableCell>
              {Object.keys(filteredRow).map((column, colIndex) => (
                <TableCell
                  style={colIndex === ColumValue ? {
                    position: 'sticky',
                    left: 0,
                    zIndex: 0,
                    padding: 0,
                    margin: 0,
                    backgroundColor: 'rgba(229, 232, 232, 0.85)',
                    color: color,
                    textAlign: 'center',
                    fontSize: "14px"
                  } : {
                    textAlign: 'center',
                    fontSize: "14px",
                    backgroundColor: backgroundColor, // Color de fondo
                    color: color, // Color de texto
                  }}
                  key={colIndex}
                  sx={{
                    textAlign: 'center',
                    fontSize: "14px",
                    backgroundColor: backgroundColor, // Color de fondo
                    color: color, // Color de texto
                  }}
                  onClick={() => handleDoubleClick(rowIndex, column)}
                >
                  {editingCell.rowIndex === rowIndex && editingCell.column === column && colIndex !== 13 && colIndex !== 18 && colIndex !== 19 ? (
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
                  ) : colIndex === 13 ? (
                    renderPdfButtons(row._id) // Mostrar botones solo para la columna 13
                  ): colIndex === 18 ? (
                    renderNotificationsButtons({ _id: row._id, notificado: row.notificado }) // Mostrar boton si fue notificado o sigue en alarma
                  ): colIndex === 19 ? (
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

     {/* Modal para filtrar */}
     <ModalFilterData
        isOpen={isModalFilterOpen}
        onClose={closeFilterModal}
        data={data}
        module="dataTable"
     />

    {/* Componente Modal visualizar Pdf */}
    <ModalComponent 
     isOpen={isModalOpen} 
     onClose={handleCloseModal} 
     pdfUrl={pdfUrl} 
     />

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

      {/* Speed Dial */}
      <SpeedDialComponent
        uploadExcelData={handleOpenModalUploadExcel}
        exportExcelTable={exportExcelDataTable}
        agregarDataFila={agregarDataFila} // ejecuto la funcion agregar fila desde el speedDial
        DownloadManual={DescargarManual}
              sx={{
                position: 'fixed',
                top: 16,  // Puedes ajustar este valor para mover el SpeedDial
                right: 35,  // Ajusta el valor para la distancia del borde derecho
                zIndex: 1300,
                '&:focus, &:active': { 
                  outline: 'none', // Elimina el borde de enfoque (outline) al hacer clic
                  // boxShadow: 'none', // Elimina la sombra de enfoque
                },
              }}
      />

      {/* Componente con el modal de carga de Excel */}
      {/* Suspense envuelve el componente lazy */}
       <Suspense fallback={<CircularProgress />}>
         <FileUploadExcel 
           open={openUploadExcelModal} 
           onClose={handleCloseModalUploadExcel} 
           module="dataTable"
          />
       </Suspense>

</TableContainer>

);
});

export default SGMRC;
