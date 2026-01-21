/**
 * ============================================================================
 * Python練習問題100選 - アプリケーションロジック
 * ============================================================================
 * 
 * このファイルはPython練習問題Webアプリのメインロジックを含みます。
 * 
 * 構造:
 * - ExerciseApp クラス
 *   - 初期化 (constructor, init, initPyodide)
 *   - データ永続化 (loadCompleted, saveCompleted, loadUserCodes, saveUserCodes)
 *   - UI更新 (updateProgress, renderExerciseLists, loadExercise, updateLineNumbers)
 *   - イベントハンドリング (bindEvents)
 *   - コード実行・検証 (runCode, verifyOutput)
 *   - 出力例・模範解答 (getExampleOutput, showSampleAnswer, getSampleAnswer)
 *   - データ管理 (exportData, importData)
 *   - ユーティリティ (showToast)
 * 
 * 依存関係:
 * - exercises.js (練習問題データ)
 * - Pyodide (ブラウザ内Python実行環境)
 */

class ExerciseApp {
    constructor() {
        this.currentExerciseId = 1;
        this.completedExercises = this.loadCompleted();
        this.userCodes = this.loadUserCodes();

        this.init();
    }

    async init() {
        this.renderExerciseLists();
        this.loadExercise(this.currentExerciseId);
        this.bindEvents();
        this.updateProgress();

        // Pyodideのロード開始
        await this.initPyodide();
    }

    // Pyodideの初期化
    async initPyodide() {
        try {
            const runBtn = document.getElementById('runBtn');
            const runBtnText = document.getElementById('runBtnText');

            this.pyodide = await loadPyodide();

            runBtn.disabled = false;
            runBtnText.textContent = "実行 (Run)";
            console.log("Pyodide loaded successfully");
        } catch (err) {
            console.error("Failed to load Pyodide:", err);
            document.getElementById('runBtnText').textContent = "Load Failed";
        }
    }

    // LocalStorage関連
    loadCompleted() {
        const saved = localStorage.getItem('python100_completed');
        return saved ? JSON.parse(saved) : [];
    }

    saveCompleted() {
        localStorage.setItem('python100_completed', JSON.stringify(this.completedExercises));
    }

    loadUserCodes() {
        const saved = localStorage.getItem('python100_codes');
        return saved ? JSON.parse(saved) : {};
    }

    saveUserCodes() {
        localStorage.setItem('python100_codes', JSON.stringify(this.userCodes));
    }

    // 問題リストをサイドバーに描画
    renderExerciseLists() {
        const categories = {
            'basics': { list: 'basics-list', range: [1, 20] },
            'input': { list: 'input-list', range: [21, 30] },
            'condition': { list: 'condition-list', range: [31, 50] },
            'loop': { list: 'loop-list', range: [51, 70] },
            'list': { list: 'list-list', range: [71, 85] },
            'advanced': { list: 'advanced-list', range: [86, 100] }
        };

        Object.entries(categories).forEach(([cat, config]) => {
            const listEl = document.getElementById(config.list);
            const exercisesInCat = exercises.filter(e =>
                e.id >= config.range[0] && e.id <= config.range[1]
            );

            listEl.innerHTML = exercisesInCat.map(ex => `
                <li data-id="${ex.id}" class="${this.completedExercises.includes(ex.id) ? 'completed' : ''}">
                    ${String(ex.id).padStart(2, '0')}. ${ex.title}
                </li>
            `).join('');
        });
    }

