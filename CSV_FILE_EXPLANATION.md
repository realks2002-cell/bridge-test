# CSV 파일 설명

## CSV 파일 = 모의고사 문제 데이터

### CSV 파일 구조

```csv
문제번호,문제,선택지1,선택지2,선택지3,선택지4,정답,해설
1,다음 중 빅데이터의 3V 특성이 아닌 것은?,Volume,Variety,Velocity,Veracity,4,빅데이터의 3V는 Volume, Variety, Velocity입니다.
2,데이터 분석에서 이상치를 처리하는 방법이 아닌 것은?,삭제,평균값으로 대체,중앙값으로 대체,무시,4,이상치는 분석에 영향을 줄 수 있으므로 적절히 처리해야 합니다.
...
```

### 각 컬럼의 의미

1. **문제번호**: 문제 순서 (1, 2, 3, ...)
2. **문제**: 문제 내용
3. **선택지1**: 첫 번째 선택지
4. **선택지2**: 두 번째 선택지
5. **선택지3**: 세 번째 선택지
6. **선택지4**: 네 번째 선택지
7. **정답**: 정답 번호 (1, 2, 3, 4 중 하나)
8. **해설**: 문제 해설

## CSV 파일의 역할

### 1. 모의고사 문제 저장
- 모든 문제 데이터를 CSV 형식으로 저장
- 객관식 문제 (4지선다)
- 정답 및 해설 포함

### 2. 웹사이트에서 사용
- 웹에서 문제 풀기 페이지에서 사용
- CSV를 읽어서 문제 표시
- 답안 체크 및 결과 계산

### 3. Colab에서 사용
- Colab 노트북에서 CSV 읽기
- 데이터 분석 실습
- 문제 풀이 및 통계 분석

## CSV 파일 위치

### 로컬 프로젝트
```
bridge-mock-exam-nextjs/
└── public/
    └── data/
        ├── exam1.csv  (1회차 모의고사)
        ├── exam2.csv  (2회차 모의고사)
        └── exam3.csv  (3회차 모의고사)
```

### 배포 후 URL
```
https://bridge-mock-exam-nextjs.vercel.app/data/exam1.csv
https://bridge-mock-exam-nextjs.vercel.app/data/exam2.csv
https://bridge-mock-exam-nextjs.vercel.app/data/exam3.csv
```

## 사용 예시

### 웹사이트에서
```javascript
// CSV 파일 읽기
const response = await fetch('/data/exam1.csv');
const csvText = await response.text();
const questions = parseCSV(csvText);

// 문제 표시
questions.forEach(q => {
  console.log(q.문제);
  console.log(q.선택지1, q.선택지2, q.선택지3, q.선택지4);
});
```

### Colab에서
```python
import pandas as pd

# CSV 파일 읽기
csv_url = 'https://bridge-mock-exam-nextjs.vercel.app/data/exam1.csv'
df = pd.read_csv(csv_url, encoding='utf-8')

# 문제 확인
print(df['문제'].head())

# 정답 분포 확인
print(df['정답'].value_counts())
```

## CSV 파일 수정 방법

### 1. 로컬에서 수정
1. `public/data/exam1.csv` 파일 열기
2. Excel 또는 텍스트 에디터로 수정
3. UTF-8 BOM 인코딩으로 저장 (한글 깨짐 방지)

### 2. 배포
1. 수정된 CSV 파일 커밋
2. Vercel에 배포
3. 자동으로 업데이트됨

## CSV 파일 예시 (실제 데이터)

```csv
문제번호,문제,선택지1,선택지2,선택지3,선택지4,정답,해설
1,다음 중 빅데이터의 3V 특성이 아닌 것은?,Volume,Variety,Velocity,Veracity,4,빅데이터의 3V는 Volume, Variety, Velocity입니다.
2,데이터 분석에서 이상치를 처리하는 방법이 아닌 것은?,삭제,평균값으로 대체,중앙값으로 대체,무시,4,이상치는 분석에 영향을 줄 수 있으므로 적절히 처리해야 합니다.
3,다음 중 머신러닝 알고리즘이 아닌 것은?,선형회귀,의사결정나무,랜덤포레스트,엑셀,4,엑셀은 스프레드시트 프로그램입니다.
```

## 결론

- ✅ **CSV 파일 = 모의고사 문제 데이터**
- ✅ 문제, 선택지, 정답, 해설 모두 포함
- ✅ 웹사이트와 Colab 모두에서 사용
- ✅ 한 곳에서 관리하고 배포

## 체크리스트

- [x] CSV 파일에 문제 데이터 포함
- [x] 문제, 선택지, 정답, 해설 모두 있음
- [x] 웹사이트에서 사용 가능
- [x] Colab에서 사용 가능
- [x] 공개 URL로 접근 가능



