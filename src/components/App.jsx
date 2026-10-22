import { NotFound } from 'pages/NotFound';
// import { Home } from "pages/Home";
import { Movies } from 'pages/Movies';
import { Routes, Route, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { lazy, Suspense } from 'react';
import { MovieDetails } from 'pages/MovieDetails';
import { Cast } from 'components/Cast';
import { Reviews } from 'components/Reviews';

const Home = lazy(() => import('pages/Home'));

const StyledLink = styled(NavLink)`
  color: black;

  &.active {
    color: pink;
  }
`;

export const App = () => {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        // alignItems: 'center',
        fontSize: 30,
        // color: '#010101'
      }}
    >
      <nav>
        <StyledLink to="/" end>
          Home
        </StyledLink>
        <StyledLink to="/movies">Movies</StyledLink>
      </nav>
      <Suspense fallback={<div>Loading page...</div>}>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/movies" element={<Movies />}></Route>
          <Route path="/movies/:movieId" element={<MovieDetails />}>
            <Route path="cast" element={<Cast />} />
            <Route path="reviews" element={<Reviews />} />
          </Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </Suspense>
    </div>
  );
};
