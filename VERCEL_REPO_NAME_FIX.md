# Vercel 저장소 이름 충돌 해결

## 문제
`bridge-test`라는 이름이 이미 다른 Git 저장소에서 사용 중입니다.

## 해결 방법

### 방법 1: Private Repository Name 변경 (권장)

**"Private Repository Name"** 필드에 다른 이름 입력:

예시:
- `bridge-mock-exam`
- `bridge-test-nextjs`
- `bridge-exam-system`
- `mock-exam-bridge`

그 다음 **"Deploy"** 클릭

### 방법 2: 기존 저장소 사용

이미 `realks2002-cell/bridge-test` 저장소가 있다면:
1. **"Skip"** 또는 **"Cancel"** 클릭
2. 기존 저장소를 직접 연결

### 방법 3: Git 저장소 생성 건너뛰기

1. **"Skip"** 버튼 클릭 (있는 경우)
2. 또는 **"Deploy without Git"** 선택
3. 나중에 Git 연결 가능

## 추천

**"Private Repository Name"**에 다음 중 하나 입력:
- `bridge-mock-exam` (권장)
- `bridge-test-nextjs`

이렇게 하면:
- Vercel 내부에서만 사용되는 이름
- GitHub 저장소 이름(`bridge-test`)과는 별개
- 충돌 없이 배포 가능



