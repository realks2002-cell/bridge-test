# 브릿지 모의고사 - 자동 실행 (코드는 완전히 숨겨집니다)
from IPython.display import HTML, display, clear_output
import base64

# 코드 실행 전에 셀 숨기기 스크립트 실행
hide_script = """
<script>
(function() {
    // 즉시 코드 셀 숨기기
    function hideCodeCells() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(function(cell) {
            const inputArea = cell.querySelector('.input_area');
            if (inputArea) {
                const cellText = inputArea.textContent || '';
                if (cellText.includes('브릿지 모의고사') || cellText.includes('자동 실행')) {
                    // 코드 셀 완전히 숨기기
                    const inputContainer = cell.querySelector('.input');
                    if (inputContainer) {
                        inputContainer.style.display = 'none';
                        inputContainer.style.visibility = 'hidden';
                        inputContainer.style.height = '0';
                        inputContainer.style.overflow = 'hidden';
                    }
                    // 입력 영역도 숨기기
                    if (inputArea) {
                        inputArea.style.display = 'none';
                        inputArea.style.visibility = 'hidden';
                        inputArea.style.height = '0';
                        inputArea.style.overflow = 'hidden';
                    }
                    // 셀 헤더도 숨기기
                    const cellHeader = cell.querySelector('.cell-header');
                    if (cellHeader) {
                        cellHeader.style.display = 'none';
                    }
                }
            }
        });
    }
    
    // 즉시 실행
    hideCodeCells();
    
    // DOM 변경 감지하여 계속 숨기기
    const observer = new MutationObserver(function(mutations) {
        hideCodeCells();
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // 주기적으로도 확인
    setInterval(hideCodeCells, 100);
})();
</script>
"""

display(HTML(hide_script))

