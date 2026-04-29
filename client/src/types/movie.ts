export type MovieStatus = "watchlist" | "watched";

export type Movie = {
  id: string;
  tmdbId: number;
  title: string;
  originalTitle?: string;
  overview?: string;
  genres?: string[];
  releaseYear?: number;
  posterUrl?: string;
  backdropUrl?: string;
  tmdbRating?: number;
  runtime?: number;
  status: MovieStatus;
  isFavorite: boolean;
  userRating: number | null;
};
