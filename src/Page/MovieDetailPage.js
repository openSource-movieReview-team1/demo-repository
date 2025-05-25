import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieById, getMovies } from "../Service/MovieService";
import {
  getReviewsByMovieId,
  addReview,
  deleteReview,
  updateReview,
} from "../Service/ReviewService";
import MovieCard from "../Component/MovieCard"; // 추천 영화 표시용
import Header from "../Component/Header";
import "../css/Form.css";
import "../css/MovieCard.css";

function MovieDetailPage({ wishlist = [], onToggleWishlist = () => {} }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(0);
  const [allMovies, setAllMovies] = useState([]); // 추천 영화 관련 상태

  // 검색 상태 추가
  const [query, setQuery] = useState("");

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
      setEditText("");
      setEditRating(0);
    });
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditText("");
    setEditRating(0);
  };

  useEffect(() => {
    getMovieById(Number(id)).then(setMovie);
    getReviewsByMovieId(Number(id)).then(setReviews); // 모든 리뷰 데이터
    getMovies().then(setAllMovies); // 모든 영화 데이터 가져오기
  }, [id]);

  const handleAddReview = () => {
    if (!reviewText.trim() || rating === 0) {
      alert("별점과 리뷰를 모두 입력해주세요.");
      return;
    }
    addReview(Number(id), reviewText, rating).then((newReview) => {
      setReviews((prev) => [...prev, newReview]);
      setReviewText("");
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
    <div style={{ background: "#111", minHeight: "100vh", color: "#fff" }}>
      {/* 검색창이 포함된 Header */}
      <Header showSearch={true} searchValue={query} onSearchChange={setQuery} />
      {/* 영화 정보 영역 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 0,
          marginBottom: 32,
        }}
      >
        {/* 영화 제목을 포스터 상단 중앙에 배치 */}
        <h2
          style={{
            textAlign: "center",
            fontSize: "2.2rem",
            fontWeight: "bold",
            margin: "32px 0 16px 0",
            letterSpacing: "1px",
          }}
        >
          {movie.title}{" "}
          {movie.year && (
            <span style={{ color: "#bbb", fontSize: "1.4rem" }}>
              ({movie.year})
            </span>
          )}
        </h2>
        <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
          {/* 포스터 */}
          <img
            className="movie-card"
            src={movie.poster}
            alt={movie.title}
            width={260}
            style={{ borderRadius: 8, boxShadow: "0 2px 8px #ccc" }}
          />
          {/* 예고편 및 정보 */}
          <div style={{ flex: 1 }}>
            {/* 예고편 영역 */}
            <div
              style={{
                width: "100%",
                height: 0,
                paddingBottom: "56.25%",
                position: "relative",
                background: "#222",
                borderRadius: 8,
                marginBottom: 24,
              }}
            >
              {/* 예고편이 있다면 iframe, 없으면 안내문구 */}
              {/* 예시: <iframe src={movie.trailerUrl} ... /> */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#888",
                  fontSize: "1.1rem",
                  background: "#222",
                  borderRadius: 8,
                }}
              >
                예고편이 준비되지 않았습니다.
              </div>
            </div>
            {/* 영화 설명 및 기타 정보 */}
            <p style={{ margin: "16px 0" }}>{movie.description}</p>
            <div style={{ margin: "12px 0" }}>
              <span
                style={{
                  color: "#ffc107",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                }}
              >
                ★ {getAverageRating(reviews)} / 5
              </span>
            </div>
            <button
              style={{
                background: wishlist.includes(movie.id) ? "#ffc107" : "#eee",
                color: wishlist.includes(movie.id) ? "#222" : "#888",
                border: "none",
                borderRadius: 4,
                padding: "8px 16px",
                cursor: "pointer",
                marginRight: 8,
              }}
              onClick={() => onToggleWishlist(movie.id)}
            >
              {wishlist.includes(movie.id) ? "즐겨찾기 해제" : "⭐ 즐겨찾기"}
            </button>
          </div>
        </div>
      </div>

      {/* 리뷰 영역 */}
      <section style={{ marginBottom: 40 }}>
        <h3>리뷰</h3>
        <ul style={{ padding: 0, listStyle: "none" }}>
          {reviews.map((r) => (
            <li
              key={r.id}
              style={{
                marginBottom: 16,
                borderBottom: "1px solid #eee",
                paddingBottom: 12,
              }}
            >
              {editingReviewId === r.id ? (
                <div>
                  <StarRating value={editRating} onChange={setEditRating} />
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={2}
                    style={{
                      width: "60%",
                      marginBottom: "8px",
                      height: "40px",
                    }}
                  />
                  <br />
                  <button onClick={handleSaveEdit}>저장</button>
                  <button onClick={handleCancelEdit} style={{ marginLeft: 8 }}>
                    취소
                  </button>
                </div>
              ) : (
                <div>
                  <span>
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        style={{
                          color: i < (r.rating || 0) ? "#ffc107" : "#e4e5e9",
                          fontSize: "1.1rem",
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
        {/* 리뷰 작성 폼 */}
        <div style={{ marginTop: 24 }}>
          <StarRating value={rating} onChange={setRating} />
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="리뷰를 작성하세요"
            rows={2}
            style={{
              width: "60%",
              marginBottom: "8px",
              height: "40px",
            }}
          />
          <br />
          <button onClick={handleAddReview} style={{ marginRight: "8px" }}>
            리뷰 등록
          </button>
          <button onClick={() => navigate(-1)}>뒤로가기</button>
        </div>
      </section>

      {/* 추천 영화 영역 */}
      <section>
        <h3 style={{ marginTop: 32 }}>추천 영화</h3>
        {recommendedMovies.length > 0 ? (
          <div style={{ display: "flex", gap: "16px", marginBottom: 24 }}>
            {recommendedMovies.map((recMovie) => (
              <MovieCard
                key={recMovie.id}
                movie={recMovie}
                wishlist={wishlist}
                onToggleWishlist={onToggleWishlist}
                avgRating={recMovie.avgRating}
              />
            ))}
          </div>
        ) : (
          <p>추천할 영화가 없습니다.</p>
        )}
      </section>
    </div>
  );
}

// 별점 선택 함수
function StarRating({ value, onChange, totalStars = 5 }) {
  const [hover, setHover] = useState(0);

  return (
    <div style={{ display: "flex", gap: 2, marginBottom: 8 }}>
      {Array.from({ length: totalStars }).map((_, i) => {
        const starValue = i + 1;
        return (
          <span
            key={starValue}
            style={{
              cursor: "pointer",
              color: starValue <= (hover || value) ? "#ffc107" : "#e4e5e9",
              fontSize: "1.5rem",
              transition: "color 0.2s",
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
