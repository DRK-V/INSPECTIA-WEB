# INSPECTIA-WEB

<div align="center">
  <img src="frontend/public/icon/18031899.png" alt="INSPECTIA Logo" width="150" height="150" />
</div>

INSPECTIA-WEB es una aplicación web completa para la gestión, seguimiento y documentación de casos de prueba e inspecciones de software. Diseñada para equipos de QA y gestores de proyectos que necesitan un sistema centralizado para manejar sus procesos de pruebas.

## 🚀 Características

- **Gestión de Proyectos**: Creación y seguimiento de proyectos de pruebas
- **Casos de Prueba**: Generación automática de casos de prueba desde historias de usuario
- **Ejecuciones**: Registro y seguimiento de ejecuciones de casos de prueba
- **Evidencias**: Carga y gestión de evidencias (imágenes, PDFs, documentos)
- **Reportes**: Generación de informes detallados por proyecto
- **Panel de Administración**: Gestión de usuarios y asignación de proyectos
- **Documentación API**: Documentación Swagger integrada

## 📋 Requisitos

- Node.js (versión recomendada: >= 18.x)
- npm o yarn
- Base de datos Supabase (cuenta gratuita o de pago)
- Cuenta SendGrid (para notificaciones por email - opcional)

## 🛠️ Estructura del Proyecto

El proyecto está dividido en dos partes principales:

```
INSPECTIA-WEB/
├── backend/             # Servidor Express.js
│   ├── controllers/     # Controladores de la API
│   ├── db/              # Configuración de la base de datos
│   ├── documents/       # Almacenamiento de archivos subidos
│   ├── middleware/      # Middleware personalizado
│   ├── routes/          # Rutas de la API
│   └── index.js         # Punto de entrada del servidor
│
└── frontend/            # Cliente React (Vite)
    ├── public/          # Archivos estáticos
    └── src/             # Código fuente
        ├── assets/      # Imágenes y recursos
        ├── components/  # Componentes React reutilizables
        └── pages/       # Páginas principales de la aplicación
```

## 🔧 Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/INSPECTIA-WEB.git
   cd INSPECTIA-WEB
   ```

2. Configura el Backend:
   ```bash
   cd backend
   npm install
   
   # Crea un archivo .env con las siguientes variables:
   # SUPABASE_URL=tu_url_de_supabase
   # SUPABASE_KEY=tu_key_de_supabase
   # JWT_SECRET=tu_clave_secreta_jwt
   # SENDGRID_API_KEY=tu_api_key_sendgrid (opcional)
   # BASE_URL=http://localhost:3000
   ```

3. Configura el Frontend:
   ```bash
   cd ../frontend
   npm install
   
   # Opcional: crear un .env con:
   # VITE_API_URL=http://localhost:3000
   ```

## 🚀 Uso

1. Inicia el Backend:
   ```bash
   cd backend
   npm start
   # El servidor estará disponible en http://localhost:3000
   # Documentación API en http://localhost:3000/api-docs
   ```

2. Inicia el Frontend en desarrollo:
   ```bash
   cd frontend
   npm run dev
   # La aplicación estará disponible en http://localhost:5173
   ```

## 🏗️ Despliegue

### Backend

El backend puede desplegarse en cualquier servicio que soporte Node.js:

- **Usando Docker:**
  ```bash
  cd backend
  docker build -t inspectia-backend .
  docker run -p 3000:3000 inspectia-backend
  ```

- **Despliegue manual:**
  En el servidor de destino, clona el repositorio, instala las dependencias y usa PM2 o similar para mantener el servicio activo.

### Frontend

El frontend está configurado para despliegue en Vercel:

```bash
cd frontend
npm run build
# Sigue las instrucciones de despliegue de Vercel
```

## 📝 Scripts Disponibles

### Backend
- `npm start` — Inicia el servidor
- `npm run dev` — Inicia el servidor con nodemon (desarrollo)

### Frontend
- `npm run dev` — Inicia el servidor de desarrollo de Vite
- `npm run build` — Compila la aplicación para producción
- `npm run lint` — Ejecuta ESLint para detectar problemas de código
- `npm run preview` — Vista previa de la build de producción

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request para sugerencias o mejoras.

1. Haz fork del proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Haz push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

[MIT](LICENSE)

## ✨ Tecnologías Utilizadas

### Backend
- Express.js - Framework web
- Supabase - Base de datos y autenticación
- JWT - Autenticación de tokens
- Multer - Manejo de archivos
- PDFKit - Generación de reportes PDF
- Swagger - Documentación API

### Frontend
- React 19 - Biblioteca UI
- React Router - Navegación
- Axios - Cliente HTTP
- TailwindCSS - Framework CSS
- Chart.js - Visualización de datos
- Framer Motion - Animaciones
