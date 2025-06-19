import express from 'express';
import { getTareas, crearTarea, actualizarTarea, borrarTarea, borrarTodasLasTareas } from '../controllers/tareasController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import isAdmin from '../middleware/isAdmin.js';

const router = express.Router();

router.route('/').get(authMiddleware, getTareas).post(authMiddleware, crearTarea);
router.delete('/all', authMiddleware, isAdmin, borrarTodasLasTareas);
router.route('/:id').put(authMiddleware, actualizarTarea).delete(authMiddleware, borrarTarea);

export default router;