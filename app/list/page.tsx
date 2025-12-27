'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { EXAM_DATA, getCsvUrl } from '@/lib/config';
import { copyToClipboard } from '@/lib/utils';

export default function ListPage() {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopyCsv = async (examId: number, csvUrl: string) => {
    const success = await copyToClipboard(csvUrl);
    if (success) {
      setCopiedId(examId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">모의고사 리스트</h2>
          <p className="text-gray-600">회차를 선택하여 모의고사를 시작하세요.</p>
        </div>

        <div className="space-y-4">
          {EXAM_DATA.map((exam) => {
            const csvUrl = getCsvUrl(exam.csvFilename);
            const isCopied = copiedId === exam.id;

            return (
              <div
                key={exam.id}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{exam.title}</h3>
                  <p className="text-sm text-gray-600">{exam.description}</p>
                </div>

                <div className="space-y-3">
                  {/* CSV URL 복사 섹션 */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CSV 데이터 URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={csvUrl}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleCopyCsv(exam.id, csvUrl)}
                        className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm font-medium min-w-[100px] min-h-[44px] ${
                          isCopied
                            ? 'bg-green-600 text-white'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isCopied ? '복사 완료!' : '복사'}
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Colab 노트북에서{' '}
                      <code className="bg-gray-200 px-1 rounded">pd.read_csv('URL')</code> 형태로
                      사용하세요.
                    </p>
                  </div>

                  {/* Colab 노트북 열기 버튼 (주요 방법) */}
                  <a
                    href={exam.colabUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors text-center font-medium min-h-[44px] mb-3"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="w-5 h-5"
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
                      Colab 노트북 열기
                    </span>
                  </a>

                  {/* 웹에서 문제 풀기 버튼 (선택사항) */}
                  <Link
                    href={`/exam/${exam.id}`}
                    className="block w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-center font-medium min-h-[44px]"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      웹에서 문제 풀기 (선택사항)
                    </span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

