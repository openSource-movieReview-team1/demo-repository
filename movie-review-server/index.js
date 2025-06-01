require('dotenv').config(); 
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

// CORS 설정 (가장 먼저)
app.use(cors()); // 개발 중엔 전체 허용. 운영에서는 origin 제한 추천

// JSON 파싱
app.use(express.json());

// MariaDB 연결
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || 'movie_review',
});

db.connect((err) => {
  if (err) {
    console.error('❌ DB 연결 실패:', err);
  } else {
    console.log('✅ MariaDB 연결 성공!');
  }
});


// 전체 리뷰 조회
app.get('/api/reviews', (req, res) => {
  const sql = 'SELECT * FROM reviews ORDER BY created_at DESC';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ 전체 리뷰 조회 오류:', err);
      return res.status(500).send('서버 오류');
    }
    res.json(results);
  });
});

// 특정 영화 리뷰 조회
app.get('/api/reviews/movie/:movie_id', (req, res) => {
  const { movie_id } = req.params;
  const sql = 'SELECT * FROM reviews WHERE movie_id = ? ORDER BY created_at DESC';
  db.query(sql, [movie_id], (err, results) => {
    if (err) {
      console.error('❌ 영화 리뷰 조회 오류:', err);
      return res.status(500).send('서버 오류');
    }
    res.json(results);
  });
});

// 리뷰 등록
app.post('/api/reviews', (req, res) => {
  const { movie_id, rating, content } = req.body;
  const sql = 'INSERT INTO reviews (movie_id, rating, content) VALUES (?, ?, ?)';
  db.query(sql, [movie_id, rating, content], (err, result) => {
    if (err) {
      console.error('❌ 리뷰 등록 오류:', err);
      return res.status(500).send('서버 오류');
    }
    res.status(201).json({ id: result.insertId });
  });
});

// 리뷰 삭제
app.delete('/api/reviews/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM reviews WHERE id = ?';
  db.query(sql, [id], (err) => {
    if (err) {
      console.error('❌ 리뷰 삭제 오류:', err);
      return res.status(500).send('서버 오류');
    }
    res.sendStatus(204);
  });
});

// 리뷰 수정
app.put('/api/reviews/:id', (req, res) => {
    const { id } = req.params;
    const { rating, content } = req.body;
  
    console.log('✍ 수정 요청 도착:', { id, rating, content }); // ⭐ 추가
    if (isNaN(rating)) {
      console.warn('❗ rating이 숫자가 아님:', rating);         // ⭐ 추가
      return res.status(400).json({ message: '별점은 숫자여야 합니다.' });
    }
  
    const sql = 'UPDATE reviews SET rating = ?, content = ? WHERE id = ?';
    db.query(sql, [rating, content, id], (err, result) => {
      if (err) {
        console.error('❌ 리뷰 수정 오류:', err);
        return res.status(500).send('서버 오류');
      }
      res.sendStatus(200);
    });
  });    

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 실행 중입니다: http://localhost:${PORT}`);
});
