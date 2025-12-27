# 브릿지 모의고사 웹 시스템 (Next.js)

Google Colab 기반 교육용 모의고사 브릿지 웹 시스템입니다.

## 기술 스택

- **Frontend**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Hosting**: Vercel (권장)

## 주요 기능

- 📱 모바일 안내 페이지
- 🔐 인증 페이지
- 📋 모의고사 리스트
- ✍️ 웹 화면에서 문제 풀이
- ✅ 결과 확인 및 정답/해설 제공

## 개발 환경 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 3. 프로덕션 빌드

```bash
npm run build
npm start
```

## 프로젝트 구조

```
.
├── app/                    # Next.js App Router 페이지
│   ├── page.tsx           # 홈 페이지 (모바일 안내)
│   ├── auth/              # 인증 페이지
│   ├── list/              # 모의고사 리스트
│   ├── exam/[id]/         # 문제 풀이 페이지
│   └── result/[id]/       # 결과 페이지
├── components/            # 공통 컴포넌트
│   ├── Header.tsx
│   └── Footer.tsx
├── lib/                   # 유틸리티 및 설정
│   ├── config.ts         # 모의고사 설정
│   └── utils.ts          # 유틸리티 함수
├── types/                # TypeScript 타입 정의
│   └── index.ts
└── public/               # 정적 파일
    └── data/             # CSV 파일
```

## 설정

### 인증 코드 설정

`lib/config.ts` 파일에서 `AUTH_CODES` 배열을 수정:

```typescript
export const AUTH_CODES = [
  'YOUR_CODE_1',
  'YOUR_CODE_2',
];
```

### 모의고사 데이터 설정

`lib/config.ts` 파일에서 `EXAM_DATA` 배열을 수정:

```typescript
export const EXAM_DATA: ExamData[] = [
  {
    id: 1,
    title: '1회차 모의고사',
    colabUrl: 'https://colab.research.google.com/drive/YOUR_NOTEBOOK_ID',
    csvFilename: 'exam1.csv',
    description: '모의고사 설명',
  },
];
```

## Vercel 배포

### 방법 1: Vercel CLI

```bash
npm i -g vercel
vercel
```

### 방법 2: GitHub 연동

1. GitHub에 코드 푸시
2. [Vercel](https://vercel.com)에 로그인
3. "Add New Project" 클릭
4. GitHub 저장소 선택
5. 자동으로 배포됨

## 환경 변수 (선택사항)

`.env.local` 파일 생성:

```env
NEXT_PUBLIC_SITE_URL=https://your-site.vercel.app
```

## 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.
