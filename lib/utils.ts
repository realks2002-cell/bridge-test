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
 * CSV 텍스트 파싱
 */
export function parseCSV(csvText: string): Question[] {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map((h) => h.trim());
  
  const questions: Question[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = parseCSVLine(line);
    
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
  
  return questions;
}

/**
 * CSV 라인 파싱 (쉼표와 따옴표 처리)
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
export async function loadExamData(csvUrl: string): Promise<Question[]> {
  try {
    const response = await fetch(csvUrl);
    
    if (!response.ok) {
      throw new Error(
        `CSV 파일을 불러올 수 없습니다: ${response.status} ${response.statusText}`
      );
    }
    
    const csvText = await response.text();
    const questions = parseCSV(csvText);
    
    if (questions.length === 0) {
      throw new Error('CSV 파일에 문제가 없습니다.');
    }
    
    return questions;
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

