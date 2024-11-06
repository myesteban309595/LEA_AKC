// routes/user.routes.js
import express from 'express';
const router = express.Router();
import {createData,getAllDatas, getDataById, updateData, deleteData} from '../controllers/dataController.js'

// Ruta para crear un nuevo usuario
router.post('/data', createData);

// Ruta para obtener todos los usuarios
router.get('/data', getAllDatas);

// Ruta para obtener un usuario por ID
router.get('/data/:id', getDataById);

// Ruta para actualizar un usuario
router.put('/data/:id', updateData);

// Ruta para eliminar un usuario
router.delete('/data/:id', deleteData);

export default router;

