import Usuario from '../models/Usuario.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    const { username, email, password, rol } = req.body;
    try {
        const userExists = await Usuario.findOne({ email });
        if (userExists) return res.status(400).json({ msg: "El email ya está registrado" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await Usuario.create({ username, email, password: hashedPassword, rol });
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
        res.json({ token, userId: usuario._id, rol: usuario.rol });
    } catch (error) {
        res.status(500).json({ error: "Error al iniciar sesión" });
    }
};

export const getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find({}, '-password');
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los usuarios" });
    }
};

export const updateUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { rol } = req.body;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            id,
            { rol },
            { new: true }
        );
        if (!usuarioActualizado) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }
        res.json(usuarioActualizado);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el usuario" });
    }
};