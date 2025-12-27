# 배포 가이드: Vercel + Colab 연동

## 📋 배포 전략

### 파일 구분

```
프로젝트 구조:
├── Next.js 웹 애플리케이션 (Vercel 배포)
│   ├── app/              # Next.js 페이지
│   ├── components/       # React 컴포넌트
│   ├── lib/              # 유틸리티 함수
│   └── public/           # 정적 파일
│       └── data/         # CSV 파일 (Colab에서 사용)
│
└── Colab 노트북 (별도 관리)
    └── *.ipynb           # Google Colab 노트북 파일
```

## 🚀 1단계: Vercel에 Next.js 배포

### 방법 A: Vercel CLI 사용 (권장)

```bash
# 1. 프로젝트 디렉토리로 이동
cd bridge-mock-exam-nextjs

# 2. Vercel CLI 설치 (전역)
npm i -g vercel

# 3. Vercel 로그인
vercel login

# 4. 프로젝트 배포
vercel

# 5. 프로덕션 배포
vercel --prod
```

### 방법 B: GitHub 연동 (자동 배포)

#### 1. GitHub 저장소 생성

```bash
# Git 초기화 (이미 되어 있다면 생략)
git init

# .gitignore 확인 (node_modules, .next 등 제외)
# 이미 설정되어 있음

# 파일 추가
git add .

# 커밋
git commit -m "Initial commit: 브릿지 모의고사 Next.js 프로젝트"

# GitHub 저장소 생성 후
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

#### 2. Vercel에 연결

1. [Vercel](https://vercel.com) 접속 → 로그인
2. "Add New Project" 클릭
3. GitHub 저장소 선택
4. 프로젝트 설정:
   - **Framework Preset**: Next.js (자동 감지)
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `npm run build` (자동)
   - **Output Directory**: `.next` (자동)
5. "Deploy" 클릭

#### 3. 환경 변수 설정 (선택사항)

Vercel 대시보드 → Project Settings → Environment Variables:

```env
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
```

### 배포 확인

- 배포 완료 후: `https://your-project.vercel.app` 접속
- 자동 배포: GitHub에 푸시할 때마다 자동 재배포

## 📊 2단계: CSV 파일을 Colab에서 사용

### 방법 1: Vercel 배포된 URL 사용 (권장)

Vercel에 배포하면 `public/data/` 폴더의 파일들이 자동으로 공개됩니다.

**CSV URL 형식:**
```
https://your-project.vercel.app/data/exam1.csv
https://your-project.vercel.app/data/exam2.csv
https://your-project.vercel.app/data/exam3.csv
```

**Colab 노트북에서 사용:**
```python
import pandas as pd

# Vercel 배포 URL 사용
csv_url = 'https://your-project.vercel.app/data/exam1.csv'
df = pd.read_csv(csv_url, encoding='utf-8')

print(df.head())
```

### 방법 2: GitHub Raw URL 사용

#### 1. CSV 파일을 GitHub에 업로드

```bash
# public/data 폴더의 CSV 파일들이 이미 GitHub에 포함됨
# 또는 별도 저장소에 업로드
```

#### 2. GitHub Raw URL 생성

1. GitHub 저장소에서 CSV 파일 클릭
2. "Raw" 버튼 클릭
3. URL 복사:
   ```
   https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/public/data/exam1.csv
   ```

#### 3. Colab에서 사용

```python
import pandas as pd

# GitHub Raw URL 사용
csv_url = 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/public/data/exam1.csv'
df = pd.read_csv(csv_url, encoding='utf-8')
```

### 방법 3: Google Drive 사용

#### 1. CSV 파일을 Google Drive에 업로드

#### 2. 공유 설정
- 파일 우클릭 → "공유"
- "링크가 있는 모든 사용자" 선택
- 파일 ID 확인 (URL에서 `id=` 뒤의 값)

#### 3. Colab에서 사용

```python
import pandas as pd

file_id = 'YOUR_FILE_ID'
url = f'https://drive.google.com/uc?export=download&id={file_id}'
df = pd.read_csv(url, encoding='utf-8')
```

## 🔗 3단계: Colab 노트북과 연동

### Colab 노트북 설정

```python
# 셀 1: 라이브러리 import
import pandas as pd
import numpy as np

# 셀 2: CSV 데이터 로드
# 방법 1: Vercel URL 사용
exam1_url = 'https://your-project.vercel.app/data/exam1.csv'
df = pd.read_csv(exam1_url, encoding='utf-8')

# 방법 2: GitHub Raw URL 사용
# exam1_url = 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/public/data/exam1.csv'
# df = pd.read_csv(exam1_url, encoding='utf-8')

# 셀 3: 데이터 확인
print(f"총 문제 수: {len(df)}")
print("\n데이터 미리보기:")
print(df.head())

# 셀 4: 문제 풀이 시작
print("\n=== 모의고사 시작 ===")
for idx, row in df.iterrows():
    print(f"\n문제 {row['문제번호']}: {row['문제']}")
    print(f"① {row['선택지1']}")
    print(f"② {row['선택지2']}")
    print(f"③ {row['선택지3']}")
    print(f"④ {row['선택지4']}")
    
    answer = input("답을 입력하세요 (1-4): ")
    # 답안 처리 로직...
```

