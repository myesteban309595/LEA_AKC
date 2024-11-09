// SpeedDialComponent.jsx
import * as React from 'react';
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from '@mui/material';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import PostAddIcon from '@mui/icons-material/PostAdd';

const actions = [
  { icon: <PostAddIcon />, name: 'Nueva Fila' },
  { icon: <FileCopyIcon />, name: 'Copy' },
  { icon: <SaveIcon />, name: 'Save' },
  { icon: <PrintIcon />, name: 'Print' },
  { icon: <ShareIcon />, name: 'Share' },
];

export default function SpeedDialComponent({ sx, agregarDataFila }) {
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
          onClick={action.name === 'Nueva Fila' ? agregarDataFila : undefined}  // Ejecuta la función agregarDataFila cuando se hace clic en "Nueva Fila"
          sx={{
            '&:focus, &:active': {
              outline: 'none',   // Elimina el borde de enfoque
              //boxShadow: 'none', // Elimina la sombra de enfoque
            }
          }}
        />
      ))}
    </SpeedDial>
  );
}
