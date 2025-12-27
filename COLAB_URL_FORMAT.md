# Colab 노트북 URL 형식 가이드

## 문제 상황

잘못된 URL 형식:
```
https://drive.google.com/file/u/0/d/YOUR_NOTEBOOK_ID_1/edit
```

이것은 Google Drive 파일 URL 형식입니다. Colab 노트북 URL이 아닙니다.

## 올바른 Colab 노트북 URL 형식

### 올바른 형식
```
https://colab.research.google.com/drive/NOTEBOOK_ID
```

### 예시
```
https://colab.research.google.com/drive/1yJ-DOQaqh3ACIWdSGF4aBNtZ1OK5VAT5
```

## URL 형식 비교

### ❌ 잘못된 형식
- `https://drive.google.com/file/u/0/d/YOUR_NOTEBOOK_ID_1/edit` (Google Drive 파일)
- `https://drive.google.com/drive/folders/YOUR_NOTEBOOK_ID` (Google Drive 폴더)
- `https://colab.research.google.com/drive/YOUR_NOTEBOOK_ID_1` (예시 텍스트 포함)

### ✅ 올바른 형식
- `https://colab.research.google.com/drive/1yJ-DOQaqh3ACIWdSGF4aBNtZ1OK5VAT5` (실제 노트북 ID)

## 현재 설정 확인

`lib/config.ts` 파일을 확인하면:
```typescript
colabUrl: 'https://colab.research.google.com/drive/1yJ-DOQaqh3ACIWdSGF4aBNtZ1OK5VAT5',
```

이것은 올바른 형식입니다.

## 문제 해결

### 1. 웹사이트에서 확인

1. 웹사이트 접속
   ```
   https://bridge-test-nine.vercel.app/list
   ```

2. "Colab 노트북 열기" 버튼 확인
   - 버튼을 우클릭 → "링크 주소 복사"
   - URL 확인

3. 올바른 URL인지 확인
   - `https://colab.research.google.com/drive/...` 형식이어야 함
   - `https://drive.google.com/...` 형식이면 잘못됨

### 2. Colab 노트북에서 올바른 URL 확인

1. Colab 노트북 열기
   ```
   https://colab.research.google.com/drive/1yJ-DOQaqh3ACIWdSGF4aBNtZ1OK5VAT5
   ```

2. 브라우저 주소창 확인
   - URL 형식: `https://colab.research.google.com/drive/1yJ-DOQaqh3ACIWdSGF4aBNtZ1OK5VAT5`
   - 이 URL을 복사

3. `lib/config.ts`에 확인
   - 복사한 URL이 `lib/config.ts`의 `colabUrl`과 일치하는지 확인

## 빠른 확인

현재 설정된 URL:
```
https://colab.research.google.com/drive/1yJ-DOQaqh3ACIWdSGF4aBNtZ1OK5VAT5
```

이 URL로 직접 접속해보세요:
1. 브라우저에서 위 URL 접속
2. 노트북이 열리면 → URL 정상 ✅
3. "요청한 파일이 없습니다" 오류가 나면 → 공유 설정 확인 필요

## 공유 설정 확인

URL이 올바른데도 오류가 나면:

1. Colab 노트북에서 "공유" 클릭
2. "일반 액세스" → "링크가 있는 모든 사용자" 선택
3. 권한: "뷰어" 선택
4. "완료" 클릭

## 체크리스트

- [ ] URL 형식 확인: `https://colab.research.google.com/drive/...`
- [ ] `lib/config.ts`의 `colabUrl` 확인
- [ ] 웹사이트에서 버튼 URL 확인
- [ ] Colab 노트북 직접 접속 테스트
- [ ] 공유 설정 확인



