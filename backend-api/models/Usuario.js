import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    rol: { type: String, default: 'user' }
}, { timestamps: true });

export default mongoose.model('Usuario', usuarioSchema);