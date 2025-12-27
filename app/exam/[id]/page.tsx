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
  const [userCodes, setUserCodes] = useState<{ [questionNum: number]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPracticeFormat, setIsPracticeFormat] = useState(false);

  const exam = EXAM_DATA.find((e) => e.id === examId);

  useEffect(() => {
    if (!exam) {
      setError('모의고사를 찾을 수 없습니다.');
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        console.log('=== 문제 데이터 로드 시작 ===');
        console.log('Exam ID:', examId);
        console.log('Exam:', exam);
        
        const csvUrl = getCsvUrl(exam.csvFilename);
        console.log('CSV URL:', csvUrl);
        
        const { questions, isPracticeFormat } = await loadExamData(csvUrl);
        console.log('로드된 문제 수:', questions.length);
        console.log('실습 문제 형식:', isPracticeFormat);
        console.log('첫 번째 문제:', questions[0]);
        
        setExamData(questions);
        setIsPracticeFormat(isPracticeFormat);
        setIsLoading(false);
        console.log('=== 문제 데이터 로드 완료 ===');
      } catch (err) {
        console.error('=== CSV 로드 오류 ===');
        console.error('Error:', err);
        console.error('Error message:', err instanceof Error ? err.message : String(err));
        console.error('Error stack:', err instanceof Error ? err.stack : 'No stack');
        setError(err instanceof Error ? err.message : '문제를 불러오는 중 오류가 발생했습니다.');
        setIsLoading(false);
      }
    };

    loadData();
  }, [exam]);

  const selectAnswer = (questionNum: number, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionNum]: answer }));
  };

  const updateCode = (questionNum: number, code: string) => {
    setUserCodes((prev) => ({ ...prev, [questionNum]: code }));
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
      
      if (isPracticeFormat) {
        const userCode = userCodes[questionNum] || '';
        const correctAnswer = question.정답;
        // 실습 문제는 코드가 작성되었는지만 확인 (정확한 검증은 Colab에서)
        const isCorrect = userCode.trim() !== '';
        
        if (isCorrect) correctCount++;

        return {
          번호: questionNum,
          문제: question.문제,
          사용자답: userCode || '코드 미작성',
          정답: correctAnswer,
          정오: isCorrect,
          해설: question.해설,
        };
      } else {
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
      }
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

  const answeredCount = isPracticeFormat 
    ? Object.keys(userCodes).filter(key => userCodes[parseInt(key)]?.trim() !== '').length
    : Object.keys(userAnswers).length;
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
              const hasCode = userCodes[questionNum] !== undefined && userCodes[questionNum].trim() !== '';
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
                      <div className="flex gap-2">
                        {question.문제유형 && (
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                            {question.문제유형}
                          </span>
                        )}
                        {question.난이도 && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            {question.난이도}
                          </span>
                        )}
                        {hasCode && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            코드 작성 완료
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-800 leading-relaxed mb-3">{question.문제}</p>
                    {question.데이터셋URL && (
                      <div className="mb-3 p-3 bg-gray-50 rounded-md">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">데이터셋:</span>{' '}
                          <a
                            href={question.데이터셋URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline break-all"
                          >
                            {question.데이터셋URL}
                          </a>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 실습 문제 형식일 때 코드 작성 상자 */}
                  {isPracticeFormat ? (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          코드 작성
                        </label>
                        <a
                          href={exam?.colabUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors text-xs font-medium"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                            />
                          </svg>
                          Colab에서 실행
                        </a>
                      </div>
                      <textarea
                        value={userCodes[questionNum] || ''}
                        onChange={(e) => updateCode(questionNum, e.target.value)}
                        placeholder={question.코드템플릿 || "여기에 Python 코드를 작성하세요..."}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm min-h-[200px] resize-y"
                        style={{ fontFamily: 'monospace' }}
                      />
                      {question.코드템플릿 && (
                        <p className="mt-2 text-xs text-gray-500">
                          💡 힌트: {question.코드템플릿.split('\n')[0]}...
                        </p>
                      )}
                    </div>
                  ) : (
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
                  )}
                </div>
              );
            })}
          </div>

          {/* 제출 버튼 */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 sticky bottom-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
              <div className="text-sm text-gray-600">
                <span className="font-semibold">{answeredCount}</span> /{' '}
                <span>{totalCount}</span> {isPracticeFormat ? '문제 코드 작성 완료' : '문제 풀이 완료'}
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


