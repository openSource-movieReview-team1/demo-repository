import openpyxl
import json
import time
import os

EXCEL_FILE = 'movies.xlsx'
JSON_FILE = 'movies.json'

def excel_to_json(excel_path, json_path):
    wb = openpyxl.load_workbook(excel_path)
    ws = wb.active
    rows = list(ws.iter_rows(values_only=True))

    if not rows:
        print("엑셀에 데이터가 없습니다.")
        return

    headers = rows[0]
    data = [dict(zip(headers, row)) for row in rows[1:] if any(row)]

    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"JSON 파일 저장 완료: {json_path}")

def watch_file(file_path, interval=5):
    print(f"감시 시작: {file_path}")
    last_mtime = None
    while True:
        try:
            current_mtime = os.path.getmtime(file_path)
            if last_mtime is None or current_mtime != last_mtime:
                last_mtime = current_mtime
                excel_to_json(file_path, JSON_FILE)
            time.sleep(interval)
        except KeyboardInterrupt:
            print("감시 종료.")
            break
        except Exception as e:
            print("오류:", e)
            time.sleep(interval)

if __name__ == '__main__':
    watch_file(EXCEL_FILE)
