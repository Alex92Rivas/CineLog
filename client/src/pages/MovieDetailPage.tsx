import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

type Movie = {
  id: string;
  title: string;
  originalTitle?: string;
  overview?: string;
  genres?: string[];
  releaseYear?: number;
  posterUrl?: string;
  backdropUrl?: string;
  tmdbRating?: number;
  runtime?: number;
  status?: "watchlist" | "watched";
  isFavorite?: boolean;
  userRating?: number | null;
};

function getStatusLabel(status?: "watchlist" | "watched") {
  if (status === "watched") return "Vista";
  return "Lista de seguimiento";
}

export default function MovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMovie() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`http://localhost:3000/api/v1/movies/${id}`);

        if (!response.ok) {
          throw new Error("No se pudo cargar la película");
        }

        const data = await response.json();
        setMovie(data);
      } catch (err) {
        setError("Error al cargar el detalle de la película");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          Cargando detalle de la película...
        </div>
      </main>
    );
  }

  if (error || !movie) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl space-y-4">
          <Link
            to="/"
            className="inline-block rounded-xl border border-zinc-700 px-4 py-2 text-sm text-white transition hover:border-red-500 hover:text-red-400"
          >
            ← Volver a la colección
          </Link>

          <div className="rounded-2xl border border-red-900 bg-red-950/40 p-6 text-red-300">
            {error || "Película no encontrada"}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl space-y-6">
        <Link
          to="/"
          className="inline-block rounded-xl border border-zinc-700 px-4 py-2 text-sm text-white transition hover:border-red-500 hover:text-red-400"
        >
          ← Volver a la colección
        </Link>

        <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-xl">
          <div className="grid gap-0 md:grid-cols-[320px_1fr]">
            <div className="bg-zinc-800">
              {movie.posterUrl ? (
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex min-h-[420px] items-center justify-center text-zinc-500">
                  Sin póster
                </div>
              )}
            </div>

            <div className="p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-red-500">
                CineLog
              </p>

              <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold">{movie.title}</h1>

                  {movie.originalTitle &&
                    movie.originalTitle !== movie.title && (
                      <p className="mt-2 text-zinc-400">
                        Título original: {movie.originalTitle}
                      </p>
                    )}
                </div>

                {movie.isFavorite && (
                  <span className="rounded-full border border-red-700 bg-red-950 px-4 py-2 text-sm text-red-300">
                    ★ Favorita
                  </span>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <span className="rounded-full bg-zinc-800 px-4 py-2 text-zinc-300">
                  {getStatusLabel(movie.status)}
                </span>

                {movie.releaseYear && (
                  <span className="rounded-full bg-zinc-800 px-4 py-2 text-zinc-300">
                    Año: {movie.releaseYear}
                  </span>
                )}

                {movie.runtime && (
                  <span className="rounded-full bg-zinc-800 px-4 py-2 text-zinc-300">
                    Duración: {movie.runtime} min
                  </span>
                )}

                {movie.tmdbRating !== undefined && movie.tmdbRating !== null && (
                  <span className="rounded-full bg-zinc-800 px-4 py-2 text-yellow-400">
                    TMDB: {movie.tmdbRating}
                  </span>
                )}

                {movie.userRating !== undefined && movie.userRating !== null && (
                  <span className="rounded-full bg-zinc-800 px-4 py-2 text-zinc-300">
                    Tu nota: {movie.userRating}/5
                  </span>
                )}
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-semibold">Géneros</h2>
                <p className="mt-2 text-zinc-300">
                  {movie.genres && movie.genres.length > 0
                    ? movie.genres.join(" · ")
                    : "Sin género"}
                </p>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-semibold">Sinopsis</h2>
                <p className="mt-2 leading-7 text-zinc-300">
                  {movie.overview || "Sin descripción disponible."}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}