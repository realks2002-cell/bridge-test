# CSV 데이터 흐름 설명

## CSV 파일 위치 및 사용 방법

### ❌ 학생이 CSV 파일을 올리는 것이 아닙니다!

### ✅ 실제 구조

```
웹사이트 (Vercel)에 CSV 파일 배포
    ↓
Colab에서 URL로 CSV 파일 읽기
    ↓
학생이 데이터로 실습
```

## 상세 설명

### 1. CSV 파일은 웹사이트에 배포됨

**위치**: Vercel에 배포된 웹사이트
```
https://bridge-mock-exam-nextjs.vercel.app/data/exam1.csv
https://bridge-mock-exam-nextjs.vercel.app/data/exam2.csv
https://bridge-mock-exam-nextjs.vercel.app/data/exam3.csv
```

**역할**:
- 모의고사 문제 데이터 저장
- 공개 접근 가능한 URL 제공
- Colab에서 직접 읽을 수 있도록 호스팅

### 2. Colab에서 URL로 CSV 읽기

**Colab 노트북 코드**:
```python
import pandas as pd

# 웹사이트에 배포된 CSV 파일의 URL 사용
csv_url = 'https://bridge-mock-exam-nextjs.vercel.app/data/exam1.csv'

# URL에서 직접 CSV 파일 읽기
df = pd.read_csv(csv_url, encoding='utf-8')

print("모의고사 데이터:")
print(df.head())
```

**역할**:
- 웹사이트의 CSV URL을 사용
- `pd.read_csv()`로 직접 읽기
- 학생이 파일을 올릴 필요 없음

### 3. 학생의 역할

**학생은**:
- ✅ CSV 파일을 올리지 않음
- ✅ Colab 노트북만 열면 됨
- ✅ 코드 실행하면 자동으로 데이터 로드
- ✅ 데이터로 실습 및 분석

## 전체 데이터 흐름

```
1. 출판사/교수자가 CSV 파일 준비
   ↓
2. 웹사이트 프로젝트에 CSV 파일 추가
   (public/data/exam1.csv)
   ↓
3. Vercel에 배포
   ↓
4. CSV 파일이 공개 URL로 제공됨
   (https://bridge-mock-exam-nextjs.vercel.app/data/exam1.csv)
   ↓
5. 학생이 Colab 노트북 열기
   ↓
6. Colab에서 URL로 CSV 읽기
   (pd.read_csv('URL'))
   ↓
7. 데이터가 자동으로 로드됨
   ↓
8. 학생이 데이터로 실습
```

## CSV 파일 구조 예시

```csv
문제번호,문제,선택지1,선택지2,선택지3,선택지4,정답,해설
1,다음 중 빅데이터의 3V 특성이 아닌 것은?,Volume,Variety,Velocity,Veracity,4,빅데이터의 3V는 Volume, Variety, Velocity입니다.
2,데이터 분석에서 이상치를 처리하는 방법이 아닌 것은?,삭제,평균값으로 대체,중앙값으로 대체,무시,4,이상치는 분석에 영향을 줄 수 있으므로 적절히 처리해야 합니다.
...
```

## 장점

### 1. 학생 편의성
- ✅ 파일 업로드 불필요
- ✅ 노트북만 열면 자동으로 데이터 로드
- ✅ 실습에 집중 가능

### 2. 관리 편의성
- ✅ CSV 파일을 한 곳에서 관리
- ✅ 업데이트 시 웹사이트만 재배포
- ✅ 모든 학생이 최신 데이터 사용

### 3. 일관성
- ✅ 모든 학생이 같은 데이터 사용
- ✅ 버전 관리 용이
- ✅ 오류 최소화

## 만약 학생이 직접 파일을 올려야 한다면?

만약 학생이 자신의 데이터를 사용해야 한다면:

```python
# 방법 1: Google Drive에서 업로드
from google.colab import drive
drive.mount('/content/drive')

# Google Drive의 파일 읽기
df = pd.read_csv('/content/drive/MyDrive/파일명.csv')

# 방법 2: 직접 업로드
from google.colab import files
uploaded = files.upload()

# 업로드된 파일 읽기
df = pd.read_csv(io.BytesIO(uploaded['파일명.csv']))
```

**하지만 현재 시스템은 이 방법을 사용하지 않습니다!**

## 결론

- ❌ 학생이 CSV 파일을 올리지 않음
- ✅ 웹사이트에 CSV 파일이 배포됨
- ✅ Colab에서 URL로 CSV 파일 읽기
- ✅ 학생은 노트북만 열고 실습하면 됨

## 체크리스트

- [x] CSV 파일은 웹사이트에 배포됨
- [x] Colab에서 URL로 읽기
- [x] 학생은 파일 업로드 불필요
- [x] 자동으로 데이터 로드됨