    // 問題を読み込んで表示
    loadExercise(id) {
        const exercise = exercises.find(e => e.id === id);
        if (!exercise) return;

        this.currentExerciseId = id;

        // ヘッダー更新
        document.getElementById('exerciseBadge').textContent = `問題 ${String(id).padStart(2, '0')}`;
        document.getElementById('exerciseTitle').textContent = exercise.title;
        document.getElementById('skillTag').textContent = exercise.skill;

        // コンテンツ更新
        document.getElementById('taskDescription').textContent = exercise.task;
        document.getElementById('hintContent').textContent = `学習スキル: ${exercise.skill}`;
        document.getElementById('explanationContent').textContent = exercise.explanation;

        // 出力例を更新
        const exampleOutputEl = document.getElementById('exampleOutput');
        exampleOutputEl.textContent = this.getExampleOutput(exercise);

        // コードエディタ更新
        const codeEditor = document.getElementById('codeEditor');
        codeEditor.value = this.userCodes[id] || '';
        this.updateLineNumbers();

        // 完了ボタン更新
        const completeBtn = document.getElementById('completeBtn');
        if (this.completedExercises.includes(id)) {
            completeBtn.textContent = '✓ 完了済み';
            completeBtn.classList.add('completed');
        } else {
            completeBtn.textContent = '✓ 完了にする';
            completeBtn.classList.remove('completed');
        }

        // ナビゲーションボタン更新
        document.getElementById('prevBtn').disabled = id === 1;
        document.getElementById('nextBtn').disabled = id === 100;

        // サイドバーのアクティブ状態更新
        document.querySelectorAll('.exercise-list li').forEach(li => {
            li.classList.remove('active');
            if (parseInt(li.dataset.id) === id) {
                li.classList.add('active');
                // カテゴリを開く
                const category = li.closest('.category');
                if (category && !category.classList.contains('open')) {
                    category.classList.add('open');
                }
            }
        });

        // 解説を閉じる
        document.querySelector('.explanation-card').classList.add('collapsed');

        // 結果表示をリセット
        document.getElementById('consoleOutput').textContent = "実行待ち...";
        document.getElementById('consoleOutput').className = "console";
        document.getElementById('statusIndicator').textContent = "";

        // 模範解答パネルを非表示
        document.getElementById('sampleAnswerPanel').style.display = 'none';

        // スクロールをトップに
        document.querySelector('.content-body').scrollTop = 0;
    }

    // 行番号を更新
    updateLineNumbers() {
        const codeEditor = document.getElementById('codeEditor');
        const lineNumbers = document.getElementById('lineNumbers');
        const lines = codeEditor.value.split('\n').length;

        lineNumbers.innerHTML = Array.from({ length: Math.max(lines, 10) }, (_, i) => i + 1).join('<br>');
    }

    // 進捗を更新
    updateProgress() {
        const count = this.completedExercises.length;
        document.getElementById('completedCount').textContent = count;
        document.getElementById('progressFill').style.width = `${count}%`;
    }

