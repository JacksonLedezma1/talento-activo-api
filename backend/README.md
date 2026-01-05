# Talento Activo API

API construida con **NestJS**, **TypeORM** y **PostgreSQL** para gestionar:

- Vacantes
- Postulaciones
- Autenticación (JWT)
- Autorización (roles)
- Protección global por API Key

## Requisitos

- Node.js 18+
- PostgreSQL 13+

## Configuración

1) Instala dependencias

```bash
npm install
```

2) Crea un archivo `.env`

Puedes basarte en `backend/.env.example`.

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=empleabilidad_db

JWT_SECRET=super_secret_jwt_key
JWT_EXPIRES_IN=1d

API_KEY=empleabilidad_api_key_123

# Por defecto el backend usa PORT=4000 en el entorno local del proyecto.
# Si lo cambias aquí, ajusta el frontend (VITE_API_BASE_URL).
PORT=4000
```

## Ejecutar

```bash
# desarrollo
npm run start:dev

# build
npm run build

# producción
npm run start:prod
```

Por defecto queda en:

- API: `http://localhost:4000`
- Swagger: `http://localhost:4000/docs`

## Seed

El seeder crea/asegura 2 usuarios:

- Admin: `admin@talento.com` / `Admin123!`
- Gestor: `gestor@talento.com` / `Gestor123!`

Variables opcionales para personalizar:

```env
SEED_ADMIN_EMAIL=admin@talento.com
SEED_ADMIN_PASSWORD=Admin123!
SEED_GESTOR_EMAIL=gestor@talento.com
SEED_GESTOR_PASSWORD=Gestor123!
```

Ejecutar:

```bash
npm run seed
```

## Seguridad (headers)

Todas las requests (excepto rutas marcadas como públicas) requieren:

- `x-api-key: <API_KEY>`
- `Authorization: Bearer <JWT>`

## Roles

- `ADMIN`: acceso total
- `GESTOR`: gestionar vacantes y postulaciones
- `CODER`: ver vacantes activas y postularse

## Respuesta estándar

El backend envuelve respuestas exitosas con:

```json
{
  "success": true,
  "data": {},
  "message": "Operación exitosa"
}
```

## Endpoints principales

Auth (públicos):

- `POST /auth/register`
- `POST /auth/login`

Vacantes:

- `GET /vacancies` (CODER: solo activas; GESTOR/ADMIN: todas)
- `POST /vacancies` (GESTOR)
- `PATCH /vacancies/:id` (GESTOR)

Postulaciones:

- `POST /applications` (CODER)
- `GET /applications` (CODER: propias; GESTOR: propias o por `?vacancyId=`)
- `PATCH /applications/:id/status` (GESTOR)
- `DELETE /applications/:id` (GESTOR, solo si estado es `Activa`)

## Tests

```bash
npm test
```

