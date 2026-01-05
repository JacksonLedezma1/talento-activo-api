# Talento Activo Frontend

Aplicación web moderna construida con **React + TypeScript + Vite** para consumir la API de Talento Activo y gestionar el proceso de postulaciones a vacantes laborales.

## Características

- **Interfaz moderna** con Tailwind CSS y animaciones Framer Motion
- **Autenticación completa** con JWT y manejo de tokens
- **Gestión de roles** (CODER, GESTOR, ADMIN) con UI adaptativa
- **Gestión de vacantes** y postulaciones en tiempo real
- **Dashboard interactivo** con estados y conteos
- **Responsive design** para todos los dispositivos
- **Rendimiento optimizado** con Vite y React 19

## Tecnologías

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vite.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **TypeScript**: [TypeScript](https://www.typescriptlang.org/)

## Requisitos Previos

- Node.js 18+ 
- npm o yarn

## Instalación y Configuración

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd talento-activo-api/frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   Crea un archivo `.env` basado en `.env.example`:
   ```env
   VITE_API_BASE_URL=http://localhost:4000
   VITE_API_KEY=empleabilidad_api_key_123
   ```

## Ejecución

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

La aplicación estará disponible en **http://localhost:5173**

## Estructura del Proyecto

```
src/
├── api/
│   └── axios.ts          # Configuración de Axios con interceptores
├── components/
│   ├── Input.tsx         # Componente de input reutilizable
│   ├── Modal.tsx         # Componente de modal
│   └── Navbar.tsx        # Barra de navegación principal
├── context/
│   └── AuthContext.tsx   # Contexto de autenticación global
├── pages/
│   ├── LoginPage.tsx           # Página de login
│   ├── RegisterPage.tsx        # Página de registro
│   ├── VacanciesPage.tsx       # Listado de vacantes
│   ├── CreateVacancyPage.tsx   # Crear vacante (Gestor)
│   ├── ManageVacancyPage.tsx   # Gestionar vacante (Gestor)
│   └── MyApplicationsPage.tsx   # Mis postulaciones (Coder)
├── types.ts              # Definiciones de tipos TypeScript
└── main.tsx              # Punto de entrada de la aplicación
```

## Autenticación

### Flujo de Autenticación
1. **Registro**: Los usuarios se registran con rol CODER por defecto
2. **Login**: Se obtiene token JWT que se guarda en localStorage
3. **Persistencia**: El token se mantiene entre sesiones
4. **Headers**: Axios agrega automáticamente `x-api-key` y `Authorization`

### Contexto de Autenticación
```typescript
const { user, token, login, logout, isAuthenticated, isGestor } = useAuth();
```

## Roles y Permisos

### CODER
- Ver vacantes activas
- Postularse a vacantes
- Ver sus postulaciones
- Límite de 3 postulaciones activas

### GESTOR / ADMIN
- Todas las funciones de CODER
- Crear y editar vacantes
- Ver postulaciones a sus vacantes
- Cambiar estados de postulaciones

## Páginas Principales

### `/` - Vacantes
- Listado de vacantes con filtros
- Indicadores visuales de cupos disponibles
- Botones de postulación según rol
- Vista detallada de cada vacante

### `/login` - Inicio de Sesión
- Formulario de login con validación
- Manejo de errores
- Redirección según rol

### `/register` - Registro
- Formulario de registro
- Validación de email y contraseña
- Asignación automática de rol CODER

### `/my-applications` - Mis Postulaciones
- Dashboard con postulaciones del usuario
- Estados actualizados en tiempo real
- Contador de postulaciones activas
- Detalles de cada postulación

### `/create-vacancy` - Crear Vacante (Gestor)
- Formulario completo de creación
- Validaciones en tiempo real
- Preview de la vacante

### `/manage-vacancy/:id` - Gestionar Vacante (Gestor)
- Lista de postulantes
- Cambio de estados
- Estadísticas de la vacante

## UI/UX Features

### Diseño Visual
- **Tema oscuro** elegante con gradientes
- **Animaciones suaves** con Framer Motion
- **Indicadores visuales** de estados y progreso
- **Cards glassmorphism** para contenido

### Interacciones
- **Hover states** en todos los elementos interactivos
- **Loading states** durante operaciones asíncronas
- **Toast notifications** para feedback al usuario
- **Modal dialogs** para detalles y confirmaciones

### Responsive Design
- **Mobile-first** approach
- **Adaptive layouts** para tablets y desktop
- **Touch-friendly** interfaces móviles

## Configuración de API

### Cliente Axios
```typescript
// Configuración automática de headers
axios.defaults.headers.common['x-api-key'] = import.meta.env.VITE_API_KEY;
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

### Endpoints Utilizados
- `POST /auth/register` - Registro
- `POST /auth/login` - Login
- `GET /vacancies` - Listar vacantes
- `POST /applications` - Postularse
- `GET /applications` - Mis postulaciones
- `PATCH /applications/:id/status` - Cambiar estado

## Testing

El frontend está preparado para testing con:

```bash
# Ejecutar tests (cuando se implementen)
npm run test

# Ejecutar linting
npm run lint
```

## Variables de Entorno

### Opciones Disponibles
```env
# URL de la API backend
VITE_API_BASE_URL=http://localhost:4000

# API Key para autenticación
VITE_API_KEY=empleabilidad_api_key_123
```

## Despliegue

### Build de Producción
```bash
npm run build
```

El build se genera en la carpeta `dist/` y es estático, listo para desplegar en cualquier hosting.

### Hosting Recomendado
- **Vercel** - Ideal para React apps
- **Netlify** - Alternativa popular
- **GitHub Pages** - Para proyectos open source
- **AWS S3 + CloudFront** - Para alta disponibilidad

## Desarrollo

### Scripts Disponibles
```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "lint": "eslint ."
}
```

### Configuración de Vite
- **Hot Module Replacement** para desarrollo rápido
- **Optimización de build** para producción
- **Path aliases** para imports limpios
- **Soporte para TypeScript** estricto

## Estado de la Aplicación

### Implementado
- Autenticación completa con JWT
- Gestión de roles y permisos
- CRUD de vacantes y postulaciones
- Dashboard interactivo
- Diseño responsive
- Animaciones y micro-interacciones

### Mejoras Futuras
- Testing unitario y E2E
- PWA capabilities
- Notificaciones push
- Chat integrado
- Video conferencing para entrevistas

## Contribución

1. Fork del proyecto
2. Crear feature branch (`git checkout -b feature/amazing-feature`)
3. Commit de cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abrir Pull Request

## Licencia

Este proyecto está bajo licencia MIT. Ver el archivo LICENSE para más detalles.

---

**Desarrollado con ❤️ para la comunidad de Talento Activo**
