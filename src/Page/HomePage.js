import React, { useEffect, useState } from 'react';
import MovieCard from '../Component/MovieCard';
import { getMovies } from '../Service/MovieService';
import { getAllReviews } from '../Service/ReviewService';
import { useNavigate } from 'react-router-dom';
import Header from '../Component/Header';

// 평균 별점 가져오기
function getAverageRating(reviews) {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, cur) => acc + (cur.rating || 0), 0);
  return (sum / reviews.length).toFixed(1);
}

function HomePage({ onSelectMovie, wishlist, onToggleWishlist }) {
  const [movies, setMovies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [query, setQuery] = useState(''); // 검색어 상태 추가
  // 정렬/필터 관련 상태
  const [sortKey, setSortKey] = useState('year');
  const [sortOrder, setSortOrder] = useState('desc');
  const [minRating, setMinRating] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    getMovies().then(setMovies);
    getAllReviews().then(setReviews);
  }, []);

  // 영화별 평균 별점 계산
  const moviesWithAvgRating = movies.map((movie) => {
    const movieReviews = reviews.filter((r) => r.movieId === movie.id);
    return { ...movie, avgRating: Number(getAverageRating(movieReviews)) };
  });

  // 필터링 검색
  let filtered = moviesWithAvgRating.filter((movie) =>
  (movie.title || '').toLowerCase().includes(query.toLowerCase())
);

  // 별점 필터
  filtered = filtered.filter((m) => (m.avgRating || 0) >= minRating);

  // 정렬
  filtered.sort((a, b) => {
    let aValue, bValue;
    if (sortKey === 'year') {
      aValue = a.year;
      bValue = b.year;
    } else if (sortKey === 'title') {
      aValue = a.title.toLowerCase();
      bValue = b.title.toLowerCase();
    } else if (sortKey === 'rating') {
      aValue = a.avgRating || 0;
      bValue = b.avgRating || 0;
    }
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div style={{ background: '#111', minHeight: '100vh', color: '#fff' }}>
      <Header
        showSearch={true}
        searchValue={query}
        onSearchChange={setQuery}
      />
      <h2>영화 목록</h2>
      {/* 검색창 */}
      <input
        type="text"
        placeholder="영화 제목을 검색하세요"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ marginBottom: '16px', width: '300px', padding: '8px' }}
      />
      <div style={{ marginBottom: '16px' }}>
        <button onClick={() => navigate('/wishlist')}>⭐ 즐겨찾기 목록</button>
      </div>
      {/* 정렬/필터 UI */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
          <option value="year">연도순</option>
          <option value="title">제목순</option>
          <option value="rating">평점순</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="desc">내림차순</option>
          <option value="asc">오름차순</option>
        </select>
        <select
          value={minRating}
          onChange={(e) => setMinRating(Number(e.target.value))}
        >
          <option value={0}>전체</option>
          <option value={3}>3점 이상</option>
          <option value={4}>4점 이상</option>
          <option value={5}>5점</option>
        </select>
      </div>
      {/* 영화 목록 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {filtered.length > 0 ? (
          filtered.map((movie) => (
            <MovieCard
              key={movie.id || movie.title}
              movie={movie}
              wishlist={wishlist}
              onToggleWishlist={onToggleWishlist}
              avgRating={movie.avgRating}
            />
          ))
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;
