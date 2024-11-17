import express from 'express';
import morgan from 'morgan'
import cors from 'cors';
import dotenv from 'dotenv';

import db from './db/db.js';
import pdfRoutes from './routes/pdfRoutes.js';
import dataRoutes from './routes/dataRoutes.js';
import sendEmail  from './routes/emailRouter.js';

import configuraciones from './config/config.js'
const app = express();
const PORT = configuraciones.PORT || 4040
dotenv.config();

//static files
app.use(express.static('public'))
//middleware
app.use(cors()); //comunica la api con el servidor y ciertos dominios
app.use(morgan('dev'))
app.use(express.json()); //* middleware- analiza solicitudes entrantes con cargas JSON y se basa en body-parser


const corsOptions = {
    origin: ['http://127.0.0.1:5173', 'https://supreme-fiesta-gwxj4v95rrw2wrxx-5173.app.github.dev'],
    optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));

//*Rutas
app.use('/api/pdfs', pdfRoutes);
app.use('/api/table', dataRoutes);
app.use('/api/email', sendEmail);
// ***************************************************************

app.listen(PORT, ()=> {
    console.log(`conectado en el puerto: ${PORT}`);
})

export default app;