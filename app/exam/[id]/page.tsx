'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { EXAM_DATA, getCsvUrl } from '@/lib/config';
import { loadExamData } from '@/lib/utils';
import { Question, UserAnswer, SubmitResult, ExamResult } from '@/types';
import Header from '@/components/Header';

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  const examId = parseInt(params.id as string);

  const [examData, setExamData] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const exam = EXAM_DATA.find((e) => e.id === examId);

  useEffect(() => {
    if (!exam) {
      setError('모의고사를 찾을 수 없습니다.');
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const csvUrl = getCsvUrl(exam.csvFilename);
        const data = await loadExamData(csvUrl);
        setExamData(data);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : '문제를 불러오는 중 오류가 발생했습니다.');
        setIsLoading(false);
      }
    };

    loadData();
  }, [exam]);

  const selectAnswer = (questionNum: number, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionNum]: answer }));
  };

  const resetAnswers = () => {
    if (confirm('모든 답안을 초기화하시겠습니까?')) {
      setUserAnswers({});
    }
  };

  const submitExam = () => {
    if (!exam) return;

    let correctCount = 0;
    const results: ExamResult[] = examData.map((question, index) => {
      const questionNum = index + 1;
      const userAnswer = userAnswers[questionNum];
      const correctAnswer = question.정답;
      const isCorrect = userAnswer === correctAnswer;

      if (isCorrect) correctCount++;

      return {
        번호: questionNum,
        문제: question.문제,
        사용자답: userAnswer || '미답',
        정답: correctAnswer,
        정오: isCorrect,
        해설: question.해설,
      };
    });

    const score = Math.round((correctCount / examData.length) * 100);

    const resultData: SubmitResult = {
      examId: exam.id,
      examTitle: exam.title,
      score,
      correctCount,
      totalCount: examData.length,
      results,
      submittedAt: new Date().toISOString(),
    };

    // localStorage에 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem('lastExamResult', JSON.stringify(resultData));
    }

    // 결과 페이지로 이동
    router.push(`/result/${exam.id}`);
  };

  const answeredCount = Object.keys(userAnswers).length;
  const totalCount = examData.length;
  const progress = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;
  const canSubmit = answeredCount === totalCount && totalCount > 0;

  if (isLoading) {
    return (
      <>
        <Header currentPage={exam?.title || '문제 풀이'} />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">문제를 불러오는 중...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header currentPage="오류" />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-red-600 flex-shrink-0 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-2">문제를 불러올 수 없습니다</h3>
                <div className="text-sm text-red-800">{error}</div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header currentPage={exam?.title || '문제 풀이'} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 진행률 표시 */}
          <div className="mb-6 text-right text-sm font-medium text-blue-600">
            진행률: {progress}%
          </div>

          {/* 문제 리스트 */}
          <div className="space-y-6 mb-8">
            {examData.map((question, index) => {
              const questionNum = index + 1;
              const isAnswered = userAnswers[questionNum] !== undefined;
              const answerClass = isAnswered
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300';

              return (
                <div
                  key={questionNum}
                  className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
                >
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        문제 {question.번호 || questionNum}
                      </h3>
                      {isAnswered && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          답변 완료
                        </span>
                      )}
                    </div>
                    <p className="text-gray-800 leading-relaxed">{question.문제}</p>
                  </div>

                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((num) => {
                      const choiceKey = `선택지${num}` as keyof Question;
                      const choice = question[choiceKey];
                      const value = String(num);

                      return (
                        <label
                          key={num}
                          className={`flex items-center p-3 border-2 ${answerClass} rounded-md cursor-pointer hover:bg-gray-50 transition-colors`}
                        >
                          <input
                            type="radio"
                            name={`question-${questionNum}`}
                            value={value}
                            checked={userAnswers[questionNum] === value}
                            onChange={() => selectAnswer(questionNum, value)}
                            className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-3 text-gray-700">
                            {['①', '②', '③', '④'][num - 1]} {choice}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 제출 버튼 */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 sticky bottom-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
              <div className="text-sm text-gray-600">
                <span className="font-semibold">{answeredCount}</span> /{' '}
                <span>{totalCount}</span> 문제 풀이 완료
              </div>
              <div className="flex gap-3">
                <button
                  onClick={resetAnswers}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium min-h-[44px]"
                >
                  초기화
                </button>
                <button
                  onClick={submitExam}
                  disabled={!canSubmit}
                  className={`px-6 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium min-h-[44px] ${
                    canSubmit
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-400 text-white cursor-not-allowed'
                  }`}
                >
                  제출하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

