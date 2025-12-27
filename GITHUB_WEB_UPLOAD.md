# GitHub 웹사이트에서 직접 파일 업로드하기

## 방법 1: 파일 직접 업로드 (가장 간단)

### 1단계: GitHub 저장소 접속
1. https://github.com/realks2002-cell/bridge-test 접속
2. 로그인 확인

### 2단계: 파일 업로드
1. 저장소 페이지에서 **"Add file"** 버튼 클릭
2. **"Upload files"** 선택

### 3단계: 파일 드래그 앤 드롭
다음 폴더/파일들을 드래그 앤 드롭:

```
업로드할 파일들:
├── app/                    # 전체 폴더
│   ├── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   ├── auth/
│   ├── list/
│   ├── exam/
│   └── result/
├── components/             # 전체 폴더
│   ├── Header.tsx
│   └── Footer.tsx
├── lib/                    # 전체 폴더
│   ├── config.ts
│   └── utils.ts
├── types/                  # 전체 폴더
│   └── index.ts
├── public/                 # 전체 폴더
│   └── data/               # CSV 파일 포함
│       ├── exam1.csv
│       ├── exam2.csv
│       └── exam3.csv
├── package.json
├── next.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.mjs
├── vercel.json
└── README.md
```

### 4단계: 커밋
1. 하단 **"Commit changes"** 섹션
2. **Commit message**: `Initial commit: 브릿지 모의고사 Next.js 프로젝트`
3. **"Commit changes"** 버튼 클릭

## 방법 2: 폴더별로 업로드 (권장)

### 1. 루트 파일 먼저 업로드
```
package.json
next.config.ts
tsconfig.json
tailwind.config.js
postcss.config.mjs
vercel.json
README.md
.gitignore
```

### 2. app 폴더 업로드
- "Add file" → "Upload files"
- `app` 폴더 전체 드래그 앤 드롭

### 3. components 폴더 업로드
- `components` 폴더 전체 드래그 앤 드롭

### 4. lib 폴더 업로드
- `lib` 폴더 전체 드래그 앤 드롭

### 5. types 폴더 업로드
- `types` 폴더 전체 드래그 앤 드롭

### 6. public 폴더 업로드
- `public` 폴더 전체 드래그 앤 드롭 (CSV 파일 포함)

## 주의사항

### 업로드하지 말아야 할 파일
다음 파일들은 `.gitignore`에 포함되어 있으므로 업로드하지 않아도 됩니다:
- `node_modules/` (자동 제외)
- `.next/` (자동 제외)
- `.env.local` (자동 제외)
- `.vercel/` (자동 제외)

### 폴더 구조 유지
- GitHub 웹 인터페이스에서 폴더를 드래그하면 자동으로 폴더 구조가 유지됩니다
- 또는 "Create new file"에서 경로를 입력하여 폴더 생성 가능

## 업로드 후 확인

1. 저장소 페이지에서 파일 목록 확인
2. 모든 파일이 올바른 위치에 있는지 확인
3. `package.json`이 루트에 있는지 확인
4. `public/data/` 폴더에 CSV 파일이 있는지 확인

## Vercel 배포

파일 업로드 완료 후:

1. [Vercel](https://vercel.com) 접속
2. "Add New Project" 클릭
3. GitHub 저장소 `realks2002-cell/bridge-test` 선택
4. Project Name: `bridge-mock-exam`
5. Deploy 클릭

## 팁

- **대용량 파일**: GitHub는 100MB 이상 파일은 업로드 불가
- **파일 개수**: 한 번에 많은 파일을 업로드할 수 있음
- **진행 상황**: 업로드 중 취소 가능
- **폴더 구조**: 드래그 앤 드롭 시 자동으로 폴더 구조 유지



