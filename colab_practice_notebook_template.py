# ============================================
# 브릿지 모의고사 - 실습 문제 버전
# AICE 자격증 실습 모의고사
# ============================================

# 필요한 라이브러리 설치 및 import
!pip install ipywidgets -q

import pandas as pd
import ipywidgets as widgets
from IPython.display import display, clear_output
import numpy as np
import warnings
import ast
import io
import sys

# 경고 무시
warnings.filterwarnings('ignore', category=pd.errors.ParserWarning)

print("=" * 50)
print("브릿지 모의고사 - 실습 문제")
print("=" * 50)
print()

# ============================================
# 1. 데이터 로드
# ============================================
print("📊 실습 문제 데이터 로드 중...")

csv_url = 'https://bridge-mock-exam-nextjs.vercel.app/data/exam1_practice.csv'
df = pd.read_csv(csv_url, encoding='utf-8-sig', index_col=False, on_bad_lines='skip')

# 문제번호 컬럼이 있으면 제거
if '문제번호' in df.columns:
    df = df.drop('문제번호', axis=1)

print(f"✅ 데이터 로드 완료! (총 {len(df)}문제)")
print(f"컬럼명: {df.columns.tolist()}")
print()

# ============================================
# 2. 실습 문제 풀이 UI 클래스
# ============================================

