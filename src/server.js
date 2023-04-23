const path = require('path');

const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('./swagger.json');

require("express-async-errors");
const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();
const AppError = require("./utils/AppError");
const routes = require("./routes");
const migrationsRun = require("./database/postgresql/migrations");

const app = express();

app.use(express.json());
app.use(routes);

app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message
    });
  }

  console.error(error);

  return response.status(500).json({
    status: "error",
    message: "Internal server error"
  });
});

app.get("/terms", (request, response) => {
  return response.json({
    message: "Termos de Serviço"
  });
});


const PORT = process.env.PORT || 5432;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL
});

async function startServer() {
  await pool.connect();
  console.log("Connected to PostgreSQL database");

  app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
  });
}

migrationsRun()
  .then(() => startServer())
  .catch(error => console.error(error));




app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));