### Colab 노트북 공유 및 URL 생성

1. Colab 노트북에서 "공유" 클릭
2. "링크가 있는 모든 사용자" 선택
3. 노트북 URL 복사:
   ```
   https://colab.research.google.com/drive/YOUR_NOTEBOOK_ID
   ```

### Next.js 설정 파일 업데이트

`lib/config.ts` 파일 수정:

```typescript
export const EXAM_DATA: ExamData[] = [
  {
    id: 1,
    title: '1회차 모의고사',
    colabUrl: 'https://colab.research.google.com/drive/YOUR_NOTEBOOK_ID_1',
    csvFilename: 'exam1.csv', // Vercel 배포 시 자동으로 /data/exam1.csv 접근
    description: 'AICE 자격증 1회차 모의고사',
  },
  // ...
];
```

## 📁 파일 배포 위치 정리

### Vercel에 배포되는 파일

```
✅ 배포됨:
- app/                    # Next.js 페이지
- components/             # React 컴포넌트
- lib/                     # 유틸리티
- public/                  # 정적 파일 (CSV 포함)
- package.json
- next.config.ts
- tsconfig.json
- vercel.json

❌ 배포 안 됨 (.gitignore):
- node_modules/
- .next/
- .env.local
```

### Colab에서 사용하는 파일

```
✅ Colab에서 접근:
- public/data/exam1.csv   # Vercel URL로 접근
- public/data/exam2.csv
- public/data/exam3.csv

📝 Colab 노트북:
- 별도로 Google Colab에 저장
- GitHub에 .ipynb 파일 업로드 (선택사항)
```

## 🔄 배포 워크플로우

### 초기 배포

```bash
# 1. 코드 작성 및 테스트
npm run dev

# 2. 빌드 테스트
npm run build

# 3. GitHub에 푸시
git add .
git commit -m "배포 준비"
git push origin main

# 4. Vercel 자동 배포 (GitHub 연동 시)
# 또는 vercel --prod
```

### CSV 파일 업데이트

```bash
# 1. CSV 파일 수정
# public/data/exam1.csv 편집

# 2. 커밋 및 푸시
git add public/data/exam1.csv
git commit -m "CSV 파일 업데이트"
git push origin main

# 3. Vercel 자동 재배포
# CSV 파일은 즉시 반영됨
```

### Colab 노트북 업데이트

1. Colab에서 노트북 수정
2. 저장 (자동 저장됨)
3. URL은 변경되지 않음 (같은 노트북 ID 사용)

## ✅ 배포 체크리스트

### Vercel 배포 전

- [ ] `npm run build` 성공 확인
- [ ] `lib/config.ts`의 Colab URL 업데이트
- [ ] CSV 파일이 `public/data/`에 있는지 확인
- [ ] 환경 변수 설정 (필요 시)

### 배포 후 확인

- [ ] Vercel URL 접속 테스트
- [ ] 모든 페이지 정상 작동 확인
- [ ] CSV 파일 접근 가능 확인
  - `https://your-project.vercel.app/data/exam1.csv` 직접 접속
- [ ] Colab에서 CSV 로드 테스트
- [ ] 모바일 안내 페이지 테스트

## 🎯 최종 구조

```
GitHub 저장소
├── Next.js 소스 코드
│   └── public/data/*.csv  # CSV 파일 포함
│
Vercel 배포
└── https://your-project.vercel.app
    ├── 웹 애플리케이션
    └── /data/*.csv        # 공개 접근 가능

Google Colab
└── 노트북 파일 (*.ipynb)
    └── CSV URL 참조: https://your-project.vercel.app/data/exam1.csv
```

## 🚨 주의사항

1. **CSV 파일은 공개 접근 가능해야 함**
   - `public/` 폴더에 있는 파일은 자동으로 공개됨
   - 민감한 정보는 포함하지 않기

2. **Colab 노트북 공유 설정**
   - "링크가 있는 모든 사용자"로 설정해야 접근 가능

3. **CORS 문제**
   - Vercel 배포 시 CORS는 자동 처리됨
   - 로컬 개발 시 문제가 있을 수 있음

4. **캐싱**
   - CSV 파일 업데이트 후 브라우저 캐시 클리어 필요할 수 있음