class PracticeExamSolver:
    def __init__(self, df):
        self.df = df
        self.user_answers = {}  # 문제번호: 작성한 코드
        self.user_results = {}  # 문제번호: 실행 결과
        self.current_question = 0
        
    def execute_code(self, code, dataset_url):
        """코드 실행 및 결과 반환"""
        try:
            # 데이터셋 로드
            exec(f"import pandas as pd")
            exec(f"df = pd.read_csv('{dataset_url}')")
            
            # 사용자 코드 실행
            exec_globals = {'pd': pd, 'df': df, 'np': np, 'len': len}
            exec_locals = {}
            
            # 코드 실행
            exec(code, exec_globals, exec_locals)
            
            # 결과 추출 (마지막 표현식의 결과)
            # exec는 None을 반환하므로, 출력을 캡처해야 함
            old_stdout = sys.stdout
            sys.stdout = mystdout = io.StringIO()
            
            try:
                # 코드를 다시 실행하여 출력 캡처
                exec(code, exec_globals, exec_locals)
            finally:
                sys.stdout = old_stdout
            
            output = mystdout.getvalue()
            
            # 결과가 없으면 마지막 표현식의 값을 찾기
            if not output:
                # 코드의 마지막 줄이 표현식인지 확인
                lines = code.strip().split('\n')
                last_line = lines[-1].strip()
                if last_line and not last_line.startswith('#'):
                    try:
                        # 마지막 표현식 실행
                        result = eval(last_line, exec_globals, exec_locals)
                        return str(result), None
                    except:
                        pass
            
            return output.strip(), None
            
        except Exception as e:
            return None, str(e)
    
    def compare_results(self, user_result, correct_code, dataset_url):
        """정답 코드 실행 결과와 비교"""
        try:
            # 정답 코드 실행
            exec(f"import pandas as pd")
            exec(f"df = pd.read_csv('{dataset_url}')")
            
            exec_globals = {'pd': pd, 'df': df, 'np': np, 'len': len}
            exec_locals = {}
            
            # 정답 코드 실행
            exec(correct_code, exec_globals, exec_locals)
            
            # 마지막 표현식의 결과 추출
            lines = correct_code.strip().split('\n')
            last_line = lines[-1].strip()
            if last_line and not last_line.startswith('#'):
                correct_result = eval(last_line, exec_globals, exec_locals)
                correct_result_str = str(correct_result)
            else:
                correct_result_str = "실행 완료"
            
            # 결과 비교
            user_result_str = str(user_result) if user_result else ""
            
            # 숫자 비교 (부동소수점 오차 고려)
            try:
                user_float = float(user_result_str)
                correct_float = float(correct_result_str)
                is_correct = abs(user_float - correct_float) < 0.0001
            except:
                # 문자열 비교
                is_correct = user_result_str.strip() == correct_result_str.strip()
            
            return is_correct, correct_result_str
            
        except Exception as e:
            return False, f"정답 코드 실행 오류: {str(e)}"
    
    def show_question(self, question_num):
        """실습 문제 표시 및 코드 작성 UI"""
        if question_num < 1 or question_num > len(self.df):
            print("문제 번호가 올바르지 않습니다.")
            return
        
        self.current_question = question_num
        row_idx = question_num - 1
        row = self.df.iloc[row_idx]
        
        # 문제 정보 추출
        try:
            problem_type = str(row.get('문제유형', '데이터분석')).strip()
            question = str(row['문제']).strip()
            dataset_url = str(row['데이터셋URL']).strip()
            code_template = str(row['코드템플릿']).strip()
            correct_code = str(row['정답코드']).strip()
            explanation = str(row['해설']).strip()
            difficulty = str(row.get('난이도', '초급')).strip()
        except KeyError as e:
            print(f"⚠️ 오류: 컬럼을 찾을 수 없습니다: {e}")
            print(f"사용 가능한 컬럼: {row.index.tolist()}")
            return
        
        # 문제 UI
        question_html = widgets.HTML(
            value=f"""
            <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #2196F3;">
                <h2 style="margin-top: 0; color: #1976D2;">문제 {question_num} / {len(self.df)} [{difficulty}]</h2>
                <p style="font-size: 16px; font-weight: bold; color: #333; margin-bottom: 10px;">{question}</p>
                <p style="font-size: 14px; color: #666;">
                    <strong>문제 유형:</strong> {problem_type}<br>
                    <strong>데이터셋:</strong> <a href="{dataset_url}" target="_blank">{dataset_url}</a>
                </p>
            </div>
            """,
            layout=widgets.Layout(width='100%')
        )
        
        # 코드 입력 영역
        code_textarea = widgets.Textarea(
            value=self.user_answers.get(question_num, code_template),
            placeholder='여기에 코드를 작성하세요...',
            description='코드 작성:',
            layout=widgets.Layout(width='100%', height='200px'),
            style={'description_width': 'initial'}
        )
        
        # 실행 결과 출력 영역
        result_output = widgets.Output(layout=widgets.Layout(width='100%'))
        
        # 버튼 생성
        button_layout = widgets.Layout(width='120px', margin='5px')
        
        prev_button = widgets.Button(
            description='◀ 이전',
            button_style='info',
            layout=button_layout,
            disabled=(question_num == 1)
        )
        
        run_button = widgets.Button(
            description='▶ 실행',
            button_style='primary',
            layout=button_layout
        )
        
        check_button = widgets.Button(
            description='✓ 정답 확인',
            button_style='warning',
            layout=button_layout
        )
        
        next_button = widgets.Button(
            description='다음 ▶',
            button_style='info',
            layout=button_layout,
            disabled=(question_num == len(self.df))
        )
        
        def run_code(b):
            """코드 실행"""
            user_code = code_textarea.value
            if not user_code or user_code.strip() == code_template.strip():
                with result_output:
                    clear_output()
                    print("⚠️ 코드를 작성해주세요!")
                return
            
            # 코드 저장
            self.user_answers[question_num] = user_code
            
            # 코드 실행
            result, error = self.execute_code(user_code, dataset_url)
            
            with result_output:
                clear_output()
                if error:
                    print(f"❌ 실행 오류:\n{error}")
                else:
                    print(f"✅ 실행 결과:\n{result}")
                    self.user_results[question_num] = result
        
        def check_answer(b):
            """정답 확인"""
            user_code = code_textarea.value
            if not user_code or user_code.strip() == code_template.strip():
                with result_output:
                    clear_output()
                    print("⚠️ 코드를 작성해주세요!")
                return
            
            # 코드 저장
            self.user_answers[question_num] = user_code
            
            # 사용자 코드 실행
            user_result, error = self.execute_code(user_code, dataset_url)
            
            if error:
                with result_output:
                    clear_output()
                    print(f"❌ 실행 오류:\n{error}")
                return
            
            # 정답과 비교
            is_correct, correct_result = self.compare_results(user_result, correct_code, dataset_url)
            
            with result_output:
                clear_output()
                if is_correct:
                    print("✅ 정답입니다!")
                else:
                    print(f"❌ 오답입니다.")
                    print(f"\n📝 내 결과: {user_result}")
                    print(f"📝 정답 결과: {correct_result}")
                
                print(f"\n💡 해설: {explanation}")
        
        def show_prev(b):
            """이전 문제"""
            if question_num > 1:
                clear_output(wait=True)
                self.show_question(question_num - 1)
        
        def show_next(b):
            """다음 문제"""
            if question_num < len(self.df):
                clear_output(wait=True)
                self.show_question(question_num + 1)
        
        # 버튼 이벤트 연결
        run_button.on_click(run_code)
        check_button.on_click(check_answer)
        prev_button.on_click(show_prev)
        next_button.on_click(show_next)
        
        # UI 표시
        display(question_html)
        display(code_textarea)
        display(widgets.HBox([prev_button, run_button, check_button, next_button]))
        display(result_output)
    
    def show_results(self):
        """시험 결과 표시"""
        total_count = len(self.df)
        correct_count = 0
        
        results_html = """
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1976D2;">📊 실습 결과</h2>
            <table border='1' style='border-collapse: collapse; width: 100%; margin: 15px 0;'>
                <tr style='background-color: #2196F3; color: white;'>
                    <th style='padding: 10px;'>문제</th>
                    <th style='padding: 10px;'>상태</th>
                    <th style='padding: 10px;'>내 결과</th>
                </tr>
        """
        
        for idx, row in self.df.iterrows():
            question_num = idx + 1
            user_code = self.user_answers.get(question_num, '미작성')
            user_result = self.user_results.get(question_num, '미실행')
            
            if user_code != '미작성' and user_result != '미실행':
                # 정답 확인 (간단 버전)
                try:
                    correct_code = str(row['정답코드']).strip()
                    dataset_url = str(row['데이터셋URL']).strip()
                    is_correct, _ = self.compare_results(user_result, correct_code, dataset_url)
                    if is_correct:
                        correct_count += 1
                        status = "✅ 정답"
                        bg_color = "#c8e6c9"
                    else:
                        status = "❌ 오답"
                        bg_color = "#ffcdd2"
                except:
                    status = "⚠️ 확인 필요"
                    bg_color = "#fff9c4"
            else:
                status = "⏸ 미완료"
                bg_color = "#e0e0e0"
            
            results_html += f"""
                <tr style='background-color: {bg_color};'>
                    <td style='padding: 8px; text-align: center;'>{question_num}</td>
                    <td style='padding: 8px; text-align: center;'>{status}</td>
                    <td style='padding: 8px;'>{str(user_result)[:50]}...</td>
                </tr>
            """
        
        score_percent = (correct_count / total_count * 100) if total_count > 0 else 0
        
        results_html += f"""
            </table>
            <h3 style='color: #1976D2;'>
                정답 수: {correct_count}/{total_count} ({score_percent:.1f}%)
            </h3>
        </div>
        """
        
        display(widgets.HTML(value=results_html))

# ============================================
# 3. 문제 풀이 시작
# ============================================

# 문제 풀이 시스템 초기화
solver = PracticeExamSolver(df)

# 1번 문제부터 시작
solver.show_question(1)

# ============================================
# 4. 결과 확인 (모든 문제 풀고 나서 실행)
# ============================================

# 모든 문제를 풀고 나면 아래 코드를 실행하여 결과를 확인하세요
# solver.show_results()


