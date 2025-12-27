# 브릿지 모의고사 - Colab 위젯 UI 템플릿
"""
이 템플릿은 학생에게는 위젯 UI만 노출되고,
실제 실행/정답 검증 로직은 백엔드 함수에서 처리되도록 구성했습니다.

실행 흐름
1. 필요한 패키지 설치 후 `clear_output(wait=True)`로 원본 셀을 비움
2. CSV / URL 파라미터 로딩
3. ipywidgets UI 렌더링 (질문, 코드 입력, 실행/정답 버튼)
"""

import subprocess
import sys

# Colab 런타임에 ipywidgets가 없으면 설치 (이미 설치되었으면 빠르게 종료)
subprocess.run([sys.executable, "-m", "pip", "install", "ipywidgets", "-q"], check=True)

import pandas as pd
import ipywidgets as widgets
from IPython.display import display, clear_output
import numpy as np
import warnings
import ast
import io
import urllib.request
import time
import base64
import json

# 코드 셀 출력 제거 → 학생에게는 오직 위젯 UI만 표시
clear_output(wait=True)

warnings.filterwarnings('ignore', category=pd.errors.ParserWarning)

CSV_URL = "https://bridge-mock-exam-nextjs.vercel.app/data/exam1.csv"


def load_exam_dataframe(csv_url: str) -> pd.DataFrame:
    """CSV를 읽어 DataFrame으로 반환."""
    response = urllib.request.urlopen(f"{csv_url}?t={int(time.time())}&v=2")
    df = pd.read_csv(
        io.StringIO(response.read().decode("utf-8-sig")),
        encoding="utf-8-sig",
        index_col=False,
        on_bad_lines="skip",
        quotechar='"',
        skipinitialspace=True,
    )
    if "문제번호" in df.columns:
        df = df.drop("문제번호", axis=1)
    return df


def read_url_params():
    """웹에서 전달된 코드/문제 번호 파라미터를 읽어온다."""
    try:
        from google.colab import output

        result = output.eval_js(
            """
        (function(){
          const params = new URLSearchParams(window.location.search);
          const code = params.get('code');
          const problem = params.get('problem') || '1';
          const exam = params.get('exam') || '1';
          if (code) {
            return JSON.stringify({code, problem, exam});
          }
          return null;
        })()
        """
        )
        if result:
            data = json.loads(result)
            decoded_code = (
                base64.b64decode(data["code"]).decode("utf-8") if data.get("code") else None
            )
            return {
                "code": decoded_code,
                "problem": int(data.get("problem", "1")),
                "exam": data.get("exam", "1"),
            }
    except Exception:
        pass
    return {"code": None, "problem": 1, "exam": "1"}


