const dummyMovies = [
  {
    id: 1,
    title: '인셉션',
    year: 2010,
    poster: require('../lena.jpg'),
    description: '꿈을 조종하는 이야기',
  },
  {
    id: 2,
    title: '인터스텔라',
    year: 2014,
    poster: 'https://via.placeholder.com/150',
    description: '우주를 여행하는 이야기',
  },
  {
    id: 3,
    title: '기생충',
    year: 2019,
    poster: 'https://via.placeholder.com/150',
    description: '두 가족의 만남과 충돌을 그린 블랙코미디',
  },
  {
    id: 4,
    title: '어벤져스: 엔드게임',
    year: 2019,
    poster: 'https://via.placeholder.com/150',
    description: '마블 히어로들의 마지막 대결',
  },
  {
    id: 5,
    title: '타이타닉',
    year: 1997,
    poster: 'https://via.placeholder.com/150',
    description: '비극적인 운명의 러브스토리',
  },
  {
    id: 6,
    title: '쇼생크 탈출',
    year: 1994,
    poster: 'https://via.placeholder.com/150',
    description: '희망을 향한 감동의 탈출기',
  },
  {
    id: 7,
    title: '라라랜드',
    year: 2016,
    poster: 'https://via.placeholder.com/150',
    description: '꿈과 사랑을 노래하는 뮤지컬 영화',
  },
  {
    id: 8,
    title: '매트릭스',
    year: 1999,
    poster: 'https://via.placeholder.com/150',
    description: '가상현실과 인간의 자유 의지',
  },
  {
    id: 9,
    title: '포레스트 검프',
    year: 1994,
    poster: 'https://via.placeholder.com/150',
    description: '순수한 영혼의 인생 대서사시',
  },
];

export function getMovies() {
  return Promise.resolve(dummyMovies);
}

export function getMovieById(id) {
  return Promise.resolve(dummyMovies.find((m) => m.id === id));
}
