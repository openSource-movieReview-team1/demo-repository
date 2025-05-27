import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Page/HomePage';
import MovieDetailPage from './Page/MovieDetailPage';
import { getMovies } from './Service/MovieService';
import WishlistPage from './Page/WishList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // 스크롤에 따라 그라데이션 투명도 조절
  const [gradientOpacity, setGradientOpacity] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const max = 100; // 0~100px 구간에서만 점점 불투명
      const opacity = Math.min(scrollY / max, 1);
      setGradientOpacity(opacity);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function Header() {
    return (
      <header>
        <h1>영화 리뷰 플랫폼</h1>
      </header>
    );
  }

  useEffect(() => {
    getMovies().then(setMovies);
  }, []);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const handleToggleWishlist = (movieId) => {
    setWishlist((prev) =>
      prev.includes(movieId)
        ? prev.filter((id) => id !== movieId)
        : [...prev, movieId]
    );
  };

  return (
    <>
      {/* 스크롤에 따라 투명도가 변하는 넷플릭스 스타일 상단 그라데이션 */}
      <div
        className="bg-gradient"
        style={{
          opacity: gradientOpacity,
          transition: 'opacity 0.2s'
        }}
      ></div>
      <Router>
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                movies={movies}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
              />
            }
          />
          <Route
            path="/movie/:id"
            element={
              <MovieDetailPage
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
              />
            }
          />
          <Route
            path="/wishlist"
            element={
              <WishlistPage
                movies={movies}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
              />
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
