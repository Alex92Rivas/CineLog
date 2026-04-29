import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

import { useMovies } from "../hooks/useMovies";

type MovieContextValue = ReturnType<typeof useMovies>;

const MovieContext = createContext<MovieContextValue | undefined>(
  undefined
);

type MovieProviderProps = {
  children: ReactNode;
};

export function MovieProvider({
  children,
}: MovieProviderProps) {
  const movieState = useMovies();

  return (
    <MovieContext.Provider value={movieState}>
      {children}
    </MovieContext.Provider>
  );
}

export function useMovieContext(): MovieContextValue {
  const context = useContext(MovieContext);

  if (!context) {
    throw new Error(
      "useMovieContext debe usarse dentro de MovieProvider"
    );
  }

  return context;
}