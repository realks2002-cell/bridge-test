# GitHub에 푸시하기

## 저장소 정보
- **사용자명**: realks2002-cell
- **저장소명**: bridge-test
- **URL**: https://github.com/realks2002-cell/bridge-test.git

## 푸시 명령어 (순서대로 실행)

### 1. 프로젝트 디렉토리로 이동
```bash
cd C:\Users\COM-JY\Desktop\Task\bridge-mock-exam-nextjs
```

### 2. Git 초기화 (아직 안 했다면)
```bash
git init
```

### 3. 파일 추가
```bash
git add .
```

### 4. 첫 커밋 생성
```bash
git commit -m "Initial commit: 브릿지 모의고사 Next.js 프로젝트"
```

### 5. 브랜치 이름 설정
```bash
git branch -M main
```

### 6. 원격 저장소 연결
```bash
git remote add origin https://github.com/realks2002-cell/bridge-test.git
```

### 7. 푸시
```bash
git push -u origin main
```

## 전체 명령어 (한 번에 복사)

```bash
cd C:\Users\COM-JY\Desktop\Task\bridge-mock-exam-nextjs
git init
git add .
git commit -m "Initial commit: 브릿지 모의고사 Next.js 프로젝트"
git branch -M main
git remote add origin https://github.com/realks2002-cell/bridge-test.git
git push -u origin main
```

## 문제 해결

### 오류: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/realks2002-cell/bridge-test.git
```

### 오류: "Authentication failed"
GitHub Personal Access Token 사용:
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token" 클릭
3. 권한 선택: `repo` 체크
4. 토큰 생성 후 복사
5. 비밀번호 입력 시 토큰 사용

### 오류: "nothing to commit"
```bash
# .gitignore 확인
cat .gitignore

# 파일 강제 추가 (필요 시)
git add -f .
```

