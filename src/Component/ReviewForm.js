import React, { useState } from 'react';
import StarRating from '../Component/StarRating';
import '../css/Form.css';

function ReviewForm({ onSubmit }) {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    if (reviewText && rating) {
      onSubmit({ text: reviewText, rating });
      setReviewText('');
      setRating(0);
    }
  };

  return (
    <div>
      <StarRating totalStars={5} onChange={setRating} />
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="리뷰를 작성하세요"
        rows={2}
        style={{ width: '100%', margin: '8px 0', height: '40px' }}
      />
      <button onClick={handleSubmit}>리뷰 등록</button>
    </div>
  );
}

export default ReviewForm;