# 실제 코드 실행 (숨겨짐)
exec("""
!pip install ipywidgets -q
import pandas as pd
import ipywidgets as widgets
from IPython.display import display, clear_output
import numpy as np
import warnings
import ast
import io
import sys
import urllib.request
import time
import base64
import json

warnings.filterwarnings('ignore', category=pd.errors.ParserWarning)

csv_url = 'https://bridge-mock-exam-nextjs.vercel.app/data/exam1.csv'
response = urllib.request.urlopen(f"{csv_url}?t={int(time.time())}&v=2")
df = pd.read_csv(io.StringIO(response.read().decode('utf-8-sig')), encoding='utf-8-sig', index_col=False, on_bad_lines='skip', quotechar='"', skipinitialspace=True)
if '문제번호' in df.columns:
    df = df.drop('문제번호', axis=1)

try:
    from google.colab import output
    result = output.eval_js("(function(){const p=new URLSearchParams(window.location.search);const c=p.get('code');return c?JSON.stringify({code:c,problem:p.get('problem')||'1',exam:p.get('exam')||'1'}):null})()")
    web_code = base64.b64decode(json.loads(result)['code']).decode('utf-8') if result and json.loads(result).get('code') else None
except:
    web_code = None

class PracticeExamSolver:
    def __init__(self, df):
        self.df = df
        self.user_answers = {}
        self.user_results = {}
        self.current_question = 0
        
    def execute_code(self, code, dataset_url):
        try:
            exec(f"import pandas as pd")
            exec(f"df = pd.read_csv('{dataset_url}')")
            exec_globals = {'pd': pd, 'df': df, 'np': np, 'len': len}
            exec_locals = {}
            exec(code, exec_globals, exec_locals)
            old_stdout = sys.stdout
            sys.stdout = mystdout = io.StringIO()
            try:
                exec(code, exec_globals, exec_locals)
            finally:
                sys.stdout = old_stdout
            output = mystdout.getvalue()
            if not output:
                lines = code.strip().split('\\n')
                last_line = lines[-1].strip()
                if last_line and not last_line.startswith('#'):
                    try:
                        result = eval(last_line, exec_globals, exec_locals)
                        return str(result), None
                    except:
                        pass
            return output.strip(), None
        except Exception as e:
            return None, str(e)
    
    def compare_results(self, user_result, correct_code, dataset_url):
        try:
            exec(f"import pandas as pd")
            exec(f"df = pd.read_csv('{dataset_url}')")
            exec_globals = {'pd': pd, 'df': df, 'np': np, 'len': len}
            exec_locals = {}
            exec(correct_code, exec_globals, exec_locals)
            lines = correct_code.strip().split('\\n')
            last_line = lines[-1].strip()
            correct_result = eval(last_line, exec_globals, exec_locals) if last_line and not last_line.startswith('#') else None
            correct_result_str = str(correct_result) if correct_result else "실행 완료"
            user_result_str = str(user_result) if user_result else ""
            try:
                user_float = float(user_result_str)
                correct_float = float(correct_result_str)
                is_correct = abs(user_float - correct_float) < 0.0001
            except:
                is_correct = user_result_str.strip() == correct_result_str.strip()
            return is_correct, correct_result_str
        except Exception as e:
            return False, f"정답 코드 실행 오류: {str(e)}"
    
    def show_question(self, question_num):
        if question_num < 1 or question_num > len(self.df):
            print("문제 번호가 올바르지 않습니다.")
            return
        self.current_question = question_num
        row_idx = question_num - 1
        row = self.df.iloc[row_idx]
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
        
        code_template_preview = code_template.split('\\n')[0] if code_template else ''
        question_html = widgets.HTML(
            value=f"""<div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #2196F3;"><h2 style="margin-top: 0; color: #1976D2;">문제 {question_num} / {len(self.df)} [{difficulty}]</h2><p style="font-size: 16px; font-weight: bold; color: #333; margin-bottom: 10px;">{question}</p><p style="font-size: 14px; color: #666;"><strong>문제 유형:</strong> {problem_type}<br><strong>데이터셋:</strong> <a href="{dataset_url}" target="_blank">{dataset_url}</a></p>{f'<p style="font-size: 13px; color: #888; margin-top: 10px; padding: 8px; background-color: #f5f5f5; border-radius: 4px;"><strong>💡 힌트:</strong> {code_template_preview}...</p>' if code_template_preview else ''}</div>""",
            layout=widgets.Layout(width='100%')
        )
        code_textarea = widgets.Textarea(
            value=self.user_answers.get(question_num, ''),
            placeholder=code_template if code_template else '여기에 코드를 작성하세요...',
            description='코드 작성:',
            layout=widgets.Layout(width='100%', height='200px'),
            style={'description_width': 'initial'}
        )
        result_output = widgets.Output(layout=widgets.Layout(width='100%'))
        button_layout = widgets.Layout(width='120px', margin='5px')
        prev_button = widgets.Button(description='◀ 이전', button_style='info', layout=button_layout, disabled=(question_num == 1))
        run_button = widgets.Button(description='▶ 실행', button_style='primary', layout=button_layout)
        check_button = widgets.Button(description='✓ 정답 확인', button_style='warning', layout=button_layout)
        next_button = widgets.Button(description='다음 ▶', button_style='info', layout=button_layout, disabled=(question_num == len(self.df)))
        
        def run_code(b):
            user_code = code_textarea.value
            if not user_code or not user_code.strip():
                with result_output:
                    clear_output()
                    print("⚠️ 코드를 작성해주세요!")
                return
            self.user_answers[question_num] = user_code
            result, error = self.execute_code(user_code, dataset_url)
            with result_output:
                clear_output()
                if error:
                    print(f"❌ 실행 오류:\\n{error}")
                else:
                    print(f"✅ 실행 결과:\\n{result}")
                    self.user_results[question_num] = result
        
        def check_answer(b):
            user_code = code_textarea.value
            if not user_code or not user_code.strip():
                with result_output:
                    clear_output()
                    print("⚠️ 코드를 작성해주세요!")
                return
            self.user_answers[question_num] = user_code
            user_result, error = self.execute_code(user_code, dataset_url)
            if error:
                with result_output:
                    clear_output()
                    print(f"❌ 실행 오류:\\n{error}")
                return
            is_correct, correct_result = self.compare_results(user_result, correct_code, dataset_url)
            with result_output:
                clear_output()
                if is_correct:
                    print("✅ 정답입니다!")
                else:
                    print(f"❌ 오답입니다.\\n\\n📝 내 결과: {user_result}\\n📝 정답 결과: {correct_result}")
                print(f"\\n💡 해설: {explanation}")
        
        def show_prev(b):
            if question_num > 1:
                clear_output(wait=True)
                self.show_question(question_num - 1)
        
        def show_next(b):
            if question_num < len(self.df):
                clear_output(wait=True)
                self.show_question(question_num + 1)
        
        run_button.on_click(run_code)
        check_button.on_click(check_answer)
        prev_button.on_click(show_prev)
        next_button.on_click(show_next)
        
        display(question_html)
        display(code_textarea)
        display(widgets.HBox([prev_button, run_button, check_button, next_button]))
        display(result_output)
    
    def show_results(self):
        total_count = len(self.df)
        correct_count = 0
        results_html = """<div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;"><h2 style="color: #1976D2;">📊 실습 결과</h2><table border='1' style='border-collapse: collapse; width: 100%; margin: 15px 0;'><tr style='background-color: #2196F3; color: white;'><th style='padding: 10px;'>문제</th><th style='padding: 10px;'>상태</th><th style='padding: 10px;'>내 결과</th></tr>"""
        for idx, row in self.df.iterrows():
            question_num = idx + 1
            user_code = self.user_answers.get(question_num, '미작성')
            user_result = self.user_results.get(question_num, '미실행')
            if user_code != '미작성' and user_result != '미실행':
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
            results_html += f"""<tr style='background-color: {bg_color};'><td style='padding: 8px; text-align: center;'>{question_num}</td><td style='padding: 8px; text-align: center;'>{status}</td><td style='padding: 8px;'>{str(user_result)[:50]}...</td></tr>"""
        score_percent = (correct_count / total_count * 100) if total_count > 0 else 0
        results_html += f"""</table><h3 style='color: #1976D2;'>정답 수: {correct_count}/{total_count} ({score_percent:.1f}%)</h3></div>"""
        display(widgets.HTML(value=results_html))

solver = PracticeExamSolver(df)
solver.show_question(1)
""")

# 코드 셀 완전히 제거 (최종 시도)
try:
    from google.colab import output
    output.eval_js("""
    setTimeout(function() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(function(cell) {
            const inputArea = cell.querySelector('.input_area');
            if (inputArea) {
                const cellText = inputArea.textContent || '';
                if (cellText.includes('브릿지 모의고사') || cellText.includes('자동 실행')) {
                    // 코드 셀 완전히 제거
                    const inputContainer = cell.querySelector('.input');
                    if (inputContainer) {
                        inputContainer.remove();
                    }
                    if (inputArea) {
                        inputArea.remove();
                    }
                    const cellHeader = cell.querySelector('.cell-header');
                    if (cellHeader) {
                        cellHeader.remove();
                    }
                }
            }
        });
    }, 1000);
    """)
except:
    pass
