import express from 'express';
import multer from 'multer';
import { uploadPdf, getPdf } from '../controllers/pdfController.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Ruta para subir PDF
router.post('/upload', upload.single('pdf'), uploadPdf);

// Ruta para obtener PDF
router.get('/:id', getPdf);

export default router;
