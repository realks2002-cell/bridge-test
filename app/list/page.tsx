'use client';

import Link from 'next/link';
import { EXAM_DATA } from '@/lib/config';

export default function ListPage() {
  return (
    <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">브릿지 모의고사</h1>
            <p className="text-gray-600 text-lg">회차를 선택하여 모의고사를 시작하세요.</p>
          </div>
          
          {/* 회차 선택 버튼 */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {EXAM_DATA.map((exam) => (
              <Link
                key={exam.id}
                href={`/exam/${exam.id}`}
                className="block bg-white rounded-lg shadow-md p-8 border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-200 text-center min-h-[200px] flex flex-col justify-center items-center"
              >
                <div className="mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">{exam.id}</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{exam.title}</h2>
                  <p className="text-sm text-gray-600">{exam.description}</p>
                </div>
                <div className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors">
                  문제 풀기
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
  );
}

