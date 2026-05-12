const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'SmartGym API',
            version: '1.0.0',
            description: 'Documentación de la API SmartGym',
        },
        servers: [
            {
                url: 'http://localhost:3000/api/v1',
                description: 'Servidor local'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                LoginRequest: {
                    type: 'object',
                    properties: {
                        email: { type: 'string', example: 'usuario@correo.com' },
                        password: { type: 'string', example: 'tuPassword' }
                    },
                    required: ['email', 'password']
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        token: { type: 'string' },
                        user: {
                            type: 'object',
                            properties: {
                                nombre: { type: 'string' },
                                rol: { type: 'number' }
                            }
                        }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' }
                    }
                }
            }
        }
    },
    apis: []
};

const swaggerSpec = swaggerJsdoc(options);

swaggerSpec.paths = {
    '/auth/login': {
        post: {
            tags: ['Auth'],
            summary: 'Iniciar sesión',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/LoginRequest' }
                    }
                }
            },
            responses: {
                '200': {
                    description: 'Login exitoso',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/AuthResponse' }
                        }
                    }
                },
                '401': {
                    description: 'Contraseña incorrecta',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                }
            }
        }
    },
    '/auth/register': {
        post: {
            tags: ['Auth'],
            summary: 'Registrar un usuario (solo admin)',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                id_rol: { type: 'number', example: 2 },
                                cedula: { type: 'string', example: '12345678' },
                                nombre: { type: 'string', example: 'Juan' },
                                apellido: { type: 'string', example: 'Pérez' },
                                email: { type: 'string', example: 'juan@correo.com' },
                                password: { type: 'string', example: '123456' },
                                telefono: { type: 'string', example: '987654321' }
                            },
                            required: ['id_rol', 'cedula', 'nombre', 'apellido', 'email', 'password', 'telefono']
                        }
                    }
                }
            },
            responses: {
                '201': { description: 'Usuario registrado' },
                '500': { description: 'Error en el servidor' }
            }
        }
    },
    '/maquinas': {
        get: {
            tags: ['Maquinas'],
            summary: 'Obtener todas las máquinas',
            responses: {
                '200': { description: 'Lista de máquinas' },
                '500': { description: 'Error al obtener máquinas' }
            }
        },
        post: {
            tags: ['Maquinas'],
            summary: 'Crear una máquina (solo admin)',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                id_categoria: { type: 'number', example: 1 },
                                nombre_maquina: { type: 'string', example: 'Cinta de correr' },
                                descripcion_tecnica: { type: 'string', example: 'Motor 2 HP, velocidad ajustable' },
                                estado: { type: 'string', example: 'Operativa' }
                            },
                            required: ['id_categoria', 'nombre_maquina', 'descripcion_tecnica', 'estado']
                        }
                    }
                }
            },
            responses: {
                '201': { description: 'Máquina registrada con éxito' },
                '500': { description: 'Error al registrar máquina' }
            }
        }
    },
    '/maquinas/{id}/estado': {
        patch: {
            tags: ['Maquinas'],
            summary: 'Actualizar estado de una máquina (solo admin)',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'integer' }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                estado: { type: 'string', example: 'En mantenimiento' }
                            },
                            required: ['estado']
                        }
                    }
                }
            },
            responses: {
                '200': { description: 'Estado actualizado con éxito' },
                '404': { description: 'Máquina no encontrada' }
            }
        }
    },
    '/clientes': {
        post: {
            tags: ['Usuarios'],
            summary: 'Registrar un cliente',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                cedula: { type: 'string', example: '12345678' },
                                nombre: { type: 'string', example: 'Ana' },
                                apellido: { type: 'string', example: 'Gómez' },
                                email: { type: 'string', example: 'ana@correo.com' },
                                password: { type: 'string', example: '123456' },
                                telefono: { type: 'string', example: '987654321' }
                            },
                            required: ['cedula', 'nombre', 'apellido', 'email', 'password', 'telefono']
                        }
                    }
                }
            },
            responses: {
                '201': { description: 'Cliente registrado con éxito' },
                '500': { description: 'Error al registrar cliente' }
            }
        }
    },
    '/entrenadores': {
        post: {
            tags: ['Usuarios'],
            summary: 'Crear un entrenador (solo admin)',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                cedula: { type: 'string', example: '12345678' },
                                nombre: { type: 'string', example: 'Pedro' },
                                apellido: { type: 'string', example: 'López' },
                                email: { type: 'string', example: 'pedro@correo.com' },
                                password: { type: 'string', example: '123456' },
                                telefono: { type: 'string', example: '987654321' },
                                especialidad: { type: 'string', example: 'Crossfit' }
                            },
                            required: ['cedula', 'nombre', 'apellido', 'email', 'password', 'telefono', 'especialidad']
                        }
                    }
                }
            },
            responses: {
                '201': { description: 'Entrenador creado con éxito' }
            }
        }
    },
    '/usuarios/staff': {
        post: {
            tags: ['Usuarios'],
            summary: 'Crear un staff (solo admin)',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                id_rol: { type: 'number', example: 2 },
                                cedula: { type: 'string', example: '12345678' },
                                nombre: { type: 'string', example: 'Laura' },
                                apellido: { type: 'string', example: 'Díaz' },
                                email: { type: 'string', example: 'laura@correo.com' },
                                password: { type: 'string', example: '123456' },
                                telefono: { type: 'string', example: '987654321' }
                            },
                            required: ['id_rol', 'cedula', 'nombre', 'apellido', 'email', 'password', 'telefono']
                        }
                    }
                }
            },
            responses: {
                '201': { description: 'Staff creado con éxito' }
            }
        }
    },
    '/usuarios': {
        get: {
            tags: ['Usuarios'],
            summary: 'Listar usuarios (solo admin)',
            security: [{ bearerAuth: [] }],
            responses: {
                '200': { description: 'Lista de usuarios' },
                '403': { description: 'Permisos insuficientes' }
            }
        }
    },
    '/roles': {
        get: {
            tags: ['Usuarios'],
            summary: 'Listar roles (solo admin)',
            security: [{ bearerAuth: [] }],
            responses: {
                '200': { description: 'Lista de roles' }
            }
        }
    },
    '/categorias-maquinas': {
        get: {
            tags: ['Categorias'],
            summary: 'Obtener categorías de máquinas',
            responses: {
                '200': { description: 'Catálogo de categorías de máquinas' }
            }
        }
    },
    '/tickets': {
        post: {
            tags: ['Tickets'],
            summary: 'Crear ticket de mantenimiento (solo admin)',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                id_maquina: { type: 'number', example: 1 },
                                id_usuario: { type: 'number', example: 1 },
                                fecha_falla: { type: 'string', format: 'date', example: '2026-05-12' },
                                descripcion_falla: { type: 'string', example: 'Motor no arranca' },
                                fecha_resolucion: { type: 'string', format: 'date', example: '2026-05-13' },
                                costo_reparacion: { type: 'number', example: 50 },
                                estado: { type: 'string', example: 'En mantenimiento' }
                            },
                            required: ['id_maquina', 'id_usuario', 'descripcion_falla']
                        }
                    }
                }
            },
            responses: {
                '201': { description: 'Ticket creado' },
                '404': { description: 'Máquina no encontrada' }
            }
        }
    }
};

module.exports = swaggerSpec;
