const express = require("express");
const {
  getMovies,
  getMovieById,
  createMovie,
  deleteMovie,
  updateMovie,
} = require("../controllers/movie.controller");

const router = express.Router();

router.get("/", getMovies);
router.get("/:id", getMovieById);
router.post("/", createMovie);
router.patch("/:id", updateMovie);
router.delete("/:id", deleteMovie);

module.exports = router;