import React from 'react';
import '../css/MovieCard.css';
import '../css/Button.css';
import '../css/Form.css';
import { useNavigate } from 'react-router-dom';

function MovieCard({ movie, avgRating, wishlist = [], onToggleWishlist }) {
  const navigate = useNavigate();
  const isWished = wishlist.includes(movie.id);
  

  return (
    <div className="movie-card" onClick={() => navigate(`/movie/${movie.id}`)}>
      {/* ✅ 포스터 */}
      <img src={movie.poster} alt={movie.title} width={150} />

      {/* ✅ 제목 */}
      <h3>{movie.title}</h3>

      {/* ✅ 즐겨찾기 버튼  */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist(movie.id); 
        }}
      >
        {isWished ? '⭐ 즐겨찾기 해제' : '⭐ 즐겨찾기'}
      </button>

      {/* ✅ 연도 및 별점 */}
      <p>{movie.year}</p>
      <p>
        평균 별점:
        <span style={{ color: '#ffc107', fontWeight: 'bold', marginLeft: 4 }}>
          {avgRating} / 5
        </span>
      </p>
    </div>
  );
}

export default MovieCard;
