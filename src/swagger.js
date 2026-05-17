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
                Membresia: {
                    type: 'object',
                    properties: {
                        id_membresias: { type: 'integer', example: 1 },
                        id_cliente: { type: 'integer', example: 2 },
                        id_plan: { type: 'integer', example: 1 },
                        fecha_inicio: { type: 'string', format: 'date', example: '2026-05-10' },
                        estado: { type: 'string', example: 'Activa' }
                    }
                },
                Pago: {
                    type: 'object',
                    properties: {
                        id_pagos: { type: 'integer', example: 1 },
                        id_membresia: { type: 'integer', example: 1 },
                        id_cliente: { type: 'integer', example: 2 },
                        monto: { type: 'number', format: 'float', example: 120.00 },
                        fecha_pago: { type: 'string', format: 'date', example: '2026-05-16' }
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
    
    // MODULO DE IDENTIDAD Y AUTENTICACIÓN!!!!

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
            summary: 'Registrar un usuario (solo admin, ultimo campo especialidad solo necesario para entrenadores)',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                id_rol: { type: 'number', example: 3 },
                                cedula: { type: 'string', example: '12345678' },
                                nombre: { type: 'string', example: 'Juan' },
                                apellido: { type: 'string', example: 'Pérez' },
                                email: { type: 'string', example: 'juan@correo.com' },
                                password: { type: 'string', example: '123456' },
                                telefono: { type: 'string', example: '987654321' },
                                especialidad: { 
                                    type: 'string', 
                                    example: 'Nutrición',
                                    description: 'Solo necesario si id_rol === 3 (Entrenador)' 
                                }
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

    '/maquinas': {
        get: {
            tags: ['Maquinas'],
            summary: 'Obtener inventario físico de máquinas (solo Administración, Entrenadores, Finanzas)',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'estado',
                    in: 'query',
                    required: false,
                    schema: { type: 'string' },
                    description: 'Filtrar por estado de la máquina'
                },
                {
                    name: 'categoria',
                    in: 'query',
                    required: false,
                    schema: { type: 'string' },
                    description: 'Filtrar por categoría de máquina (nombre o id)' 
                }
            ],
            responses: {
                '200': { description: 'Inventario físico de máquinas' },
                '403': { description: 'Permisos insuficientes' },
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
                                estado: { type: 'string', example: 'Activa' }
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
    },
    '/tickets/{id}/resolver': {
        patch: {
            tags: ['Tickets'],
            summary: 'Resolver un ticket de mantenimiento (Administración, Finanzas)',
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
                                fecha_resolucion: { type: 'string', format: 'date', example: '2026-05-13' },
                                costo_reparacion: { type: 'number', example: 150 }
                            },
                            required: ['fecha_resolucion', 'costo_reparacion']
                        }
                    }
                }
            },
            responses: {
                '200': { description: 'Ticket resuelto y máquina actualizada a Activa' },
                '400': { description: 'Datos inválidos o incompletos' },
                '404': { description: 'Ticket o máquina no encontrada' }
            }
        }
    },

    // ==========================================
    // MÓDULO DE GESTIÓN DEPORTIVA Y RESERVAS
    // ==========================================
    '/disciplinas': {
        get: {
            tags: ['Gestión Deportiva'],
            summary: 'Retorna el catálogo de tipos de clases disponibles (Todos)',
            security: [{ bearerAuth: [] }],
            responses: {
                '200': { description: 'Catálogo de disciplinas obtenido con éxito' },
                '403': { description: 'Acceso denegado, token faltante o inválido' }
            }
        }
    },
    '/sesiones': {
        get: {
            tags: ['Gestión Deportiva'],
            summary: 'Lista las sesiones programadas (Todos)',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'fecha',
                    in: 'query',
                    required: false,
                    schema: { type: 'string', format: 'date', example: '2026-06-10' },
                    description: 'Filtrar por fecha específica'
                },
                {
                    name: 'id_disciplina',
                    in: 'query',
                    required: false,
                    schema: { type: 'integer', example: 1 },
                    description: 'Filtrar por disciplina'
                }
            ],
            responses: {
                '200': { description: 'Lista de sesiones obtenida con éxito' }
            }
        },
        post: {
            tags: ['Gestión Deportiva'],
            summary: 'Programa una nueva clase en el calendario (Administración, Entrenadores)',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                id_disciplina: { type: 'integer', example: 1 },
                                id_entrenador: { type: 'integer', example: 1 },
                                fecha: { type: 'string', format: 'date', example: '2026-06-10' },
                                hora_inicio: { type: 'string', format: 'time', example: '14:00:00' },
                                hora_cierre: { type: 'string', format: 'time', example: '15:00:00' },
                                cupos_maximos: { type: 'integer', example: 15 }
                            },
                            required: ['id_disciplina', 'id_entrenador', 'fecha', 'hora_inicio', 'hora_cierre', 'cupos_maximos']
                        }
                    }
                }
            },
            responses: {
                '201': { description: 'Sesión programada con éxito' },
                '400': { description: 'Datos incompletos' },
                '409': { description: 'Conflicto: El entrenador ya tiene una clase que se solapa (ERR_SOLAPAMIENTO_ENTRENADOR)' }
            }
        }
    },
    '/reservas': {
        get: {
            tags: ['Reservas'],
            summary: 'Consulta el registro de inscripciones (Cliente, Administración)',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id_cliente',
                    in: 'query',
                    required: false,
                    schema: { type: 'integer', example: 1 },
                    description: 'Filtrar reservas por cliente (Solo útil para Administración)'
                }
            ],
            responses: {
                '200': { description: 'Historial de reservas obtenido con éxito' }
            }
        },
        post: {
            tags: ['Reservas'],
            summary: 'Crea una inscripción validando solapamientos y capacidad (Cliente, Administración)',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                id_sesion: { type: 'integer', example: 1 }
                            },
                            required: ['id_sesion']
                        }
                    }
                }
            },
            responses: {
                '201': { description: 'Reserva confirmada con éxito' },
                '404': { description: 'La sesión no existe' },
                '409': { description: 'Conflicto: Cupo lleno (ERR_CUPO_LLENO) o Solapamiento de horario del cliente (ERR_SOLAPAMIENTO_CLIENTE)' }
            }
        }
    },
    '/reservas/{id}': {
        delete: {
            tags: ['Reservas'],
            summary: 'Cancela una reservación liberando un cupo (Cliente, Administración)',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'integer', example: 1 },
                    description: 'ID de la reserva a cancelar'
                }
            ],
            responses: {
                '200': { description: 'Reserva cancelada correctamente' },
                '403': { description: 'No tienes permiso para cancelar esta reserva' },
                '404': { description: 'Reserva no encontrada' }
            }
        }
    },

    '/accesos': {
        get: {
            tags: ['Control de Acceso'],
            summary: 'Consulta la bitácora histórica de entradas (Administración)',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'fecha',
                    in: 'query',
                    required: false,
                    schema: { type: 'string', format: 'date', example: '2026-05-13' },
                    description: 'Filtrar bitácora por fecha'
                },
                {
                    name: 'id_cliente',
                    in: 'query',
                    required: false,
                    schema: { type: 'integer', example: 1 },
                    description: 'Filtrar bitácora por cliente específico'
                }
            ],
            responses: {
                '200': { description: 'Bitácora obtenida exitosamente' },
                '403': { description: 'Permisos insuficientes. Solo Administración' }
            }
        }
    },
    '/accesos/entrada': {
        post: {
            tags: ['Control de Acceso'],
            summary: 'Registra el paso por recepción validando la membresía (Administración)',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                cedula: { type: 'string', example: '31066235' }
                            },
                            required: ['cedula']
                        }
                    }
                }
            },
            responses: {
                '201': { description: 'Acceso autorizado. Torniquete abierto' },
                '404': { description: 'Cliente no encontrado (ERR_CLIENTE_NO_ENCONTRADO)' },
                '409': { description: 'Acceso denegado: Membresía inactiva (ERR_MEMBRESIA_INACTIVA)' }
            }
        }
    },

    // ==========================================
    // PLANES DE SUSCRIPCIÓN
    // ==========================================
    '/planes': {
        get: {
            tags: ['Planes de Suscripción'],
            summary: 'Consulta los distintos planes de suscripción ofertados y sus costos (Todos)',
            responses: {
                '200': {
                    description: 'Lista de planes obtenida con éxito',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        id_plan: { type: 'integer', example: 2 },
                                        nombre_plan: { type: 'string', example: 'Plan Premium' },
                                        costo_plan: { type: 'number', example: 40.00 },
                                        descripcion_plan: { type: 'string', example: 'Acceso total al área de máquinas y clases guiadas' },
                                        duracion_plan: { type: 'integer', example: 30 }
                                    }
                                }
                            }
                        }
                    }
                },
                '500': {
                    description: 'Error interno al consultar'
                }
            }
        },
        post: {
            tags: ['Planes de Suscripción'],
            summary: 'Registra un nuevo tipo de plan de suscripción (Administración, Finanzas)',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                nombre: { type: 'string', example: 'Plan Trimestral' },
                                costo: { type: 'number', example: 110.00 },
                                descripcion: { type: 'string', example: 'Acceso ilimitado durante 90 días' },
                                duracion_dias: { type: 'integer', example: 90 }
                            },
                            required: ['nombre', 'costo', 'duracion_dias']
                        }
                    }
                }
            },
            responses: {
                '201': {
                    description: 'Plan registrado con éxito'
                },
                '400': {
                    description: 'Datos incompletos o inválidos',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    error: { type: 'boolean', example: true },
                                    codigoInterno: { type: 'string', example: '400_Datos_Incompletos' },
                                    mensaje: { type: 'string', example: 'El nombre, costo y duración del plan son obligatorios.' },
                                    timestamp: { type: 'string', example: '2026-05-16T23:00:00.000Z' }
                                }
                            }
                        }
                    }
                },
                '500': {
                    description: 'Error interno al registrar'
                }
            }
        }
    },
    '/planes/{id_plan}': {
        patch: {
            tags: ['Planes de Suscripción'],
            summary: 'Actualiza detalles comerciales de un plan existente (Administración, Finanzas)',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id_plan',
                    in: 'path',
                    required: true,
                    schema: { type: 'integer' },
                    description: 'ID numérico del plan a modificar'
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                nombre: { type: 'string', example: 'Plan Premium Plus' },
                                costo: { type: 'number', example: 45.00 },
                                descripcion: { type: 'string', example: 'Acceso a máquinas, clases y casillero VIP' },
                                duracion_dias: { type: 'integer', example: 30 }
                            }
                        }
                    }
                }
            },
            responses: {
                '200': {
                    description: 'Detalles del plan actualizados correctamente'
                },
                '404': {
                    description: 'No se encontró el plan'
                },
                '500': {
                    description: 'Error interno al actualizar'
                }
            }
        },
        
        delete: {
            tags: ['Planes de Suscripción'],
            summary: 'Elimina un plan de suscripción del sistema (Administración, Finanzas)',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id_plan',
                    in: 'path',
                    required: true,
                    schema: { type: 'integer' },
                    description: 'ID numérico del plan a eliminar'
                }
            ],
            responses: {
                '200': { description: 'Plan eliminado con éxito' },
                '403': { description: 'Permisos insuficientes' },
                '500': { description: 'Error interno o plan no encontrado' }
            }
        }
    },
    
    
    '/membresias': {
        get: {
            tags: ['Membresías'],
            summary: 'Lista las membresías globales (Administración, Finanzas)',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'estado',
                    in: 'query',
                    required: false,
                    schema: { type: 'string', example: 'Activa' },
                    description: 'Filtrar membresías por estado'
                }
            ],
            responses: {
                '200': {
                    description: 'Listado de membresías',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: { $ref: '#/components/schemas/Membresia' }
                            }
                        }
                    }
                },
                '403': { description: 'Permisos insuficientes. Solo Administración o Finanzas' },
                '500': { description: 'Error al obtener membresías' }
            }
        },
        post: {
            tags: ['Membresías'],
            summary: 'Registra una nueva membresía (Administración)',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                id_cliente: { type: 'integer', example: 2 },
                                id_plan: { type: 'integer', example: 1 }
                            },
                            required: ['id_cliente', 'id_plan']
                        }
                    }
                }
            },
            responses: {
                '201': {
                    description: 'Membresía registrada',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: { type: 'string' },
                                    id_membresias: { type: 'integer' },
                                    id_cliente: { type: 'integer' },
                                    id_plan: { type: 'integer' }
                                }
                            }
                        }
                    }
                },
                '400': { description: 'Datos incompletos' },
                '403': { description: 'Permisos insuficientes. Solo Administración' },
                '404': { description: 'Cliente o plan no encontrado' },
                '500': { description: 'Error al registrar la membresía' }
            }
        }
    },

    '/membresias/cliente/{id}': {
        get: {
            tags: ['Membresías'],
            summary: 'Consulta el estado actual de la membresía de un cliente específico (Administración, Finanzas, Cliente)',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'integer', example: 1 },
                    description: 'ID del cliente'
                }
            ],
            responses: {
                '200': {
                    description: 'Membresía del cliente encontrada',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Membresia' }
                        }
                    }
                },
                '403': { description: 'Permisos insuficientes. Solo Administración, Finanzas o Cliente' },
                '404': { description: 'Membresía no encontrada para el cliente especificado' },
                '500': { description: 'Error al obtener la membresía del cliente' }
            }
        }
    },
    
    '/membresias/{id}/estado': {
        patch: {
            tags: ['Membresías'],
            summary: 'Revoca o suspende una membresía de forma manual por excepciones (Administración)',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'integer', example: 1 },
                    description: 'ID de la membresía'
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                estado: { type: 'string', example: 'Suspendida' }
                            },
                            required: ['estado']
                        }
                    }
                }
            },
            responses: {
                '200': {
                    description: 'Estado de membresía actualizado con éxito',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: { type: 'string' },
                                    id_membresias: { type: 'integer', example: 1 },
                                    estado: { type: 'string', example: 'Suspendida' }
                                }
                            }
                        }
                    }
                },
                '400': { description: 'Estado faltante o inválido' },
                '403': { description: 'Permisos insuficientes. Solo Administración' },
                '404': { description: 'No se encontró la membresía especificada' },
                '500': { description: 'Error al actualizar el estado de la membresía' }
            }
        }
    },
    '/pagos': {
        get: {
            tags: ['Pagos'],
            summary: 'Retorna el historial de transacciones financieras con filtros por fechas y cliente (Administración, Finanzas)',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'fecha_desde',
                    in: 'query',
                    required: false,
                    schema: { type: 'string', format: 'date', example: '2026-05-01' },
                    description: 'Fecha de inicio para el filtro de pagos (inclusive)'
                },
                {
                    name: 'fecha_hasta',
                    in: 'query',
                    required: false,
                    schema: { type: 'string', format: 'date', example: '2026-05-31' },
                    description: 'Fecha de fin para el filtro de pagos (inclusive)'
                },
                {
                    name: 'id_cliente',
                    in: 'query',
                    required: false,
                    schema: { type: 'integer', example: 2 },
                    description: 'ID del cliente para filtrar pagos asociados a su membresía'
                }
            ],
            responses: {
                '200': {
                    description: 'Historial de pagos filtrado',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: { $ref: '#/components/schemas/Pago' }
                            }
                        }
                    }
                },
                '403': { description: 'Permisos insuficientes. Solo Administración o Finanzas' },
                '500': { description: 'Error al obtener el historial de pagos' }
            }
        },
        post: {
            tags: ['Pagos'],
            summary: 'Registra la adquisición o renovación de un plan y activa la membresía (Administración, Finanzas)',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                id_membresia: { type: 'integer', example: 1 },
                                monto: { type: 'number', format: 'float', example: 120.00 }
                            },
                            required: ['id_membresia', 'monto']
                        }
                    }
                }
            },
            responses: {
                '201': {
                    description: 'Pago registrado y membresía activada',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Pago' }
                        }
                    }
                },
                '400': { description: 'Datos incompletos o inválidos' },
                '403': { description: 'Permisos insuficientes. Solo Administración o Finanzas' },
                '404': { description: 'Membresía no encontrada' },
                '500': { description: 'Error al registrar el pago' }
            }
        }
    },

    
    // SEGUIMIENTO BIOMÉTRICO!!!
    
    '/evaluaciones': {
        get: {
            tags: ['Seguimiento Biométrico'],
            summary: 'Consulta global de evaluaciones (Administración)',
            security: [{ bearerAuth: [] }],
            responses: {
                '200': { description: 'Lista global de evaluaciones' },
                '403': { description: 'Permiso denegado. Solo Administración.' }
            }
        },
        post: {
            tags: ['Seguimiento Biométrico'],
            summary: 'Registra una nueva evaluación física (Entrenador)',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                id_cliente: { type: 'integer', example: 1 },
                                peso: { type: 'number', example: 75.5 },
                                altura: { type: 'number', example: 1.78 },
                                porcentaje_grasa: { type: 'number', example: 15.2 },
                                observaciones: { type: 'string', example: 'Falta resistencia aeróbica' }
                            },
                            required: ['id_cliente', 'peso', 'altura']
                        }
                    }
                }
            },
            responses: { '201': { description: 'Evaluación registrada' } }
        }
    },
    '/evaluaciones/{id}': {
        get: {
            tags: ['Seguimiento Biométrico'],
            summary: 'Retorna el detalle completo de un registro biométrico específico (Administración, Entrenadores, Clientes)',
            security: [{ bearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
            responses: { '200': { description: 'Detalle de la evaluación' } }
        },
        patch: {
            tags: ['Seguimiento Biométrico'],
            summary: 'Actualiza parcialmente una evaluación existente (Entrenadores)',
            security: [{ bearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: { 
                                peso: { type: 'number', example: 74.0 },
                                altura: { type: 'number', example: 1.75 },
                                porcentaje_grasa: { type: 'number', example: 14.5 },
                                observaciones: { type: 'string', example: 'Nueva dieta asignada' }
                            }
                        }
                    }
                }
            },
            responses: { '200': { description: 'Evaluación actualizada' } }
        },
        delete: {
            tags: ['Seguimiento Biométrico'],
            summary: 'Elimina un registro de evaluación erróneo (Entrenadores, Administración)',
            security: [{ bearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
            responses: { '200': { description: 'Evaluación eliminada' } }
        }
    },
    '/clientes/{id}/evaluaciones': {
        get: {
            tags: ['Seguimiento Biométrico'],
            summary: 'Consulta el historial evolutivo de un cliente específico (Entrenadores, Clientes)',
            security: [{ bearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
            responses: { '200': { description: 'Historial obtenido correctamente' } }
        }
    }
    
    
};

module.exports = swaggerSpec;
