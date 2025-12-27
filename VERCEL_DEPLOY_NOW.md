# Vercel 배포하기

## ✅ GitHub 푸시 완료!

코드가 성공적으로 GitHub에 업로드되었습니다:
- 저장소: https://github.com/realks2002-cell/bridge-test
- 브랜치: main

## 🚀 Vercel 배포 단계

### 방법 1: Vercel 웹사이트에서 배포 (권장)

#### 1단계: Vercel 접속 및 로그인
1. https://vercel.com 접속
2. **"Sign Up"** 또는 **"Log In"** 클릭
3. **"Continue with GitHub"** 클릭 (GitHub 계정으로 로그인)

#### 2단계: 프로젝트 추가
1. 대시보드에서 **"Add New..."** 또는 **"Add Project"** 클릭
2. **"Import Git Repository"** 선택
3. GitHub 저장소 목록에서 **`realks2002-cell/bridge-test`** 찾기
4. **"Import"** 클릭

#### 3단계: 프로젝트 설정
1. **Project Name**: `bridge-mock-exam` (또는 원하는 이름, 공백 없이)
2. **Framework Preset**: Next.js (자동 감지됨)
3. **Root Directory**: `./` (기본값)
4. **Build Command**: `npm run build` (자동)
5. **Output Directory**: `.next` (자동)
6. **Install Command**: `npm install` (자동)

#### 4단계: 배포
1. **"Deploy"** 버튼 클릭
2. 배포 진행 상황 확인 (약 1-2분 소요)
3. 배포 완료 후 URL 확인

### 방법 2: Vercel CLI 사용

```bash
# Vercel CLI 설치 (전역)
npm i -g vercel

# Vercel 로그인
vercel login

# 프로젝트 디렉토리에서 배포
cd C:\Users\COM-JY\Desktop\Task\bridge-mock-exam-nextjs
vercel

# 프로덕션 배포
vercel --prod
```

## 📋 배포 후 확인 사항

### 1. 배포 URL 확인
- Vercel 대시보드에서 배포된 URL 확인
- 예: `https://bridge-mock-exam.vercel.app`

### 2. 사이트 테스트
- [ ] 홈 페이지 접속 확인
- [ ] 모바일 안내 페이지 작동 확인
- [ ] 인증 페이지 접속 확인
- [ ] 모의고사 리스트 페이지 확인
- [ ] CSV 파일 접근 확인: `https://your-site.vercel.app/data/exam1.csv`

### 3. CSV 파일 접근 테스트
브라우저에서 직접 접속:
```
https://your-site.vercel.app/data/exam1.csv
```
CSV 파일이 다운로드되거나 내용이 표시되면 정상입니다.

## 🔗 Colab 연동

배포 후 Colab 노트북에서:

```python
import pandas as pd

# Vercel 배포 URL 사용
csv_url = 'https://your-site.vercel.app/data/exam1.csv'
df = pd.read_csv(csv_url, encoding='utf-8')

print(df.head())
```

## 📝 설정 업데이트

배포 후 `lib/config.ts` 파일에서 Colab URL을 실제 노트북 URL로 업데이트:

```typescript
export const EXAM_DATA: ExamData[] = [
  {
    id: 1,
    title: '1회차 모의고사',
    colabUrl: 'https://colab.research.google.com/drive/YOUR_ACTUAL_NOTEBOOK_ID',
    csvFilename: 'exam1.csv',
    description: 'AICE 자격증 1회차 모의고사',
  },
  // ...
];
```

업데이트 후 다시 커밋 및 푸시하면 Vercel이 자동으로 재배포합니다.

## 🎉 완료!

배포가 완료되면:
1. Vercel URL로 사이트 접속 가능
2. CSV 파일이 공개 URL로 접근 가능
3. Colab에서 CSV 파일 사용 가능
4. QR 코드 생성 가능



