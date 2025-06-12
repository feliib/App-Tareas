import mongoose from 'mongoose';

const tareaSchema = new mongoose.Schema({
    nombre: { type: String, required: true, trim: true },
    categoria: { type: String, trim: true },
    estaActiva: { type: Boolean, default: true },
    idUsuario: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario',
        required: true 
    }
}, { timestamps: true });

export default mongoose.model('Tarea', tareaSchema);