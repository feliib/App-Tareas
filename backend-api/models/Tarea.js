import mongoose from 'mongoose';

const TareaSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    categoria: { type: String },
    estaActiva: { type: Boolean, default: true },
    idUsuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }
});

export default mongoose.model('Tarea', TareaSchema);