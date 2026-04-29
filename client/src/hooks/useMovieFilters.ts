import { useMemo, useState } from "react";
import type { Movie, MovieStatus } from "../types/movie";

export function useMovieFilters(movies: Movie[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | MovieStatus>("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchesSearch =
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.originalTitle?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || movie.status === statusFilter;

      const matchesFavorite = !favoritesOnly || movie.isFavorite;

      return matchesSearch && matchesStatus && matchesFavorite;
    });
  }, [movies, searchTerm, statusFilter, favoritesOnly]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    favoritesOnly,
    setFavoritesOnly,
    filteredMovies,
  };
}