    // イベントバインド
    bindEvents() {
        // カテゴリの開閉
        document.querySelectorAll('.category-header').forEach(header => {
            header.addEventListener('click', () => {
                header.closest('.category').classList.toggle('open');
            });
        });

        // 問題選択
        document.querySelectorAll('.exercise-list').forEach(list => {
            list.addEventListener('click', (e) => {
                const li = e.target.closest('li');
                if (li) {
                    this.loadExercise(parseInt(li.dataset.id));
                }
            });
        });

        // コードエディタ
        const codeEditor = document.getElementById('codeEditor');
        codeEditor.addEventListener('input', () => {
            this.updateLineNumbers();
        });

        codeEditor.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = codeEditor.selectionStart;
                const end = codeEditor.selectionEnd;
                codeEditor.value = codeEditor.value.substring(0, start) + '    ' + codeEditor.value.substring(end);
                codeEditor.selectionStart = codeEditor.selectionEnd = start + 4;
            }
        });

        // 実行ボタン
        document.getElementById('runBtn').addEventListener('click', () => {
            this.runCode();
        });

        // Ctrl+Enterで実行
        codeEditor.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                this.runCode();
            }
        });

        // 保存ボタン
        document.getElementById('saveBtn').addEventListener('click', () => {
            this.userCodes[this.currentExerciseId] = codeEditor.value;
            this.saveUserCodes();
            this.showToast('コードを保存しました！');
        });

        // リセットボタン
        document.getElementById('resetBtn').addEventListener('click', () => {
            if (confirm('コードをリセットしますか？')) {
                codeEditor.value = '';
                delete this.userCodes[this.currentExerciseId];
                this.saveUserCodes();
                this.updateLineNumbers();
            }
        });

        // 完了ボタン
        document.getElementById('completeBtn').addEventListener('click', () => {
            const id = this.currentExerciseId;
            if (this.completedExercises.includes(id)) {
                this.completedExercises = this.completedExercises.filter(i => i !== id);
            } else {
                this.completedExercises.push(id);
            }
            this.saveCompleted();
            this.renderExerciseLists();
            this.loadExercise(id);
            this.updateProgress();
        });

        // ナビゲーション
        document.getElementById('prevBtn').addEventListener('click', () => {
            if (this.currentExerciseId > 1) {
                this.loadExercise(this.currentExerciseId - 1);
            }
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            if (this.currentExerciseId < 100) {
                this.loadExercise(this.currentExerciseId + 1);
            }
        });

        // 解説の開閉
        document.getElementById('explanationToggle').addEventListener('click', () => {
            document.querySelector('.explanation-card').classList.toggle('collapsed');
        });

        // 検索
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filterExercises(e.target.value);
        });

        // キーボードショートカット
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'TEXTAREA') return;

            if (e.key === 'ArrowLeft') {
                document.getElementById('prevBtn').click();
            } else if (e.key === 'ArrowRight') {
                document.getElementById('nextBtn').click();
            }
        });

        // データエクスポート
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportData();
        });

        // データインポートボタン
        document.getElementById('importBtn').addEventListener('click', () => {
            document.getElementById('importInput').click();
        });

        // ファイル選択時
        document.getElementById('importInput').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.importData(e.target.files[0]);
                e.target.value = ''; // リセット
            }
        });

        // 模範解答トグルボタン
        document.getElementById('toggleSampleBtn').addEventListener('click', () => {
            const codeEl = document.getElementById('sampleCode');
            const toggleBtn = document.getElementById('toggleSampleBtn');
            if (codeEl.style.display === 'none') {
                codeEl.style.display = 'block';
                toggleBtn.textContent = '非表示';
            } else {
                codeEl.style.display = 'none';
                toggleBtn.textContent = '表示';
            }
        });
    }

    // コード実行・採点ロジック
    async runCode() {
        const code = document.getElementById('codeEditor').value;
        const consoleEl = document.getElementById('consoleOutput');
        const statusEl = document.getElementById('statusIndicator');
        const exercise = exercises.find(e => e.id === this.currentExerciseId);

        consoleEl.textContent = "実行中...\n";
        consoleEl.className = "console";
        statusEl.textContent = "";

        if (!this.pyodide) {
            consoleEl.textContent = "Python環境の準備ができていません。少々お待ちください。";
            return;
        }

        try {
            // 標準出力をキャプチャするためのセットアップ
            this.pyodide.setStdout({
                batched: (msg) => {
                    if (consoleEl.textContent === "実行中...\n") {
                        consoleEl.textContent = "";
                    }
                    consoleEl.textContent += msg + "\n";
                }
            });

            // input()関数のモック化（期待される入力がある場合）
            let inputs = [];
            if (exercise.expected && exercise.expected.type === 'io') {
                inputs = [...exercise.expected.inputs]; // コピーを作成
            }

            // input()を上書きするPythonコード
            // inputs配列から順番に値を返すようにする
            const mockInputCode = `
import builtins
_input_iter = iter(${JSON.stringify(inputs)})
def input(prompt=''):
    try:
        val = next(_input_iter)
        print(f"{prompt}{val}") # プロンプトと入力値を表示
        return str(val)
    except StopIteration:
        return ""

builtins.input = input
`;
            if (inputs.length > 0) {
                await this.pyodide.runPythonAsync(mockInputCode);
            } else {
                // inputを使わない場合は標準に戻す（念のため）
                await this.pyodide.runPythonAsync(`
import builtins
# input = builtins.input # 元に戻すのは難しいので何もしないか、空を返す
def input(prompt=''): return "" 
builtins.input = input 
`);
            }

            // ユーザーコードの実行
            await this.pyodide.runPythonAsync(code);

            // 結果の検証
            const output = consoleEl.textContent.trim();
            const result = this.verifyOutput(output, exercise);

            if (result.success) {
                statusEl.textContent = "正解！🎉";
                statusEl.className = "success";
                consoleEl.classList.add("success");

                // 初正解なら完了にする
                if (!this.completedExercises.includes(this.currentExerciseId)) {
                    this.completedExercises.push(this.currentExerciseId);
                    this.saveCompleted();
                    this.renderExerciseLists();
                    this.updateProgress();
                    // 完了ボタンの表示を更新（loadExerciseを呼ばない）
                    const completeBtn = document.getElementById('completeBtn');
                    completeBtn.textContent = '✓ 完了済み';
                    completeBtn.classList.add('completed');
                    this.showToast('正解です！進捗を保存しました👏');
                } else {
                    this.showToast('正解です！👏');
                }
            } else {
                statusEl.textContent = "不正解...";
                statusEl.className = "error";
                consoleEl.classList.add("error");
                consoleEl.textContent += `\n\n[ヒント] ${result.message}`;
            }

            // 模範解答を表示
            this.showSampleAnswer(exercise);

        } catch (err) {
            consoleEl.textContent += `\nエラー:\n${err}`;
            consoleEl.classList.add("error");
            statusEl.textContent = "エラー";
            statusEl.className = "error";

            // エラー時も模範解答を表示
            this.showSampleAnswer(exercise);
        }
    }

    // 出力検証
    verifyOutput(actual, exercise) {
        if (!exercise.expected) {
            // 期待値がない場合はエラーがなければOKとする
            return { success: true, message: "" };
        }

        const expected = exercise.expected;
        const actualTrimmed = actual.trim();

        switch (expected.type) {
            case 'output':
                return {
                    success: actualTrimmed === expected.value,
                    message: `期待される出力: "${expected.value}"`
                };
            case 'contains':
                const missing = expected.value.find(v => !actual.includes(v));
                return {
                    success: !missing,
                    message: `出力に "${missing}" が含まれていません。`
                };
            case 'output_regex':
                return {
                    success: expected.value.test(actualTrimmed),
                    message: "出力形式が正しくありません。"
                };
            case 'io':
                // IO系は output_contains か output_regex で判定
                if (expected.output_contains) {
                    const missingIO = expected.output_contains.find(v => !actual.includes(v));
                    return {
                        success: !missingIO,
                        message: `計算結果 "${missingIO}" が出力に含まれていません。`
                    };
                }
                if (expected.output_regex) {
                    return {
                        success: expected.output_regex.test(actualTrimmed),
                        message: "計算結果の形式が正しくありません。"
                    };
                }
                return { success: true, message: "" };
            default:
                return { success: true, message: "" };
        }
    }

    // 出力例を生成
    getExampleOutput(exercise) {
        // 問題ごとの出力例を定義
        const examples = {
            1: "Hello World",
            2: "私の名前は太郎です\n年齢は20歳です\n趣味はプログラミングです",
            3: "8",
            4: "6",
            5: "42",
            6: "3.75",
            7: "2",
            8: "30",
            9: "5",
            10: "HelloHelloHelloHelloHello",
            11: "年齢は20歳です",
            12: "50",
            13: "110.55",
            14: "78.5",
            15: "77.0",
            16: "BMI: 20.8",
            17: "1行目\n2行目\n3行目",
            18: "名前    年齢\n太郎    20\n花子    25",
            19: "太郎さんの点数は89.5点です",
            20: "Hello",
            21: "こんにちは、花子さん！",
            22: "5の2倍は10です",
            23: "合計: 30",
            24: "あなたは26歳です",
            25: "1人あたり: 250円",
            26: "税込価格: 1100円",
            27: "170cmは1.7mです",
            28: "平均: 80.0",
            29: "2分30秒",
            30: "こんにちは、太郎さん",
            31: "正の数",
            32: "偶数",
            33: "合格",
            34: "B",
            35: "大きい方: 10",
            36: "最大値: 15",
            37: "大人",
            38: "うるう年",
            39: "三角形が作れる",
            40: "ログイン成功",
            41: "範囲内",
            42: "運転できます",
            43: "絶対値: 5",
            44: "15.0",
            45: "31日",
            46: "夏",
            47: "入場料: 1000円",
            48: "中吉",
            49: "コンピュータ: グー\nあなたの勝ち！",
            50: "正解！",
            51: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10",
            52: "10\n9\n8\n7\n6\n5\n4\n3\n2\n1",
            53: "2 4 6 8 10 12 14 16 18 20",
            54: "5050",
            55: "3 × 1 = 3\n3 × 2 = 6\n...",
            56: "1 2 3 ...\n2 4 6 ...\n...",
            57: "5! = 120",
            58: "0 1 1 2 3 5 8 13 21 34",
            59: "素数",
            60: "1 2 3 4 6 12",
            61: "OLLEH",
            62: "3"
        };

        // 定義済みの出力例があればそれを返す
        if (examples[exercise.id]) {
            return examples[exercise.id];
        }

        // expected プロパティから出力例を生成
        if (exercise.expected) {
            const exp = exercise.expected;
            if (exp.type === 'output') {
                return exp.value;
            }
            if (exp.type === 'contains' && exp.value) {
                return exp.value.join('\n');
            }
            if (exp.type === 'io' && exp.output_contains) {
                return `（入力例: ${exp.inputs.join(', ')}）\n→ ${exp.output_contains.join(' を含む出力')}`;
            }
        }

        // デフォルト
        return "（この問題の出力例は自由です）";
    }

    // 模範解答パネルを表示
    showSampleAnswer(exercise) {
        const panel = document.getElementById('sampleAnswerPanel');
        const codeEl = document.getElementById('sampleCode');
        const toggleBtn = document.getElementById('toggleSampleBtn');

        const sampleCode = this.getSampleAnswer(exercise.id);
        if (sampleCode) {
            codeEl.textContent = sampleCode;
            panel.style.display = 'block';
            codeEl.style.display = 'none';
            toggleBtn.textContent = '表示';
        }
    }

    // 模範解答を取得
    getSampleAnswer(id) {
        const samples = {
            1: `print("Hello World")`,
            2: `name = "太郎"
age = 20
hobby = "プログラミング"
print(f"私の名前は{name}です")
print(f"年齢は{age}歳です")
print(f"趣味は{hobby}です")`,
            3: `a = 5
b = 3
result = a + b
print(result)`,
            4: `a = 10
b = 4
result = a - b
print(result)`,
            5: `a = 6
b = 7
result = a * b
print(result)`,
            6: `a = 15
b = 4
print(a / b)`,
            7: `a = 17
b = 5
print(a % b)`,
            8: `a = 10
b = 5
c = 2
result = (a + b) * c
print(result)`,
            9: `text = "こんにちは"
print(len(text))`,
            10: `text = "Hello"
print(text * 5)`,
            11: `age = 20
message = "年齢は" + str(age) + "歳です"
print(message)`,
            12: `num_str = "42"
num = int(num_str)
print(num + 8)`,
            13: `price = 100.5
tax = 1.1
total = price * tax
print(total)`,
            14: `pi = 3.14
radius = 5
area = pi * radius ** 2
print(area)`,
            15: `celsius = 25
fahrenheit = celsius * 9/5 + 32
print(fahrenheit)`,
            16: `weight = 60
height_cm = 170
height_m = height_cm / 100
bmi = weight / height_m ** 2
print(f"BMI: {bmi:.1f}")`,
            17: `print("1行目")
print("2行目")
print("3行目")`,
            18: `print("名前\\t年齢")
print("太郎\\t20")
print("花子\\t25")`,
            19: `name = "太郎"
score = 89.5
print(f"{name}さんの点数は{score:.1f}点です")`,
            20: `# これはコメントです
print("Hello")  # 行末コメント`,
            21: `name = input("名前を入力してください: ")
print(f"こんにちは、{name}さん！")`,
            22: `num = int(input("数値を入力: "))
result = num * 2
print(f"{num}の2倍は{result}です")`,
            23: `a = int(input("1つ目の数値: "))
b = int(input("2つ目の数値: "))
print(f"合計: {a + b}")`,
            24: `current_year = 2026
birth_year = int(input("生まれ年を入力: "))
age = current_year - birth_year
print(f"あなたは{age}歳です")`,
            25: `total = int(input("合計金額: "))
people = int(input("人数: "))
per_person = total // people
print(f"1人あたり: {per_person}円")`,
            31: `num = int(input("数値: "))
if num > 0:
    print("正の数")
elif num < 0:
    print("負の数")
else:
    print("ゼロ")`,
            32: `num = int(input("数値: "))
if num % 2 == 0:
    print("偶数")
else:
    print("奇数")`,
            33: `score = int(input("点数: "))
if score >= 60:
    print("合格")
else:
    print("不合格")`,
            51: `for i in range(1, 11):
    print(i)`,
            52: `for i in range(10, 0, -1):
    print(i)`,
            53: `for i in range(2, 21, 2):
    print(i, end=" ")`,
            54: `total = 0
for i in range(1, 101):
    total += i
print(total)`,
            55: `dan = 3
for i in range(1, 10):
    print(f"{dan} × {i} = {dan * i}")`,
            // 入力編 26-30
            26: `price = int(input("価格: "))
tax_included = int(price * 1.1)
print(f"税込価格: {tax_included}円")`,
            27: `cm = float(input("センチメートル: "))
m = cm / 100
print(f"{cm}cmは{m}mです")`,
            28: `a = int(input("1つ目: "))
b = int(input("2つ目: "))
c = int(input("3つ目: "))
average = (a + b + c) / 3
print(f"平均: {average}")`,
            29: `total_seconds = int(input("秒数: "))
minutes = total_seconds // 60
seconds = total_seconds % 60
print(f"{minutes}分{seconds}秒")`,
            30: `name = input("名前: ")
time = input("時間帯（朝/昼/夜）: ")
if time == "朝":
    print(f"おはようございます、{name}さん")
elif time == "昼":
    print(f"こんにちは、{name}さん")
else:
    print(f"こんばんは、{name}さん")`,
            // 条件分岐 34-50
            34: `score = int(input("点数: "))
if score >= 90:
    print("A")
elif score >= 80:
    print("B")
elif score >= 70:
    print("C")
elif score >= 60:
    print("D")
else:
    print("F")`,
            35: `a = int(input("1つ目: "))
b = int(input("2つ目: "))
print(f"大きい方: {max(a, b)}")`,
            36: `a = int(input("1つ目: "))
b = int(input("2つ目: "))
c = int(input("3つ目: "))
print(f"最大値: {max(a, b, c)}")`,
            37: `age = int(input("年齢: "))
if age < 18:
    print("子供")
elif age < 65:
    print("大人")
else:
    print("シニア")`,
            38: `year = int(input("年: "))
if (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0):
    print("うるう年")
else:
    print("うるう年ではない")`,
            39: `a = int(input("辺a: "))
b = int(input("辺b: "))
c = int(input("辺c: "))
if a + b > c and b + c > a and c + a > b:
    print("三角形が作れる")
else:
    print("三角形は作れない")`,
            40: `correct_password = "secret123"
user_input = input("パスワード: ")
if user_input == correct_password:
    print("ログイン成功")
else:
    print("パスワードが違います")`,
            41: `num = int(input("数値(1-100): "))
if 1 <= num <= 100:
    print("範囲内")
else:
    print("範囲外")`,
            42: `age = int(input("年齢: "))
has_license = input("免許あり(y/n): ") == "y"
if age >= 18 and has_license:
    print("運転できます")
else:
    print("運転できません")`,
            43: `num = int(input("数値: "))
if num < 0:
    result = -num
else:
    result = num
print(f"絶対値: {result}")`,
            44: `a = float(input("1つ目: "))
op = input("演算子(+,-,*,/): ")
b = float(input("2つ目: "))
if op == "+":
    print(a + b)
elif op == "-":
    print(a - b)
elif op == "*":
    print(a * b)
elif op == "/":
    print(a / b)`,
            45: `month = int(input("月: "))
if month in [1,3,5,7,8,10,12]:
    print("31日")
elif month in [4,6,9,11]:
    print("30日")
elif month == 2:
    print("28日または29日")`,
            46: `month = int(input("月: "))
if month in [3, 4, 5]:
    print("春")
elif month in [6, 7, 8]:
    print("夏")
elif month in [9, 10, 11]:
    print("秋")
else:
    print("冬")`,
            47: `age = int(input("年齢: "))
if age < 6:
    price = 0
elif age < 12:
    price = 300
elif age < 18:
    price = 500
elif age < 65:
    price = 1000
else:
    price = 700
print(f"入場料: {price}円")`,
            48: `import random
result = random.randint(1, 5)
if result == 1:
    print("大吉")
elif result == 2:
    print("中吉")
elif result == 3:
    print("小吉")
elif result == 4:
    print("吉")
else:
    print("凶")`,
            49: `import random
hands = ["グー", "チョキ", "パー"]
user = input("手を入力(グー/チョキ/パー): ")
com = random.choice(hands)
print(f"コンピュータ: {com}")
if user == com:
    print("あいこ")
elif (user == "グー" and com == "チョキ") or \\
     (user == "チョキ" and com == "パー") or \\
     (user == "パー" and com == "グー"):
    print("あなたの勝ち！")
else:
    print("あなたの負け")`,
            50: `import random
answer = random.randint(1, 100)
while True:
    guess = int(input("数を当てて: "))
    if guess == answer:
        print("正解！")
        break
    elif guess < answer:
        print("もっと大きい")
    else:
        print("もっと小さい")`,
            // 繰り返し 56-70
            56: `for i in range(1, 10):
    for j in range(1, 10):
        print(f"{i*j:2d}", end=" ")
    print()`,
            57: `n = int(input("数値: "))
result = 1
for i in range(1, n + 1):
    result *= i
print(f"{n}! = {result}")`,
            58: `n = int(input("何項まで？: "))
a, b = 0, 1
for _ in range(n):
    print(a, end=" ")
    a, b = b, a + b`,
            59: `n = int(input("数値: "))
is_prime = True
if n < 2:
    is_prime = False
for i in range(2, n):
    if n % i == 0:
        is_prime = False
        break
print("素数" if is_prime else "素数ではない")`,
            60: `n = int(input("数値: "))
for i in range(1, n + 1):
    if n % i == 0:
        print(i, end=" ")`,
            61: `text = input("文字列: ")
print(text[::-1])`,
            62: `text = input("文字列: ")
char = input("探す文字: ")
count = 0
for c in text:
    if c == char:
        count += 1
print(count)`,
            63: `text = input("文字列: ")
for i, c in enumerate(text):
    print(f"{i}: {c}")`,
            64: `words = input("単語をスペースで区切って入力: ").split()
for word in words:
    print(word)`,
            65: `text = input("文字列: ")
print(text.upper())`,
            66: `text = input("文字列: ")
print(text.replace("a", "@"))`,
            67: `for i in range(1, 6):
    print("*" * i)`,
            68: `n = int(input("段数: "))
for i in range(1, n + 1):
    print(" " * (n - i) + "*" * (2 * i - 1))`,
            69: `numbers = []
while True:
    num = input("数値を入力(終了は'q'): ")
    if num == 'q':
        break
    numbers.append(int(num))
print(f"合計: {sum(numbers)}")`,
            70: `count = 0
while True:
    password = input("パスワード: ")
    if password == "secret":
        print("ログイン成功")
        break
    count += 1
    if count >= 3:
        print("ロックされました")
        break
    print("もう一度お試しください")`,
            // リスト 71-85
            71: `fruits = ["りんご", "バナナ", "オレンジ"]
for fruit in fruits:
    print(fruit)`,
            72: `numbers = [1, 2, 3, 4, 5]
print(f"合計: {sum(numbers)}")
print(f"平均: {sum(numbers)/len(numbers)}")`,
            73: `numbers = [3, 1, 4, 1, 5, 9, 2, 6]
print(f"最大: {max(numbers)}")
print(f"最小: {min(numbers)}")`,
            74: `numbers = [3, 1, 4, 1, 5, 9, 2, 6]
numbers.sort()
print(numbers)`,
            75: `numbers = [1, 2, 3, 4, 5]
numbers.reverse()
print(numbers)`,
            76: `numbers = [1, 2, 3, 4, 5]
numbers.append(6)
print(numbers)`,
            77: `numbers = [1, 2, 3, 4, 5]
numbers.remove(3)
print(numbers)`,
            78: `numbers = [1, 2, 3, 4, 5]
print(numbers[0])
print(numbers[-1])
print(numbers[1:4])`,
            79: `numbers = [1, 2, 3, 4, 5]
squared = [x ** 2 for x in numbers]
print(squared)`,
            80: `numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
evens = [x for x in numbers if x % 2 == 0]
print(evens)`,
            81: `matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
for row in matrix:
    print(row)`,
            82: `a = [1, 2, 3]
b = [4, 5, 6]
c = a + b
print(c)`,
            83: `items = ["a", "b", "c"]
for i, item in enumerate(items):
    print(f"{i}: {item}")`,
            84: `names = ["Alice", "Bob", "Charlie"]
ages = [20, 25, 30]
for name, age in zip(names, ages):
    print(f"{name}は{age}歳")`,
            85: `numbers = [1, 2, 2, 3, 3, 3, 4]
unique = list(set(numbers))
print(unique)`,
            // 辞書・関数 86-100
            86: `person = {"name": "太郎", "age": 20}
print(person["name"])
print(person["age"])`,
            87: `person = {"name": "太郎", "age": 20}
for key, value in person.items():
    print(f"{key}: {value}")`,
            88: `person = {"name": "太郎", "age": 20}
person["city"] = "東京"
print(person)`,
            89: `scores = {"国語": 80, "数学": 90, "英語": 85}
print(f"平均: {sum(scores.values())/len(scores)}")`,
            90: `def greet(name):
    return f"こんにちは、{name}さん！"
print(greet("太郎"))`,
            91: `def add(a, b):
    return a + b
print(add(5, 3))`,
            92: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)
print(factorial(5))`,
            93: `def is_even(n):
    return n % 2 == 0
print(is_even(4))
print(is_even(5))`,
            94: `def greet(name, greeting="こんにちは"):
    return f"{greeting}、{name}さん！"
print(greet("太郎"))
print(greet("花子", "おはよう"))`,
            95: `def calculate(*args):
    return sum(args)
print(calculate(1, 2, 3, 4, 5))`,
            96: `numbers = [1, 2, 3, 4, 5]
doubled = list(map(lambda x: x * 2, numbers))
print(doubled)`,
            97: `numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
evens = list(filter(lambda x: x % 2 == 0, numbers))
print(evens)`,
            98: `class Dog:
    def __init__(self, name):
        self.name = name
    def bark(self):
        return f"{self.name}がワンと鳴いた"
dog = Dog("ポチ")
print(dog.bark())`,
            99: `try:
    num = int(input("数値: "))
    result = 10 / num
    print(result)
except ValueError:
    print("数値を入力してください")
except ZeroDivisionError:
    print("0では割れません")`,
            100: `with open("sample.txt", "w") as f:
    f.write("Hello, World!")
with open("sample.txt", "r") as f:
    print(f.read())`
        };

        return samples[id] || null;
    }

    // データをエクスポート（JSONダウンロード）
    exportData() {
        const data = {
            completedExercises: this.completedExercises,
            userCodes: this.userCodes,
            exportedAt: new Date().toISOString(),
            version: '1.0'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');

        // ファイル名: python-exercises-backup-YYYYMMDD.json
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        a.href = url;
        a.download = `python-practice-backup-${date}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showToast('データを保存（ダウンロード）しました');
    }

    // データをインポート
    importData(file) {
        if (!confirm('現在のデータを上書きして、バックアップから復元しますか？\n（現在の進捗は失われます）')) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                // データ検証（簡易）
                if (!data.completedExercises || !data.userCodes) {
                    throw new Error('無効なデータ形式です');
                }

                // データを適用
                this.completedExercises = data.completedExercises;
                this.userCodes = data.userCodes;

                this.saveCompleted();
                this.saveUserCodes();

                // 画面更新
                this.renderExerciseLists();
                this.loadExercise(this.currentExerciseId);
                this.updateProgress();

                this.showToast('データを復元しました！');
            } catch (err) {
                alert('フャイルの読み込みに失敗しました:\n' + err.message);
                console.error(err);
            }
        };
        reader.readAsText(file);
    }

    // 問題を検索・フィルタ
    filterExercises(query) {
        const lowerQuery = query.toLowerCase();

        document.querySelectorAll('.exercise-list li').forEach(li => {
            const id = parseInt(li.dataset.id);
            const exercise = exercises.find(e => e.id === id);

            const matches = query === '' ||
                exercise.title.toLowerCase().includes(lowerQuery) ||
                exercise.skill.toLowerCase().includes(lowerQuery) ||
                String(id).includes(query);

            li.style.display = matches ? '' : 'none';
        });

        // マッチした問題があるカテゴリを開く
        document.querySelectorAll('.category').forEach(cat => {
            const hasVisible = cat.querySelector('.exercise-list li:not([style*="display: none"])');
            if (query && hasVisible) {
                cat.classList.add('open');
            }
        });
    }

    // トースト通知
    showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
}

// スタイル追加（アニメーション用）
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);

// アプリ起動
document.addEventListener('DOMContentLoaded', () => {
    new ExerciseApp();
});
