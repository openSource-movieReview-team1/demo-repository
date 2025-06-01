import React, { useState } from 'react';

function ReviewForm({ onSubmit }) {
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text || rating <= 0 || rating > 5) {
      alert('리뷰와 별점을 올바르게 입력하세요.');
      return;
    }
    onSubmit({ text, rating });
    setText('');
    setRating(0);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        placeholder="리뷰를 작성하세요"
        onChange={(e) => setText(e.target.value)}
      />
      <input
        type="number"
        value={rating}
        placeholder="평점 (1~5)"
        onChange={(e) => setRating(Number(e.target.value))}
        min="1"
        max="5"
      />
      <button type="submit">등록</button>
    </form>
  );
}

export default ReviewForm;