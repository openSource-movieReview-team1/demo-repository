export async function getMovies() {
  const res = await fetch('/movies.json');
  if (!res.ok) throw new Error('영화 데이터를 불러오지 못했습니다.');
  return await res.json();
}

export async function getMovieById(id) {
  const movies = await getMovies();
  return movies.find((m) => m.id === id);
}
