# Colab 노트북 문제 풀이 UI 템플릿

## 현재 문제

- ❌ CSV 데이터만 로드됨
- ❌ 문제를 풀 수 있는 UI가 없음
- ❌ 답안 선택 인터페이스가 없음

## 해결 방법: Colab 위젯 사용

Colab에서는 `ipywidgets`를 사용하여 인터랙티브 UI를 만들 수 있습니다.

## 개선된 노트북 구조

### 1. 데이터 로드 (기본)

```python
import pandas as pd
import ipywidgets as widgets
from IPython.display import display, clear_output

# CSV 데이터 로드
csv_url = 'https://bridge-mock-exam-nextjs.vercel.app/data/exam1.csv'
df = pd.read_csv(csv_url, encoding='utf-8')

print("=" * 50)
print("브릿지 모의고사 - 1회차")
print(f"✅ 데이터 로드 완료! (총 {len(df)}문제)")
print("=" * 50)
```

### 2. 문제 풀이 UI (위젯 사용)

```python
# 문제 풀이 함수
def solve_question(question_num):
    """문제를 표시하고 답안을 입력받는 함수"""
    row = df.iloc[question_num - 1]
    
    # 문제 정보
    question = row['문제']
    choice1 = row['선택지1']
    choice2 = row['선택지2']
    choice3 = row['선택지3']
    choice4 = row['선택지4']
    correct_answer = row['정답']
    explanation = row['해설']
    
    # 위젯 생성
    question_label = widgets.HTML(
        value=f"<h3>문제 {question_num}: {question}</h3>",
        layout=widgets.Layout(width='100%')
    )
    
    answer_radio = widgets.RadioButtons(
        options=[
            ('① ' + choice1, '1'),
            ('② ' + choice2, '2'),
            ('③ ' + choice3, '3'),
            ('④ ' + choice4, '4')
        ],
        description='답안:',
        layout=widgets.Layout(width='100%')
    )
    
    submit_button = widgets.Button(
        description='제출',
        button_style='primary',
        layout=widgets.Layout(width='200px')
    )
    
    result_output = widgets.Output()
    
    def on_submit(b):
        with result_output:
            clear_output()
            user_answer = answer_radio.value
            is_correct = str(correct_answer) == user_answer
            
            if is_correct:
                print("✅ 정답입니다!")
            else:
                print(f"❌ 오답입니다. 정답은 {correct_answer}번입니다.")
            
            print(f"\n해설: {explanation}")
    
    submit_button.on_click(on_submit)
    
    # UI 표시
    display(question_label)
    display(answer_radio)
    display(submit_button)
    display(result_output)

# 문제 풀이 시작
solve_question(1)  # 1번 문제
```

### 3. 전체 문제 풀이 UI (개선 버전)

