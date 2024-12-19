// SpeedDialComponent.jsx
import * as React from 'react';
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from '@mui/material';

// ICONS
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import PostAddIcon from '@mui/icons-material/PostAdd';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import TableRowsIcon from '@mui/icons-material/TableRows';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const actions = [
  { icon: <PostAddIcon />, name: 'Nueva Fila' },
  { icon: <FileDownloadIcon />, name: 'Export Excel' },
  { icon: <FileUploadIcon />, name: 'Upload Excel' },
  { icon: <PrintIcon />, name: 'Print' },
  { icon: <TableRowsIcon />, name: 'Table de Colores' },
  { icon: <PictureAsPdfIcon />, name: 'DescargarManual' },
];

export default function SpeedDialComponent({ sx, agregarDataFila, exportExcelTable, uploadExcelData, DownloadManual }) {
  return (
    <SpeedDial
      ariaLabel="SpeedDial example"
      hidden={false}
      icon={<SpeedDialIcon />}
      direction="left"
      sx={sx}  // Recibe estilos a través de `sx` como prop
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={() => {
            // Llamamos a la función correspondiente basada en el nombre de la acción
            if (action.name === 'Nueva Fila') {
              agregarDataFila();
            } else if (action.name === 'Export Excel') {
              exportExcelTable();
            } else if (action.name === 'Upload Excel') {
              uploadExcelData();  // Llamamos la función para abrir el modal
            } else if (action.name === 'Table de Colores') {
              window.location ="/colors" 
            } else if (action.name === 'DescargarManual'){
              DownloadManual()
            }
          }}
          sx={{
            '&:focus, &:active': {
              outline: 'none',
            },
          }}
        />
      ))}
    </SpeedDial>
  );
}
