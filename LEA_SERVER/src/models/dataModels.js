import mongoose from 'mongoose';

// Definir el esquema con 18 campos
const dataSchema = new mongoose.Schema({
  fechaSolicitud: { type: String },
  codigoInventario: { type: String },
  nombre: { type: String }, // Cambié a String, ya que parece más apropiado
  marca: { type: String },
  lote: { type: String },  // Correcto para establecer fecha por defecto
  tipo: { type: String },
  area: { type: String },
  fechaIngreso: { type: String },  // Cambié a Date si debe ser una fecha
  fechaVencimiento: { type: String },  // Cambié a Date, ya que parece ser una fecha
  fechaActualizacionInformacion: { type: String },
  cantidadIngreso: { type: Number },  // Cambié a Number si representa una cantidad
  manipulacion: { type: String },
  almacenamiento: { type: String },
  certificadoAnalisis: { type: Boolean },
  responsable: { type: String },  // Cambié a String si es un nombre o identificador
  observaciones: { type: String },
  vencimiento: { type: String },
  mesesRestantes: { type: String },
  estado: {type: String}
}, { timestamps: true });  // Este campo agrega createdAt y updatedAt automáticamente

// Crear los índices en los campos más utilizados
dataSchema.index({ fechaVencimiento: 1 });
dataSchema.index({ mesesRestantes: 1 });

// Crear el modelo
const Data = mongoose.model('Data', dataSchema);

export default Data;
