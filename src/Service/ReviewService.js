// localStorage에서 리뷰 불러오기
function loadReviews() {
  const saved = localStorage.getItem('reviews');
  return saved ? JSON.parse(saved) : [];
}

// localStorage에 리뷰 저장하기
function saveReviews(reviews) {
  localStorage.setItem('reviews', JSON.stringify(reviews));
}

export function getReviewsByMovieId(movieId) {
  const reviews = loadReviews();
  return Promise.resolve(reviews.filter((r) => r.movieId === movieId));
}

// 리뷰 추가하기
export function addReview(movieId, text, rating) {
  const reviews = loadReviews();
  const newReview = { id: Date.now(), movieId, text, rating, likes: 0 };
  reviews.push(newReview);
  saveReviews(reviews);
  return Promise.resolve(newReview);
}
// 리뷰 전부 가져오기
export function getAllReviews() {
  return Promise.resolve(loadReviews());
}

// 리뷰 삭제
export function deleteReview(reviewId) {
  let reviews = loadReviews();
  reviews = reviews.filter((r) => r.id !== reviewId);
  saveReviews(reviews);
  return Promise.resolve();
}

// 리뷰 수정
export function updateReview(reviewId, newText, newRating) {
  const reviews = loadReviews();
  const idx = reviews.findIndex((r) => r.id === reviewId);
  if (idx !== -1) {
    reviews[idx].text = newText;
    reviews[idx].rating = newRating;
    saveReviews(reviews);
  }
  return Promise.resolve();
}
