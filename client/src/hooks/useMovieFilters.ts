import { useMemo, useState } from "react";
import type { Movie, MovieStatus } from "../types/movie";

export function useMovieFilters(movies: Movie[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | MovieStatus>("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const filteredMovies = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return movies.filter((movie) => {
      const title = movie.title.toLowerCase();
      const originalTitle = movie.originalTitle?.toLowerCase() ?? "";
      const genres = movie.genres?.join(" ").toLowerCase() ?? "";

      const matchesSearch =
        normalizedSearch === "" ||
        title.includes(normalizedSearch) ||
        originalTitle.includes(normalizedSearch) ||
        genres.includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" || movie.status === statusFilter;

      const matchesFavorite = !favoritesOnly || movie.isFavorite;

      return matchesSearch && matchesStatus && matchesFavorite;
    });
  }, [movies, searchTerm, statusFilter, favoritesOnly]);

  function resetFilters() {
    setSearchTerm("");
    setStatusFilter("all");
    setFavoritesOnly(false);
  }

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    favoritesOnly,
    setFavoritesOnly,
    filteredMovies,
    resetFilters,
  };
}