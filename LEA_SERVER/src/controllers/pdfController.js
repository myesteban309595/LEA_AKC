import Pdf from '../models/pdfModel.js';

// Subir PDF
export const uploadPdf = async (req, res) => {
    const pdfFile = req.file;
    const newPdf = new Pdf({
        filename: pdfFile.originalname,
        data: pdfFile.buffer,
        contentType: pdfFile.mimetype,
    });

    try {
        await newPdf.save();
        res.status(201).json({ message: 'PDF subido exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al subir el PDF', error });
    }
};

// Obtener PDF
export const getPdf = async (req, res) => {
    try {
        const pdf = await Pdf.findById(req.params.id);
        res.contentType(pdf.contentType);
        res.send(pdf.data);
    } catch (error) {
        res.status(404).json({ message: 'PDF no encontrado', error });
    }
};
