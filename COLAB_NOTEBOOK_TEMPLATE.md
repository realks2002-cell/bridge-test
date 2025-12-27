# Colab 노트북 템플릿

## 프로젝트 목적에 맞는 Colab 노트북 생성 가이드

프로젝트 목적: **QR코드 → 웹사이트 → Google Colab**에서 모의고사 풀이

## Colab 노트북 생성 단계

### 1. Google Colab 접속
1. https://colab.research.google.com 접속
2. "새 노트북" 클릭

### 2. 노트북 제목 설정
```
브릿지 모의고사 - 1회차
```

### 3. 노트북 내용 작성

```python
# ============================================
# 브릿지 모의고사 - 1회차
# AICE 자격증 1회차 모의고사
# ============================================

# 필요한 라이브러리 설치 및 import
import pandas as pd
import numpy as np

print("=" * 50)
print("브릿지 모의고사 - 1회차")
print("=" * 50)
print()

# ============================================
# 1. 모의고사 데이터 로드
# ============================================
print("📊 모의고사 데이터 로드 중...")

# CSV 파일 URL (웹사이트에서 복사한 URL 사용)
csv_url = 'https://bridge-mock-exam-nextjs.vercel.app/data/exam1.csv'

# CSV 파일 읽기
df = pd.read_csv(csv_url, encoding='utf-8')

print(f"✅ 데이터 로드 완료! (총 {len(df)}문제)")
print()
print("=" * 50)
print("문제 미리보기")
print("=" * 50)
print(df.head())
print()

# ============================================
# 2. 문제 풀이 시작
# ============================================
print("=" * 50)
print("문제 풀이 시작")
print("=" * 50)
print()

# 문제를 하나씩 출력하고 답안 입력 받기
user_answers = {}

for idx, row in df.iterrows():
    question_num = row['문제번호']
    question = row['문제']
    choice1 = row['선택지1']
    choice2 = row['선택지2']
    choice3 = row['선택지3']
    choice4 = row['선택지4']
    
    print(f"\n문제 {question_num}: {question}")
    print(f"① {choice1}")
    print(f"② {choice2}")
    print(f"③ {choice3}")
    print(f"④ {choice4}")
    
    # 답안 입력 (1, 2, 3, 4 중 선택)
    answer = input("답안을 입력하세요 (1-4): ")
    user_answers[question_num] = answer
    
    print("-" * 50)

# ============================================
# 3. 결과 확인
# ============================================
print()
print("=" * 50)
print("결과 확인")
print("=" * 50)
print()

correct_count = 0
total_count = len(df)

for idx, row in df.iterrows():
    question_num = row['문제번호']
    correct_answer = str(row['정답'])
    user_answer = str(user_answers.get(question_num, ''))
    
    is_correct = correct_answer == user_answer
    if is_correct:
        correct_count += 1
    
    status = "✅" if is_correct else "❌"
    print(f"{status} 문제 {question_num}: 정답={correct_answer}, 내 답안={user_answer}")

print()
print("=" * 50)
print(f"최종 점수: {correct_count}/{total_count} ({correct_count/total_count*100:.1f}%)")
print("=" * 50)

# ============================================
# 4. 해설 확인
# ============================================
print()
print("=" * 50)
print("해설")
print("=" * 50)
print()

for idx, row in df.iterrows():
    question_num = row['문제번호']
    question = row['문제']
    explanation = row['해설']
    
    print(f"\n문제 {question_num}: {question}")
    print(f"해설: {explanation}")
    print("-" * 50)
```

### 4. 노트북 저장 및 공유

1. **저장**
   - "파일" → "저장" 클릭
   - Google Drive에 자동 저장

2. **공유 설정**
   - "공유" 버튼 클릭
   - "링크가 있는 모든 사용자" 선택
   - "편집자" 또는 "뷰어" 권한 설정
   - 공유 링크 복사

3. **URL 확인**
   - 공유 링크 형식: `https://colab.research.google.com/drive/YOUR_NOTEBOOK_ID`
   - `YOUR_NOTEBOOK_ID` 부분을 복사

### 5. 웹사이트에 Colab URL 추가

`lib/config.ts` 파일에서 `colabUrl`을 실제 노트북 URL로 변경:

```typescript
{
  id: 1,
  title: '1회차 모의고사',
  colabUrl: 'https://colab.research.google.com/drive/실제_노트북_ID', // 여기에 실제 ID 입력
  csvFilename: 'exam1.csv',
  description: 'AICE 자격증 1회차 모의고사',
},
```

## 간단한 버전 (선택사항)

더 간단한 버전도 가능합니다:

```python
# 브릿지 모의고사 - 간단 버전
import pandas as pd

# 데이터 로드
df = pd.read_csv('https://bridge-mock-exam-nextjs.vercel.app/data/exam1.csv', encoding='utf-8')

# 문제 확인
print("=== 모의고사 문제 ===")
for idx, row in df.iterrows():
    print(f"\n문제 {row['문제번호']}: {row['문제']}")
    print(f"① {row['선택지1']}")
    print(f"② {row['선택지2']}")
    print(f"③ {row['선택지3']}")
    print(f"④ {row['선택지4']}")
    print(f"정답: {row['정답']}")
    print(f"해설: {row['해설']}")
    print("-" * 50)
```

## 각 모의고사별 노트북 생성

1. **1회차 모의고사** 노트북 생성
2. **2회차 모의고사** 노트북 생성
3. **3회차 모의고사** 노트북 생성

각 노트북의 CSV URL만 변경하면 됩니다:
- 1회차: `exam1.csv`
- 2회차: `exam2.csv`
- 3회차: `exam3.csv`

## 완료 체크리스트

- [ ] Colab 노트북 파일(.ipynb) 생성
- [ ] CSV 데이터 로드 코드 작성
- [ ] 문제 풀이 템플릿 작성
- [ ] 노트북 공유 설정
- [ ] 공유 링크 복사
- [ ] `lib/config.ts`에 Colab URL 추가
- [ ] 웹사이트에서 Colab 버튼 테스트

