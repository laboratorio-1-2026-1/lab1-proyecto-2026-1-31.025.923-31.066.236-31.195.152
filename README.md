# SmartGym API

API REST para la gestión de un gimnasio inteligente con acceso por roles, gestión de membresías, pagos, planes, tickets, gestión deportiva, inventario de productos y reportes de acceso.

## Características principales

- Autenticación con JWT
- Registro y gestión de usuarios por roles
- Gestión de planes de suscripción y membresías de clientes
- Pagos automáticos calculados según el plan asociado
- Gestión de máquinas y categorías de máquinas
- Registro y seguimiento biométrico de evaluaciones de clientes
- Soporte para tickets de mantenimiento y reservas deportivas
- Documentación Swagger disponible en `/api-docs`

## Requisitos

El proyecto se puede ejecutar con Docker o localmente.

Opción Docker (recomendado):
- Docker
- Docker Compose

Opción local:
- Node.js 18+ (o compatible)
- npm
- MySQL

## Instalación

1. Clona el repositorio o descarga el proyecto.

2. Si vas a usar Docker, no necesitas instalar dependencias manualmente en tu máquina.
   Solo ejecuta:

```bash
docker-compose up --build
```

   Docker construirá la imagen y hará `npm install` dentro del contenedor.

3. Si quieres ejecutar el proyecto localmente sin Docker, en la raíz del proyecto ejecuta:

```bash
npm install
```

   Eso instalará todas las dependencias listadas en `package.json`.

4. Crea el archivo de configuración de entorno:

```bash
cp .env.example .env
```

   En Windows, puedes copiar el archivo con el Explorador o usar:

```powershell
copy .env.example .env
```

5. Configura tus datos en `.env`:

- `PORT`: puerto donde correrá el servidor
- `DB_HOST`: host de la base de datos
- `DB_USER`: usuario de la base de datos
- `DB_PASSWORD`: contraseña de la base de datos
- `DB_NAME`: nombre de la base de datos
- `JWT_SECRET`: clave secreta para firmar tokens JWT

> Nota: como el repositorio ya incluye `package.json` y `package-lock.json`, no necesitas ejecutar `npm init -y` ni instalar dependencias una por una. Solo usa `npm install` si trabajas sin Docker.

> Si tienes un error con Docker, puedes detener y limpiar los contenedores y volúmenes con:
>
> ```bash
docker-compose down -v
> ```
>
> Luego corrige el problema y vuelve a ejecutar:
>
> ```bash
docker-compose up --build
```

## Uso

Ejecuta la API en modo desarrollo:

```bash
npm run dev
```

O ejecuta en modo producción:

```bash
npm start
```

La API quedará disponible en `http://localhost:<PORT>`.

## Documentación

La documentación Swagger se sirve en:

```text
http://localhost:<PORT>/api-docs
```

## Estructura principal del proyecto

- `src/app.js`: configuración principal de Express y rutas.
- `src/controllers/`: lógica de negocio por entidad.
- `src/routes/`: definición de rutas API.
- `src/middlewares/authMiddleware.js`: verificación de JWT y permisos.
- `src/config/db.js`: conexión a la base de datos.
- `src/swagger.js`: configuración de Swagger/OpenAPI.

## Variables de entorno

