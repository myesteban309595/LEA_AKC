import {React, Fragment} from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom'

import SGMRC from './components/SGMRC';
import UploadFile from './components/UploadFile'
import { Typography } from '@mui/material';


function App() {
  return (
    <div>
     <Fragment>   
      <BrowserRouter>
       <Routes>
        <Route path='/' element = {<SGMRC/>}/>
        <Route path="/upload/:rowId" element = {<UploadFile/>}/>
       </Routes>
      </BrowserRouter>
     </Fragment>
    </div>
  );
}

export default App;
