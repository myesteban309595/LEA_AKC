import mongoose from 'mongoose';

const pdfSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true },
});

const Pdf = mongoose.model('Pdf', pdfSchema);
export default Pdf; // Asegúrate de usar 'export default'
