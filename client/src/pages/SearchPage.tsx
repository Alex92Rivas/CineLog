import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMovieContext } from "../context/MovieContext";

function getStatusLabel(status?: "watchlist" | "watched") {
  if (status === "watched") return "Vista";
  return "Lista de seguimiento";
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const { movies, loading, error } = useMovieContext();

  const filteredMovies = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return movies;
    }

    return movies.filter((movie) => {
      const title = movie.title.toLowerCase();
      const originalTitle = movie.originalTitle?.toLowerCase() || "";
      const genres = movie.genres?.join(" ").toLowerCase() || "";

      return (
        title.includes(normalizedQuery) ||
        originalTitle.includes(normalizedQuery) ||
        genres.includes(normalizedQuery)
      );
    });
  }, [movies, query]);

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-red-500">
              CineLog
            </p>
            <h1 className="mt-2 text-4xl font-bold">Buscar películas</h1>
            <p className="mt-2 text-zinc-400">
              Encuentra películas por título, título original o género.
            </p>
          </div>

          <Link
            to="/"
            className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-white transition hover:border-red-500 hover:text-red-400"
          >
            ← Volver a la colección
          </Link>
        </header>

        <section className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <label className="mb-2 block text-sm text-zinc-300">
            Texto de búsqueda
          </label>

          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-500"
            placeholder="Ej: Interstellar, Batman, drama..."
          />

          <p className="mt-3 text-sm text-zinc-400">
            Resultados encontrados:{" "}
            <span className="font-semibold text-white">
              {filteredMovies.length}
            </span>
          </p>
        </section>

        {loading && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            Cargando películas...
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-900 bg-red-950/40 p-6 text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && filteredMovies.length === 0 && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-300">
            No se encontraron películas con esa búsqueda.
          </div>
        )}

        {!loading && !error && filteredMovies.length > 0 && (
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMovies.map((movie) => (
              <Link
                key={movie.id}
                to={`/movie/${movie.id}`}
                className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-lg transition hover:-translate-y-1 hover:border-zinc-700"
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
                  <h2 className="text-xl font-semibold leading-tight">
                    {movie.title}
                  </h2>

                  <p className="mt-2 text-sm text-zinc-400">
                    {movie.genres && movie.genres.length > 0
                      ? movie.genres.slice(0, 2).join(" · ")
                      : "Sin género"}
                    {movie.releaseYear ? ` / ${movie.releaseYear}` : ""}
                  </p>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-300">
                    {movie.overview || "Sin descripción disponible."}
                  </p>

                  <span className="mt-4 inline-block rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
                    {getStatusLabel(movie.status)}
                  </span>
                </div>
              </Link>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}