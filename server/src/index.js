const express = require("express");
const cors = require("cors");
const { port } = require("./config/env");
const movieRoutes = require("./routes/movie.routes");

const app = express();

const loggerAcademico = (req, res, next) => {
  const inicio = Date.now();

  res.on("finish", () => {
    const duracion = Date.now() - inicio;

    console.log(
      `[${req.method}] ${req.originalUrl} - Estado: ${res.statusCode} (${duracion}ms)`
    );
  });

  next();
};

// CORS MANUAL PARA VERCEL
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");

  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// CORS EXPRESS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
    ],
  })
);

app.use(express.json());
app.use(loggerAcademico);

app.get("/", (req, res) => {
  res.json({
    message: "Servidor CineLog funcionando correctamente",
  });
});

app.use("/api/v1/movies", movieRoutes);

app.use((err, req, res, next) => {
  if (err.message === "NOT_FOUND") {
    return res.status(404).json({
      error: "Película no encontrada.",
    });
  }

  console.error("ERROR GLOBAL:", err);

  return res.status(500).json({
    error: "Error interno del servidor.",
  });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });
}

module.exports = app;