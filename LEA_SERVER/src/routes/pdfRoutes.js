import express from 'express';
import multer from 'multer';
import { uploadPdf, getPdfByIndex ,deletePdfByIndex, getDownPdfByIndex} from '../controllers/pdfController.js';


const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// Ruta para subir PDF
router.post('/upload', upload.single('pdf'), uploadPdf);

// Ruta para obtener PDF por rowIndex
router.get('/:rowId', getPdfByIndex);

// Ruta para descargar PDF por rowId
router.get('/download/:rowId', getDownPdfByIndex);

// Ruta para eliminar PDF por rowId
router.delete('/:rowId', deletePdfByIndex);

export default router;
