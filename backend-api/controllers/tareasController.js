import Tarea from '../models/Tarea.js';

export const getTareas = async (req, res) => {
    try {
        const tareas = await Tarea.find({ idUsuario: req.usuario._id });
        res.json(tareas);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener tareas" });
    }
};

export const crearTarea = async (req, res) => {
    const { nombre, categoria } = req.body;
    try {
        const nuevaTarea = await Tarea.create({ nombre, categoria, idUsuario: req.usuario._id });
        res.status(201).json(nuevaTarea);
    } catch (error) {
        res.status(500).json({ error: "Error al crear la tarea" });
    }
};

export const actualizarTarea = async (req, res) => {
    try {
        const tarea = await Tarea.findById(req.params.id);
        if (!tarea || tarea.idUsuario.toString() !== req.usuario._id.toString()) {
            return res.status(404).json({ msg: "Tarea no encontrada o no autorizada" });
        }
        
        // Actualiza solo los campos que vienen en el body
        Object.assign(tarea, req.body);
        await tarea.save();
        res.json(tarea);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar la tarea" });
    }
};

export const borrarTarea = async (req, res) => {
    try {
        const tarea = await Tarea.findById(req.params.id);
        if (!tarea || tarea.idUsuario.toString() !== req.usuario._id.toString()) {
            return res.status(404).json({ msg: "Tarea no encontrada o no autorizada" });
        }
        await tarea.deleteOne();
        res.json({ msg: "Tarea eliminada" });
    } catch (error) {
        res.status(500).json({ error: "Error al borrar la tarea" });
    }
};