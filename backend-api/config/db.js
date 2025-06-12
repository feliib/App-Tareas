import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB conectado exitosamente');
    } catch (error) {
        console.error(`Error de conexión con MongoDB: ${error.message}`);
        process.exit(1); // Detiene la app si no se puede conectar
    }
};

export default connectDB;