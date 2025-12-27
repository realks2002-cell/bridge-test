# 배포 완료 체크리스트

## ✅ 완료된 작업
- [x] GitHub에 코드 푸시 완료
- [x] Vercel에 프로젝트 배포 완료
- [x] 프로젝트 이름: `bridge-mock-exam`

## 🔍 배포 확인 사항

### 1. 사이트 접속 확인
배포된 URL로 접속:
```
https://bridge-mock-exam.vercel.app
```
또는
```
https://bridge-mock-exam-[랜덤].vercel.app
```

### 2. 페이지별 테스트

#### ✅ 홈 페이지 (모바일 안내)
- [ ] 접속 시 모바일 안내 페이지 표시 (모바일에서)
- [ ] PC 접속 시 환영 페이지 표시 (PC에서)
- [ ] URL 복사 버튼 작동 확인

#### ✅ 인증 페이지
- [ ] `/auth` 접속 확인
- [ ] 인증 코드 입력 폼 표시
- [ ] 테스트 코드 입력: `AICE2024` 또는 `TEST1234`
- [ ] 인증 성공 시 리스트 페이지로 이동

#### ✅ 모의고사 리스트
- [ ] `/list` 접속 확인
- [ ] 3개 모의고사 카드 표시
- [ ] CSV URL 복사 버튼 작동
- [ ] "문제 풀기" 버튼 작동
- [ ] Colab 버튼 제거 확인

#### ✅ 문제 풀이 페이지
- [ ] `/exam/1` 접속 확인
- [ ] CSV 파일에서 문제 로드 확인
- [ ] 문제 및 선택지 표시
- [ ] 답안 선택 기능
- [ ] 진행률 표시
- [ ] 제출 기능

#### ✅ 결과 페이지
- [ ] 문제 제출 후 결과 페이지 이동
- [ ] 점수 표시
- [ ] 문제별 정답/오답 표시
- [ ] 해설 표시

### 3. CSV 파일 접근 확인

브라우저에서 직접 접속:
```
https://bridge-mock-exam.vercel.app/data/exam1.csv
https://bridge-mock-exam.vercel.app/data/exam2.csv
https://bridge-mock-exam.vercel.app/data/exam3.csv
```

- [ ] CSV 파일이 다운로드되거나 내용이 표시됨
- [ ] 한글이 깨지지 않음

### 4. Colab 연동 테스트

Colab 노트북에서:
```python
import pandas as pd

csv_url = 'https://bridge-mock-exam.vercel.app/data/exam1.csv'
df = pd.read_csv(csv_url, encoding='utf-8')
print(df.head())
```

- [ ] CSV 파일 로드 성공
- [ ] 한글 정상 표시

## 🎯 다음 단계

### 1. 실제 데이터로 교체
- [ ] `lib/config.ts`에서 실제 인증 코드로 변경
- [ ] `lib/config.ts`에서 실제 Colab URL로 변경 (필요 시)
- [ ] `lib/config.ts`에서 실제 정답/해설 PDF URL로 변경

### 2. 도메인 설정 (선택사항)
- [ ] Vercel에서 커스텀 도메인 연결 (선택)

### 3. QR 코드 생성
- [ ] 배포된 URL로 QR 코드 생성
- [ ] 도서에 QR 코드 인쇄

## 📝 설정 파일 업데이트

### lib/config.ts 수정 필요 사항:

```typescript
// 인증 코드 (실제 도서 코드로 변경)
export const AUTH_CODES = [
  '실제_도서_인증_코드_1',
  '실제_도서_인증_코드_2',
];

// 정답/해설 PDF URL (실제 PDF URL로 변경)
export const ANSWER_DATA: AnswerData[] = [
  {
    id: 1,
    title: '1회차 정답 및 해설',
    pdfUrl: 'https://실제_PDF_URL/exam1.pdf',
  },
  // ...
];
```

## 🚨 문제 발생 시

### 404 오류
- Vercel 대시보드에서 배포 상태 확인
- 배포가 완료되었는지 확인

### CSV 파일 접근 불가
- `public/data/` 폴더에 파일이 있는지 확인
- 파일 경로 확인

### 스타일이 적용되지 않음
- 빌드가 완료되었는지 확인
- 브라우저 캐시 클리어



