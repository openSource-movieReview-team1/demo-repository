import React, { useEffect, useState } from 'react';
import MovieCard from '../Component/MovieCard';
import { getAllReviews } from '../Service/ReviewService';
import { useNavigate } from 'react-router-dom';

function WishlistPage({ movies, wishlist, onToggleWishlist }) {
  // 위시리스트에 추가된 영화만 필터링
  const wishedMovies = wishlist
    .map((id) => movies.find((movie) => movie.id === id))
    .filter(Boolean); // 혹시 없는 영화 id가 있을 경우 방지
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllReviews().then(setReviews);
  }, []);

  return (
    <div>
      <h2>내 위시리스트</h2>
      {wishedMovies.length === 0 ? (
        <p>위시리스트에 추가된 영화가 없습니다.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {wishedMovies.map((movie) => {
            const movieReviews = reviews.filter((r) => r.movieId === movie.id);
            const avgRating = Number(getAverageRating(movieReviews));
            return (
              <MovieCard
                key={movie.id}
                movie={movie}
                wishlist={wishlist}
                onToggleWishlist={onToggleWishlist}
                avgRating={avgRating}
              />
            );
          })}
        </div>
      )}
      <button onClick={() => navigate(-1)} style={{ marginTop: 24 }}>
        뒤로가기
      </button>
    </div>
  );
}

// 평균 별점 계산 함수
function getAverageRating(reviews) {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, cur) => acc + (cur.rating || 0), 0);
  return (sum / reviews.length).toFixed(1);
}

export default WishlistPage;
