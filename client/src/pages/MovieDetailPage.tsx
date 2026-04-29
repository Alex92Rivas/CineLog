import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMovieById, type Movie } from "../api/moviesApi";

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
      if (!id) {
        setError("No se encontró el identificador de la película");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getMovieById(id);
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
        <div className="mx-auto max-w-6xl rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          Cargando detalle de la película...
        </div>
      </main>
    );
  }

  if (error || !movie) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-6xl space-y-4">
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

  const backdropImage = movie.backdropUrl || movie.posterUrl || "";

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section
        className="relative min-h-[560px] bg-cover bg-center"
        style={{
          backgroundImage: backdropImage ? `url(${backdropImage})` : undefined,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />

        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 md:flex-row md:items-end md:pt-40">
          <div className="w-48 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl md:w-64">
            {movie.posterUrl ? (
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex min-h-[360px] items-center justify-center text-zinc-500">
                Sin póster
              </div>
            )}
          </div>

          <div className="max-w-3xl">
            <Link
              to="/"
              className="mb-5 inline-block text-sm text-zinc-400 transition hover:text-red-400"
            >
              ← Volver a la colección
            </Link>

            <p className="text-sm uppercase tracking-[0.35em] text-red-500">
              CineLog
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-red-600 px-4 py-2 text-xs font-bold uppercase tracking-wide">
                {getStatusLabel(movie.status)}
              </span>

              {movie.isFavorite && (
                <span className="rounded-full border border-yellow-500/40 bg-yellow-500/10 px-4 py-2 text-xs font-bold text-yellow-300">
                  ★ Favorita
                </span>
              )}

              {movie.releaseYear && (
                <span className="text-sm text-zinc-300">
                  {movie.releaseYear}
                </span>
              )}
            </div>

            <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
              {movie.title}
            </h1>

            {movie.originalTitle && movie.originalTitle !== movie.title && (
              <p className="mt-3 text-lg text-zinc-400">
                {movie.originalTitle}
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              {movie.genres && movie.genres.length > 0 ? (
                movie.genres.map((genre: string) => (
                  <span
                    key={genre}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-300"
                  >
                    {genre}
                  </span>
                ))
              ) : (
                <span className="text-sm text-zinc-500">Sin género</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-[1fr_300px]">
        <article>
          <h2 className="mb-4 text-2xl font-bold">Sinopsis</h2>

          <p className="max-w-3xl text-lg leading-8 text-zinc-300">
            {movie.overview || "Sin descripción disponible."}
          </p>
        </article>

        <aside className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-xl">
          <h2 className="mb-5 text-xl font-bold">Datos de la película</h2>

          <div className="space-y-5 text-sm">
            <div>
              <p className="text-zinc-500">Rating TMDB</p>
              <p className="text-3xl font-black text-yellow-400">
                {movie.tmdbRating !== undefined && movie.tmdbRating !== null
                  ? movie.tmdbRating.toFixed(1)
                  : "N/A"}
              </p>
            </div>

            <div>
              <p className="text-zinc-500">Estado</p>
              <p className="font-semibold">{getStatusLabel(movie.status)}</p>
            </div>

            <div>
              <p className="text-zinc-500">Favorita</p>
              <p className="font-semibold">{movie.isFavorite ? "Sí" : "No"}</p>
            </div>

            {movie.userRating !== undefined && movie.userRating !== null && (
              <div>
                <p className="text-zinc-500">Tu nota</p>
                <p className="font-semibold">{movie.userRating}/5</p>
              </div>
            )}

            {movie.runtime && (
              <div>
                <p className="text-zinc-500">Duración</p>
                <p className="font-semibold">{movie.runtime} min</p>
              </div>
            )}

            {movie.releaseYear && (
              <div>
                <p className="text-zinc-500">Año</p>
                <p className="font-semibold">{movie.releaseYear}</p>
              </div>
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}