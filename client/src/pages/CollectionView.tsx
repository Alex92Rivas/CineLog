import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createMovie } from "../api/moviesApi";
import { useMovieContext } from "../context/MovieContext";
import { useMovieFilters } from "../hooks/useMovieFilters";
import type { Movie } from "../types/movie";

type NewMovieForm = {
  title: string;
  overview: string;
  releaseYear: string;
  genres: string;
  status: "watchlist" | "watched";
};

type TmdbSearchResult = {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  release_date?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  genre_ids?: number[];
};

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

const TMDB_GENRES: Record<number, string> = {
  28: "Acción",
  12: "Aventura",
  16: "Animación",
  35: "Comedia",
  80: "Crimen",
  99: "Documental",
  18: "Drama",
  10751: "Familia",
  14: "Fantasía",
  36: "Historia",
  27: "Terror",
  10402: "Música",
  9648: "Misterio",
  10749: "Romance",
  878: "Ciencia ficción",
  10770: "Película de TV",
  53: "Suspense",
  10752: "Bélica",
  37: "Western",
};

function getStatusLabel(status?: "watchlist" | "watched") {
  if (status === "watched") return "Vista";
  return "Lista de seguimiento";
}

function getGenresFromTmdb(genreIds?: number[]) {
  if (!genreIds || genreIds.length === 0) return [];

  return genreIds.map((genreId) => TMDB_GENRES[genreId]).filter(Boolean);
}

async function searchMovieInTmdb(
  title: string
): Promise<TmdbSearchResult | null> {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  if (!apiKey) {
    console.warn("Falta VITE_TMDB_API_KEY en client/.env");
    return null;
  }

  const cleanTitle = title.trim();

  const searches = [
    `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=es-ES&query=${encodeURIComponent(
      cleanTitle
    )}&include_adult=false`,
    `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${encodeURIComponent(
      cleanTitle
    )}&include_adult=false`,
  ];

  for (const url of searches) {
    const response = await fetch(url);

    if (!response.ok) {
      continue;
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return data.results[0];
    }
  }

  return null;
}

