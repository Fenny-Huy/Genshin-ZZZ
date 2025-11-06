const express = require('express');
const { Pool } = require('pg');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const app = express();
const port = 3000;

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'your_supabase_connection_string_here',
});

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Genshin Artifacts API',
      version: '1.0.0',
      description: 'API for fetching Genshin Artifacts',
    },
  },
  apis: ['./docs/*.js'], // Adjusted to include all files in the docs folder
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const genshinArtifactsRouter = require('./api/genshinartifacts');

// Use the genshinartifacts API router
app.use('/genshinartifacts', genshinArtifactsRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});