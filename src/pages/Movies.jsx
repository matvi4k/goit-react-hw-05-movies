import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const API_KEY = 'd7c241f33e39c9fb38b36ca12385aca4';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w200';

export const Movies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query')?.trim() ?? '';
  const [inputValue, setInputValue] = useState(query);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  useEffect(() => {
    if (!query) {
      setMovies([]);
      setError(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function searchMovies() {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          api_key: API_KEY,
          language: 'en-US',
          query,
        });
        const response = await fetch(
          `${BASE_URL}/search/movie?${params}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error('Failed to search movies.');
        }

        const data = await response.json();
        setMovies(data.results ?? []);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err instanceof Error ? err.message : 'Something went wrong.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    searchMovies();
    return () => controller.abort();
  }, [query]);

  const handleSubmit = event => {
    event.preventDefault();
    const trimmedValue = inputValue.trim();

    if (trimmedValue) {
      setSearchParams({ query: trimmedValue });
    } else {
      setSearchParams({});
    }
  };

  return (
    <main>
      <form style={{ display: 'flex', gap: '12px', marginTop: '50px' }} onSubmit={handleSubmit}>
        <input
          type="search"
          value={inputValue}
          onChange={event => setInputValue(event.target.value)}
          placeholder="Enter a movie title"
          aria-label="Movie title"
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Searching movies...</p>}
      {error && <p role="alert">Error: {error}</p>}
      {!loading && !error && query && movies.length === 0 && (
        <p>No movies found for “{query}”.</p>
      )}

      <ul>
        {movies.map(movie => (
          <li key={movie.id}>
            <Link to={`/movies/${movie.id}`}>
              {movie.poster_path && (
                <img
                  src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                  alt=""
                  width="100"
                />
              )}{' '}
              {movie.title}
              {movie.release_date && ` (${movie.release_date.slice(0, 4)})`}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
};
