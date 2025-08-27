const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/dataroutes');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Usuarios',
            version: '1.0.0',
            description: 'Documentación de la API de Usuarios',
        },
        servers: [
            { url: `http://localhost:${PORT}` }
        ],
    },
    apis: ['./routes/*.js', './models/*.js'], // Rutas y modelos
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(cors({ 
    origin: ['https://front-clima-latest.onrender.com', 'http://localhost:5173'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use('/api/users', userRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
