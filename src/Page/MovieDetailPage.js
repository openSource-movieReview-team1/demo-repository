import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieById, getMovies } from '../Service/MovieService';
import {
  getReviewsByMovieId,
  addReview,
  deleteReview,
  updateReview,
} from '../Service/ReviewService';
import MovieCard from '../Component/MovieCard'; // 추천 영화 표시용
import '../css/Form.css';
import '../css/MovieCard.css';

function MovieDetailPage({ wishlist = [], onToggleWishlist = () => {} }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editRating, setEditRating] = useState(0);
  const [allMovies, setAllMovies] = useState([]); // 추천 영화 관련 상태

  // 수정 시작
  const handleEditReview = (review) => {
    setEditingReviewId(review.id);
    setEditText(review.text);
    setEditRating(review.rating);
  };
  // 수정 저장
  const handleSaveEdit = () => {
    updateReview(editingReviewId, editText, editRating).then(() => {
      getReviewsByMovieId(Number(id)).then(setReviews);
      setEditingReviewId(null);
      setEditText('');
      setEditRating(0);
    });
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditText('');
    setEditRating(0);
  };

  useEffect(() => {
    getMovieById(Number(id)).then(setMovie);
    getReviewsByMovieId(Number(id)).then(setReviews); // 모든 리뷰 데이터
    getMovies().then(setAllMovies); // 모든 영화 데이터 가져오기
  }, [id]);

  const handleAddReview = () => {
    if (!reviewText.trim() || rating === 0) {
      alert('별점과 리뷰를 모두 입력해주세요.');
      return;
    }
    addReview(Number(id), reviewText, rating).then((newReview) => {
      setReviews((prev) => [...prev, newReview]);
      setReviewText('');
      setRating(0);
    });
  };

  // 리뷰 삭제
  const handleDeleteReview = (reviewId) => {
    deleteReview(reviewId).then(() => {
      // 삭제 후 localStorage에서 최신 리뷰 다시 불러오기!
      getReviewsByMovieId(Number(id)).then(setReviews);
    });
  };

  const recommendedMovies = allMovies
    .filter((m) => m.id !== Number(id) && m.year === movie?.year)
    .slice(0, 5); // 최대 5개 추천

  if (!movie) return <div>Loading...</div>;

  return (
    <div>
      <h2>{movie.title}</h2>
      <img
        className="movie-card"
        src={movie.poster}
        alt={movie.title}
        width={200}
      />
      <p>{movie.description}</p>
      <h3 style={{ marginTop: 32 }}>추천 영화</h3>
      {recommendedMovies.length > 0 ? (
        <div style={{ display: 'flex', gap: '16px', marginBottom: 24 }}>
          {recommendedMovies.map((recMovie) => (
            <MovieCard
              key={recMovie.id}
              movie={recMovie}
              wishlist={wishlist} // 추가!
              onToggleWishlist={onToggleWishlist} // 추가!
              avgRating={recMovie.avgRating} // 필요하다면
            />
          ))}
        </div>
      ) : (
        <p>추천할 영화가 없습니다.</p>
      )}
      <p>
        평균 별점:
        <span style={{ color: '#ffc107', fontWeight: 'bold', marginLeft: 4 }}>
          {getAverageRating(reviews)} / 5
        </span>
      </p>
      <h3>리뷰</h3>
      <ul>
        {reviews.map((r) => (
          <li key={r.id} style={{ marginBottom: 8 }}>
            {editingReviewId === r.id ? (
              <div>
                {/* 수정 모드 */}
                <StarRating value={editRating} onChange={setEditRating} />
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={2}
                  style={{ width: '50%', marginBottom: '8px', height: '40px' }}
                />
                <br />
                <button onClick={handleSaveEdit}>저장</button>
                <button onClick={handleCancelEdit} style={{ marginLeft: 8 }}>
                  취소
                </button>
              </div>
            ) : (
              <div>
                {/* 읽기 모드 */}
                <span>
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      style={{
                        color: i < (r.rating || 0) ? '#ffc107' : '#e4e5e9',
                      }}
                    >
                      ★
                    </span>
                  ))}
                </span>
                <br />
                {r.text}
                <br />
                <button
                  onClick={() => handleEditReview(r)}
                  style={{ marginRight: 5 }}
                >
                  수정
                </button>
                <button onClick={() => handleDeleteReview(r.id)}>삭제</button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div style={{ marginTop: '16px' }}>
        {/* 별점 선택 */}
        <StarRating value={rating} onChange={setRating} />
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="리뷰를 작성하세요"
          rows={2}
          style={{ width: '50%', marginBottom: '8px', height: '40px' }}
        />
        <br />
        <button onClick={handleAddReview} style={{ marginRight: '8px' }}>
          리뷰 등록
        </button>
        <button onClick={() => navigate(-1)}>뒤로가기</button>
      </div>
    </div>
  );
}

// 별점 선택 함수
function StarRating({ value, onChange, totalStars = 5 }) {
  const [hover, setHover] = useState(0);

  return (
    <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
      {Array.from({ length: totalStars }).map((_, i) => {
        const starValue = i + 1;
        return (
          <span
            key={starValue}
            style={{
              cursor: 'pointer',
              color: starValue <= (hover || value) ? '#ffc107' : '#e4e5e9',
              fontSize: '1.5rem',
              transition: 'color 0.2s',
            }}
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
            role="button"
            aria-label={`${starValue}점`}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}

// 별점 평균 표시 함수
function getAverageRating(reviews) {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, cur) => acc + (cur.rating || 0), 0);
  return (sum / reviews.length).toFixed(1); // 소수점 1자리
}

export default MovieDetailPage;
