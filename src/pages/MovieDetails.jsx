import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

const API_KEY = 'd7c241f33e39c9fb38b36ca12385aca4';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export const MovieDetails = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`
        );

        if (!response.ok) {
          throw new Error('Failed to load movie details.');
        }

        const data = await response.json();
        setMovie(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    }

    fetchMovieDetails();
  }, [movieId]);

  if (loading) return <p>Loading movie details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!movie) return <p>Movie not found.</p>;

  return (
    <main>
      <button type="button" onClick={() => navigate('/')}>
        Go back
      </button>
      <h1>{movie.title}</h1>
      {movie.poster_path && (
        <img
          src={`${IMAGE_BASE_URL}${movie.poster_path}`}
          alt={`Poster for ${movie.title}`}
        />
      )}
      <p>{movie.overview || 'No description available.'}</p>
      {movie.release_date && <p>Release date: {movie.release_date}</p>}
      {movie.genres?.length > 0 && (
        <p>Genres: {movie.genres.map(genre => genre.name).join(', ')}</p>
      )}
      <section>
        <h2>Additional information</h2>
        <ul>
          <li>
            <button type="button" onClick={() => navigate('cast')}>
              Cast
            </button>
          </li>
          <li>
            <button type="button" onClick={() => navigate('reviews')}>
              Reviews
            </button>
          </li>
        </ul>
      </section>
      <Outlet />
    </main>
  );
};