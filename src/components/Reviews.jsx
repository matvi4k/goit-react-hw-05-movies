import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = 'd7c241f33e39c9fb38b36ca12385aca4';

export const Reviews = () => {
  const { movieId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchReviews() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${BASE_URL}/movie/${movieId}/reviews?api_key=${API_KEY}&language=en-US`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error('Failed to load reviews.');
        }

        const data = await response.json();
        setReviews(data.results ?? []);
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

    fetchReviews();
    return () => controller.abort();
  }, [movieId]);

  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p role="alert">Error: {error}</p>;
  if (reviews.length === 0) return <p>No reviews available for this movie.</p>;

  return (
    <section>
      <h2>Reviews</h2>
      <ul>
        {reviews.map(review => (
          <li key={review.id}>
            <h3>{review.author}</h3>
            <p>{review.content}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};