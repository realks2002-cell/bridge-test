# Git 설정 및 배포 가이드

## 오류 해결: "src refspec main does not match any"

이 오류는 다음 중 하나의 문제입니다:
1. 커밋이 없음
2. 브랜치가 없음
3. 원격 저장소가 설정되지 않음

## 단계별 해결 방법

### 1단계: Git 초기화 확인

```bash
cd ../bridge-mock-exam-nextjs
git status
```

### 2단계: 파일 추가 및 커밋

```bash
# 파일 추가
git add .

# 첫 커밋 생성
git commit -m "Initial commit: 브릿지 모의고사 Next.js 프로젝트"

# 브랜치 확인 (main 또는 master)
git branch
```

### 3단계: 브랜치 이름 확인 및 변경

```bash
# 현재 브랜치 확인
git branch

# main 브랜치가 없으면 생성
git branch -M main

# 또는 master 브랜치 사용
git branch -M master
```

### 4단계: GitHub 저장소 생성

1. [GitHub](https://github.com) 접속
2. 우측 상단 `+` → `New repository` 클릭
3. 저장소 이름 입력 (예: `bridge-mock-exam`)
4. `Public` 선택 (무료 GitHub Pages 사용 시)
5. **README, .gitignore, license 추가하지 않기** (이미 있음)
6. `Create repository` 클릭

### 5단계: 원격 저장소 연결

```bash
# 기존 원격 저장소 확인
git remote -v

# 원격 저장소 제거 (잘못 설정된 경우)
git remote remove origin

# 올바른 원격 저장소 추가 (YOUR_USERNAME과 YOUR_REPO_NAME을 실제 값으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 원격 저장소 확인
git remote -v
```

### 6단계: 푸시

```bash
# main 브랜치로 푸시
git push -u origin main

# 또는 master 브랜치인 경우
git push -u origin master
```

## 전체 명령어 순서 (한 번에)

```bash
# 1. 디렉토리 이동
cd ../bridge-mock-exam-nextjs

# 2. Git 초기화 (이미 되어 있다면 생략)
git init

# 3. 파일 추가
git add .

# 4. 커밋
git commit -m "Initial commit: 브릿지 모의고사 Next.js 프로젝트"

# 5. 브랜치 이름 확인 및 설정
git branch -M main

# 6. 원격 저장소 추가 (실제 GitHub URL로 변경)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 7. 푸시
git push -u origin main
```

## 문제 해결

### 오류: "fatal: not a git repository"

**해결:**
```bash
git init
```

### 오류: "nothing to commit"

**해결:**
```bash
# 파일이 있는지 확인
ls

# .gitignore 확인
cat .gitignore

# 강제로 추가 (필요 시)
git add -f .
```

### 오류: "remote origin already exists"

**해결:**
```bash
# 기존 원격 저장소 제거
git remote remove origin

# 새로 추가
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### 오류: "Authentication failed"

**해결:**
1. GitHub Personal Access Token 사용:
   - GitHub → Settings → Developer settings → Personal access tokens
   - 토큰 생성 후 비밀번호 대신 사용

2. 또는 SSH 키 사용:
   ```bash
   git remote set-url origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
   ```

## Vercel 배포

GitHub에 푸시한 후:

1. [Vercel](https://vercel.com) 접속
2. "Add New Project" 클릭
3. GitHub 저장소 선택
4. Project Name: `bridge-mock-exam`
5. Deploy 클릭



