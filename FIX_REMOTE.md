# 원격 저장소 URL 수정하기

## 문제
원격 저장소 URL이 `YOUR_USERNAME/YOUR_REPO.git`로 설정되어 있습니다.
실제 URL로 변경해야 합니다.

## 해결 방법

### 1. 현재 원격 저장소 확인
```bash
git remote -v
```

### 2. 잘못된 원격 저장소 제거
```bash
git remote remove origin
```

### 3. 올바른 원격 저장소 추가
```bash
git remote add origin https://github.com/realks2002-cell/bridge-test.git
```

### 4. 확인
```bash
git remote -v
```
다음과 같이 표시되어야 합니다:
```
origin  https://github.com/realks2002-cell/bridge-test.git (fetch)
origin  https://github.com/realks2002-cell/bridge-test.git (push)
```

### 5. 푸시
```bash
git push -u origin main
```

## 전체 명령어 (한 번에)

```bash
# 원격 저장소 확인
git remote -v

# 잘못된 원격 저장소 제거
git remote remove origin

# 올바른 원격 저장소 추가
git remote add origin https://github.com/realks2002-cell/bridge-test.git

# 확인
git remote -v

# 푸시
git push -u origin main
```



