/**
 * 모의고사 설정 데이터
 */

import { ExamData, AnswerData } from '@/types';

// 모의고사 데이터
export const EXAM_DATA: ExamData[] = [
  {
    id: 1,
    title: '1회차 모의고사',
    csvFilename: 'exam1.csv',
    description: 'AICE 자격증 1회차 모의고사',
  },
  {
    id: 2,
    title: '2회차 모의고사',
    csvFilename: 'exam2.csv',
    description: 'AICE 자격증 2회차 모의고사',
  },
  {
    id: 3,
    title: '3회차 모의고사',
    csvFilename: 'exam3.csv',
    description: '빅데이터 분석기사 1회차 모의고사',
  },
];

// 인증 코드 (실제 사용 시 환경 변수로 관리 권장)
export const AUTH_CODES = [
  'AICE2024',
  'BIGDATA2024',
  'TEST1234',
  'DEMO5678',
];

// 정답/해설 PDF 데이터
export const ANSWER_DATA: AnswerData[] = [
  {
    id: 1,
    title: '1회차 정답 및 해설',
    pdfUrl: 'https://example.com/answers/exam1.pdf',
  },
  {
    id: 2,
    title: '2회차 정답 및 해설',
    pdfUrl: 'https://example.com/answers/exam2.pdf',
  },
  {
    id: 3,
    title: '3회차 정답 및 해설',
    pdfUrl: 'https://example.com/answers/exam3.pdf',
  },
];

/**
 * CSV URL 생성
 */
export function getCsvUrl(filename: string): string {
  if (typeof window === 'undefined') {
    // 서버 사이드
    return `/data/${filename}`;
  }
  
  // 클라이언트 사이드
  return `/data/${filename}`;
}

