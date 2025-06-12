import Usuario from '../models/Usuario.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const userExists = await Usuario.findOne({ email });
        if (userExists) return res.status(400).json({ msg: "El email ya está registrado" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await Usuario.create({ username, email, password: hashedPassword });
        res.status(201).json({ msg: "Usuario registrado con éxito" });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar el usuario" });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const usuario = await Usuario.findOne({ username });
        if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

        const esCorrecto = await bcrypt.compare(password, usuario.password);
        if (!esCorrecto) return res.status(401).json({ msg: "Credenciales inválidas" });

        const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '8h' });

        res.json({ token, userId: usuario._id, username: usuario.username });
    } catch (error) {
        res.status(500).json({ error: "Error al iniciar sesión" });
    }
};