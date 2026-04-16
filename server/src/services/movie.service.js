let movies = [
  {
    id: 1,
    tmdbId: 155,
    title: "The Dark Knight",
    originalTitle: "The Dark Knight",
    overview:
      "Batman se enfrenta al Joker, un criminal caótico que siembra el terror en Gotham.",
    genres: ["Acción", "Crimen", "Drama"],
    releaseYear: "2008",
    posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
    tmdbRating: 8.5,
    runtime: 152,
    status: "watched",
    isFavorite: true,
    userRating: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    tmdbId: 157336,
    title: "Interstellar",
    originalTitle: "Interstellar",
    overview:
      "Un grupo de exploradores utiliza un agujero de gusano para intentar salvar a la humanidad.",
    genres: ["Aventura", "Drama", "Ciencia ficción"],
    releaseYear: "2014",
    posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    tmdbRating: 8.4,
    runtime: 169,
    status: "watchlist",
    isFavorite: false,
    userRating: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let currentId = 3;

const getAllMovies = () => {
  return [...movies];
};

const getMovieById = (id) => {
  return movies.find((movie) => movie.id === id);
};

const createMovie = ({
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
}) => {
  const newMovie = {
    id: currentId++,
    tmdbId,
    title: title.trim(),
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  movies.push(newMovie);
  return newMovie;
};

const deleteMovie = (id) => {
  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (movieIndex === -1) {
    throw new Error("NOT_FOUND");
  }

  movies.splice(movieIndex, 1);
};

const updateMovie = (id, data) => {
  const movie = movies.find((movie) => movie.id === id);

  if (!movie) {
    throw new Error("NOT_FOUND");
  }

  if (data.status !== undefined) movie.status = data.status;
  if (data.isFavorite !== undefined) movie.isFavorite = data.isFavorite;
  if (data.userRating !== undefined) movie.userRating = data.userRating;

  movie.updatedAt = new Date().toISOString();

  return movie;
};

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  deleteMovie,
  updateMovie,
};