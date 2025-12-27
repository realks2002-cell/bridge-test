'use client';

import Link from 'next/link';

interface HeaderProps {
  currentPage?: string;
}

export default function Header({ currentPage = '홈' }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-gray-900">브릿지 모의고사</h1>
          </Link>
          <div className="text-sm text-gray-600">
            <span>{currentPage}</span>
          </div>
        </div>
      </nav>
    </header>
  );
}



