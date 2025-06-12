import express from 'express';
import { getTareas, crearTarea, actualizarTarea, borrarTarea } from '../controllers/tareasController.js';
import checkAuth from '../middleware/authMiddleware.js';
const router = express.Router();

router.use(checkAuth); // Protege todas las rutas de este archivo
router.route('/').get(getTareas).post(crearTarea);
router.route('/:id').put(actualizarTarea).delete(borrarTarea);
export default router;