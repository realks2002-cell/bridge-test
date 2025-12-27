'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { validateAuthCode } from '@/lib/utils';

export default function AuthPage() {
  const router = useRouter();
  const [authCode, setAuthCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // UX를 위한 짧은 딜레이
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (validateAuthCode(authCode)) {
      // 인증 성공
      router.push('/list');
    } else {
      // 인증 실패
      setError('인증 코드가 올바르지 않습니다. 다시 확인해주세요.');
      setIsLoading(false);
      setAuthCode('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">인증 코드 입력</h2>
          <p className="text-gray-600 text-sm">도서에 기재된 인증 코드를 입력해주세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="auth-code-input"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              인증 코드
            </label>
            <input
              type="text"
              id="auth-code-input"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              autoComplete="off"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-wider uppercase"
              placeholder="인증 코드 입력"
              disabled={isLoading}
            />
            <p className="mt-2 text-xs text-gray-500">대소문자는 구분하지 않습니다.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-800" role="alert">
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium min-h-[44px] ${
              isLoading
                ? 'bg-green-600 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isLoading ? '인증 중...' : '인증하기'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            인증 코드는 도서 내에 기재되어 있습니다.<br />
            문제가 지속되면 출판사에 문의해주세요.
          </p>
        </div>
      </div>
    </div>
  );
}



