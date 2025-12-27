# Vercel 배포 가이드

## 프로젝트 이름 규칙

Vercel 프로젝트 이름은 다음 규칙을 따라야 합니다:
- 최대 100자
- **소문자만** 사용
- 허용 문자: 영문자, 숫자, `.`, `_`, `-`
- **공백 불가능**
- `---` (연속된 하이픈 3개) 불가능

## 올바른 프로젝트 이름 예시

✅ **사용 가능:**
- `bridge-test`
- `bridge-mock-exam`
- `bridge_test`
- `bridgetest`
- `bridge-mock-exam-nextjs`

❌ **사용 불가능:**
- `bridge test` (공백 포함)
- `Bridge Test` (대문자 포함)
- `bridge---test` (연속된 하이픈 3개)

## 배포 방법

### 방법 1: Vercel CLI 사용

```bash
cd ../bridge-mock-exam-nextjs

# Vercel 배포 (프로젝트 이름 지정)
vercel --name bridge-mock-exam

# 또는 대화형으로 진행 (이름 입력 시 공백 없이)
vercel
# 프로젝트 이름: bridge-mock-exam (공백 없이!)
```

### 방법 2: vercel.json에 이름 지정

`vercel.json` 파일 수정:

```json
{
  "name": "bridge-mock-exam",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

그 다음:
```bash
vercel --prod
```

### 방법 3: GitHub 연동 (권장)

1. GitHub에 코드 푸시
2. Vercel 웹사이트에서:
   - "Add New Project" 클릭
   - GitHub 저장소 선택
   - **Project Name**: `bridge-mock-exam` (공백 없이 입력)
   - Deploy 클릭

## 문제 해결

### 오류: "Project names can be up to 100 characters long..."

**해결 방법:**
1. 프로젝트 이름에 공백이 있는지 확인
2. 대문자가 있는지 확인
3. 소문자와 하이픈만 사용: `bridge-mock-exam`

### 오류: "The provided path does not exist"

**해결 방법:**
```bash
# 현재 디렉토리 확인
pwd  # 또는 Windows: cd

# 올바른 디렉토리로 이동
cd ../bridge-mock-exam-nextjs

# 경로는 ./ 또는 . 만 사용
vercel
# In which directory is your code located? ./
```

## 추천 프로젝트 이름

- `bridge-mock-exam` (권장)
- `bridge-test`
- `mock-exam-bridge`
- `bridge-exam-system`



