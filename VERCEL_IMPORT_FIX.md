# Vercel에서 저장소 찾기 문제 해결

## 문제
Vercel이 `KS-Tech-DEPT` 계정과 연결되어 있어서 `realks2002-cell` 저장소가 보이지 않습니다.

## 해결 방법

### 방법 1: 저장소 URL 직접 입력 (가장 빠름!)

1. 화면 상단의 **"Enter a Git repository URL to deploy…"** 입력란 찾기
2. 다음 URL 입력:
   ```
   https://github.com/realks2002-cell/bridge-test
   ```
3. **"Continue"** 또는 **"Import"** 클릭

### 방법 2: GitHub 계정 추가/전환

1. Vercel 대시보드 우측 상단 **프로필 아이콘** 클릭
2. **"Settings"** 클릭
3. 왼쪽 메뉴에서 **"Git"** 또는 **"Connected Accounts"** 클릭
4. **"Add Account"** 또는 **"Connect GitHub"** 클릭
5. `realks2002-cell` 계정으로 로그인
6. 권한 승인

### 방법 3: "Other" 옵션 사용

1. **"Other"** 섹션 찾기
2. 클릭하여 저장소 URL 입력 옵션 확인
3. 저장소 URL 입력: `https://github.com/realks2002-cell/bridge-test`

## 추천: 방법 1 (URL 직접 입력)

가장 빠르고 간단합니다:

1. **"Enter a Git repository URL to deploy…"** 입력란에:
   ```
   https://github.com/realks2002-cell/bridge-test
   ```
2. Enter 키 누르거나 **"Continue"** 클릭
3. Project Name: `bridge-mock-exam` 입력
4. **"Deploy"** 클릭

