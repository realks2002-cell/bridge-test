/**
 * 타입 정의
 */

// 모의고사 데이터 타입
export interface ExamData {
  id: number;
  title: string;
  colabUrl: string; // Google Colab 노트북 URL
  csvFilename: string;
  description: string;
}

// 문제 타입
export interface Question {
  번호: string;
  문제: string;
  선택지1: string;
  선택지2: string;
  선택지3: string;
  선택지4: string;
  정답: string;
  해설: string;
  코드템플릿?: string; // 실습 문제용
  데이터셋URL?: string; // 실습 문제용
  문제유형?: string; // 실습 문제용
  난이도?: string; // 실습 문제용
}

// 사용자 답안 타입
export interface UserAnswer {
  [questionNum: number]: string;
}

// 시험 결과 타입
export interface ExamResult {
  번호: number;
  문제: string;
  사용자답: string;
  정답: string;
  정오: boolean;
  해설: string;
}

// 제출 결과 타입
export interface SubmitResult {
  examId: number;
  examTitle: string;
  score: number;
  correctCount: number;
  totalCount: number;
  results: ExamResult[];
  submittedAt: string;
}

// 정답/해설 PDF 타입
export interface AnswerData {
  id: number;
  title: string;
  pdfUrl: string;
}

