# GitHub 인증 문제 해결

## 문제
- 현재 로그인된 계정: `KS-Tech-DEPT`
- 접근하려는 저장소: `realks2002-cell/bridge-test`
- 오류: Permission denied (403)

## 해결 방법

### 방법 1: Personal Access Token 사용 (권장)

#### 1. GitHub에서 토큰 생성

1. GitHub에 `realks2002-cell` 계정으로 로그인
2. 우측 상단 프로필 → **Settings**
3. 왼쪽 메뉴 하단 → **Developer settings**
4. **Personal access tokens** → **Tokens (classic)**
5. **Generate new token (classic)** 클릭
6. 설정:
   - **Note**: `bridge-test` (설명)
   - **Expiration**: 원하는 기간 선택
   - **Select scopes**: `repo` 체크 (모든 권한)
7. **Generate token** 클릭
8. **토큰 복사** (한 번만 표시됨! 저장해두기)

#### 2. Windows 자격 증명 제거

```bash
# Windows 자격 증명 관리자에서 GitHub 자격 증명 제거
# 제어판 → 자격 증명 관리자 → Windows 자격 증명
# 또는 명령어로:
cmdkey /list
cmdkey /delete:git:https://github.com
```

또는 PowerShell:
```powershell
# 자격 증명 확인
git config --global credential.helper
git config --global --unset credential.helper
git config --system --unset credential.helper
```

#### 3. 푸시 시 토큰 사용

```bash
# 푸시 시도
git push -u origin main

# Username: realks2002-cell 입력
# Password: (여기에 Personal Access Token 붙여넣기)
```

### 방법 2: Git 자격 증명 직접 설정

```bash
# 사용자명 설정
git config --global user.name "realks2002-cell"
git config --global user.email "your-email@example.com"

# 자격 증명 헬퍼 설정
git config --global credential.helper wincred

# 푸시 시도 (토큰 사용)
git push -u origin main
```

### 방법 3: URL에 토큰 포함 (임시)

```bash
# 원격 저장소 URL에 토큰 포함 (보안상 권장하지 않음)
git remote set-url origin https://YOUR_TOKEN@github.com/realks2002-cell/bridge-test.git

# 푸시
git push -u origin main
```

## 단계별 해결 (권장)

### 1단계: Personal Access Token 생성
- GitHub → Settings → Developer settings → Personal access tokens
- `repo` 권한으로 토큰 생성

### 2단계: Windows 자격 증명 제거
```powershell
# PowerShell에서 실행
cmdkey /list | Select-String "github"
# GitHub 관련 자격 증명이 있으면:
cmdkey /delete:git:https://github.com
```

### 3단계: 푸시
```bash
git push -u origin main
# Username: realks2002-cell
# Password: [Personal Access Token 붙여넣기]
```

## 자동 저장 설정 (선택사항)

토큰을 매번 입력하지 않으려면:

```bash
# Git Credential Manager 사용
git config --global credential.helper manager-core

# 또는 Windows Credential Manager
git config --global credential.helper wincred
```

## 확인

```bash
# 현재 Git 설정 확인
git config --global user.name
git config --global user.email
git config --global credential.helper

# 원격 저장소 확인
git remote -v
```



