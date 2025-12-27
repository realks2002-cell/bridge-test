# Vercel 404 오류 해결하기

## 오류 원인
- 배포가 아직 진행 중
- 배포 실패
- 잘못된 URL 접근
- 프로젝트가 제대로 연결되지 않음

## 해결 방법

### 1단계: Vercel 대시보드 확인

1. https://vercel.com 접속
2. 로그인 확인
3. **대시보드**에서 프로젝트 목록 확인
4. **`bridge-mock-exam`** 또는 **`bridge-test`** 프로젝트 찾기

### 2단계: 배포 상태 확인

프로젝트를 클릭하여:
1. **"Deployments"** 탭 확인
2. 최신 배포 상태 확인:
   - ✅ **Ready**: 배포 완료 (정상)
   - 🔄 **Building**: 배포 진행 중 (대기)
   - ❌ **Error**: 배포 실패 (오류 확인 필요)

### 3단계: 배포 실패 시

#### 빌드 오류 확인
1. 실패한 배포 클릭
2. **"Build Logs"** 확인
3. 오류 메시지 확인

#### 일반적인 오류와 해결

**오류: "Build Command failed"**
```bash
# 로컬에서 빌드 테스트
cd C:\Users\COM-JY\Desktop\Task\bridge-mock-exam-nextjs
npm run build
```

**오류: "Module not found"**
- `package.json` 확인
- 의존성 설치 확인

**오류: "TypeScript errors"**
- `tsconfig.json` 확인
- 타입 오류 수정

### 4단계: 프로젝트가 없는 경우

#### 새로 프로젝트 추가
1. Vercel 대시보드에서 **"Add New..."** 클릭
2. **"Import Git Repository"** 선택
3. 저장소 URL 입력: `https://github.com/realks2002-cell/bridge-test`
4. 또는 GitHub 저장소 목록에서 선택
5. Project Name: `bridge-mock-exam` 입력
6. **"Deploy"** 클릭

### 5단계: 올바른 URL 확인

배포 완료 후:
1. 프로젝트 페이지에서 **"Domains"** 탭 확인
2. 배포된 URL 확인:
   - 예: `https://bridge-mock-exam.vercel.app`
   - 또는: `https://bridge-test-xxx.vercel.app`

## 빠른 확인 방법

### 1. 프로젝트 목록 확인
```
https://vercel.com/dashboard
```

### 2. 새 프로젝트 추가
```
https://vercel.com/new
```

### 3. 저장소 URL로 직접 추가
```
https://vercel.com/new?import=https://github.com/realks2002-cell/bridge-test
```

## 배포 재시도

### 방법 1: Vercel 대시보드에서
1. 프로젝트 → **"Deployments"** 탭
2. 최신 배포 → **"Redeploy"** 클릭

### 방법 2: Git 푸시로 재배포
```bash
# 빈 커밋으로 재배포 트리거
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

## 체크리스트

- [ ] Vercel에 로그인되어 있는가?
- [ ] 프로젝트가 생성되어 있는가?
- [ ] GitHub 저장소가 연결되어 있는가?
- [ ] 배포가 진행 중인가? (Building 상태)
- [ ] 배포가 실패했는가? (Error 상태 - 로그 확인)
- [ ] 올바른 URL에 접근하고 있는가?



