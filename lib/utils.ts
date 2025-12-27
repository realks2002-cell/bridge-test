/**
 * 유틸리티 함수
 */

import { Question } from '@/types';

/**
 * 모바일 디바이스 감지
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth <= 768;
}

/**
 * 클립보드에 텍스트 복사
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('클립보드 복사 실패:', err);
    
    // 폴백: 텍스트 영역 사용
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
}

/**
 * CSV 텍스트 파싱 (실습 문제 형식 지원, 여러 줄 필드 처리)
 */
export function parseCSV(csvText: string): Question[] {
  // 여러 줄 필드를 포함한 CSV 파싱
  const rows = parseCSVWithMultiline(csvText);
  if (rows.length === 0) {
    console.error('CSV 파싱 실패: 행이 없습니다.');
    return [];
  }
  
  const headers = rows[0].map((h) => h.trim());
  console.log('CSV 헤더:', headers);
  
  // 실습 문제 형식인지 확인 (문제유형, 데이터셋URL, 코드템플릿 컬럼 존재 여부)
  const isPracticeFormat = headers.includes('문제유형') || headers.includes('데이터셋URL') || headers.includes('코드템플릿');
  console.log('실습 문제 형식 여부:', isPracticeFormat);
  
  if (!isPracticeFormat) {
    console.warn('CSV가 실습 문제 형식이 아닙니다. 헤더:', headers);
  }
  
  const questions: Question[] = [];
  
  for (let i = 1; i < rows.length; i++) {
    const values = rows[i];
    if (values.length === 0) continue;
    
    if (isPracticeFormat) {
      // 실습 문제 형식: 문제번호,문제유형,문제,데이터셋URL,코드템플릿,정답코드,해설,난이도
      const question: Question = {
        번호: values[0] || String(i),
        문제: values[2] || '', // 문제 컬럼
        선택지1: `[실습 문제] Colab 노트북에서 코드를 작성하여 풀어주세요.`,
        선택지2: `데이터셋: ${values[3] || ''}`,
        선택지3: `문제 유형: ${values[1] || '데이터분석'}`,
        선택지4: `난이도: ${values[7] || '초급'}`,
        정답: values[5] || '', // 정답코드
        해설: values[6] || '', // 해설
        코드템플릿: values[4] || '', // 코드 템플릿
        데이터셋URL: values[3] || '', // 데이터셋 URL
        문제유형: values[1] || '', // 문제 유형
        난이도: values[7] || '', // 난이도
      };
      
      questions.push(question);
    } else {
      // 기존 형식: 문제번호,문제,선택지1,선택지2,선택지3,선택지4,정답,해설
      if (values.length >= headers.length) {
        const question: Question = {
          번호: values[0] || String(i),
          문제: values[1] || '',
          선택지1: values[2] || '',
          선택지2: values[3] || '',
          선택지3: values[4] || '',
          선택지4: values[5] || '',
          정답: values[6] || '',
          해설: values[7] || '',
        };
        
        questions.push(question);
      }
    }
  }
  
  console.log(`총 ${questions.length}개의 문제를 파싱했습니다.`);
  return questions;
}

/**
 * CSV 파싱 (여러 줄 필드 지원)
 */
function parseCSVWithMultiline(csvText: string): string[][] {
  const rows: string[][] = [];
  const lines = csvText.split(/\r?\n/);
  
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      const nextChar = j < line.length - 1 ? line[j + 1] : null;
      
      if (char === '"') {
        // 이스케이프된 따옴표 처리 ("")
        if (nextChar === '"' && inQuotes) {
          currentField += '"';
          j++; // 다음 문자 건너뛰기
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // 필드 구분자
        currentRow.push(currentField.trim());
        currentField = '';
      } else {
        currentField += char;
      }
    }
    
    // 따옴표 안이 아니면 줄바꿈 처리, 따옴표 안이면 줄바꿈을 필드에 포함
    if (!inQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
      
      if (currentRow.length > 0 && currentRow.some(field => field.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
    } else {
      // 따옴표 안이면 줄바꿈을 필드에 포함
      currentField += '\n';
    }
  }
  
  // 마지막 필드 처리
  if (currentField.trim() || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(field => field.length > 0)) {
      rows.push(currentRow);
    }
  }
  
  return rows;
}

/**
 * CSV 라인 파싱 (쉼표와 따옴표 처리) - 단일 줄용
 */
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current.trim());
  return values;
}

/**
 * CSV 파일 로드
 */
export async function loadExamData(csvUrl: string): Promise<{ questions: Question[]; isPracticeFormat: boolean }> {
  try {
    // 캐시 방지를 위해 타임스탬프 추가
    const cacheBuster = `?t=${Date.now()}&v=2`;
    const urlWithCache = csvUrl.includes('?') ? `${csvUrl}&${cacheBuster.substring(1)}` : `${csvUrl}${cacheBuster}`;
    
    console.log('CSV 파일 로드 시도:', urlWithCache);
    
    const response = await fetch(urlWithCache, {
      headers: {
        'Accept': 'text/csv; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(
        `CSV 파일을 불러올 수 없습니다: ${response.status} ${response.statusText}`
      );
    }
    
    // UTF-8로 명시적으로 디코딩
    const arrayBuffer = await response.arrayBuffer();
    const decoder = new TextDecoder('utf-8');
    const csvText = decoder.decode(arrayBuffer);
    
    // 여러 줄 필드를 포함한 CSV 파싱
    const rows = parseCSVWithMultiline(csvText);
    if (rows.length === 0) {
      throw new Error('CSV 파일이 비어있습니다.');
    }
    
    const headers = rows[0].map((h) => h.trim());
    console.log('CSV 로드 - 헤더:', headers);
    const isPracticeFormat = headers.includes('문제유형') || headers.includes('데이터셋URL') || headers.includes('코드템플릿');
    console.log('CSV 로드 - 실습 문제 형식:', isPracticeFormat);
    
    const questions = parseCSV(csvText);
    
    if (questions.length === 0) {
      throw new Error('CSV 파일에 문제가 없습니다.');
    }
    
    return { questions, isPracticeFormat };
  } catch (error) {
    console.error('CSV 로드 오류:', error);
    throw error;
  }
}

/**
 * 인증 코드 검증
 */
export function validateAuthCode(inputCode: string): boolean {
  if (!inputCode || typeof inputCode !== 'string') {
    return false;
  }
  
  const normalizedInput = inputCode.trim().toUpperCase();
  const { AUTH_CODES } = require('@/lib/config');
  
  return AUTH_CODES.some((code: string) => code.toUpperCase() === normalizedInput);
}


