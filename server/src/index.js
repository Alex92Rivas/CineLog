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

app.use(cors());
app.use(express.json());
app.use(loggerAcademico);

app.get("/", (req, res) => {
  res.json({ message: "Servidor Cinelog funcionando correctamente" });
});

app.use("/api/v1/movies", movieRoutes);

app.use((err, req, res, next) => {
  if (err.message === "NOT_FOUND") {
    return res.status(404).json({ error: "Película no encontrada." });
  }

  console.error("ERROR GLOBAL:", err);
  return res.status(500).json({ error: "Error interno del servidor." });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});