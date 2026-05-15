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

const esAdminOFinanzas = (req, res, next) => {
    // Administración o Finanzas pueden resolver tickets
    if (req.user && [1, 2].includes(req.user.id_rol)) {
        next();
    } else {
        res.status(403).json({ error: 'Permisos insuficientes. Solo Administración o Finanzas.' });
    }
};

const esAdminEntrenadorFinanzas = (req, res, next) => {
    // Administración, Entrenadores, Finanzas
    if (req.user && [1, 3, 2].includes(req.user.id_rol)) {
        next();
    } else {
        res.status(403).json({ error: 'Permisos insuficientes. Solo Administración, Entrenadores o Finanzas.' });
    }
};

// Middleware adicional para verificar roles específicos AGREGADO POR CALO CALITO CALO
const esEntrenadorOAdmin = (req, res, next) => {
    // Roles: 1=Administrador, 3=Entrenador
    if (req.user && (req.user.id_rol === 1 || req.user.id_rol === 3)) {
        next();
    } else {
        res.status(403).json({ error: 'Permisos insuficientes. Requiere rol de Entrenador o Administración.' });
    }
};
// Middleware adicional para verificar roles específicos AGREGADO POR CALO CALITO CALO
const esClienteOAdmin = (req, res, next) => {
    // Roles: 1=Administrador, 4=Cliente
    if (req.user && (req.user.id_rol === 1 || req.user.id_rol === 4)) {
        next();
    } else {
        res.status(403).json({ error: 'Permisos insuficientes. Requiere rol de Cliente o Administración.' });
    }
};

module.exports = { verificarToken, esAdmin, esAdminOFinanzas, esAdminEntrenadorFinanzas, esEntrenadorOAdmin, esClienteOAdmin };
