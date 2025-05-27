import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header({ showSearch = false, searchValue = '', onSearchChange }) {
  const navigate = useNavigate();

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px 32px',
        borderBottom: '1px solid #eee',
        background: '#111',
        color: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      {/* 왼쪽: 로고/홈페이지명 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '1.6rem',
          color: '#ffc107',
          marginRight: 32,
        }}
        onClick={() => navigate('/')}
      >
        <span style={{ fontSize: '2rem', marginRight: 8 }}>🎬</span>
        영화 리뷰 플랫폼
      </div>
      {/* 중앙: 검색창 */}
      {showSearch && (
        <input
          type="text"
          placeholder="영화 제목을 검색하세요"
          value={searchValue}
          onChange={e => onSearchChange(e.target.value)}
          style={{
            flex: 1,
            maxWidth: 400,
            padding: '8px 12px',
            borderRadius: 4,
            border: '1px solid #ccc',
            fontSize: '1rem',
            marginLeft: 16,
            background: '#222',
            color: '#fff',
          }}
        />
      )}
    </header>
  );
}

export default Header;