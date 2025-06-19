import express from 'express';
import { register, login, getUsuarios, updateUsuario } from '../controllers/authController.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/usuarios', getUsuarios);
router.put('/usuarios/:id', updateUsuario);

export default router;