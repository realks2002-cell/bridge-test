# Windows 자격 증명 제거 및 재인증

## 문제
Windows에 `KS-Tech-DEPT` 계정 정보가 저장되어 있어서, Personal Access Token을 사용해도 이전 계정으로 인증되고 있습니다.

## 해결 방법

### 방법 1: Windows 자격 증명 관리자에서 제거 (권장)

#### PowerShell에서 실행:
```powershell
# GitHub 자격 증명 제거
cmdkey /delete:git:https://github.com

# 또는 모든 GitHub 자격 증명 제거
cmdkey /list | Select-String "github"
# 나오는 항목들을 하나씩 삭제:
cmdkey /delete:git:https://github.com
```

#### 수동으로 제거:
1. **제어판** 열기
2. **자격 증명 관리자** 검색
3. **Windows 자격 증명** 클릭
4. `git:https://github.com` 찾기
5. 클릭 → **제거** 또는 **편집** → 삭제

### 방법 2: Git 자격 증명 캐시 제거

```bash
# Git 자격 증명 캐시 제거
git config --global --unset credential.helper
git config --system --unset credential.helper

# 또는
git credential-manager-core erase
```

### 방법 3: URL에 토큰 포함 (임시 해결)

```bash
# 원격 저장소 URL에 토큰 포함
git remote set-url origin https://YOUR_TOKEN@github.com/realks2002-cell/bridge-test.git

# YOUR_TOKEN을 실제 토큰으로 교체
# 예: https://ghp_xxxxxxxxxxxx@github.com/realks2002-cell/bridge-test.git

# 푸시
git push -u origin main
```

## 단계별 해결 (권장)

### 1단계: 자격 증명 제거
PowerShell에서:
```powershell
cmdkey /delete:git:https://github.com
```

### 2단계: Git 설정 확인
```bash
git remote -v
# 올바른 URL인지 확인: https://github.com/realks2002-cell/bridge-test.git
```

### 3단계: 푸시 (새로운 인증)
```bash
git push -u origin main
```

프롬프트가 나타나면:
- **Username**: `realks2002-cell`
- **Password**: (Personal Access Token 붙여넣기)

## 방법 4: GitHub 웹사이트에서 직접 업로드 (가장 간단)

Git 인증 문제를 피하려면 웹사이트에서 직접 업로드하세요:

1. https://github.com/realks2002-cell/bridge-test/upload/main 접속
2. 파일 드래그 앤 드롭
3. Commit changes 클릭

이 방법은 인증 문제가 없습니다!

