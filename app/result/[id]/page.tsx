'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { EXAM_DATA, ANSWER_DATA } from '@/lib/config';
import { SubmitResult } from '@/types';
import Header from '@/components/Header';

export default function ResultPage() {
  const params = useParams();
  const examId = parseInt(params.id as string);
  const [resultData, setResultData] = useState<SubmitResult | null>(null);

  const exam = EXAM_DATA.find((e) => e.id === examId);
  const answerData = ANSWER_DATA.find((a) => a.id === examId);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('lastExamResult');
      if (stored) {
        try {
          const data = JSON.parse(stored);
          setResultData(data);
        } catch (err) {
          console.error('결과 데이터 파싱 오류:', err);
        }
      }
    }
  }, []);

  if (!resultData) {
    return (
      <>
        <Header currentPage="결과 확인" />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8 text-center">
            <p className="text-gray-600">결과 데이터를 찾을 수 없습니다.</p>
            <Link
              href="/list"
              className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              모의고사 리스트로 돌아가기
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header currentPage="결과 확인" />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">제출이 완료되었습니다</h2>
            <p className="text-gray-600">모의고사 제출이 성공적으로 완료되었습니다.</p>
          </div>

          {/* 점수 표시 */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6 text-center mb-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">{resultData.score}점</div>
            <p className="text-gray-600">
              정답:{' '}
              <span className="font-semibold text-green-600">{resultData.correctCount}</span> / 전체:{' '}
              <span className="font-semibold">{resultData.totalCount}</span>
            </p>
          </div>

          {/* 문제별 결과 */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">문제별 결과</h3>
            <div className="space-y-3">
              {resultData.results.map((result) => {
                const bgColor = result.정오
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200';
                const textColor = result.정오 ? 'text-green-800' : 'text-red-800';

                return (
                  <div key={result.번호} className={`border-2 ${bgColor} rounded-lg p-4`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className={`font-bold ${textColor}`}>문제 {result.번호}</h4>
                      <div className="flex items-center gap-2">
                        {result.정오 ? (
                          <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                            정답
                          </span>
                        ) : (
                          <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">
                            오답
                          </span>
                        )}
                        <svg
                          className={`w-5 h-5 ${textColor}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {result.정오 ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          )}
                        </svg>
                      </div>
                    </div>
                    <p className="text-gray-800 mb-3">{result.문제}</p>
                    <div className="space-y-1 text-sm">
                      <p className={textColor}>
                        <span className="font-semibold">사용자 답:</span>{' '}
                        {result.사용자답 === '미답' ? (
                          <span className="text-gray-500">미답변</span>
                        ) : (
                          result.사용자답
                        )}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">정답:</span> {result.정답}
                      </p>
                      {result.해설 && (
                        <p className="text-gray-600 mt-2 text-xs bg-white p-2 rounded">
                          💡 {result.해설}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 정답/해설 PDF 링크 */}
          {answerData && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">정답 및 해설 PDF</h3>
              <a
                href={answerData.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-3 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors min-h-[44px] flex items-center justify-between"
              >
                <span className="font-medium text-gray-900">{answerData.title}</span>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/list"
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-center font-medium min-h-[44px] flex items-center justify-center"
            >
              모의고사 리스트로 돌아가기
            </Link>
            <Link
              href="/auth"
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-center font-medium min-h-[44px] flex items-center justify-center"
            >
              다른 모의고사 풀기
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

