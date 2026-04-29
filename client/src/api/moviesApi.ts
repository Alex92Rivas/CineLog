import type { Movie } from "../types/movie";

const API_URL = "http://localhost:3000/api/v1/movies";

export async function getMovies(): Promise<Movie[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Error al obtener películas");
  }

  return response.json();
}

export async function getMovieById(id: string): Promise<Movie> {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Película no encontrada");
  }

  return response.json();
}

export async function createMovie(
  movie: Omit<Movie, "id">
): Promise<Movie> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(movie),
  });

  if (!response.ok) {
    throw new Error("Error al crear película");
  }

  return response.json();
}

export async function updateMovie(
  id: string,
  updates: Partial<Movie>
): Promise<Movie> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar película");
  }

  return response.json();
}

export async function deleteMovie(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error al eliminar película");
  }
}