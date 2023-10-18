import { useState, useEffect } from "react";

const KEY = "38e5f897";

export function useMovie(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoding] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      // callback?.();

      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoding(true);
          setError("");

          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok) {
            throw new Error("data not fetch :(");
          }

          const data = await res.json();

          if (data.Response === "False") {
            throw new Error("Movie not  found");
          }
          setMovies(data.Search);
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
          }
          // setError("");
        } finally {
          setIsLoding(false);
        }
      }

      if (query.length < 3) {
        setError("");
        setMovies([]);

        return;
      }

      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
