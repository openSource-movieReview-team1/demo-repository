const BASE_URL = "http://localhost:5001/api/reviews";

// 전체 리뷰 가져오기
export async function getAllReviews() {
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("리뷰 조회 실패");
    return await res.json();
  } catch (err) {
    console.error("❌ 전체 리뷰 불러오기 오류:", err);
    throw err;
  }
}

// 특정 영화 리뷰 가져오기
export async function getReviewsByMovieId(movieId) {
  try {
    const res = await fetch(`${BASE_URL}?movieId=${movieId}`);
    if (!res.ok) throw new Error("리뷰 조회 실패");
    return await res.json();
  } catch (err) {
    console.error("❌ 영화 리뷰 불러오기 오류:", err);
    throw err;
  }
}

// 리뷰 추가
export async function addReview(movieId, content, rating) {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ movie_id: movieId, content, rating }),
    });
    if (!res.ok) throw new Error("리뷰 저장 실패");
    return await res.json();
  } catch (err) {
    console.error("❌ 리뷰 저장 오류:", err);
    throw err;
  }
}

// 리뷰 삭제
export async function deleteReview(id) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("리뷰 삭제 실패");
  } catch (err) {
    console.error("❌ 리뷰 삭제 오류:", err);
    throw err;
  }
}

// 리뷰 수정
export async function updateReview(id, content, rating) {
  if (isNaN(Number(rating))) {
    console.error("❗ rating이 숫자가 아님:", rating);
    throw new Error("유효하지 않은 별점입니다.");
  }

  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, rating }),
    });
    if (!res.ok) throw new Error("리뷰 수정 실패");
    return;
  } catch (err) {
    console.error("❌ 리뷰 수정 오류:", err);
    throw err;
  }
}

