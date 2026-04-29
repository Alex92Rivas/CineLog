import type { Movie } from "../types/movie";

export type { Movie };

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("Falta definir VITE_API_URL");
}

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

export async function createMovie(movie: Omit<Movie, "id">): Promise<Movie> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(movie),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error al crear película:", errorText);
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