```python
# 전체 문제 풀이 시스템
class ExamSolver:
    def __init__(self, df):
        self.df = df
        self.user_answers = {}
        self.current_question = 0
        
    def show_question(self, question_num):
        """문제 표시"""
        if question_num < 1 or question_num > len(self.df):
            print("문제 번호가 올바르지 않습니다.")
            return
        
        self.current_question = question_num
        row = self.df.iloc[question_num - 1]
        
        # 문제 정보
        question = row['문제']
        choice1 = row['선택지1']
        choice2 = row['선택지2']
        choice3 = row['선택지3']
        choice4 = row['선택지4']
        
        # UI 생성
        question_html = widgets.HTML(
            value=f"""
            <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin-bottom: 10px;">
                <h3>문제 {question_num} / {len(self.df)}</h3>
                <p style="font-size: 16px; font-weight: bold;">{question}</p>
            </div>
            """,
            layout=widgets.Layout(width='100%')
        )
        
        answer_radio = widgets.RadioButtons(
            options=[
                ('① ' + choice1, '1'),
                ('② ' + choice2, '2'),
                ('③ ' + choice3, '3'),
                ('④ ' + choice4, '4')
            ],
            description='답안 선택:',
            layout=widgets.Layout(width='100%', margin='10px 0')
        )
        
        # 답안 저장
        if question_num in self.user_answers:
            answer_radio.value = str(self.user_answers[question_num])
        
        button_layout = widgets.Layout(width='150px', margin='5px')
        prev_button = widgets.Button(
            description='이전 문제',
            button_style='info',
            layout=button_layout,
            disabled=(question_num == 1)
        )
        
        next_button = widgets.Button(
            description='다음 문제',
            button_style='info',
            layout=button_layout,
            disabled=(question_num == len(self.df))
        )
        
        submit_button = widgets.Button(
            description='답안 저장',
            button_style='success',
            layout=button_layout
        )
        
        result_output = widgets.Output()
        
        def save_answer(b):
            self.user_answers[question_num] = int(answer_radio.value)
            with result_output:
                clear_output()
                print(f"✅ 문제 {question_num} 답안 저장: {answer_radio.value}번")
        
        def show_prev(b):
            if question_num > 1:
                self.show_question(question_num - 1)
        
        def show_next(b):
            if question_num < len(self.df):
                self.show_question(question_num + 1)
        
        submit_button.on_click(save_answer)
        prev_button.on_click(show_prev)
        next_button.on_click(show_next)
        
        # UI 표시
        display(question_html)
        display(answer_radio)
        display(widgets.HBox([prev_button, submit_button, next_button]))
        display(result_output)
    
    def show_results(self):
        """결과 표시"""
        correct_count = 0
        total_count = len(self.df)
        
        results_html = "<h2>시험 결과</h2><table border='1' style='border-collapse: collapse; width: 100%;'>"
        results_html += "<tr><th>문제</th><th>내 답안</th><th>정답</th><th>결과</th></tr>"
        
        for idx, row in self.df.iterrows():
            question_num = idx + 1
            user_answer = self.user_answers.get(question_num, 0)
            correct_answer = int(row['정답'])
            is_correct = user_answer == correct_answer
            
            if is_correct:
                correct_count += 1
                result_text = "✅ 정답"
            else:
                result_text = "❌ 오답"
            
            results_html += f"""
            <tr>
                <td>{question_num}</td>
                <td>{user_answer}</td>
                <td>{correct_answer}</td>
                <td>{result_text}</td>
            </tr>
            """
        
        results_html += "</table>"
        results_html += f"<h3>점수: {correct_count}/{total_count} ({correct_count/total_count*100:.1f}%)</h3>"
        
        display(widgets.HTML(value=results_html))

# 사용 방법
solver = ExamSolver(df)
solver.show_question(1)  # 1번 문제부터 시작
```

### 4. 간단한 버전 (마크다운 + 입력)

```python
# 간단한 버전: 마크다운으로 문제 표시, 입력으로 답안 받기
def simple_question(question_num):
    row = df.iloc[question_num - 1]
    
    print("=" * 50)
    print(f"문제 {question_num}: {row['문제']}")
    print("=" * 50)
    print(f"① {row['선택지1']}")
    print(f"② {row['선택지2']}")
    print(f"③ {row['선택지3']}")
    print(f"④ {row['선택지4']}")
    print()
    
    # 답안 입력
    user_answer = input("답안을 입력하세요 (1-4): ")
    correct_answer = str(row['정답'])
    
    if user_answer == correct_answer:
        print("✅ 정답입니다!")
    else:
        print(f"❌ 오답입니다. 정답은 {correct_answer}번입니다.")
    
    print(f"해설: {row['해설']}")
    print()

# 모든 문제 풀기
for i in range(1, len(df) + 1):
    simple_question(i)
```

## 권장 구조

### 노트북 셀 구성

```
[1] 라이브러리 import 및 데이터 로드
[2] 문제 풀이 UI 클래스 정의
[3] 문제 풀이 시작 (1번 문제)
[4] 결과 확인 버튼
```

## 체크리스트

- [ ] ipywidgets 설치 및 import
- [ ] 문제 표시 UI 구현
- [ ] 답안 선택 인터페이스 (라디오 버튼)
- [ ] 이전/다음 문제 버튼
- [ ] 답안 저장 기능
- [ ] 결과 확인 기능
- [ ] 점수 계산 및 표시

## 완성된 노트북 예시

전체 코드는 별도 파일로 제공하거나, Colab 노트북에 직접 복사해서 사용할 수 있습니다.



