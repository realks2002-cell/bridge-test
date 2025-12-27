'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { isMobileDevice, copyToClipboard } from '@/lib/utils';

export default function HomePage() {
  const [isMobile, setIsMobile] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  const handleCopyUrl = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 입력 필드 클릭 시 자동 선택
  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.currentTarget.select();
  };

  if (isMobile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">PC 접속이 필요합니다</h2>
            <p className="text-gray-600">모의고사는 PC 환경에서만 이용 가능합니다.</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">PC에서 접속하는 방법</h3>
              <ol className="list-decimal list-inside space-y-2 text-blue-800 text-sm">
                <li>아래 URL을 복사하세요</li>
                <li>PC 브라우저(Chrome, Edge, Firefox)에서 붙여넣기하세요</li>
                <li>인증 코드를 입력하고 모의고사를 시작하세요</li>
              </ol>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                현재 페이지 URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={typeof window !== 'undefined' ? window.location.href : ''}
                  onClick={handleInputClick}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleCopyUrl}
                  className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors min-w-[100px] min-h-[44px] ${
                    copied
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {copied ? '복사 완료!' : 'URL 복사'}
                </button>
              </div>
            </div>

            {/* 모바일 → PC 전달 방법 안내 */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">📱 모바일에서 PC로 URL 전달하는 방법</h3>
              <div className="space-y-2 text-green-800 text-sm">
                <div className="flex items-start gap-2">
                  <span className="font-semibold">방법 1:</span>
                  <span>위의 URL 입력 필드를 길게 눌러 "복사" 선택</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold">방법 2:</span>
                  <span>URL 복사 버튼 클릭 → 메시지/이메일로 본인에게 전송</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold">방법 3:</span>
                  <span>클라우드 클립보드 앱 사용 (예: Pushbullet, KDE Connect)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold">방법 4:</span>
                  <span>QR 코드를 다시 스캔 (PC에서도 QR 스캔 가능)</span>
                </div>
              </div>
            </div>

            {/* 빠른 전송 버튼들 */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-3">빠른 전송</h3>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`sms:?body=${encodeURIComponent(
                    typeof window !== 'undefined' ? window.location.href : ''
                  )}`}
                  className="px-4 py-2 bg-white border border-purple-300 rounded-md hover:bg-purple-50 text-center text-sm font-medium text-purple-700"
                >
                  📱 문자로 전송
                </a>
                <a
                  href={`mailto:?subject=모의고사%20접속%20URL&body=${encodeURIComponent(
                    typeof window !== 'undefined' ? window.location.href : ''
                  )}`}
                  className="px-4 py-2 bg-white border border-purple-300 rounded-md hover:bg-purple-50 text-center text-sm font-medium text-purple-700"
                >
                  📧 이메일로 전송
                </a>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/auth"
              className="inline-block px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
            >
              PC에서 접속했다면 계속하기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          브릿지 모의고사에 오신 것을 환영합니다
        </h2>
        <p className="text-gray-600 mb-6">
          Google Colab 기반 교육용 모의고사 시스템입니다.
        </p>
        <Link
          href="/auth"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium min-h-[44px] flex items-center justify-center"
        >
          인증 페이지로 이동
        </Link>
      </div>
    </div>
  );
}
