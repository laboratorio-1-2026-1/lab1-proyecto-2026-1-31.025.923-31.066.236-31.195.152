const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato: Bearer TOKEN

    if (!token) {
        return res.status(403).json({ error: 'Acceso denegado, se requiere token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
};

const esAdmin = (req, res, next) => {
    // Según tu DB, el ID 1 suele ser Administración
    if (req.user && req.user.id_rol === 1) {
        next();
    } else {
        res.status(403).json({ error: 'Permisos insuficientes. Solo Administración.' });
    }
};

const esAdminofinanzas = (req, res, next) => {
    // Según tu DB, el ID 1 suele ser Administración
    if (req.user && req.user.id_rol === 1 || req.user && req.user.id_rol === 4) {
        next();
    } else {
        res.status(403).json({ error: 'Permisos insuficientes. Solo Administración.' });
    }
};

module.exports = { verificarToken, esAdmin, esAdminofinanzas };