export default function CollectionView() {
  const {
    movies,
    setMovies,
    loading,
    error,
    setError,
    toggleStatus,
    toggleFavorite,
    removeMovie,
  } = useMovieContext();

  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    favoritesOnly,
    setFavoritesOnly,
    filteredMovies,
    resetFilters,
  } = useMovieFilters(movies);

  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<NewMovieForm>({
    title: "",
    overview: "",
    releaseYear: "",
    genres: "",
    status: "watchlist",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const tmdbMovie = await searchMovieInTmdb(formData.title);

      if (!tmdbMovie) {
        setError(
          "No se encontró la película en TMDB. Prueba con el título original."
        );
        return;
      }

      const releaseYearFromTmdb = tmdbMovie.release_date
        ? Number(tmdbMovie.release_date.slice(0, 4))
        : undefined;

      const manualGenres = formData.genres
        .split(",")
        .map((genre) => genre.trim())
        .filter(Boolean);

      const tmdbGenres = getGenresFromTmdb(tmdbMovie.genre_ids);

      const newMovie = {
        title: tmdbMovie.title || formData.title,
        originalTitle: tmdbMovie.original_title || formData.title,
        tmdbId: tmdbMovie.id,
        overview: formData.overview || tmdbMovie.overview || "",
        releaseYear: Number(formData.releaseYear) || releaseYearFromTmdb,
        genres: manualGenres.length > 0 ? manualGenres : tmdbGenres,
        posterUrl: tmdbMovie.poster_path
          ? `${TMDB_IMAGE_BASE}/w500${tmdbMovie.poster_path}`
          : "",
        backdropUrl: tmdbMovie.backdrop_path
          ? `${TMDB_IMAGE_BASE}/original${tmdbMovie.backdrop_path}`
          : "",
        tmdbRating:
          tmdbMovie.vote_average !== undefined
            ? Number(tmdbMovie.vote_average.toFixed(1))
            : undefined,
        runtime: undefined,
        status: formData.status,
        isFavorite: false,
        userRating: null,
      };

      const createdMovie = await createMovie(newMovie);

      setMovies((prevMovies) => [createdMovie, ...prevMovies]);

      setFormData({
        title: "",
        overview: "",
        releaseYear: "",
        genres: "",
        status: "watchlist",
      });
    } catch (err) {
      setError("Error al crear la película");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleStatus(movie: Movie) {
    try {
      setError("");
      await toggleStatus(movie);
    } catch (err) {
      setError("Error al actualizar el estado de la película");
      console.error(err);
    }
  }

  async function handleToggleFavorite(movie: Movie) {
    try {
      setError("");
      await toggleFavorite(movie);
    } catch (err) {
      setError("Error al actualizar favorita");
      console.error(err);
    }
  }

  async function handleDeleteMovie(movieId: string) {
    try {
      setError("");
      await removeMovie(movieId);
    } catch (err) {
      setError("Error al eliminar la película");
      console.error(err);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-red-500">
              CineLog
            </p>
            <h1 className="mt-2 text-4xl font-bold">Mi colección</h1>
            <p className="mt-2 text-zinc-400">
              Aquí se mostrarán las películas guardadas en tu colección.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => navigate("/search")}
              className="rounded-2xl border border-red-800 bg-red-950 px-4 py-3 text-sm font-medium text-red-200 transition hover:bg-red-900 hover:text-white"
            >
              Buscar películas
            </button>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-300">
              Total de películas:{" "}
              <span className="font-semibold text-white">{movies.length}</span>
            </div>
          </div>
        </header>

        <section className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-4 text-xl font-semibold">Añadir película</h2>

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-zinc-300">Título</label>
              <input
                type="text"
                value={formData.title}
                onChange={(event) =>
                  setFormData({ ...formData, title: event.target.value })
                }
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-500"
                placeholder="Ej: Gladiator"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-zinc-300">
                Descripción
              </label>
              <textarea
                value={formData.overview}
                onChange={(event) =>
                  setFormData({ ...formData, overview: event.target.value })
                }
                className="min-h-[120px] w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-500"
                placeholder="Opcional. Si lo dejas vacío se usará la descripción de TMDB."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">Año</label>
              <input
                type="number"
                value={formData.releaseYear}
                onChange={(event) =>
                  setFormData({ ...formData, releaseYear: event.target.value })
                }
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-500"
                placeholder="Opcional. Ej: 2000"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">Estado</label>
              <select
                value={formData.status}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    status: event.target.value as "watchlist" | "watched",
                  })
                }
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-500"
              >
                <option value="watchlist">Lista de seguimiento</option>
                <option value="watched">Vista</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-zinc-300">
                Géneros
              </label>
              <input
                type="text"
                value={formData.genres}
                onChange={(event) =>
                  setFormData({ ...formData, genres: event.target.value })
                }
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-500"
                placeholder="Opcional. Ej: Acción, Drama"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Buscando y guardando..." : "Añadir película"}
              </button>
            </div>
          </form>
        </section>

        {loading && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            Cargando películas...
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-900 bg-red-950/40 p-6 text-red-300">
            {error}
          </div>
        )}

        {!loading && movies.length > 0 && (
          <section className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="grid gap-4 md:grid-cols-[1fr_auto_auto_auto] md:items-center">
              <input
                type="text"
                placeholder="Buscar por título, título original o género..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-500"
              />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as "all" | "watchlist" | "watched"
                  )
                }
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-500"
              >
                <option value="all">Todas</option>
                <option value="watchlist">Pendientes</option>
                <option value="watched">Vistas</option>
              </select>

              <button
                type="button"
                onClick={() => setFavoritesOnly(!favoritesOnly)}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                  favoritesOnly
                    ? "bg-yellow-500 text-black hover:bg-yellow-400"
                    : "border border-yellow-700 bg-zinc-950 text-yellow-300 hover:bg-yellow-950"
                }`}
              >
                {favoritesOnly ? "Mostrando favoritas" : "Solo favoritas"}
              </button>

              <button
                type="button"
                onClick={resetFilters}
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm font-medium text-zinc-300 transition hover:border-red-500 hover:text-white"
              >
                Limpiar filtros
              </button>
            </div>

            <p className="mt-4 text-sm text-zinc-400">
              Mostrando{" "}
              <span className="font-semibold text-white">
                {filteredMovies.length}
              </span>{" "}
              de{" "}
              <span className="font-semibold text-white">{movies.length}</span>{" "}
              películas.
            </p>
          </section>
        )}

        {!loading && !error && movies.length === 0 && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-300">
            No hay películas todavía.
          </div>
        )}

        {!loading && !error && movies.length > 0 && filteredMovies.length === 0 && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-300">
            No hay películas que coincidan con los filtros actuales.
          </div>
        )}

        {!loading && !error && filteredMovies.length > 0 && (
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMovies.map((movie) => (
              <article
                key={movie.id}
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="cursor-pointer overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-lg transition hover:-translate-y-1 hover:border-zinc-700"
              >
                <div className="h-72 bg-zinc-800">
                  {movie.posterUrl ? (
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-zinc-500">
                      Sin póster
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-xl font-semibold leading-tight">
                      {movie.title}
                    </h2>

                    {movie.isFavorite && (
                      <span className="shrink-0 text-sm text-red-400">
                        ★ Favorita
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-zinc-400">
                    {movie.genres && movie.genres.length > 0
                      ? movie.genres.slice(0, 2).join(" · ")
                      : "Sin género"}
                    {movie.releaseYear ? ` / ${movie.releaseYear}` : ""}
                  </p>

                  {movie.tmdbRating !== undefined &&
                    movie.tmdbRating !== null && (
                      <p className="mt-2 text-sm font-medium text-yellow-400">
                        TMDB: {movie.tmdbRating}
                      </p>
                    )}

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-300">
                    {movie.overview || "Sin descripción disponible."}
                  </p>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
                        {getStatusLabel(movie.status)}
                      </span>

                      {movie.userRating !== null &&
                        movie.userRating !== undefined && (
                          <span className="text-sm text-zinc-300">
                            Tu nota: {movie.userRating}/5
                          </span>
                        )}
                    </div>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleToggleStatus(movie);
                      }}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:border-red-500 hover:text-red-400"
                    >
                      {movie.status === "watched"
                        ? "Pasar a lista de seguimiento"
                        : "Marcar como vista"}
                    </button>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleToggleFavorite(movie);
                      }}
                      className="w-full rounded-xl border border-yellow-700 bg-zinc-950 px-4 py-2 text-sm font-medium text-yellow-300 transition hover:bg-yellow-950 hover:text-yellow-200"
                    >
                      {movie.isFavorite
                        ? "Quitar de favoritas"
                        : "Marcar como favorita"}
                    </button>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDeleteMovie(movie.id);
                      }}
                      className="w-full rounded-xl border border-red-800 bg-red-950 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-900 hover:text-white"
                    >
                      Eliminar película
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}