class PracticeExamSolver:
    def __init__(self, df):
        self.df = df
        self.user_answers = {}
        self.user_results = {}
        self.current_question = 0
        params = read_url_params()
        self.prefill_code = params["code"]
        self.prefill_problem = params["problem"]

    def execute_code(self, code, dataset_url):
        """사용자 코드를 실행하고 표준 출력/결과를 반환."""
        try:
            exec_globals = {"pd": pd, "np": np, "len": len}
            exec_locals = {}
            exec(f"df = pd.read_csv('{dataset_url}')", exec_globals, exec_locals)

            # 1차 실행 (변수 정의)
            exec(code, exec_globals, exec_locals)

            # 2차 실행하며 stdout 캡처
            old_stdout = sys.stdout
            sys.stdout = mystdout = io.StringIO()
            try:
                exec(code, exec_globals, exec_locals)
            finally:
                sys.stdout = old_stdout

            output_text = mystdout.getvalue().strip()
            if output_text:
                return output_text, None

            # 출력이 없다면 마지막 표현식 평가
            lines = [ln for ln in code.strip().split("\n") if ln.strip()]
            last_line = lines[-1].strip() if lines else ""
            if last_line and not last_line.startswith("#"):
                try:
                    result = eval(last_line, exec_globals, exec_locals)
                    return str(result), None
                except Exception:
                    pass

            return "", None
        except Exception as e:
            return None, str(e)

    def compare_results(self, user_result, correct_code, dataset_url):
        """정답 코드와 결과를 비교."""
        try:
            exec_globals = {"pd": pd, "np": np, "len": len}
            exec_locals = {}
            exec(f"df = pd.read_csv('{dataset_url}')", exec_globals, exec_locals)
            exec(correct_code, exec_globals, exec_locals)

            lines = [ln for ln in correct_code.strip().split("\n") if ln.strip()]
            last_line = lines[-1].strip() if lines else ""
            if last_line and not last_line.startswith("#"):
                correct_result = eval(last_line, exec_globals, exec_locals)
                correct_result_str = str(correct_result)
            else:
                correct_result_str = "실행 완료"

            user_result_str = str(user_result) if user_result else ""

            try:
                return abs(float(user_result_str) - float(correct_result_str)) < 0.0001, correct_result_str
            except Exception:
                return user_result_str.strip() == correct_result_str.strip(), correct_result_str
        except Exception as e:
            return False, f"정답 코드 실행 오류: {e}"

    def show_question(self, question_num):
        """문제 UI 구성."""
        if question_num < 1 or question_num > len(self.df):
            print("문제 번호가 올바르지 않습니다.")
            return

        self.current_question = question_num
        row = self.df.iloc[question_num - 1]

        try:
            problem_type = str(row.get("문제유형", "데이터분석")).strip()
            question = str(row["문제"]).strip()
            dataset_url = str(row["데이터셋URL"]).strip()
            code_template = str(row["코드템플릿"]).strip()
            correct_code = str(row["정답코드"]).strip()
            explanation = str(row["해설"]).strip()
            difficulty = str(row.get("난이도", "초급")).strip()
        except KeyError as e:
            print(f"[경고] 컬럼을 찾을 수 없습니다: {e}")
            print(f"사용 가능한 컬럼: {row.index.tolist()}")
            return

        code_template_preview = code_template.split("\n")[0] if code_template else ""
        hint_html = ""
        if code_template_preview:
            hint_html = (
                f'<p style="font-size: 13px; color: #888; margin-top: 10px; '
                f'padding: 8px; background-color: #f5f5f5; border-radius: 4px;">'
                f"<strong>[힌트]</strong> {code_template_preview}...</p>"
            )

        question_html = widgets.HTML(
            value=(
                f"<div style='background-color: #e3f2fd; padding: 20px; border-radius: 8px; "
                f"margin-bottom: 15px; border-left: 4px solid #2196F3;'>"
                f"<h2 style='margin-top: 0; color: #1976D2;'>문제 {question_num} / {len(self.df)} [{difficulty}]</h2>"
                f"<p style='font-size: 16px; font-weight: bold; color: #333; margin-bottom: 10px;'>{question}</p>"
                f"<p style='font-size: 14px; color: #666;'><strong>문제 유형:</strong> {problem_type}<br>"
                f"<strong>데이터셋:</strong> <a href='{dataset_url}' target='_blank'>{dataset_url}</a></p>"
                f"{hint_html}</div>"
            ),
            layout=widgets.Layout(width="100%"),
        )

        default_value = self.user_answers.get(question_num, "")
        if not default_value and self.prefill_code and question_num == self.prefill_problem:
            default_value = self.prefill_code

        code_textarea = widgets.Textarea(
            value=default_value,
            placeholder=code_template if code_template else "여기에 코드를 작성하세요...",
            description="코드 작성:",
            layout=widgets.Layout(width="100%", height="220px"),
            style={"description_width": "initial"},
        )

        result_output = widgets.Output(layout=widgets.Layout(width="100%"))
        button_layout = widgets.Layout(width="140px", margin="5px")

        prev_button = widgets.Button(
            description="◀ 이전",
            button_style="info",
            layout=button_layout,
            disabled=(question_num == 1),
        )
        run_button = widgets.Button(description="▶ 실행", button_style="primary", layout=button_layout)
        check_button = widgets.Button(description="정답 확인", button_style="warning", layout=button_layout)
        next_button = widgets.Button(
            description="다음 ▶",
            button_style="info",
            layout=button_layout,
            disabled=(question_num == len(self.df)),
        )

        def run_code(_):
            user_code = code_textarea.value
            if not user_code.strip():
                with result_output:
                    clear_output()
                    print("[경고] 코드를 작성해주세요!")
                return

            self.user_answers[question_num] = user_code
            result, error = self.execute_code(user_code, dataset_url)
            with result_output:
                clear_output()
                if error:
                    print(f"[오류] 실행 오류:\n{error}")
                else:
                    print(f"[실행 결과]\n{result or '(출력 없음)'}")
                    self.user_results[question_num] = result

        def check_answer(_):
            user_code = code_textarea.value
            if not user_code.strip():
                with result_output:
                    clear_output()
                    print("[경고] 코드를 작성해주세요!")
                return

            self.user_answers[question_num] = user_code
            user_result, error = self.execute_code(user_code, dataset_url)
            if error:
                with result_output:
                    clear_output()
                    print(f"[오류] 실행 오류:\n{error}")
                return

            is_correct, correct_result = self.compare_results(user_result, correct_code, dataset_url)
            with result_output:
                clear_output()
                if is_correct:
                    print("[정답] 정답입니다!")
                else:
                    print(f"[오답] 내 결과: {user_result}")
                    print(f"[오답] 정답 결과: {correct_result}")
                print(f"\n[해설]\n{explanation}")

        def show_prev(_):
            if question_num > 1:
                clear_output(wait=True)
                self.show_question(question_num - 1)

        def show_next(_):
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
        """전체 결과 요약."""
        total_count = len(self.df)
        correct_count = 0
        rows_html = []

        for idx, row in self.df.iterrows():
            question_num = idx + 1
            user_code = self.user_answers.get(question_num, "미작성")
            user_result = self.user_results.get(question_num, "미실행")

            if user_code != "미작성" and user_result != "미실행":
                try:
                    correct_code = str(row["정답코드"]).strip()
                    dataset_url = str(row["데이터셋URL"]).strip()
                    is_correct, _ = self.compare_results(user_result, correct_code, dataset_url)
                    if is_correct:
                        correct_count += 1
                        status = "[정답] 정답"
                        bg_color = "#c8e6c9"
                    else:
                        status = "[오답] 오답"
                        bg_color = "#ffcdd2"
                except Exception:
                    status = "[경고] 확인 필요"
                    bg_color = "#fff9c4"
            else:
                status = "[미완료] 미완료"
                bg_color = "#e0e0e0"

            rows_html.append(
                f"<tr style='background-color: {bg_color};'>"
                f"<td style='padding:8px; text-align:center;'>{question_num}</td>"
                f"<td style='padding:8px; text-align:center;'>{status}</td>"
                f"<td style='padding:8px;'>{str(user_result)[:80]}...</td>"
                f"</tr>"
            )

        score_percent = (correct_count / total_count * 100) if total_count else 0
        score_percent_str = str(round(score_percent, 1))

        html = (
            "<div style='background-color:#f5f5f5; padding:20px; border-radius:8px; margin:20px 0;'>"
            "<h2 style='color:#1976D2;'>[결과] 실습 요약</h2>"
            "<table border='1' style='border-collapse: collapse; width: 100%; margin: 15px 0;'>"
            "<tr style='background-color:#2196F3; color:white;'>"
            "<th style='padding:10px;'>문제</th>"
            "<th style='padding:10px;'>상태</th>"
            "<th style='padding:10px;'>내 결과</th>"
            "</tr>"
            + "".join(rows_html)
            + "</table>"
            + f"<h3 style='color:#1976D2;'>정답 수: {correct_count}/{total_count} ({score_percent_str}%)</h3>"
            + "</div>"
        )
        display(widgets.HTML(value=html))


# ==============================
# 실행 시작
# ==============================
exam_df = load_exam_dataframe(CSV_URL)
solver = PracticeExamSolver(exam_df)
solver.show_question(1)

