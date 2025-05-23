import React, { useState } from 'react';
import '../css/StarRating.css';

// 별점 컴포넌트, 기본 5개 별
function StarRating({ totalStars = 5, onChange }) {
  const [rating, setRating] = useState(0); // 선택된 별점
  const [hover, setHover] = useState(0); // 마우스오버 별점

  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[...Array(totalStars)].map((_, idx) => {
        const starValue = idx + 1;
        return (
          <span
            key={starValue}
            style={{
              cursor: 'pointer',
              color: starValue <= (hover || rating) ? '#ffc107' : '#e4e5e9',
              fontSize: '2rem',
              transition: 'color 0.2s',
            }}
            onClick={() => {
              setRating(starValue);
              if (onChange) onChange(starValue);
            }}
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

export default StarRating;
