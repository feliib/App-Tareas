import Tarea from '../models/Tarea.js';

export const getTareas = async (req, res) => {
    try {
        const tareas = await Tarea.find({ idUsuario: req.usuario._id });
        res.json(tareas);
    } catch {
        res.status(500).json({ error: "Error al obtener tareas" });
    }
};

export const crearTarea = async (req, res) => {
    try {
        const tarea = new Tarea({ ...req.body, idUsuario: req.usuario._id });
        await tarea.save();
        res.json(tarea);
    } catch {
        res.status(500).json({ error: "Error al crear tarea" });
    }
};

export const actualizarTarea = async (req, res) => {
    try {
        const tarea = await Tarea.findOneAndUpdate(
            { _id: req.params.id, idUsuario: req.usuario._id },
            req.body,
            { new: true }
        );
        if (!tarea) return res.status(404).json({ msg: "Tarea no encontrada" });
        res.json(tarea);
    } catch {
        res.status(500).json({ error: "Error al actualizar la tarea" });
    }
};

export const borrarTarea = async (req, res) => {
    try {
        const tarea = await Tarea.findOneAndDelete({ _id: req.params.id, idUsuario: req.usuario._id });
        if (!tarea) return res.status(404).json({ msg: "Tarea no encontrada" });
        res.json({ msg: "Tarea eliminada" });
    } catch {
        res.status(500).json({ error: "Error al eliminar la tarea" });
    }
};

export const borrarTodasLasTareas = async (req, res) => {
    try {
        await Tarea.deleteMany({});
        res.json({ msg: "Todas las tareas han sido eliminadas" });
    } catch {
        res.status(500).json({ error: "Error al borrar todas las tareas" });
    }
};