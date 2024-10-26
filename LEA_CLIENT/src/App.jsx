import React from 'react';
import SGMRC from './components/SGMRC';
import { Typography } from '@mui/material';

function App() {
  return (
    <div>
      <Typography variant="h4" sx={{ margin: 2, textAlign:'center' }}>
        MATERIAL DE REFERENCIA CERTIFICADO
      </Typography>
      <SGMRC />
    </div>
  );
}

export default App;
