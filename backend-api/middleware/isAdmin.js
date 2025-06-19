export default function isAdmin(req, res, next) {
    if (req.usuario && req.usuario.rol === 'admin') {
        return next();
    }
    return res.status(403).json({ msg: 'Acceso solo para administradores' });
}