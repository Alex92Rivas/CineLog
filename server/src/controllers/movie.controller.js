const movieService = require("../services/movie.service");

const validStatuses = ["watchlist", "watched"];

const getMovies = (req, res) => {
  const movies = movieService.getAllMovies();
  res.status(200).json(movies);
};

const getMovieById = (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        error: "El id debe ser un número válido.",
      });
    }

    const movie = movieService.getMovieById(id);

    if (!movie) {
      throw new Error("NOT_FOUND");
    }

    res.status(200).json(movie);
  } catch (error) {
    next(error);
  }
};

const createMovie = (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      error: "Debes enviar un body en formato JSON.",
    });
  }

  const {
    tmdbId,
    title,
    originalTitle = "",
    overview = "",
    genres = [],
    releaseYear = "",
    posterUrl = "",
    backdropUrl = "",
    tmdbRating = null,
    runtime = null,
    status = "watchlist",
    isFavorite = false,
    userRating = null,
  } = req.body;

  if (typeof tmdbId !== "number" || Number.isNaN(tmdbId)) {
    return res.status(400).json({
      error: "tmdbId es obligatorio y debe ser numérico.",
    });
  }

  if (!title || typeof title !== "string" || title.trim().length < 2) {
    return res.status(400).json({
      error: "El título es obligatorio y debe tener al menos 2 caracteres.",
    });
  }

  if (!Array.isArray(genres)) {
    return res.status(400).json({
      error: "genres debe ser un array.",
    });
  }

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: "status debe ser watchlist o watched.",
    });
  }

  if (typeof isFavorite !== "boolean") {
    return res.status(400).json({
      error: "isFavorite debe ser booleano.",
    });
  }

  if (
    userRating !== null &&
    (typeof userRating !== "number" || userRating < 1 || userRating > 5)
  ) {
    return res.status(400).json({
      error: "userRating debe ser un número entre 1 y 5 o null.",
    });
  }

  const newMovie = movieService.createMovie({
    tmdbId,
    title,
    originalTitle,
    overview,
    genres,
    releaseYear,
    posterUrl,
    backdropUrl,
    tmdbRating,
    runtime,
    status,
    isFavorite,
    userRating,
  });

  res.status(201).json(newMovie);
};

const updateMovie = (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        error: "El id debe ser un número válido.",
      });
    }

    if (!req.body) {
      return res.status(400).json({
        error: "Debes enviar un body en formato JSON.",
      });
    }

    const { status, isFavorite, userRating } = req.body;

    if (status !== undefined && !validStatuses.includes(status)) {
      return res.status(400).json({
        error: "Si envías status, debe ser watchlist o watched.",
      });
    }

    if (isFavorite !== undefined && typeof isFavorite !== "boolean") {
      return res.status(400).json({
        error: "Si envías isFavorite, debe ser booleano.",
      });
    }

    if (
      userRating !== undefined &&
      userRating !== null &&
      (typeof userRating !== "number" || userRating < 1 || userRating > 5)
    ) {
      return res.status(400).json({
        error: "Si envías userRating, debe ser un número entre 1 y 5 o null.",
      });
    }

    const updatedMovie = movieService.updateMovie(id, {
      status,
      isFavorite,
      userRating,
    });

    res.status(200).json(updatedMovie);
  } catch (error) {
    next(error);
  }
};

const deleteMovie = (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        error: "El id debe ser un número válido.",
      });
    }

    movieService.deleteMovie(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
};