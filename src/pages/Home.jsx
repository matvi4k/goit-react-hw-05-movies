import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_KEY = 'd7c241f33e39c9fb38b36ca12385aca4';
const BASE_URL = 'https://api.themoviedb.org/3';

const Home = () => {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState (null)

  useEffect(() => {
    async function fetchTrendingMovies() {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}&language=en-US`);
        
        if (!response.ok) {
          throw new Error("Failed to load trending movies.");
        }

        const data = await response.json();
        setMovies(data.results || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTrendingMovies();
  }, []);

  if (loading) return <p>Loading movies...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div>
      <h3>Trending today</h3>

          <ul style={{ fontSize: 24, listStyle: 'none', padding: 0 }}>
        {movies.map((movie) => (
          <li key={movie.id} style={{ marginBottom: "12px" }}>
            <button
              type="button"
              onClick={() => navigate(`/movies/${movie.id}`)}
              style={{
                color: '#007BFF',
                textDecoration: 'none',
                font: 'inherit',
                padding: 0,
                border: 0,
                background: 'none',
                cursor: 'pointer',
              }}
            >
              {movie.title || movie.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;