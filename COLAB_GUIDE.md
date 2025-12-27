# Colab 파일 가이드

## 현재 시스템 구조

현재 시스템은 **웹에서 직접 문제를 풀 수 있도록** 구성되어 있습니다:
- ✅ 웹에서 문제 풀이 가능 (`/exam/[id]`)
- ✅ CSV 파일은 웹에서 자동으로 제공됨
- ✅ Colab 버튼은 제거됨

## Colab의 역할 (선택사항)

Colab은 이제 **필수가 아닙니다**. 하지만 다음과 같은 용도로 사용할 수 있습니다:

### 1. 추가 학습 자료 제공
- CSV 데이터 분석 예제
- 데이터 시각화 연습
- 추가 실습 문제

### 2. 고급 사용자를 위한 선택사항
- Python으로 데이터 분석하고 싶은 학생
- 프로그래밍 연습이 필요한 학생

## Colab에 올릴 파일

### 방법 1: Colab 노트북 파일 (.ipynb) 생성

새로운 Colab 노트북을 만들고 다음 내용을 추가:

```python
# 모의고사 데이터 분석 예제
import pandas as pd
import matplotlib.pyplot as plt

# CSV 파일 읽기 (Vercel 배포 URL 사용)
csv_url = 'https://bridge-mock-exam-nextjs.vercel.app/data/exam1.csv'
df = pd.read_csv(csv_url, encoding='utf-8')

# 데이터 확인
print("=== 모의고사 데이터 ===")
print(df.head())
print(f"\n총 문제 수: {len(df)}")

# 문제별 정답 분포
if '정답' in df.columns:
    answer_counts = df['정답'].value_counts()
    print("\n=== 정답 분포 ===")
    print(answer_counts)
    
    # 시각화
    plt.figure(figsize=(8, 6))
    answer_counts.plot(kind='bar')
    plt.title('정답 분포')
    plt.xlabel('정답')
    plt.ylabel('문제 수')
    plt.show()

# 문제 유형 분석 (예시)
print("\n=== 문제 유형 분석 ===")
print(f"문제 컬럼: {df.columns.tolist()}")
```

### 방법 2: 간단한 예제 노트북

```python
# 브릿지 모의고사 - 데이터 로드 예제
import pandas as pd

# 1회차 모의고사
exam1_url = 'https://bridge-mock-exam-nextjs.vercel.app/data/exam1.csv'
df1 = pd.read_csv(exam1_url, encoding='utf-8')
print("1회차 모의고사:", len(df1), "문제")

# 2회차 모의고사
exam2_url = 'https://bridge-mock-exam-nextjs.vercel.app/data/exam2.csv'
df2 = pd.read_csv(exam2_url, encoding='utf-8')
print("2회차 모의고사:", len(df2), "문제")

# 3회차 모의고사
exam3_url = 'https://bridge-mock-exam-nextjs.vercel.app/data/exam3.csv'
df3 = pd.read_csv(exam3_url, encoding='utf-8')
print("3회차 모의고사:", len(df3), "문제")

# 데이터 미리보기
print("\n=== 1회차 모의고사 미리보기 ===")
print(df1.head())
```

## Colab 노트북 생성 단계

### 1. Google Colab 접속
1. https://colab.research.google.com 접속
2. "새 노트북" 클릭

### 2. 노트북 작성
- 위의 Python 코드를 복사하여 붙여넣기
- 필요한 설명 추가

### 3. 노트북 저장 및 공유
1. "파일" → "저장" 클릭
2. Google Drive에 저장
3. "공유" 버튼 클릭
4. "링크가 있는 모든 사용자"로 설정
5. 공유 링크 복사

### 4. (선택사항) 웹에 Colab 링크 추가

만약 웹에서 Colab 링크를 제공하고 싶다면:

`lib/config.ts`에 다시 `colabUrl` 필드를 추가할 수 있습니다:

```typescript
export const EXAM_DATA: ExamData[] = [
  {
    id: 1,
    title: '1회차 모의고사',
    csvFilename: 'exam1.csv',
    description: 'AICE 자격증 1회차 모의고사',
    colabUrl: 'https://colab.research.google.com/drive/YOUR_NOTEBOOK_ID_1', // 선택사항
  },
  // ...
];
```

그리고 `app/list/page.tsx`에 Colab 버튼을 다시 추가할 수 있습니다.

## 권장 사항

### 옵션 1: Colab 없이 웹만 사용 (현재 상태)
- ✅ 간단하고 직관적
- ✅ 모든 학생이 쉽게 사용 가능
- ✅ 추가 설정 불필요

### 옵션 2: Colab을 선택사항으로 제공
- 웹에서 기본 문제 풀이
- Colab 링크를 "추가 학습 자료"로 제공
- 고급 사용자를 위한 선택사항

### 옵션 3: Colab을 필수로 사용
- 웹에서 CSV URL만 복사
- Colab에서 실제 문제 풀이
- (현재는 이 방식이 아님)

## 결론

**현재 시스템에서는 Colab 파일이 필수가 아닙니다.**

하지만 추가 학습 자료로 제공하고 싶다면:
1. Colab 노트북 파일(.ipynb) 생성
2. CSV 데이터 분석 예제 작성
3. (선택사항) 웹에 Colab 링크 추가

## CSV 파일 위치

CSV 파일은 이미 Vercel에 배포되어 있습니다:
- https://bridge-mock-exam-nextjs.vercel.app/data/exam1.csv
- https://bridge-mock-exam-nextjs.vercel.app/data/exam2.csv
- https://bridge-mock-exam-nextjs.vercel.app/data/exam3.csv

Colab에서 이 URL을 직접 사용할 수 있습니다.

