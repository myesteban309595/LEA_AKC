import Pdf from '../models/pdfModel.js';

export const uploadPdf = async (req, res) => {
    const { rowIndex } = req.body;

    // Verifica que req.file esté definido
    if (!req.file) {
        return res.status(400).json({ message: 'No se subió ningún archivo.' });
    }

    // Extrae las propiedades de req.file
    const { originalname, mimetype, buffer } = req.file;

    // Asegúrate de que originalname se esté utilizando como filename
    if (!originalname) {
        return res.status(400).json({ message: 'El nombre del archivo es requerido.' });
    }

    try {
        const newPdf = new Pdf({
            filename: originalname, // Usa originalname aquí
            data: buffer,
            contentType: mimetype,
            rowIndex: Number(rowIndex), // Asegúrate de convertirlo a número
        });

        await newPdf.save();
        res.status(201).json({ message: 'PDF subido exitosamente', filename: originalname });
    } catch (error) {
        console.error("Error al subir el PDF:", error);
        res.status(500).json({ message: 'Error al subir el PDF', error });
    }
};


// Obtener PDF
    export const getPdfByIndex = async (req, res) => {
        const { rowIndex } = req.params;
    
        try {
            const pdf = await Pdf.findOne({ rowIndex: Number(rowIndex) });
    
            if (!pdf) {
                return res.status(404).json({ message: 'PDF no encontrado' });
            }
    
            res.set('Content-Type', pdf.contentType);
            res.set('Content-Disposition', `attachment; filename="${pdf.filename}"`);
            // res.send(pdf.data); // Asegúrate de que pdf.data contenga el buffer del PDF
            res.json({
                filename: pdf.filename,
                data: pdf.data // Asegúrate de que pdf.data contenga el buffer del PDF
            });

        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el PDF', error });
        }
};

// Eliminar PDF
export const deletePdfByIndex = async (req, res) => {
    const { rowIndex } = req.params;

    try {
        const deletedPdf = await Pdf.findOneAndDelete({ rowIndex: Number(rowIndex) });

        if (!deletedPdf) {
            return res.status(404).json({ message: 'PDF no encontrado' });
        }

        res.status(200).json({ message: 'PDF eliminado exitosamente', filename: deletedPdf.filename });
    } catch (error) {
        console.error("Error al eliminar el PDF:", error);
        res.status(500).json({ message: 'Error al eliminar el PDF', error });
    }
};