Ejemplo mínimo:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=smartgym
JWT_SECRET=tu_secreto_jwt
```

## Endpoints principales

### Autenticación

- `POST /api/v1/auth/login` — login público
- `POST /api/v1/auth/register` — registrar usuario (solo admin)

### Usuarios y roles

- `POST /api/v1/clientes` — registrar cliente
- `POST /api/v1/entrenadores` — crear entrenador (admin)
- `POST /api/v1/usuarios/staff` — crear staff (admin)
- `GET /api/v1/usuarios` — listar usuarios (admin)
- `GET /api/v1/roles` — listar roles (admin)

### Planes

- `GET /api/v1/planes` — obtener planes
- `POST /api/v1/planes` — registrar plan (admin/finanzas)
- `PATCH /api/v1/planes/:id_plan` — actualizar plan (admin/finanzas)
- `DELETE /api/v1/planes/:id_plan` — eliminar plan (admin/finanzas)

### Membresías

- `GET /api/v1/membresias` — listar membresías (admin/finanzas)
- `GET /api/v1/membresias/cliente/:id` — ver membresía de cliente
- `PATCH /api/v1/membresias/:id/estado` — actualizar estado (admin)
- `POST /api/v1/membresias` — crear membresía (admin)

### Pagos

- `GET /api/v1/pagos` — historial de pagos (admin/finanzas)
- `POST /api/v1/pagos` — registrar pago (admin/finanzas)

> Al registrar un pago, la API calcula el monto según el plan asociado a la membresía. Si se envía `id_plan`, la membresía se actualiza al nuevo plan pagado.

### Seguimiento biométrico

- `GET /api/v1/evaluaciones` — listar evaluaciones biométricas (admin)
- `GET /api/v1/evaluaciones/:id` — ver evaluación por id (admin/entrenadores/clientes)
- `GET /api/v1/clientes/:id/evaluaciones` — historial de evaluaciones del cliente (entrenadores/clientes)
- `POST /api/v1/evaluaciones` — registrar evaluación biométrica (entrenador)
- `PATCH /api/v1/evaluaciones/:id` — actualizar evaluación (entrenador)
- `DELETE /api/v1/evaluaciones/:id` — eliminar evaluación (entrenador/admin)

### Máquinas y categorías

- `GET /api/v1/` (máquinas) — listar máquinas
- `POST /api/v1/` (máquinas) — crear máquina (admin)
- `PATCH /api/v1/:id/estado` — actualizar estado de máquina (admin)
- `GET /api/v1/categorias-maquinas` — listar categorías
- `POST /api/v1/categorias-maquinas` — crear categoría (admin)

### Tickets de mantenimiento

- `POST /api/v1/tickets` — crear ticket (admin)
- `PATCH /api/v1/tickets/:id/resolver` — resolver ticket (admin/finanzas)

### Gestión deportiva

- `GET /api/v1/disciplinas` — listar disciplinas
- `GET /api/v1/sesiones` — listar sesiones
- `POST /api/v1/sesiones` — crear sesión (admin/entrenador)
- `GET /api/v1/reservas` — listar reservas (cliente/admin)
- `POST /api/v1/reservas` — crear reserva (cliente/admin)
- `DELETE /api/v1/reservas/:id` — eliminar reserva (cliente/admin)

### Accesos

- `GET /api/v1/accesos` — historial de accesos (admin)
- `POST /api/v1/accesos/entrada` — registrar entrada (admin)

### Inventario y tienda

- `GET /api/v1/productos` — listar productos
- `POST /api/v1/productos` — crear producto (admin/finanzas)
- `GET /api/v1/productos/:id_producto` — obtener por id
- `DELETE /api/v1/productos/:id_producto` — eliminar producto (admin)
- `PATCH /api/v1/productos/:id_producto` — actualizar producto (admin/finanzas)

### Ventas

- `POST /api/v1/ventas` — registrar venta (admin/finanzas)
- `GET /api/v1/ventas` — listar ventas (admin/finanzas)
- `GET /api/v1/ventas/:id` — obtener venta por id (admin/finanzas)

## Roles y permisos

- `Administrador` — puede gestionar usuarios, planes, membresías, máquinas, categorías y tickets.
- `Finanzas` — puede ver pagos, ventas y gestionar pagos/tickets.
- `Entrenadores` — pueden crear sesiones y evaluaciones.
- `Clientes` — pueden consultar su propia información y reservar sesiones.

## Base de datos

La API usa MySQL con tablas como:

- `usuarios`
- `roles`
- `clientes`
- `entrenadores`
- `membresiascliente`
- `planessuscripcion`
- `pagos`
- `maquinas`
- `categoriasmaquinas`
- `ticketsmantenimiento`
- `disciplinas`
- `sesionesprogramadas`
- `reservas`
- `productostienda`
- `ventas`

Asegúrate de crear la base de datos y ejecutar el script SQL de inicialización si está disponible.

## Notas

- El middleware de autenticación usa header `Authorization: Bearer <token>`.
- La validación de pagos está diseñada para evitar montos distintos al plan.
- Si necesitas cambiar algún permiso o ruta, revisa `src/middlewares/authMiddleware.js`.

## Contribuciones

1. Crea una rama nueva.
2. Haz tus cambios.
3. Abre un pull request.

## Licencia

Proyecto de laboratorio universitario. Ajusta según la licencia requerida.
