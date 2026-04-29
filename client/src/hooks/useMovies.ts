import { useCallback, useEffect, useState } from "react";
import { deleteMovie, getMovies, updateMovie } from "../api/moviesApi";
import type { Movie } from "../types/movie";

export function useMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMovies();
      setMovies(data);
    } catch (err) {
      setError("Error al cargar las películas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleStatus = useCallback(async (movie: Movie) => {
    const newStatus = movie.status === "watched" ? "watchlist" : "watched";

    const updatedMovie = await updateMovie(movie.id, {
      status: newStatus,
    });

    setMovies((prevMovies) =>
      prevMovies.map((currentMovie) =>
        currentMovie.id === movie.id ? updatedMovie : currentMovie
      )
    );
  }, []);

  const toggleFavorite = useCallback(async (movie: Movie) => {
    const updatedMovie = await updateMovie(movie.id, {
      isFavorite: !movie.isFavorite,
    });

    setMovies((prevMovies) =>
      prevMovies.map((currentMovie) =>
        currentMovie.id === movie.id ? updatedMovie : currentMovie
      )
    );
  }, []);

  const removeMovie = useCallback(async (movieId: string) => {
    await deleteMovie(movieId);

    setMovies((prevMovies) =>
      prevMovies.filter((movie) => movie.id !== movieId)
    );
  }, []);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  return {
    movies,
    setMovies,
    loading,
    error,
    setError,
    loadMovies,
    toggleStatus,
    toggleFavorite,
    removeMovie,
  };
}