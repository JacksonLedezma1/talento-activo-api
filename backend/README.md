# Talento Activo API 🚀

API robusta construida con **NestJS**, **TypeORM** y **PostgreSQL** para la gestión de vacantes laborales y postulaciones de candidatos.

## 👤 Información del Desarrollador
- **Nombre:** [Tu Nombre / Coder Name]
- **Proyecto:** Talento Activo - Gestión de Candidatos y Vacantes

## 📋 Tabla de Contenidos
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Roles y Permisos](#-roles-y-permisos)
- [Documentación (Swagger)](#-documentación-swagger)
- [Ejemplos de Endpoints](#-ejemplos-de-endpoints)
- [Seguridad](#-seguridad)
- [Pruebas](#-pruebas)

---

## ✨ Características
- 🔐 **Autenticación Simple**: Registro e inicio de sesión con JWT.
- 🛡️ **Seguridad Multinivel**: Guardias por API Key globales y Roles específicos.
- 💼 **Gestión de Vacantes**: Creación, actualización y listado de ofertas laborales.
- 📝 **Postulaciones**: Sistema de aplicaciones con reglas de negocio (máximo 3 postulaciones activas por usuario).
- 🧪 **Calidad de Código**: Pruebas unitarias con Jest con cobertura superior al 60%.

## 🛠️ Tecnologías
- **Framework**: [NestJS](https://nestjs.com/)
- **ORM**: [TypeORM](https://typeorm.io/)
- **Base de Datos**: [PostgreSQL](https://www.postgresql.org/)
- **Validación**: `class-validator` & `class-transformer`
- **Seguridad**: `bcrypt`, `passport-jwt`
- **Documentación**: `Swagger`
- **Testing**: `Jest`

## 🚀 Requisitos Previos
- Node.js (v18.x o superior)
- PostgreSQL
- npm o yarn

## ⚙️ Instalación y Configuración

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd talento-activo-api
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   Crea un archivo `.env` en la raíz del proyecto basándote en el siguiente ejemplo:
   ```env
   # Database
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=postgres
   DATABASE_PASSWORD=tu_password
   DATABASE_NAME=talento_activo

   # Security
   JWT_SECRET=tu_secreto_super_seguro
   API_KEY=tu_api_key_secreta
   ```

4. **Poblar la base de datos (Opcional)**
   Si deseas cargar datos iniciales de prueba (usuarios, vacantes):
   ```bash
   npm run seed
   ```

5. **Iniciar la aplicación**
   ```bash
   # Desarrollo
   npm run start:dev

   # Producción
   npm run build
   npm run start:prod
   ```

## 👥 Roles y Permisos
El sistema utiliza tres roles principales definidos en el enum `Role`:
- `ADMIN`: Acceso total.
- `GESTOR`: Puede crear y gestionar vacantes, ver postulaciones.
- `CODER`: Puede ver vacantes activas y postularse a ellas.

## 📡 Documentación (Swagger)
Una vez iniciada la aplicación, puedes acceder a la documentación interactiva en:
👉 **[http://localhost:3000/docs](http://localhost:3000/docs)**

## 📡 Ejemplos de Endpoints

### 1. Autenticación (Auth)
#### Registro de Usuario
`POST /auth/register`
```json
// Body
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!"
}
```

#### Inicio de Sesión
`POST /auth/login`
```json
// Body
{
  "email": "john@example.com",
  "password": "Password123!"
}

// Response
{
  "accessToken": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "coder"
  }
}
```

### 2. Vacantes (Vacancies)
#### Crear Vacante (Solo GESTOR)
`POST /vacancies`
```json
// Body
{
  "title": "Backend Developer NestJS",
  "description": "Buscamos experto en microservicios...",
  "technologies": "NestJS, TypeScript, PostgreSQL",
  "seniority": "Senior",
  "softSkills": "Comunicación, Trabajo en equipo",
  "location": "Remoto",
  "modality": "remote",
  "maxApplicants": 10
}
```

#### Listar Vacantes
`GET /vacancies`
- Los **CODERS** solo recibirán vacantes activas.
- Los **GESTORES/ADMINS** recibirán todas las vacantes.

### 3. Postulaciones (Applications)
#### Postularse a una Vacante (Solo CODER)
`POST /applications`
```json
// Body
{
  "vacancyId": 1
}
```

## 🔒 Seguridad
1. **X-API-KEY**: Todas las peticiones requieren el header `x-api-key` con el valor definido en el `.env`.
2. **JWT**: Endpoints protegidos requieren el header `Authorization: Bearer <token>`.
3. **Roles**: Uso del decorador `@Roles()` para restringir acceso por tipo de usuario.

## 🧪 Pruebas
Ejecución de todas las pruebas unitarias:
```bash
npm test
```

Reporte de cobertura:
```bash
npm run test:cov
```

---

