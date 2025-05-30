const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

// 엑셀 파일 경로
const excelFilePath = path.join(__dirname, '../data/movies.xlsx');
// 저장될 JSON 파일 경로
const jsonFilePath = path.join(__dirname, '../public/movies.json');

try {
  // 엑셀 파일 읽기
  const workbook = xlsx.readFile(excelFilePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // JSON으로 변환
  const jsonData = xlsx.utils.sheet_to_json(sheet);

  // 저장
  fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf8');
  console.log('✅ 엑셀 -> JSON 변환 성공:', jsonFilePath);
} catch (error) {
  console.error('❌ 변환 중 오류 발생:', error.message);
}
