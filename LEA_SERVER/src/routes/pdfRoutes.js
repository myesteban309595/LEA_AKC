import express from 'express';
import multer from 'multer';
import { uploadPdf, getPdfByIndex ,deletePdfByIndex} from '../controllers/pdfController.js';


const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// Ruta para subir PDF
router.post('/upload', upload.single('pdf'), uploadPdf);

// Ruta para obtener PDF por rowIndex
router.get('/:rowIndex', getPdfByIndex);

// Ruta para eliminar PDF por rowIndex
router.delete('/:rowIndex', deletePdfByIndex);

export default router;
