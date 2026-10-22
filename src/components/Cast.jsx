import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const API_KEY = 'd7c241f33e39c9fb38b36ca12385aca4';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w200';

export const Cast = () => {
  const { movieId } = useParams();
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchCast() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=en-US`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error('Failed to load the cast.');
        }

        const data = await response.json();
        setCast(data.cast ?? []);
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

    fetchCast();
    return () => controller.abort();
  }, [movieId]);

  if (loading) return <p>Loading cast...</p>;
  if (error) return <p role="alert">Error: {error}</p>;
  if (cast.length === 0) return <p>No cast information available.</p>;

  return (
    <section>
      <h2>Cast</h2>
      <ul>
        {cast.map(person => (
          <li key={person.cast_id ?? `${person.id}-${person.credit_id}`}>
            {person.profile_path && (
              <img
                src={`${IMAGE_BASE_URL}${person.profile_path}`}
                alt={person.name}
                width="100"
              />
            )}
            <p>{person.name}</p>
            {person.character && <p>Character: {person.character}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
};