# 배포된 코드의 역할

## 1. 웹사이트 코드 (Vercel에 배포)

### 역할: 브릿지(Bridge) - 중간 다리

웹사이트는 **QR코드 → Colab**을 연결하는 중간 다리 역할을 합니다.

### 주요 기능

#### 1. 모바일 안내 페이지 (`/`)
- **역할**: QR코드 스캔 시 모바일 감지
- **기능**: 
  - 모바일에서 접속하면 PC 접속 안내
  - URL 복사 기능 제공
  - SMS/이메일로 URL 전송

#### 2. 인증 페이지 (`/auth`)
- **역할**: 도서 인증 코드 확인
- **기능**:
  - 학생이 도서에 있는 인증 코드 입력
  - `AUTH_CODES` 배열과 비교
  - 인증 성공 시 모의고사 리스트로 이동

#### 3. 모의고사 리스트 (`/list`)
- **역할**: 모의고사 선택 및 Colab 연결
- **기능**:
  - 모의고사 목록 표시
  - CSV URL 제공 및 복사 기능
  - **Colab 노트북 열기 버튼** (핵심!)
  - 웹에서 문제 풀기 (선택사항)

#### 4. 문제 풀이 페이지 (`/exam/[id]`)
- **역할**: 웹에서 직접 문제 풀기 (선택사항)
- **기능**:
  - CSV 데이터 로드
  - 문제 표시
  - 답안 선택
  - 결과 계산

#### 5. 결과 페이지 (`/result/[id]`)
- **역할**: 시험 결과 표시
- **기능**:
  - 점수 표시
  - 정답/오답 확인
  - 해설 제공
  - 정답 PDF 링크

### 설정 파일 (`lib/config.ts`)

```typescript
// 모의고사 데이터
export const EXAM_DATA = [
  {
    id: 1,
    title: '1회차 모의고사',
    colabUrl: 'https://colab.research.google.com/drive/...', // Colab 연결
    csvFilename: 'exam1.csv', // CSV 파일명
    description: 'AICE 자격증 1회차 모의고사',
  },
];

// 인증 코드
export const AUTH_CODES = ['AICE2024', 'BIGDATA2024', ...];
```

**역할**: 
- 모의고사 정보 관리
- Colab URL 저장
- 인증 코드 관리

## 2. Colab 노트북 코드

### 역할: 실제 실습 환경

Colab 노트북은 **학생이 실제로 문제를 풀고 실습하는 곳**입니다.

### 현재 코드

```python
import pandas as pd

# CSV 데이터 로드
csv_url = 'https://bridge-mock-exam-nextjs.vercel.app/data/exam1.csv'
df = pd.read_csv(csv_url, encoding='utf-8')

print("모의고사 데이터:")
print(df.head())
```

**역할**:
- CSV 데이터를 웹사이트에서 가져오기
- 데이터를 pandas DataFrame으로 변환
- 데이터 미리보기

### 개선된 코드 (권장)

```python
# ============================================
# 브릿지 모의고사 - 1회차
# ============================================

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# 1. 데이터 로드 (기본 제공)
csv_url = 'https://bridge-mock-exam-nextjs.vercel.app/data/exam1.csv'
df = pd.read_csv(csv_url, encoding='utf-8')
print(f"✅ 데이터 로드 완료! (총 {len(df)}문제)")

# 2. 실습 1: 총 문제 수 구하기 (학생이 작성)
# 여기에 코드를 작성하세요
# result = len(df)
# print("총 문제 수:", result)

# 3. 실습 2: 정답 분포 확인 (학생이 작성)
# 여기에 코드를 작성하세요
# answer_counts = df['정답'].value_counts()
# print("정답 분포:", answer_counts)

# 4. 자유 실습 (학생이 작성)
# 원하는 분석을 자유롭게 진행하세요
```

**역할**:
- 데이터 로드 (기본 제공)
- 실습 문제 템플릿 제공
- 학생이 코드를 작성할 빈 셀 제공

## 전체 흐름

```
1. 학생이 QR코드 스캔
   ↓
2. 웹사이트 접속 (모바일 안내)
   ↓
3. PC에서 웹사이트 접속
   ↓
4. 인증 코드 입력 (웹사이트 코드)
   ↓
5. 모의고사 리스트 확인 (웹사이트 코드)
   ↓
6. "Colab 노트북 열기" 버튼 클릭 (웹사이트 코드)
   ↓
7. Colab 노트북 열림 (Colab 코드)
   ↓
8. CSV 데이터 로드 (Colab 코드)
   ↓
9. 학생이 실습 코드 작성 (Colab 코드)
   ↓
10. 결과 확인
```

## 요약

### 웹사이트 코드의 역할
- ✅ **브릿지**: QR코드 → Colab 연결
- ✅ **인증**: 도서 인증 코드 확인
- ✅ **안내**: 모의고사 선택 및 Colab 연결
- ✅ **데이터 제공**: CSV 파일 호스팅

### Colab 노트북 코드의 역할
- ✅ **실습 환경**: 파이썬 코드 실행
- ✅ **데이터 로드**: CSV 데이터 가져오기
- ✅ **실습 템플릿**: 문제 풀이 가이드
- ✅ **자유 실습**: 학생이 직접 코드 작성

## 결론

**웹사이트 코드** = 중간 다리 (접근 편의성 제공)
**Colab 코드** = 실제 실습 환경 (문제 풀이 및 분석)

둘 다 필요하며, 각각 다른 역할을 합니다!



