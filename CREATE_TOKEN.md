# Personal Access Token 생성 가이드

## Note 필드 입력

**Note 필드에는 URL이 아닙니다!** 토큰의 용도를 설명하는 메모를 입력하세요.

### 예시:
- `bridge-test` (간단하게)
- `bridge-test repository` 
- `bridge-mock-exam project`
- `Git push for bridge-test`

**추천**: `bridge-test` 또는 `bridge-test repository`

## 전체 설정 방법

### 1. Note (필수)
```
bridge-test
```
또는
```
bridge-test repository
```

### 2. Expiration (선택)
- 30 days
- 60 days  
- 90 days
- No expiration (권장하지 않음)

**추천**: `90 days` 또는 원하는 기간

### 3. Select scopes (권한 선택) - 중요!

**반드시 체크해야 할 항목:**
- ✅ **`repo`** (전체 체크)
  - 이 항목 하나만 체크하면 모든 저장소 권한이 포함됩니다
  - `repo` 체크 시 하위 항목들도 자동으로 포함됨

**`repo` 권한에 포함되는 것:**
- repo:status
- repo_deployment
- public_repo
- repo:invite
- security_events

### 4. Generate token 클릭

### 5. 토큰 복사 (중요!)
- 토큰이 한 번만 표시됩니다
- **반드시 복사해서 안전한 곳에 저장하세요!**
- 예: 메모장, 비밀번호 관리자 등

## 토큰 사용 방법

### Git 푸시 시:
```bash
git push -u origin main

# Username: realks2002-cell
# Password: [여기에 복사한 토큰 붙여넣기]
```

## 주의사항

1. **토큰은 비밀번호처럼 취급**: 다른 사람과 공유하지 마세요
2. **한 번만 표시**: 페이지를 벗어나면 다시 볼 수 없습니다
3. **복사 필수**: 안전한 곳에 저장하세요
4. **만료일 확인**: 만료되면 새로 생성해야 합니다



