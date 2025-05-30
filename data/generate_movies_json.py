import requests
import openpyxl
import time

API_KEY = '414b8c35ae5397ee3e94ce7a5f2c24d4'
POSTER_BASE = 'https://image.tmdb.org/t/p/w500'

wb = openpyxl.Workbook()
ws = wb.active
ws.append([
    'title',
    'original_title',
    'poster_url',
    'overview',
    'release_date',
    'runtime',
    'language',
    'genres',
    'rating',
    'trailer_url'
])

def get_movie_details(movie_id):
    url = f'https://api.themoviedb.org/3/movie/{movie_id}?api_key={API_KEY}&language=ko-KR'
    res = requests.get(url)
    return res.json() if res.status_code == 200 else {}

def get_trailer_url(movie_id):
    url = f'https://api.themoviedb.org/3/movie/{movie_id}/videos?api_key={API_KEY}&language=ko-KR'
    try:
        res = requests.get(url).json()
        for video in res.get('results', []):
            if video['type'] == 'Trailer' and video['site'] == 'YouTube':
                return f"https://www.youtube.com/watch?v={video['key']}"
        return ''
    except:
        return ''

for page in range(1, 26):  
    url = f'https://api.themoviedb.org/3/movie/popular?api_key={API_KEY}&language=ko-KR&page={page}'
    res = requests.get(url)
    if res.status_code != 200:
        continue
    data = res.json()

    for movie in data['results']:
        movie_id = movie['id']
        title = movie.get('title', '')
        original_title = movie.get('original_title', '')
        poster = movie.get('poster_path', '')
        poster_url = POSTER_BASE + poster if poster else ''
        rating = movie.get('vote_average', '')

        details = get_movie_details(movie_id)
        overview = details.get('overview', '')
        release_date = details.get('release_date', '')
        runtime = details.get('runtime', '')
        language = details.get('original_language', '')
        genres = ', '.join([g['name'] for g in details.get('genres', [])])

        trailer_url = get_trailer_url(movie_id)

        ws.append([
            title,
            original_title,
            poster_url,
            overview,
            release_date,
            runtime,
            language,
            genres,
            rating,
            trailer_url
        ])
        time.sleep(0.1)  # API 제한 회피

wb.save('movie_info_with_trailers.xlsx')
print('✅ 저장 완료: movie_info_with_trailers.xlsx')
