// ===== 言語定義 =====
const LANGUAGES = [
  {
    id: 'python',
    name: 'Python',
    icon: '🐍',
    env: 'データサイエンス・ML・スクリプト',
    color: '#3776ab',
    colorBg: 'rgba(55,118,171,0.13)',
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: '🌐',
    env: 'Webフロントエンド・Node.js',
    color: '#c8a800',
    colorBg: 'rgba(200,168,0,0.12)',
  },
  {
    id: 'java',
    name: 'Java',
    icon: '☕',
    env: 'Android・エンタープライズ',
    color: '#ed8b00',
    colorBg: 'rgba(237,139,0,0.12)',
  },
  {
    id: 'cpp',
    name: 'C++',
    icon: '⚙️',
    env: 'ゲーム・組み込み・競技プロ',
    color: '#0080c8',
    colorBg: 'rgba(0,128,200,0.13)',
  },
];

// ===== ヘルパー: 言語別フィールド取得 =====
function gl(val, lang) {
  if (val === null || val === undefined) return '';
  if (typeof val === 'object' && !Array.isArray(val) && val[lang] !== undefined) return val[lang];
  return val;
}

// ===== STEPデータ =====
const STEPS = [
  // ──── STEP 1: 入力と出力 ────
  {
    id: 1,
    badge: 'STEP 1',
    concept: '入力と出力',
    title: '入力と出力',
    desc: 'プログラムの基本は「何かを受け取り、処理して、結果を返す」こと。まずはユーザーから名前をもらって挨拶するプログラムを作ってみよう！',
    flowchart: [
      { type: 'start', label: '開始' },
      { type: 'io', label: '名前を入力' },
      { type: 'proc', label: '「こんにちは〇〇さん」\nと組み立てる' },
      { type: 'io', label: '結果を表示' },
      { type: 'end', label: '終了' },
    ],
    code: {
      python: `<span class="cmt"># 入力と出力</span>

<span class="var">name</span> = <span class="fn">input</span>(<span class="str">"名前を入力: "</span>)
<span class="var">message</span> = <span class="str">"こんにちは、"</span> + <span class="var">name</span> + <span class="str">"さん！"</span>
<span class="fn">print</span>(<span class="var">message</span>)`,
      javascript: `<span class="cmt">// 入力と出力（ブラウザ）</span>

<span class="kw">const</span> <span class="var">name</span> = <span class="fn">prompt</span>(<span class="str">"名前を入力: "</span>);
<span class="kw">const</span> <span class="var">message</span> = <span class="str">"こんにちは、"</span> + <span class="var">name</span> + <span class="str">"さん！"</span>;
<span class="fn">console</span>.<span class="fn">log</span>(<span class="var">message</span>);`,
      java: `<span class="cmt">// 入力と出力</span>
<span class="kw">import</span> java.util.Scanner;

<span class="kw">public class</span> <span class="type">Main</span> {
    <span class="kw">public static void</span> <span class="fn">main</span>(<span class="type">String</span>[] args) {
        <span class="type">Scanner</span> <span class="var">sc</span> = <span class="kw">new</span> <span class="type">Scanner</span>(System.in);
        System.out.print(<span class="str">"名前を入力: "</span>);
        <span class="type">String</span> <span class="var">name</span> = <span class="var">sc</span>.<span class="fn">nextLine</span>();
        <span class="type">String</span> <span class="var">msg</span> = <span class="str">"こんにちは、"</span> + <span class="var">name</span> + <span class="str">"さん！"</span>;
        System.out.<span class="fn">println</span>(<span class="var">msg</span>);
    }
}`,
      cpp: `<span class="cmt">// 入力と出力</span>
<span class="kw">#include</span> <span class="str">&lt;iostream&gt;</span>
<span class="kw">#include</span> <span class="str">&lt;string&gt;</span>
<span class="kw">using namespace</span> std;

<span class="type">int</span> <span class="fn">main</span>() {
    <span class="type">string</span> <span class="var">name</span>;
    cout << <span class="str">"名前を入力: "</span>;
    cin >> <span class="var">name</span>;
    cout << <span class="str">"こんにちは、"</span> << <span class="var">name</span>
         << <span class="str">"さん！"</span> << endl;
    <span class="kw">return</span> <span class="num">0</span>;
}`,
    },
    usageEnv: {
      python: 'Jupyter NotebookやCLIスクリプトで input()/print() が活躍します。AIモデルの学習ログも print() で出力するのが一般的です。',
      javascript: 'ブラウザでは console.log() でデバッグ、Node.js の CLI ツールでは readline で入力受付。prompt() はブラウザ専用です。',
      java: 'WebアプリはHTTPリクエストで入力を受け取りますが、学習・競プロでは Scanner が定番。System.out.println() はデバッグログとしても広く使われます。',
      cpp: '競技プログラミングでは cin/cout が標準。Unreal Engine では UE_LOG() でデバッグ出力します。組み込みでは UART 経由の出力も。',
    },
    concepts: {
      python: [
        { icon: '📥', text: '<strong>input()</strong> ── ユーザーから文字列を受け取る。数値が必要なら <code>int(input())</code>' },
        { icon: '📤', text: '<strong>print()</strong> ── 文字列・数値を画面に表示する' },
        { icon: '🐍', text: '<strong>動的型付け</strong> ── 変数の型宣言が不要。<code>x = 5</code> と書くだけでOK' },
      ],
      javascript: [
        { icon: '📥', text: '<strong>prompt()</strong> ── ブラウザでユーザー入力を受け取る。Node.js では <code>readline</code> を使用' },
        { icon: '📤', text: '<strong>console.log()</strong> ── ブラウザのDevTools・Node.jsコンソールに出力' },
        { icon: '🌐', text: '<strong>実行環境で変わる</strong> ── ブラウザ/Node.js で入出力の方法が異なる' },
      ],
      java: [
        { icon: '📥', text: '<strong>Scanner</strong> ── <code>java.util.Scanner</code> クラスで標準入力を読む' },
        { icon: '📤', text: '<strong>System.out.println()</strong> ── 標準出力に表示して改行する' },
        { icon: '☕', text: '<strong>静的型付け</strong> ── <code>String name</code> のように型を宣言してから使う' },
      ],
      cpp: [
        { icon: '📥', text: '<strong>cin &gt;&gt;</strong> ── 標準入力から読む。空白区切りで複数読める' },
        { icon: '📤', text: '<strong>cout &lt;&lt;</strong> ── 標準出力に送る。<code>endl</code> で改行を追加' },
        { icon: '⚙️', text: '<strong>#include</strong> ── 使うライブラリを冒頭でインクルードする必要がある' },
      ],
    },
    quizzes: [
      {
        type: 'choice',
        questionByLang: {
          python:     '🤔 Q1：<code>print("Hello")</code> を実行すると何が表示される？',
          javascript: '🤔 Q1：<code>console.log("Hello")</code> を実行すると何が表示される？',
          java:       '🤔 Q1：<code>System.out.println("Hello")</code> を実行すると何が表示される？',
          cpp:        '🤔 Q1：<code>cout &lt;&lt; "Hello"</code> を実行すると何が表示される？',
        },
        choices: ['Hello（引用符なし）', '"Hello"（引用符つき）', 'エラーになる', '何も表示されない'],
        answer: 0,
        points: 3,
        explanationByLang: {
          python:     '<code>print()</code> は引数の文字列をそのまま表示します。引用符は区切り記号なので表示されません。→ <code>Hello</code>',
          javascript: '<code>console.log()</code> はコンソールに出力します。引用符は含まれません。→ <code>Hello</code>',
          java:       '<code>System.out.println()</code> は文字列を表示して改行します。引用符は含まれません。→ <code>Hello</code>',
          cpp:        '<code>cout &lt;&lt;</code> は標準出力に送ります。引用符は含まれません。→ <code>Hello</code>',
        },
      },
      {
        type: 'choice',
        question: '🤔 Q2：ユーザーからキーボード入力を受け取る関数/クラスはどれ？',
        choices: ['print / console.log', 'input / prompt / Scanner / cin', 'return / yield', 'import / include'],
        answer: 1,
        points: 3,
        explanation: '入力関数はPython: <code>input()</code>、JavaScript: <code>prompt()</code>、Java: <code>Scanner</code>、C++: <code>cin</code> です。言語は違っても「ユーザーからデータを受け取る」という役割は共通です。',
      },
      {
        type: 'choice',
        question: '🤔 Q3：変数の型宣言が「不要」な言語はどれ？',
        choices: ['Java と C++', 'Python と JavaScript', 'C++ と Python', 'Java と JavaScript'],
        answer: 1,
        points: 3,
        explanation: 'Python/JavaScript は<strong>動的型付け</strong>なので <code>x = 5</code> のように型宣言不要です。Java/C++ は<strong>静的型付け</strong>で <code>int x = 5;</code> のように型宣言が必須です。',
      },
      {
        type: 'choice',
        scenarioByLang: {
          python:     '年齢を入力してもらい「あと〇年で65歳です」と表示するスクリプトを書きました。age = input("年齢: ") として remaining = 65 - age を計算すると TypeError が発生します。',
          javascript: 'Webフォームに <input id="ageInput" type="number"> があります。ユーザーが入力した年齢を取得して「あと〇年で65歳」と計算したい。',
          java:       'Scanner を使って「Taro Yamada」のようにスペースを含む名前を1行で読もうとしましたが、sc.next() では「Taro」しか取得できません。',
          cpp:        'cin >> name でフルネームを取得しようとしましたが、「Taro Yamada」を入力すると「Taro」しか変数に入りません。',
        },
        questionByLang: {
          python:     '🤔 Q4：TypeError の原因と正しい修正は？',
          javascript: '🤔 Q4：入力値を取得して数値として扱うには？',
          java:       '🤔 Q4：スペースを含む1行全体を読む正しいメソッドは？',
          cpp:        '🤔 Q4：原因と正しい解決方法は？',
        },
        choicesByLang: {
          python: [
            'input() は文字列を返すため、int(input()) で整数に変換してから計算する',
            '65 を "65" と書いて文字列として引き算する',
            'print() で出力してから計算する',
            'Python は引き算ができない',
          ],
          javascript: [
            'prompt("年齢:") で取得する',
            'document.getElementById("ageInput").value を使うが、文字列なので Number() か parseInt() で変換が必要',
            'console.log("ageInput") で取得する',
            'document.value("ageInput") を使う',
          ],
          java: [
            'sc.read()',
            'sc.nextLine()',
            'sc.nextInt()',
            'sc.nextWord()',
          ],
          cpp: [
            'cin はスペースで区切るため。getline(cin, name) を使えば1行全体を読める',
            'string 型がスペースを扱えないため。char 配列を使う',
            'cin の代わりに cout を使う',
            '#include <string> を追加すれば解決する',
          ],
        },
        answerByLang: { python: 0, javascript: 1, java: 1, cpp: 0 },
        points: 5,
        explanationByLang: {
          python:     '<code>input()</code> は常に<strong>文字列</strong>を返します。文字列と整数の引き算は TypeError になります。<code>age = int(input("年齢: "))</code> で整数に変換してから計算してください。',
          javascript: '<code>element.value</code> は文字列を返します。計算に使う場合は <code>Number()</code> または <code>parseInt()</code> で変換が必要です。<code>prompt()</code> はブラウザが警告を出すため本番では使われません。',
          java:       '<code>next()</code> はスペース・改行を区切り文字として1トークンだけ読みます。スペースを含む1行全体を読むには <code>nextLine()</code> を使います。ただし <code>nextInt()</code> などの後に呼ぶと改行が残るため注意が必要です。',
          cpp:        '<code>cin &gt;&gt;</code> はスペース・タブ・改行を区切り文字として扱うため、スペース以降が読まれません。1行全体を読むには <code>getline(cin, name)</code> を使います。C++プログラマが最もよく踏む入力の落とし穴の一つです。',
        },
      },
      {
        type: 'choice',
        scenarioByLang: {
          python:     '商品の合計金額を「合計: ¥1,234,567」のようにカンマ区切りで表示したい。変数 total = 1234567 がある。',
          javascript: 'ページ上の <p id="msg"> 要素に「こんにちは、Taro さん！」と動的に表示したい。変数 name = "Taro" がある。',
          java:       'ゲームのスコアを「Score: 001234」のように6桁ゼロ埋めで表示したい。変数 int score = 1234 がある。',
          cpp:        'C++でゲームのスコアを「Score: 001234」のように6桁ゼロ埋めで表示したい。#include <iomanip> は追加済み。',
        },
        questionByLang: {
          python:     '🤔 Q5：Pythonのf-stringで正しい書き方は？',
          javascript: '🤔 Q5：HTML要素のテキストを書き換える正しい方法は？',
          java:       '🤔 Q5：Javaで正しいフォーマット出力は？',
          cpp:        '🤔 Q5：C++で正しい書き方は？',
        },
        choicesByLang: {
          python: [
            'f"合計: ¥{total,}"',
            'f"合計: ¥{total:,}"',
            'print("合計: ¥" + str(total))',
            'f"合計: ¥{total.format(",")}"',
          ],
          javascript: [
            'document.getElementById("msg").value = `こんにちは、${name} さん！`',
            'document.getElementById("msg").textContent = `こんにちは、${name} さん！`',
            'console.log(`こんにちは、${name} さん！`)',
            'document.getElementById("msg") = `こんにちは、${name} さん！`',
          ],
          java: [
            'System.out.println("Score: " + score)',
            'System.out.printf("Score: %06d%n", score)',
            'System.out.println("Score: " + String(score, 6))',
            'System.out.format("Score: {0:6}", score)',
          ],
          cpp: [
            'cout << "Score: " << score',
            'cout << "Score: " << setw(6) << setfill(\'0\') << score',
            'printf("Score: %s", score)',
            'cout << format("Score: {:06}", score)',
          ],
        },
        answerByLang: { python: 1, javascript: 1, java: 1, cpp: 1 },
        points: 5,
        explanationByLang: {
          python:     'f-stringでは <code>{変数:,}</code> のようにフォーマット指定子が使えます。<code>:,</code> はカンマ区切り、<code>:.2f</code> は小数点2桁など。これはPythonの強力な機能の一つです。',
          javascript: '<code>element.value</code> は <code>&lt;input&gt;</code> 専用です。<code>&lt;p&gt;</code> や <code>&lt;div&gt;</code> のテキストを変えるには <code>.textContent</code>（XSS安全）または <code>.innerHTML</code>（HTML埋め込み可）を使います。',
          java:       '<code>printf()</code> の書式指定子：<code>%06d</code> は「6桁・ゼロ埋め・整数」を意味します。C言語と同じ書式で、<code>%n</code> は改行です。<code>String.format()</code> でも同じ書式が使えます。',
          cpp:        '<code>&lt;iomanip&gt;</code> の <code>setw(n)</code> は表示幅、<code>setfill(\'0\')</code> は埋め文字を設定します。<code>setw</code> は1回限り有効です。C言語の <code>printf("%06d", score)</code> と同等の出力になります。',
        },
      },
    ],
  },

  // ──── STEP 2: 条件分岐 ────
  {
    id: 2,
    badge: 'STEP 2',
    concept: '条件分岐 (if)',
    title: '条件分岐 (if)',
    desc: '「もし〇〇なら△△する、そうでなければ□□する」という処理。クイズゲームの正解判定に使います！',
    flowchart: [
      { type: 'start', label: '問題を表示' },
      { type: 'io', label: '答えを入力' },
      { type: 'diamond', label: '答え\n== 2 ?' },
      { type: 'proc-yes', label: '✅ 正解！' },
      { type: 'proc-no', label: '❌ 不正解\n正解は 2' },
      { type: 'end', label: '次へ' },
    ],
    code: {
      python: `<span class="cmt"># 条件分岐</span>

<span class="fn">print</span>(<span class="str">"問題: 1 + 1 = ?"</span>)
<span class="var">answer</span> = <span class="fn">input</span>(<span class="str">"答え: "</span>)

<span class="kw">if</span> <span class="var">answer</span> == <span class="str">"2"</span>:
    <span class="fn">print</span>(<span class="str">"✅ 正解！"</span>)
<span class="kw">elif</span> <span class="var">answer</span> == <span class="str">"3"</span>:
    <span class="fn">print</span>(<span class="str">"惜しい！"</span>)
<span class="kw">else</span>:
    <span class="fn">print</span>(<span class="str">"❌ 不正解。正解は 2"</span>)`,
      javascript: `<span class="cmt">// 条件分岐</span>

<span class="kw">const</span> <span class="var">answer</span> = <span class="fn">prompt</span>(<span class="str">"問題: 1 + 1 = ?"</span>);

<span class="kw">if</span> (<span class="var">answer</span> === <span class="str">"2"</span>) {
    <span class="fn">console</span>.<span class="fn">log</span>(<span class="str">"✅ 正解！"</span>);
} <span class="kw">else if</span> (<span class="var">answer</span> === <span class="str">"3"</span>) {
    <span class="fn">console</span>.<span class="fn">log</span>(<span class="str">"惜しい！"</span>);
} <span class="kw">else</span> {
    <span class="fn">console</span>.<span class="fn">log</span>(<span class="str">"❌ 不正解。正解は 2"</span>);
}`,
      java: `<span class="cmt">// 条件分岐（文字列比較は .equals() を使う！）</span>
<span class="type">Scanner</span> <span class="var">sc</span> = <span class="kw">new</span> <span class="type">Scanner</span>(System.in);
System.out.<span class="fn">println</span>(<span class="str">"問題: 1 + 1 = ?"</span>);
<span class="type">String</span> <span class="var">answer</span> = <span class="var">sc</span>.<span class="fn">nextLine</span>();

<span class="kw">if</span> (<span class="var">answer</span>.<span class="fn">equals</span>(<span class="str">"2"</span>)) {
    System.out.<span class="fn">println</span>(<span class="str">"✅ 正解！"</span>);
} <span class="kw">else if</span> (<span class="var">answer</span>.<span class="fn">equals</span>(<span class="str">"3"</span>)) {
    System.out.<span class="fn">println</span>(<span class="str">"惜しい！"</span>);
} <span class="kw">else</span> {
    System.out.<span class="fn">println</span>(<span class="str">"❌ 不正解。正解は 2"</span>);
}`,
      cpp: `<span class="cmt">// 条件分岐</span>
<span class="type">string</span> <span class="var">answer</span>;
cout << <span class="str">"問題: 1 + 1 = ?"</span> << endl;
cin >> <span class="var">answer</span>;

<span class="kw">if</span> (<span class="var">answer</span> == <span class="str">"2"</span>) {
    cout << <span class="str">"✅ 正解！"</span> << endl;
} <span class="kw">else if</span> (<span class="var">answer</span> == <span class="str">"3"</span>) {
    cout << <span class="str">"惜しい！"</span> << endl;
} <span class="kw">else</span> {
    cout << <span class="str">"❌ 不正解。正解は 2"</span> << endl;
}`,
    },
    usageEnv: {
      python: '機械学習の推論処理でif/else分岐は必須。Djangoのビュー関数でもリクエスト内容を条件分岐します。',
      javascript: 'Reactコンポーネントでの条件レンダリング（三項演算子が多用）、APIレスポンスのエラー判定でも活躍します。',
      java: 'SpringのControllerでHTTPメソッド(GET/POST)を判定し処理を分岐します。Androidではタップイベントの条件処理でも頻出。',
      cpp: 'ゲームの当たり判定・物理シミュレーションでif文が大量使用されます。競プロでは条件分岐の最適化が得点に直結します。',
    },
    concepts: {
      python: [
        { icon: '🔀', text: '<strong>if / elif / else</strong> ── コロン(<code>:</code>)でブロックを始め、インデントで範囲を示す' },
        { icon: '📝', text: '<strong>== で文字列比較OK</strong> ── Pythonでは <code>==</code> で文字列の内容を比較できる' },
        { icon: '🐍', text: '<strong>elif</strong> ── 他言語の <code>else if</code> に相当するPython独自のキーワード' },
      ],
      javascript: [
        { icon: '🔀', text: '<strong>if / else if / else</strong> ── <code>{}</code> でブロックを囲む（省略可だが非推奨）' },
        { icon: '⚠️', text: '<strong>=== を推奨</strong> ── <code>==</code> は型変換あり。<code>===</code> は値と型を厳密比較' },
        { icon: '🌐', text: '<strong>三項演算子</strong> ── <code>condition ? 値A : 値B</code> でif/elseを1行に書ける' },
      ],
      java: [
        { icon: '🔀', text: '<strong>if / else if / else</strong> ── <code>{}</code> でブロックを囲む（1文でも推奨）' },
        { icon: '⚠️', text: '<strong>文字列比較は .equals()</strong> ── <code>==</code> は参照を比較するため、内容比較には <code>.equals()</code> を使う' },
        { icon: '☕', text: '<strong>型安全な条件式</strong> ── if の条件式は必ず <code>boolean</code> 型を返す必要がある' },
      ],
      cpp: [
        { icon: '🔀', text: '<strong>if / else if / else</strong> ── <code>{}</code> でブロックを囲む（Cと同じ構文）' },
        { icon: '📝', text: '<strong>string型なら == でOK</strong> ── <code>std::string</code> は <code>==</code> で内容を比較できる' },
        { icon: '⚙️', text: '<strong>三項演算子も使える</strong> ── <code>condition ? A : B</code> でシンプルに書ける' },
      ],
    },
    quizzes: [
      {
        type: 'choice',
        questionByLang: {
          python:     '🤔 Q1：<code>x = 1</code> のとき <code>if x &gt; 3:</code> の中は実行される？',
          javascript: '🤔 Q1：<code>x = 1</code> のとき <code>if (x &gt; 3) { }</code> の中は実行される？',
          java:       '🤔 Q1：<code>x = 1</code> のとき <code>if (x &gt; 3) { }</code> の中は実行される？',
          cpp:        '🤔 Q1：<code>x = 1</code> のとき <code>if (x &gt; 3) { }</code> の中は実行される？',
        },
        choices: ['はい、実行される', 'いいえ、実行されない', 'エラーになる', '毎回ランダム'],
        answer: 1,
        points: 3,
        explanation: '1 &gt; 3 は <code>False</code>（すべての言語で同じ）。ifブロックは条件が <strong>真のとき</strong> のみ実行されます。<code>else</code> ブロックがあればそちらが実行されます。',
      },
      {
        type: 'text',
        question: '🤔 Q2：if の条件が False のときに実行されるキーワードは？',
        answer: 'else',
        placeholder: 'キーワードを入力…',
        hint: '英語4文字。全言語共通のキーワードです',
        points: 3,
        explanation: '<code>else</code> はすべての言語で共通のキーワードです。Python: <code>else:</code>、JS/Java/C++: <code>else { }</code> と書き方が少し違います。',
      },
      {
        type: 'choice',
        question: '🤔 Q3：文字列を == で比較すると「参照が異なれば False」になる言語は？',
        choices: ['Python', 'JavaScript', 'Java', 'C++'],
        answer: 2,
        points: 3,
        explanation: 'Java では <code>==</code> は参照（メモリアドレス）を比較します。文字列の内容を比較するには <code>.equals()</code> が必要です。Python/JS では <code>==</code> で文字列の内容を比較できます。',
      },
      {
        type: 'choice',
        scenarioByLang: {
          python:     'ECサイトの在庫管理を開発中。在庫数によって表示を変えたい：0→「売り切れ」、1〜9→「残りわずか」、10以上→「在庫あり」。',
          javascript: 'ユーザーのログイン状態 isLoggedIn によってUIを切り替えたい。true なら「マイページ」ボタン、false なら「ログイン」ボタンを表示する。',
          java:       '会員ランク（String型）を == で比較するif文を書きました。テスト環境では正常動作するのに、本番サーバーでは稀に間違った分岐に入ります。',
          cpp:        '曜日（0=日〜6=土）に応じて異なるメッセージを表示するプログラムを書きたい。7通りの分岐があります。',
        },
        questionByLang: {
          python:     '🤔 Q4：このロジックに最適な構文は？',
          javascript: '🤔 Q4：このロジックに最適な構文は？',
          java:       '🤔 Q4：最も可能性が高い原因は？',
          cpp:        '🤔 Q4：if/else if を7段使う代わりに、より読みやすい構文は？',
        },
        choicesByLang: {
          python: [
            'if / elif / else',
            'for ループ',
            'while ループ',
            '変数代入のみ',
          ],
          javascript: [
            'for...of ループ',
            'if / else（または三項演算子 condition ? a : b）',
            'forEach メソッド',
            'switch文（caseが2つだけなのでif/elseが適切）',
          ],
          java: [
            'Javaのバグ',
            'Javaの == は参照を比較するため、外部入力の文字列では内容が同じでも false になることがある',
            'String型はif文で使えない',
            'テスト環境と本番のJavaバージョンが異なる',
          ],
          cpp: [
            'for ループ',
            'switch 文',
            'while ループ',
            'do...while 文',
          ],
        },
        answerByLang: { python: 0, javascript: 1, java: 1, cpp: 1 },
        points: 5,
        explanationByLang: {
          python:     '複数の条件で処理を分岐するには <code>if / elif / else</code> が最適です。Pythonでは <code>elif</code>（else if の略）を使います。在庫 == 0 → elif stock &lt; 10 → else の3段構造になります。',
          javascript: '2値の切り替えには <code>if / else</code> または三項演算子 <code>isLoggedIn ? "マイページ" : "ログイン"</code> が適切です。三項演算子は JSX（React）の中でも使いやすい形式です。',
          java:       '<code>==</code> は参照（メモリアドレス）を比較します。文字列定数はプールで再利用されるためテストでは偶然一致しますが、外部入力はプール外のため別参照になります。文字列比較は必ず <code>.equals()</code> を使います。',
          cpp:        '<code>switch</code> 文は整数・enum値による多分岐に最適です。<code>case 0: ... break;</code> の形で各値を処理します。<code>default:</code> で未定義の値も処理できます。7段の <code>if/else if</code> より可読性が高くなります。',
        },
      },
      {
        type: 'choice',
        scenarioByLang: {
          python:     '18歳以上かつ会員登録済みのユーザーだけに「プレミアムコンテンツ」を表示したい。変数 age と is_member がある。',
          javascript: 'JavaScriptで 0、""（空文字）、null を条件判定するコードを書きました。if (value) で判定しているが、意図せず偽判定になってしまいます。これらは何と呼ばれますか？',
          java:       'String rank = getUserRank() で取得した値を if (rank == "gold") と比較したが常に false になる。正しい比較方法は？',
          cpp:        'C++で int 型の割り算 7 / 2 を計算したら 3.5 ではなく 3 が返ってきました。',
        },
        questionByLang: {
          python:     '🤔 Q5：正しい条件式は？',
          javascript: '🤔 Q5：0、""、null、undefined のような値の呼び名と正しい対処法は？',
          java:       '🤔 Q5：Javaで文字列の内容を正しく比較するコードは？',
          cpp:        '🤔 Q5：3.5 を正しく得るには？',
        },
        choicesByLang: {
          python: [
            'if age >= 18 or is_member:',
            'if age >= 18 and is_member:',
            'if age > 18 and is_member:',
            'if (age >= 18) == is_member:',
          ],
          javascript: [
            'エラー値（error value）— 実行時エラーを起こす値',
            'falsy値（falsy values）— false ではないが、条件式で false として評価される値',
            'null型 — すべてnullと同じ扱い',
            'undefined値 — 未定義の変数のみ',
          ],
          java: [
            'rank === "gold"（JavaScriptの構文でJavaには存在しない）',
            '"gold".equals(rank)（null安全）または rank != null && rank.equals("gold")',
            'rank.compareTo("gold") == 0（辞書順比較なので内容比較には不向き）',
            'rank.toString() == "gold"（== の問題は変わらない）',
          ],
          cpp: [
            'int 型変数の宣言を double に変えるだけでよい',
            '7.0 / 2 または (double)7 / 2 と書いて double として計算する',
            'int型同士の割り算は常に整数になるため変更できない',
            '#include <cmath> をインクルードする',
          ],
        },
        answerByLang: { python: 1, javascript: 1, java: 1, cpp: 1 },
        points: 5,
        explanationByLang: {
          python:     '<code>and</code> は両方が True のとき True、<code>or</code> は一方が True のとき True です。「18歳以上<strong>かつ</strong>会員」には <code>and</code> が正解です。<code>age > 18</code> は18歳を含まないため、<code>>=</code> が正しい条件です。',
          javascript: 'JavaScriptには <strong>falsy値</strong> が6つあります：<code>false</code>、<code>0</code>、<code>""</code>（空文字）、<code>null</code>、<code>undefined</code>、<code>NaN</code>。これらは <code>if</code> の中で <code>false</code> と評価されます。<code>if (value != null)</code> など明示的な比較も有効です。',
          java:       '<code>==</code> は参照比較です。文字列の内容比較は <code>.equals()</code> を使います。<code>"gold".equals(rank)</code> のように定数を左辺に書くと、<code>rank</code> が <code>null</code> でも NullPointerException を防げます。',
          cpp:        'C++で <code>int</code> 同士の割り算は<strong>整数除算</strong>になり、小数点以下が切り捨てられます。少なくとも片方を <code>double</code>（<code>7.0</code> または <code>(double)7</code>）にすると浮動小数点演算になります。',
        },
      },
    ],
  },

  // ──── STEP 3: 繰り返し ────
  {
    id: 3,
    badge: 'STEP 3',
    concept: '繰り返し (loop)',
    title: '繰り返し (while / for)',
    desc: '同じ処理を何度も繰り返すのがループ。「問題が残っている間は続ける」という処理に使います！',
    flowchart: [
      { type: 'proc', label: 'count = 0\n問題数 = 3' },
      { type: 'diamond', label: 'count < 3 ?' },
      { type: 'io', label: '問題を出す' },
      { type: 'io', label: '答えを受け取る' },
      { type: 'proc', label: 'count += 1\n↑ループ先頭へ戻る' },
      { type: 'end', label: '結果表示' },
    ],
    code: {
      python: `<span class="cmt"># while ループ</span>
<span class="var">count</span> = <span class="num">0</span>
<span class="kw">while</span> <span class="var">count</span> < <span class="num">3</span>:
    <span class="fn">print</span>(<span class="str">f"問題 {count + 1}"</span>)
    <span class="var">count</span> += <span class="num">1</span>

<span class="cmt"># for ループ（同じ意味）</span>
<span class="kw">for</span> <span class="var">i</span> <span class="kw">in</span> <span class="fn">range</span>(<span class="num">3</span>):
    <span class="fn">print</span>(<span class="str">f"問題 {i + 1}"</span>)

<span class="kw">if</span> <span class="var">miss</span> >= <span class="num">3</span>: <span class="kw">break</span>  <span class="cmt"># 途中で抜ける</span>`,
      javascript: `<span class="cmt">// while ループ</span>
<span class="kw">let</span> <span class="var">count</span> = <span class="num">0</span>;
<span class="kw">while</span> (<span class="var">count</span> < <span class="num">3</span>) {
    <span class="fn">console</span>.<span class="fn">log</span>(<span class="str">\`問題 \${count + 1}\`</span>);
    <span class="var">count</span>++;
}

<span class="cmt">// for ループ（同じ意味）</span>
<span class="kw">for</span> (<span class="kw">let</span> <span class="var">i</span> = <span class="num">0</span>; <span class="var">i</span> < <span class="num">3</span>; <span class="var">i</span>++) {
    <span class="fn">console</span>.<span class="fn">log</span>(<span class="str">\`問題 \${i + 1}\`</span>);
}`,
      java: `<span class="cmt">// while ループ</span>
<span class="type">int</span> <span class="var">count</span> = <span class="num">0</span>;
<span class="kw">while</span> (<span class="var">count</span> < <span class="num">3</span>) {
    System.out.<span class="fn">println</span>(<span class="str">"問題 "</span> + (<span class="var">count</span> + <span class="num">1</span>));
    <span class="var">count</span>++;
}

<span class="cmt">// for ループ（同じ意味）</span>
<span class="kw">for</span> (<span class="type">int</span> <span class="var">i</span> = <span class="num">0</span>; <span class="var">i</span> < <span class="num">3</span>; <span class="var">i</span>++) {
    System.out.<span class="fn">println</span>(<span class="str">"問題 "</span> + (<span class="var">i</span> + <span class="num">1</span>));
}`,
      cpp: `<span class="cmt">// while ループ</span>
<span class="type">int</span> <span class="var">count</span> = <span class="num">0</span>;
<span class="kw">while</span> (<span class="var">count</span> < <span class="num">3</span>) {
    cout << <span class="str">"問題 "</span> << (<span class="var">count</span> + <span class="num">1</span>) << endl;
    <span class="var">count</span>++;
}

<span class="cmt">// for ループ（同じ意味）</span>
<span class="kw">for</span> (<span class="type">int</span> <span class="var">i</span> = <span class="num">0</span>; <span class="var">i</span> < <span class="num">3</span>; <span class="var">i</span>++) {
    cout << <span class="str">"問題 "</span> << (<span class="var">i</span> + <span class="num">1</span>) << endl;
}`,
    },
    usageEnv: {
      python: 'データフレームの行処理、APIページネーション、機械学習のエポック管理などでforループが中心的な役割を担います。',
      javascript: '配列操作では forEach/map/filter が主流。DOMの繰り返し描画やAPIデータ処理でよく使います。',
      java: 'DBから取得したレコードをfor-eachで処理するのが定番。Java 8以降はStream APIも多用されます。',
      cpp: 'ゲームのメインループ（while(true)）、vectorの要素処理、競プロの探索アルゴリズムでforが必須です。',
    },
    concepts: {
      python: [
        { icon: '🔁', text: '<strong>while</strong> ── 条件が True の間繰り返す' },
        { icon: '🔂', text: '<strong>for i in range(n)</strong> ── 0からn-1まで繰り返す（Pythonの特徴的な書き方）' },
        { icon: '⚠️', text: '<strong>break</strong> ── ループを途中で強制終了する（全言語共通）' },
      ],
      javascript: [
        { icon: '🔁', text: '<strong>while / for</strong> ── CスタイルのforはJava/C++とほぼ同じ構文' },
        { icon: '🔂', text: '<strong>配列メソッド</strong> ── <code>forEach/map/filter</code> など関数型スタイルが現代JSでは主流' },
        { icon: '⚠️', text: '<strong>break</strong> ── ループを途中で強制終了する（全言語共通）' },
      ],
      java: [
        { icon: '🔁', text: '<strong>while / for</strong> ── C++とほぼ同じ構文。型宣言 <code>int i = 0</code> が必要' },
        { icon: '🔂', text: '<strong>for-each</strong> ── <code>for (Type item : list)</code> でコレクション要素を順番に処理' },
        { icon: '⚠️', text: '<strong>break</strong> ── ループを途中で強制終了する（全言語共通）' },
      ],
      cpp: [
        { icon: '🔁', text: '<strong>while / for</strong> ── Cスタイルで最もメジャー。パフォーマンス最重要の場面で使う' },
        { icon: '🔂', text: '<strong>range-based for</strong> ── <code>for (auto item : vec)</code> でコンテナを反復（C++11以降）' },
        { icon: '⚠️', text: '<strong>while(true)</strong> ── ゲームのメインループなど無限ループでよく使われる' },
      ],
    },
    quizzes: [
      {
        type: 'choice',
        questionByLang: {
          python:     '🤔 Q1：<code>count = 0</code> で <code>while count &lt; 3:</code> は何回繰り返す？',
          javascript: '🤔 Q1：<code>let count = 0</code> で <code>while (count &lt; 3)</code> は何回繰り返す？',
          java:       '🤔 Q1：<code>int count = 0</code> で <code>while (count &lt; 3)</code> は何回繰り返す？',
          cpp:        '🤔 Q1：<code>int count = 0</code> で <code>while (count &lt; 3)</code> は何回繰り返す？',
        },
        choices: ['2回', '3回', '4回', '0回'],
        answer: 1,
        points: 3,
        explanation: 'count が 0 → 1 → 2 と増え、3 になった時点で 3 &lt; 3 が False になりループ終了。合計<strong>3回</strong>実行されます。全言語で結果は同じです。',
      },
      {
        type: 'text',
        question: '🤔 Q2：ループを途中で強制終了するキーワードは？',
        answer: 'break',
        placeholder: 'キーワードを入力…',
        hint: '英語5文字。全言語共通のキーワードです',
        points: 3,
        explanation: '<code>break</code> はすべての言語で共通のキーワードです。ループを即座に抜け出します。<code>continue</code> はスキップしてループの先頭に戻ります。',
      },
      {
        type: 'choice',
        question: '🤔 Q3：Python の <code>for i in range(5):</code> で i が取る値の範囲は？',
        choices: ['1〜5', '0〜5', '0〜4', '1〜4'],
        answer: 2,
        points: 3,
        explanation: '<code>range(5)</code> は 0, 1, 2, 3, 4 を生成します（5は含まれない）。C++/Java/JavaScript の <code>for (i = 0; i &lt; 5; i++)</code> と同様に 0〜4 です。',
      },
      {
        type: 'choice',
        scenarioByLang: {
          python:     '100人の生徒の点数リスト scores = [85, 72, 91, ...] があります。全員の合計点を計算したい。',
          javascript: 'ショッピングカートの商品リスト items = [{name:"...", price:...}, ...] から合計金額を計算したい。',
          java:       'ArrayList<String> names にユーザー名が格納されています。全ユーザー名を1行ずつ表示したい。',
          cpp:        'ゲームを開発しています。「プレイヤーが生存している間ずっと update() と render() を呼び続けたい」という要件があります。',
        },
        questionByLang: {
          python:     '🤔 Q4：Pythonで最もシンプルな合計の書き方は？',
          javascript: '🤔 Q4：最もモダンなJavaScriptの書き方は？',
          java:       '🤔 Q4：Javaの拡張for文（for-each）での正しい書き方は？',
          cpp:        '🤔 Q4：この要件に最も適したループ構造は？',
        },
        choicesByLang: {
          python: [
            'while len(scores) > 0: total += scores.pop()',
            'total = sum(scores)、またはfor score in scores: total += score',
            'for i in range(100): total += scores[i]',
            'total = scores[0] + scores[1] + ...（100個を手書き）',
          ],
          javascript: [
            'for (let i = 0; i < items.length; i++) total += items[i].price',
            'const total = items.reduce((sum, item) => sum + item.price, 0)',
            'while (items.length > 0) total += items.shift().price',
            'items.forEach(item => items.price)',
          ],
          java: [
            'for (int i = 0; i < names.size(); i++) System.out.println(names(i))',
            'for (String name : names) System.out.println(name)',
            'while (names.hasNext()) System.out.println(names.next())',
            'names.stream().forEach(System.out::println)（これも正しいが上級者向け）',
          ],
          cpp: [
            'for (int i = 0; i < 10000; i++) { update(); render(); }',
            'while (playerIsAlive) { update(); render(); }',
            'if (playerIsAlive) { update(); render(); }',
            'do { update(); } while (false)',
          ],
        },
        answerByLang: { python: 1, javascript: 1, java: 1, cpp: 1 },
        points: 5,
        explanationByLang: {
          python:     'Pythonには組み込み関数 <code>sum()</code> があり、リストの合計を1行で計算できます。<code>for score in scores: total += score</code> も正解ですが、<code>sum()</code> がより Pythonic です。NumPyなら <code>np.sum(scores)</code> も高速です。',
          javascript: '<code>reduce()</code> は配列を1つの値に集約するメソッドです。<code>(sum, item) => sum + item.price</code> が各要素に適用され、<code>0</code> が初期値です。実務では最もよく使われるパターンの一つです。',
          java:       '<code>for (型 変数 : コレクション)</code> は拡張for文（for-each）です。インデックス管理が不要で、配列・ArrayList・その他 Iterable に対して使えます。<code>names(i)</code> はメソッド呼び出し構文でエラーになります（正しくは <code>names.get(i)</code>）。',
          cpp:        '<code>while (条件)</code> は条件が true の間ずっと繰り返します。「生存している間 = 条件が true」なので while が最適です。<code>for</code> は繰り返し回数が事前にわかる場合に使います。Unreal Engine などのゲームエンジンでも類似のメインループが使われています。',
        },
      },
      {
        type: 'choice',
        scenarioByLang: {
          python:     '以下のコードが無限ループになりました：\ncount = 0\nwhile count < 5:\n    print(count)',
          javascript: 'for...in で配列 arr = [10, 20, 30] をループしたら、値ではなくインデックス（0, 1, 2）が返ってきました。',
          java:       '以下のコードが無限ループになりました：\nint i = 0;\nwhile (i < 5) {\n    System.out.println(i);\n}',
          cpp:        '以下のコードが無限ループになりました：\nint i = 0;\nwhile (i < 5) { cout << i; }',
        },
        questionByLang: {
          python:     '🤔 Q5：無限ループの原因は？',
          javascript: '🤔 Q5：配列の値を取り出す正しいループは？',
          java:       '🤔 Q5：原因と修正方法は？',
          cpp:        '🤔 Q5：無限ループの原因は？',
        },
        choicesByLang: {
          python: [
            'while の条件式が間違っている',
            'ループ内で count を増やしていない（count += 1 が抜けている）',
            'print() はループを止めない',
            'Python の while は1回しか実行できない',
          ],
          javascript: [
            'for (let i in arr)（for...inはキー/インデックスを返す）',
            'for (const val of arr)（for...ofは値を返す）',
            'for (const arr of val)',
            'forEach は使えない',
          ],
          java: [
            'while の条件が間違い。i <= 5 にする',
            'i をインクリメントしていない。ループ末尾に i++ を追加する',
            'System.out.println の書き方が間違い',
            'int 型は while ループで使えない',
          ],
          cpp: [
            'while の条件式の書き方が間違っている',
            'ループ変数 i のインクリメント（i++）を書き忘れている',
            'cout の使い方が間違っている',
            'int 型は while ループで使えない',
          ],
        },
        answerByLang: { python: 1, javascript: 1, java: 1, cpp: 1 },
        points: 5,
        explanationByLang: {
          python:     '<code>count</code> が 0 のまま変化しないため、<code>count &lt; 5</code> が永遠に true になります。ループ末尾に <code>count += 1</code> を追加することで解決します。while ループでのインクリメント忘れは最もよく犯すバグの一つです。',
          javascript: '<code>for...in</code> はオブジェクトの<strong>キー</strong>（配列ではインデックス）を返します。配列の<strong>値</strong>を取り出すには <code>for...of</code> を使います。オブジェクトのプロパティ列挙には <code>for...in</code>、配列の値には <code>for...of</code> と使い分けましょう。',
          java:       '<code>i</code> が 0 のまま変化しないため、<code>i &lt; 5</code> が永遠に true になります。ループ末尾に <code>i++</code>（または <code>i += 1</code>）を追加することで解決します。',
          cpp:        '<code>i</code> が 0 のまま変化しないため、<code>i &lt; 5</code> が永遠に true になります。ループ内に <code>i++</code> を追加することで解決します。デバッガで実行すると無限ループを素早く発見できます。',
        },
      },
    ],
  },

  // ──── STEP 4: 変数 ────
  {
    id: 4,
    badge: 'STEP 4',
    concept: '変数とスコア管理',
    title: '変数でスコア管理',
    desc: '変数はプログラムが覚えておくための「箱」。スコアを変数に入れて、正解するたびに増やしていこう！',
    flowchart: [
      { type: 'proc', label: 'score = 0' },
      { type: 'io', label: '問題を解く' },
      { type: 'diamond', label: '正解？' },
      { type: 'proc-yes', label: 'score += 1' },
      { type: 'proc-no', label: '正解表示' },
      { type: 'end', label: 'スコア表示' },
    ],
    code: {
      python: `<span class="cmt"># 変数でスコア管理（型宣言不要）</span>
<span class="var">score</span> = <span class="num">0</span>
<span class="var">miss</span>  = <span class="num">0</span>

<span class="kw">if</span> <span class="var">answer</span> == <span class="var">correct</span>:
    <span class="var">score</span> += <span class="num">1</span>
    <span class="fn">print</span>(<span class="str">f"✅ スコア: {score}"</span>)
<span class="kw">else</span>:
    <span class="var">miss</span> += <span class="num">1</span>
    <span class="fn">print</span>(<span class="str">f"❌ ミス: {miss}回"</span>)

<span class="kw">if</span> <span class="var">score</span> >= <span class="num">80</span>:
    <span class="fn">print</span>(<span class="str">"🎉 合格！"</span>)`,
      javascript: `<span class="cmt">// 変数でスコア管理（let/const）</span>
<span class="kw">let</span> <span class="var">score</span> = <span class="num">0</span>;
<span class="kw">let</span> <span class="var">miss</span>  = <span class="num">0</span>;

<span class="kw">if</span> (<span class="var">answer</span> === <span class="var">correct</span>) {
    <span class="var">score</span> += <span class="num">1</span>;
    <span class="fn">console</span>.<span class="fn">log</span>(<span class="str">\`✅ スコア: \${score}\`</span>);
} <span class="kw">else</span> {
    <span class="var">miss</span> += <span class="num">1</span>;
    <span class="fn">console</span>.<span class="fn">log</span>(<span class="str">\`❌ ミス: \${miss}回\`</span>);
}

<span class="kw">if</span> (<span class="var">score</span> >= <span class="num">80</span>) <span class="fn">console</span>.<span class="fn">log</span>(<span class="str">"🎉 合格！"</span>);`,
      java: `<span class="cmt">// 変数でスコア管理（型宣言が必要）</span>
<span class="type">int</span> <span class="var">score</span> = <span class="num">0</span>;
<span class="type">int</span> <span class="var">miss</span>  = <span class="num">0</span>;

<span class="kw">if</span> (<span class="var">answer</span>.<span class="fn">equals</span>(<span class="var">correct</span>)) {
    <span class="var">score</span> += <span class="num">1</span>;
    System.out.<span class="fn">println</span>(<span class="str">"✅ スコア: "</span> + <span class="var">score</span>);
} <span class="kw">else</span> {
    <span class="var">miss</span> += <span class="num">1</span>;
    System.out.<span class="fn">println</span>(<span class="str">"❌ ミス: "</span> + <span class="var">miss</span> + <span class="str">"回"</span>);
}

<span class="kw">if</span> (<span class="var">score</span> >= <span class="num">80</span>) System.out.<span class="fn">println</span>(<span class="str">"🎉 合格！"</span>);`,
      cpp: `<span class="cmt">// 変数でスコア管理（型宣言が必要）</span>
<span class="type">int</span> <span class="var">score</span> = <span class="num">0</span>;
<span class="type">int</span> <span class="var">miss</span>  = <span class="num">0</span>;

<span class="kw">if</span> (<span class="var">answer</span> == <span class="var">correct</span>) {
    <span class="var">score</span> += <span class="num">1</span>;
    cout << <span class="str">"✅ スコア: "</span> << <span class="var">score</span> << endl;
} <span class="kw">else</span> {
    <span class="var">miss</span> += <span class="num">1</span>;
    cout << <span class="str">"❌ ミス: "</span> << <span class="var">miss</span> << <span class="str">"回"</span> << endl;
}

<span class="kw">if</span> (<span class="var">score</span> >= <span class="num">80</span>) cout << <span class="str">"🎉 合格！"</span> << endl;`,
    },
    usageEnv: {
      python: '型宣言不要で素早く書けます。データ分析ではNumPy配列やDataFrameを変数で管理します。型ヒントで大規模開発にも対応可能。',
      javascript: 'let/constの使い分けが重要。Reactではstateを変数で管理しUIを更新します。TypeScriptで型安全性を追加する流れも広まっています。',
      java: '静的型付けで型安全。大規模な銀行システムや官公庁システムでも採用されており、型ミスマッチをコンパイル時に発見できるのが強みです。',
      cpp: 'int/double/string など型宣言が必須。auto で型推論も可能。ゲームではメモリ効率を考えた型選択（float vs double など）が重要です。',
    },
    concepts: {
      python: [
        { icon: '📦', text: '<strong>型宣言不要</strong> ── <code>x = 5</code> と書くだけで変数を作れる（動的型付け）' },
        { icon: '➕', text: '<strong>+= 演算子</strong> ── <code>score += 1</code> は <code>score = score + 1</code> の短縮形（全言語共通）' },
        { icon: '🐍', text: '<strong>型ヒント</strong> ── <code>score: int = 0</code> で型を明示することも可能（任意）' },
      ],
      javascript: [
        { icon: '📦', text: '<strong>let / const</strong> ── 再代入可能(let)か定数(const)かを選ぶ。<code>var</code> は非推奨' },
        { icon: '➕', text: '<strong>+= 演算子</strong> ── 全言語共通の省略形' },
        { icon: '🌐', text: '<strong>TypeScript</strong> ── <code>let score: number = 0;</code> のように型宣言を追加できる上位互換言語' },
      ],
      java: [
        { icon: '📦', text: '<strong>型宣言が必須</strong> ── <code>int score = 0;</code> のように型を先に書く（静的型付け）' },
        { icon: '➕', text: '<strong>+= 演算子</strong> ── 全言語共通の省略形' },
        { icon: '☕', text: '<strong>コンパイル時エラー</strong> ── 型のミスマッチは実行前に発覚。大規模開発で安全性が高い' },
      ],
      cpp: [
        { icon: '📦', text: '<strong>型宣言が必須</strong> ── <code>int score = 0;</code> のように型を先に書く（静的型付け）' },
        { icon: '📦', text: '<strong>auto</strong> ── <code>auto score = 0;</code> でコンパイラに型を推論させることもできる' },
        { icon: '⚙️', text: '<strong>メモリ効率</strong> ── <code>int</code>/<code>short</code>/<code>char</code> など型を選ぶとメモリ使用量を最適化できる' },
      ],
    },
    quizzes: [
      {
        type: 'text',
        questionByLang: {
          python:     '🤔 Q1：<code>score = 0</code> の後、<code>score += 1</code> を3回実行すると score はいくつ？',
          javascript: '🤔 Q1：<code>let score = 0</code> の後、<code>score += 1</code> を3回実行すると score はいくつ？',
          java:       '🤔 Q1：<code>int score = 0</code> の後、<code>score += 1</code> を3回実行すると score はいくつ？',
          cpp:        '🤔 Q1：<code>int score = 0</code> の後、<code>score += 1</code> を3回実行すると score はいくつ？',
        },
        answer: '3',
        placeholder: '数字を入力…',
        hint: '0 + 1 + 1 + 1 = ?',
        points: 3,
        explanation: 'score が 0 → 1 → 2 → 3 と増えます。<code>+= 1</code> は「現在の値に1を足して代入する」の省略形で、全言語で同じ動作です。',
      },
      {
        type: 'choice',
        question: '🤔 Q2：<code>score += 5</code> と同じ意味の式は？',
        choices: ['score = 5', 'score = score + 5', 'score + 5', 'score == 5'],
        answer: 1,
        points: 3,
        explanation: '<code>+=</code> は複合代入演算子です。<code>score += 5</code> は <code>score = score + 5</code> と全く同じ動作で、Python/JS/Java/C++ すべてで共通です。',
      },
      {
        type: 'choice',
        question: '🤔 Q3：Python・JavaScript と Java・C++ の変数宣言の違いは？',
        choices: ['Python/JSは型宣言が不要、Java/C++は必要', 'Java/C++は変数を使えない', 'Python/JSは数値のみ扱える', '違いはない'],
        answer: 0,
        points: 3,
        explanation: 'Python/JavaScript は動的型付けで <code>x = 5</code>（型宣言なし）。Java/C++ は静的型付けで <code>int x = 5;</code>（型宣言あり）。どちらにもメリット・デメリットがあります。',
      },
      {
        type: 'choice',
        scenarioByLang: {
          python:     'ユーザーが入力した点数が80点以上かチェックします。score = input("点数: ") として if score >= 80: と書いたが「91」入力でも「80点未満」と表示されます。',
          javascript: 'Reactでカウンターを作っています。const count = 0 と宣言してボタンクリックで count++ を実行しても数が増えません。',
          java:       'int 型の変数 price = 1000 と tax = 0.1 を掛けて消費税額を計算したい。int tax_amount = price * tax と書くとコンパイルエラーになります。',
          cpp:        'C++で int count = 2147483647; count++; を実行したら、count が -2147483648 になってしまいました。',
        },
        questionByLang: {
          python:     '🤔 Q4：原因と修正方法は？',
          javascript: '🤔 Q4：count が増えない根本的な原因は？',
          java:       '🤔 Q4：コンパイルエラーの原因と正しい修正は？',
          cpp:        '🤔 Q4：この現象は何と呼ばれ、どう防ぐか？',
        },
        choicesByLang: {
          python: [
            'Python の >= 演算子のバグ',
            'input() は文字列を返すため、int(input()) で整数に変換してから比較する',
            '80 を "80" と書く必要がある',
            'print() で出力してから比較する',
          ],
          javascript: [
            'const は再代入できないため count の値を変えられない（さらにReactでは useState が必要）',
            'React ではカウントアップできない',
            'let に変えればすべて解決する',
            'ボタンのイベントが設定されていない',
          ],
          java: [
            'Java は乗算ができない',
            'int と double の計算結果は double になるため、double tax_amount = price * tax と宣言する',
            'tax を "0.1" と書けば解決する',
            'import java.math が必要',
          ],
          cpp: [
            'メモリリーク。delete を使えば解決する',
            '整数オーバーフロー。大きな数を扱う場合は long long 型を使う',
            'セグメンテーション違反。ポインタの問題',
            'コンパイルエラー。型キャストが必要',
          ],
        },
        answerByLang: { python: 1, javascript: 0, java: 1, cpp: 1 },
        points: 5,
        explanationByLang: {
          python:     '<code>input()</code> は常に<strong>文字列</strong>を返します。文字列 <code>"91"</code> と整数 <code>80</code> の比較は Python3 では TypeError になります。<code>score = int(input("点数: "))</code> で整数に変換してから比較してください。',
          javascript: '<code>const</code> は再代入不可の定数です。値を変えたい変数には <code>let</code> を使います。ただしReactでは変数を直接変更してもコンポーネントが再レンダリングされないため、<code>const [count, setCount] = useState(0)</code> の <code>useState</code> フックが正解です。',
          java:       'Javaでは <code>int</code>（整数）と <code>double</code>（小数）の演算結果は <code>double</code> になります。<code>int</code> 型変数に <code>double</code> 値を代入しようとするとコンパイルエラーです。<code>double tax_amount = price * tax;</code> と宣言するか、<code>(int)(price * tax)</code> でキャストします。',
          cpp:        '<code>int</code> 型は約 ±21億（2^31-1）が上限です。これを超えると<strong>整数オーバーフロー</strong>が起き、最小値（-2147483648）に折り返します。大きな数を扱う場合は <code>long long</code>（約 ±920京）を使います。',
        },
      },
      {
        type: 'choice',
        scenarioByLang: {
          python:     '関数の中でグローバル変数 total_score = 0 を増やそうとしましたが、関数を呼んでも外側の total_score が変わりません。',
          javascript: 'var で宣言した変数が if ブロックの外でも参照できてしまい、意図しない値が混入するバグが起きました。',
          java:       'int total = 3_000_000_000; と書いたらコンパイルエラーになりました。',
          cpp:        '関数内で宣言した変数を関数の外から参照しようとしたらコンパイルエラーになりました。',
        },
        questionByLang: {
          python:     '🤔 Q5：正しい修正方法は？',
          javascript: '🤔 Q5：このバグを防ぐための正しいアプローチは？',
          java:       '🤔 Q5：原因と正しい型は？',
          cpp:        '🤔 Q5：この仕様は何と呼ばれ、なぜ重要か？',
        },
        choicesByLang: {
          python: [
            'total_score を大文字にする（定数扱い）',
            '関数内で global total_score と宣言してからアクセスする',
            'Python では関数内からグローバル変数を変更できない',
            'return で値を返すほうが推奨（global も有効だが副作用に注意）',
          ],
          javascript: [
            'var の代わりに const または let を使う（ブロックスコープになる）',
            'var は必ず最上部で宣言する',
            'use strict を追加する',
            'TypeScript に移行する',
          ],
          java: [
            'Java の int 型は約21億（2^31-1）まで。3_000_000_000 は超えているため long 型を使い 3_000_000_000L と書く',
            'int は1億まで',
            'アンダースコア（_）を数字の中に使えない（アンダースコア自体はJava7以降で使える）',
            'long の代わりに double を使う',
          ],
          cpp: [
            '型エラー。正しい型にキャストすれば解決する',
            'スコープ（有効範囲）。変数はブロック内でのみ有効。これにより変数の意図しない変更を防げる',
            'メモリエラー。ヒープに確保すれば解決する',
            'C++のバグ。グローバル変数に変えれば解決する',
          ],
        },
        answerByLang: { python: 1, javascript: 0, java: 0, cpp: 1 },
        points: 5,
        explanationByLang: {
          python:     '関数内でグローバル変数に代入する場合は <code>global 変数名</code> の宣言が必要です。ただし <code>global</code> を多用するとコードの予測可能性が下がります。実務では <code>return</code> で値を返してから代入する設計が推奨されます。',
          javascript: '<code>var</code> は関数スコープを持ち、<code>if</code> や <code>for</code> ブロックを超えて有効です。<code>let</code> と <code>const</code> はブロックスコープを持ち、ブロック外からはアクセスできません。モダンJSでは <code>var</code> を使わず <code>const</code>/<code>let</code> を使うのが標準です。',
          java:       '<code>int</code> 型の最大値は 2,147,483,647（約21億）です。30億は超えているためコンパイルエラーになります。30億以上の数には <code>long</code> 型を使い、リテラルには末尾に <code>L</code> をつけます（<code>3_000_000_000L</code>）。',
          cpp:        '<strong>スコープ</strong>（有効範囲）はC++の根幹的な仕様です。変数はブロック（<code>{ }</code>）内でのみ有効で、ブロック外からはアクセスできません。これにより変数の意図しない変更を防ぎ、メモリを効率的に管理できます。',
        },
      },
    ],
  },

  // ──── STEP 5: 関数 ────
  {
    id: 5,
    badge: 'STEP 5',
    concept: '関数 (function)',
    title: '関数で整理しよう',
    desc: '同じ処理をまとめて名前をつけたものが「関数」。クイズゲームを関数に分けることで、コードが読みやすくなる！',
    flowchart: [
      { type: 'start', label: 'main()' },
      { type: 'fn-call', label: 'show_rules()' },
      { type: 'fn-call', label: 'quiz(問題, 正解)' },
      { type: 'fn-call', label: 'show_result(score)' },
      { type: 'end', label: '終了' },
    ],
    code: {
      python: `<span class="cmt"># 関数で整理（def）</span>

<span class="kw">def</span> <span class="fn">show_rules</span>():
    <span class="fn">print</span>(<span class="str">"=== クイズゲーム ==="</span>)

<span class="kw">def</span> <span class="fn">quiz</span>(<span class="var">question</span>, <span class="var">correct</span>):
    <span class="fn">print</span>(<span class="var">question</span>)
    <span class="var">ans</span> = <span class="fn">input</span>(<span class="str">"答え: "</span>)
    <span class="kw">return</span> <span class="var">ans</span> == <span class="var">correct</span>

<span class="kw">def</span> <span class="fn">show_result</span>(<span class="var">score</span>):
    <span class="fn">print</span>(<span class="str">f"スコア: {score} 点"</span>)

<span class="var">score</span> = <span class="num">0</span>
<span class="fn">show_rules</span>()
<span class="kw">if</span> <span class="fn">quiz</span>(<span class="str">"1+1は？"</span>, <span class="str">"2"</span>): <span class="var">score</span> += <span class="num">1</span>
<span class="fn">show_result</span>(<span class="var">score</span>)`,
      javascript: `<span class="cmt">// 関数（function / アロー関数）</span>

<span class="kw">function</span> <span class="fn">showRules</span>() {
    <span class="fn">console</span>.<span class="fn">log</span>(<span class="str">"=== クイズゲーム ==="</span>);
}

<span class="kw">const</span> <span class="fn">quiz</span> = (<span class="var">question</span>, <span class="var">correct</span>) => {
    <span class="kw">const</span> <span class="var">ans</span> = <span class="fn">prompt</span>(<span class="var">question</span>);
    <span class="kw">return</span> <span class="var">ans</span> === <span class="var">correct</span>;
};

<span class="kw">function</span> <span class="fn">showResult</span>(<span class="var">score</span>) {
    <span class="fn">console</span>.<span class="fn">log</span>(<span class="str">\`スコア: \${score} 点\`</span>);
}

<span class="kw">let</span> <span class="var">score</span> = <span class="num">0</span>;
<span class="fn">showRules</span>();
<span class="kw">if</span> (<span class="fn">quiz</span>(<span class="str">"1+1は？"</span>, <span class="str">"2"</span>)) <span class="var">score</span>++;
<span class="fn">showResult</span>(<span class="var">score</span>);`,
      java: `<span class="cmt">// メソッドで整理（クラス内に定義）</span>
<span class="kw">import</span> java.util.Scanner;
<span class="kw">public class</span> <span class="type">QuizGame</span> {
    <span class="kw">static</span> <span class="type">Scanner</span> <span class="var">sc</span> = <span class="kw">new</span> <span class="type">Scanner</span>(System.in);

    <span class="kw">static void</span> <span class="fn">showRules</span>() {
        System.out.<span class="fn">println</span>(<span class="str">"=== クイズゲーム ==="</span>);
    }
    <span class="kw">static boolean</span> <span class="fn">quiz</span>(<span class="type">String</span> <span class="var">q</span>, <span class="type">String</span> <span class="var">correct</span>) {
        System.out.<span class="fn">println</span>(<span class="var">q</span>);
        <span class="kw">return</span> <span class="var">sc</span>.<span class="fn">nextLine</span>().<span class="fn">equals</span>(<span class="var">correct</span>);
    }
    <span class="kw">static void</span> <span class="fn">showResult</span>(<span class="type">int</span> <span class="var">score</span>) {
        System.out.<span class="fn">println</span>(<span class="str">"スコア: "</span> + <span class="var">score</span> + <span class="str">"点"</span>);
    }
    <span class="kw">public static void</span> <span class="fn">main</span>(<span class="type">String</span>[] args) {
        <span class="type">int</span> <span class="var">score</span> = <span class="num">0</span>;
        <span class="fn">showRules</span>();
        <span class="kw">if</span> (<span class="fn">quiz</span>(<span class="str">"1+1は？"</span>, <span class="str">"2"</span>)) <span class="var">score</span>++;
        <span class="fn">showResult</span>(<span class="var">score</span>);
    }
}`,
      cpp: `<span class="cmt">// 関数で整理</span>
<span class="kw">#include</span> <span class="str">&lt;iostream&gt;</span>
<span class="kw">#include</span> <span class="str">&lt;string&gt;</span>
<span class="kw">using namespace</span> std;

<span class="kw">void</span> <span class="fn">showRules</span>() {
    cout << <span class="str">"=== クイズゲーム ==="</span> << endl;
}
<span class="kw">bool</span> <span class="fn">quiz</span>(<span class="type">string</span> <span class="var">q</span>, <span class="type">string</span> <span class="var">correct</span>) {
    cout << <span class="var">q</span> << endl;
    <span class="type">string</span> <span class="var">ans</span>; cin >> <span class="var">ans</span>;
    <span class="kw">return</span> <span class="var">ans</span> == <span class="var">correct</span>;
}
<span class="kw">void</span> <span class="fn">showResult</span>(<span class="type">int</span> <span class="var">score</span>) {
    cout << <span class="str">"スコア: "</span> << <span class="var">score</span> << <span class="str">"点"</span> << endl;
}
<span class="type">int</span> <span class="fn">main</span>() {
    <span class="type">int</span> <span class="var">score</span> = <span class="num">0</span>;
    <span class="fn">showRules</span>();
    <span class="kw">if</span> (<span class="fn">quiz</span>(<span class="str">"1+1は？"</span>, <span class="str">"2"</span>)) <span class="var">score</span>++;
    <span class="fn">showResult</span>(<span class="var">score</span>);
    <span class="kw">return</span> <span class="num">0</span>;
}`,
    },
    usageEnv: {
      python: 'def で手軽に関数定義。Djangoのビュー関数・Flaskのルートも関数ベース。デコレータ（@）で機能を拡張する書き方も特徴的です。',
      javascript: 'Reactコンポーネントも function で書きます。コールバック・Promise・async/await で非同期処理も関数ベースで記述します。',
      java: '関数はクラスのメソッドとして定義します。SpringのService層に処理をメソッドとして整理するのが定番のアーキテクチャです。',
      cpp: 'ゲームのUpdate()/Render()関数、ライブラリのAPI設計でも関数が基本単位。inline関数でオーバーヘッドを削減するパフォーマンス最適化も重要です。',
    },
    concepts: {
      python: [
        { icon: '📦', text: '<strong>def で定義</strong> ── <code>def 関数名(引数):</code> とコロンで始める。インデントが必須' },
        { icon: '📨', text: '<strong>戻り値の型宣言不要</strong> ── <code>return</code> で任意の値を返せる' },
        { icon: '🐍', text: '<strong>ラムダ</strong> ── <code>lambda x: x*2</code> で1行の無名関数を書ける' },
      ],
      javascript: [
        { icon: '📦', text: '<strong>function / アロー関数</strong> ── <code>function f(){}</code> と <code>const f = () => {}</code> の2種類' },
        { icon: '📨', text: '<strong>戻り値の型宣言不要</strong> ── <code>return</code> で値を返す。型宣言は不要' },
        { icon: '🌐', text: '<strong>コールバック</strong> ── 関数を引数として渡すスタイルが多用される（非同期処理など）' },
      ],
      java: [
        { icon: '📦', text: '<strong>メソッドとして定義</strong> ── クラスの中にメソッドを書く。クラス外に関数は書けない' },
        { icon: '📨', text: '<strong>戻り値の型が必須</strong> ── <code>static int add(int a, int b)</code> のように型宣言が必要' },
        { icon: '☕', text: '<strong>void</strong> ── 値を返さない関数の戻り値型は <code>void</code> と書く' },
      ],
      cpp: [
        { icon: '📦', text: '<strong>戻り値の型が必須</strong> ── <code>int add(int a, int b)</code> のように型宣言が必要' },
        { icon: '📨', text: '<strong>void</strong> ── 値を返さない場合は <code>void</code> を指定する' },
        { icon: '⚙️', text: '<strong>インライン関数</strong> ── <code>inline void f()</code> で呼び出しオーバーヘッドを削減できる' },
      ],
    },
    quizzes: [
      {
        type: 'choice',
        questionByLang: {
          python:     '🤔 Q1：<code>def greet():</code> で定義した関数を呼び出すには？',
          javascript: '🤔 Q1：<code>function greet() { }</code> で定義した関数を呼び出すには？',
          java:       '🤔 Q1：<code>static void greet() { }</code> で定義したメソッドを呼び出すには？',
          cpp:        '🤔 Q1：<code>void greet() { }</code> で定義した関数を呼び出すには？',
        },
        choices: ['greet', 'greet()', 'call greet', 'run greet'],
        answer: 1,
        points: 3,
        explanation: '関数は名前の後に <code>()</code> をつけて呼び出します。全言語で共通のルールです。<code>greet</code> だけでは関数オブジェクトの参照になり実行されません。',
      },
      {
        type: 'text',
        question: '🤔 Q2：関数の結果を呼び出し元に返すキーワードは？',
        answer: 'return',
        placeholder: 'キーワードを入力…',
        hint: '英語6文字。全言語共通のキーワードです',
        points: 3,
        explanation: '<code>return</code> はすべての言語で共通のキーワードです。関数の実行を終了し、値を呼び出し元に返します。',
      },
      {
        type: 'choice',
        question: '🤔 Q3：関数の戻り値の型宣言が「必要」な言語は？',
        choices: ['Python と JavaScript', 'Java と C++', 'Python のみ', '全言語で不要'],
        answer: 1,
        points: 3,
        explanation: 'Java/C++ では <code>int add()</code> や <code>void greet()</code> のように戻り値の型を宣言します。Python/JavaScript では型宣言不要です（TypeScriptでは任意で宣言可能）。',
      },
      {
        type: 'choice',
        scenarioByLang: {
          python:     'ユーザー権限チェック if user["role"] == "admin" or user["role"] == "manager": を5か所にコピペしました。後で "superadmin" を追加する必要が出て、5か所すべて修正が必要になりました。',
          javascript: 'ログイン済みかつ管理者チェックのコードを React コンポーネントの3か所にコピペしました。後で「2段階認証済み」の条件が追加され、3か所修正が必要になりました。',
          java:       '「ユーザーが管理者かどうか」チェックのコードをクラス3か所に重複して書きました。後で条件変更があり、3か所修正が必要になりました。',
          cpp:        '「管理者権限チェック」コードを4か所に複製しました。後で条件変更があり、4か所すべて修正が必要になりました。',
        },
        questionByLang: {
          python:     '🤔 Q4：このような保守性の問題を防ぐ正しいアプローチは？',
          javascript: '🤔 Q4：このような保守性の問題を防ぐ正しいアプローチは？',
          java:       '🤔 Q4：このような保守性の問題を防ぐ正しいアプローチは？',
          cpp:        '🤔 Q4：このような保守性の問題を防ぐ正しいアプローチは？',
        },
        choicesByLang: {
          python: [
            'コメントに「このコードは5か所あります」と書く',
            'def has_privilege(user): ... のような関数にまとめ、各所から呼び出す',
            'グローバル変数に保存する',
            'if文を1行にまとめる',
          ],
          javascript: [
            'さらに多くの場所にコピペする',
            'const isAdminUser = (user) => ... のような関数（またはカスタムフック）にまとめる',
            'グローバル変数に保存する',
            'コメントに説明を書く',
          ],
          java: [
            'static boolean isAdmin(User user) { ... } のような static メソッドにまとめる',
            'interface を使う（これは別の目的）',
            'グローバル変数を使う（Javaにグローバル変数はない）',
            'コメントを増やす',
          ],
          cpp: [
            'bool isAdmin(const User& user) { ... } のような関数にまとめ、各所から呼び出す',
            'マクロ定義（#define）を使う（型安全でないため非推奨）',
            'グローバル変数を使う',
            'コメントに説明を書く',
          ],
        },
        answerByLang: { python: 1, javascript: 1, java: 0, cpp: 0 },
        points: 5,
        explanationByLang: {
          python:     '同じロジックを関数にまとめる原則を <strong>DRY（Don\'t Repeat Yourself）</strong> と言います。<code>def has_privilege(user):</code> を作れば修正は1か所で済みます。Pythonでは関数がファーストクラスオブジェクトなので、関数を引数に渡すことも容易です。',
          javascript: 'DRY原則に従い、<code>const isAdminUser = (user) => ...</code> のような関数にまとめます。Reactでは状態を扱うロジックは <code>useAdmin()</code> のようなカスタムフックに切り出すのがベストプラクティスです。',
          java:       '<code>static</code> メソッドにまとめることで、インスタンス生成なしに呼び出せます。<code>AuthUtils.isAdmin(user)</code> のようなユーティリティクラスに集約するのが一般的な設計パターンです。修正は1か所で済み、テストも書きやすくなります。',
          cpp:        '関数にまとめることで修正は1か所で済みます。<code>const User&</code> は参照渡し（コピーを避ける）です。ヘッダファイル（.h）に宣言を書き、複数の .cpp ファイルから <code>#include</code> することで再利用できます。',
        },
      },
      {
        type: 'choice',
        scenarioByLang: {
          python:     'def get_discount(price): if price > 1000: return price * 0.9 という関数を書きました。d = get_discount(500) を呼んだら d * 2 で TypeError が出ました。',
          javascript: 'function getDiscount(price) { if (price > 1000) { return price * 0.9; } } を定義し、const d = getDiscount(500); console.log(d * 2) を実行したら NaN が出力されました。',
          java:       '「2つの整数を受け取り、大きい方の値を返す」関数 max() を実装したい。',
          cpp:        '「2つの整数を受け取り、大きい方の値を返す」関数 max() を実装したい。',
        },
        questionByLang: {
          python:     '🤔 Q5：TypeError の原因は？',
          javascript: '🤔 Q5：NaN が出力される原因は？',
          java:       '🤔 Q5：Javaで正しいメソッド定義は？',
          cpp:        '🤔 Q5：C++で正しい関数定義は？',
        },
        choicesByLang: {
          python: [
            'Python の関数はすべて return が必要',
            'price <= 1000 の場合 return が実行されず None が返る。None に掛け算はできない',
            '0.9 を int にする必要がある',
            'TypeError は Python のバグ',
          ],
          javascript: [
            'JavaScript の掛け算のバグ',
            'price <= 1000 のとき return が実行されず undefined が返る。undefined * 2 は NaN になる',
            '0.9 を整数にする必要がある',
            'console.log の書き方が間違い',
          ],
          java: [
            'void max(int a, int b) { return a > b ? a : b; }',
            'int max(int a, int b) { return a > b ? a : b; }',
            'max(int a, int b) { return a > b ? a : b; }',
            'function max(int a, int b) { return a > b ? a : b; }',
          ],
          cpp: [
            'void max(int a, int b) { return a > b ? a : b; }',
            'int max(int a, int b) { return a > b ? a : b; }',
            'max(int a, int b) { return a > b ? a : b; }',
            'function max(int a, int b) { return a > b ? a : b; }',
          ],
        },
        answerByLang: { python: 1, javascript: 1, java: 1, cpp: 1 },
        points: 5,
        explanationByLang: {
          python:     'Pythonの関数は <code>return</code> 文が実行されない場合、暗黙的に <code>None</code> を返します。<code>None * 2</code> は TypeError になります。すべての分岐で適切な値を返すか、<code>else: return price</code> のようにデフォルト値を返してください。',
          javascript: 'JavaScriptの関数も <code>return</code> が実行されない場合、暗黙的に <code>undefined</code> を返します。<code>undefined * 2</code> は <code>NaN</code>（Not a Number）になります。<code>else { return price; }</code> を追加してすべての分岐で値を返してください。',
          java:       'Java/C++では戻り値の型宣言が必須です。整数を返すなら <code>int</code> を宣言します。<code>void</code> は「値を返さない」型なので <code>return</code> で値を返せません。選択肢Cは戻り値型がなくコンパイルエラー。選択肢Dは JavaScript 構文です。',
          cpp:        'C++でも戻り値の型宣言が必須です。整数を返すなら <code>int</code> を宣言します。<code>void</code> は戻り値なし。選択肢Cは戻り値型がなくコンパイルエラー。選択肢Dは JavaScript 構文です。なお標準ライブラリに <code>std::max()</code> が存在するため名前の衝突に注意が必要です。',
        },
      },
    ],
  },

  // ──── STEP 6: FizzBuzz ────
  {
    id: 6,
    badge: 'STEP 6',
    concept: '総合演習：FizzBuzz',
    title: '総合演習：FizzBuzz',
    desc: 'プログラミングの登竜門「FizzBuzz」！1〜30の数を順に表示し、3の倍数は「Fizz」、5の倍数は「Buzz」、15の倍数は「FizzBuzz」と表示します。4言語で書き方を比較しよう！',
    flowchart: [
      { type: 'proc', label: 'i = 1' },
      { type: 'diamond', label: 'i <= 30 ?' },
      { type: 'diamond', label: 'i % 15\n== 0 ?' },
      { type: 'proc-yes', label: 'FizzBuzz\nを表示' },
      { type: 'diamond', label: 'i % 3\n== 0 ?' },
      { type: 'proc-yes', label: 'Fizz\nを表示' },
      { type: 'proc-no', label: 'i%5==0→Buzz\nelse→i' },
      { type: 'proc', label: 'i += 1\n↑ループ先頭へ' },
      { type: 'end', label: '終了' },
    ],
    code: {
      python: `<span class="cmt"># FizzBuzz（総合演習）</span>

<span class="kw">for</span> <span class="var">i</span> <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, <span class="num">31</span>):  <span class="cmt"># 1〜30</span>
    <span class="kw">if</span>   <span class="var">i</span> % <span class="num">15</span> == <span class="num">0</span>: <span class="fn">print</span>(<span class="str">"FizzBuzz"</span>)
    <span class="kw">elif</span> <span class="var">i</span> % <span class="num">3</span>  == <span class="num">0</span>: <span class="fn">print</span>(<span class="str">"Fizz"</span>)
    <span class="kw">elif</span> <span class="var">i</span> % <span class="num">5</span>  == <span class="num">0</span>: <span class="fn">print</span>(<span class="str">"Buzz"</span>)
    <span class="kw">else</span>:            <span class="fn">print</span>(<span class="var">i</span>)`,
      javascript: `<span class="cmt">// FizzBuzz（総合演習）</span>

<span class="kw">for</span> (<span class="kw">let</span> <span class="var">i</span> = <span class="num">1</span>; <span class="var">i</span> <= <span class="num">30</span>; <span class="var">i</span>++) {
    <span class="kw">if</span>      (<span class="var">i</span> % <span class="num">15</span> === <span class="num">0</span>) <span class="fn">console</span>.<span class="fn">log</span>(<span class="str">"FizzBuzz"</span>);
    <span class="kw">else if</span> (<span class="var">i</span> % <span class="num">3</span>  === <span class="num">0</span>) <span class="fn">console</span>.<span class="fn">log</span>(<span class="str">"Fizz"</span>);
    <span class="kw">else if</span> (<span class="var">i</span> % <span class="num">5</span>  === <span class="num">0</span>) <span class="fn">console</span>.<span class="fn">log</span>(<span class="str">"Buzz"</span>);
    <span class="kw">else</span>                   <span class="fn">console</span>.<span class="fn">log</span>(<span class="var">i</span>);
}`,
      java: `<span class="cmt">// FizzBuzz（総合演習）</span>
<span class="kw">public class</span> <span class="type">FizzBuzz</span> {
    <span class="kw">public static void</span> <span class="fn">main</span>(<span class="type">String</span>[] args) {
        <span class="kw">for</span> (<span class="type">int</span> <span class="var">i</span> = <span class="num">1</span>; <span class="var">i</span> <= <span class="num">30</span>; <span class="var">i</span>++) {
            <span class="kw">if</span>      (<span class="var">i</span> % <span class="num">15</span> == <span class="num">0</span>)
                System.out.<span class="fn">println</span>(<span class="str">"FizzBuzz"</span>);
            <span class="kw">else if</span> (<span class="var">i</span> % <span class="num">3</span>  == <span class="num">0</span>)
                System.out.<span class="fn">println</span>(<span class="str">"Fizz"</span>);
            <span class="kw">else if</span> (<span class="var">i</span> % <span class="num">5</span>  == <span class="num">0</span>)
                System.out.<span class="fn">println</span>(<span class="str">"Buzz"</span>);
            <span class="kw">else</span>
                System.out.<span class="fn">println</span>(<span class="var">i</span>);
        }
    }
}`,
      cpp: `<span class="cmt">// FizzBuzz（総合演習）</span>
<span class="kw">#include</span> <span class="str">&lt;iostream&gt;</span>
<span class="kw">using namespace</span> std;
<span class="type">int</span> <span class="fn">main</span>() {
    <span class="kw">for</span> (<span class="type">int</span> <span class="var">i</span> = <span class="num">1</span>; <span class="var">i</span> <= <span class="num">30</span>; <span class="var">i</span>++) {
        <span class="kw">if</span>      (<span class="var">i</span> % <span class="num">15</span> == <span class="num">0</span>) cout << <span class="str">"FizzBuzz"</span> << endl;
        <span class="kw">else if</span> (<span class="var">i</span> % <span class="num">3</span>  == <span class="num">0</span>) cout << <span class="str">"Fizz"</span>     << endl;
        <span class="kw">else if</span> (<span class="var">i</span> % <span class="num">5</span>  == <span class="num">0</span>) cout << <span class="str">"Buzz"</span>     << endl;
        <span class="kw">else</span>                  cout << <span class="var">i</span>           << endl;
    }
    <span class="kw">return</span> <span class="num">0</span>;
}`,
    },
    usageEnv: {
      python: '就職・転職面接で頻出の問題です。list comprehension を使ったワンライナー解法も有名で、Pythonらしい書き方の練習にもなります。',
      javascript: 'フロントエンドエンジニア面接の定番問題。<code>Array.from({length:30}).map()</code> など関数型スタイルの解法も好まれます。',
      java: 'Javaエンジニアの採用面接でも定番。Stream APIを使った関数型スタイルの解法も近年では見られます。',
      cpp: '競技プログラミングの入門問題として定番。高速出力が必要な場合は <code>printf()</code> を使うことも。AtCoderでは C++ 利用者が最多です。',
    },
    concepts: {
      python: [
        { icon: '➗', text: '<strong>% (剰余演算子)</strong> ── 割り算の「余り」を返す。<code>9 % 3 == 0</code> は3の倍数の判定（全言語共通）' },
        { icon: '🔢', text: '<strong>range(1, 31)</strong> ── 1から30まで生成（終端の31は含まれない）' },
        { icon: '⚠️', text: '<strong>判定順が重要！</strong> ── <code>i % 15</code> を最初に判定しないと15の倍数が誤判定になる' },
      ],
      javascript: [
        { icon: '➗', text: '<strong>% (剰余演算子)</strong> ── 全言語共通の演算子' },
        { icon: '🔢', text: '<strong>i = 1; i &lt;= 30</strong> ── 終端を含むので <code>&lt;=</code> を使う（Pythonと違う点）' },
        { icon: '⚠️', text: '<strong>判定順が重要！</strong> ── <code>i % 15</code> を最初に判定しないと15の倍数が誤判定になる' },
      ],
      java: [
        { icon: '➗', text: '<strong>% (剰余演算子)</strong> ── 全言語共通の演算子' },
        { icon: '🔢', text: '<strong>i = 1; i &lt;= 30</strong> ── 終端を含むので <code>&lt;=</code> を使う' },
        { icon: '⚠️', text: '<strong>判定順が重要！</strong> ── <code>i % 15</code> を最初に判定しないと15の倍数が誤判定になる' },
      ],
      cpp: [
        { icon: '➗', text: '<strong>% (剰余演算子)</strong> ── 全言語共通の演算子' },
        { icon: '🔢', text: '<strong>i = 1; i &lt;= 30</strong> ── 終端を含むので <code>&lt;=</code> を使う' },
        { icon: '⚠️', text: '<strong>判定順が重要！</strong> ── <code>i % 15</code> を最初に判定しないと15の倍数が誤判定になる' },
      ],
    },
    quizzes: [
      {
        type: 'text',
        questionByLang: {
          python:     '🤔 Q1：Python で <code>9 % 3</code> の結果は？',
          javascript: '🤔 Q1：JavaScript で <code>9 % 3</code> の結果は？',
          java:       '🤔 Q1：Java で <code>9 % 3</code> の結果は？',
          cpp:        '🤔 Q1：C++ で <code>9 % 3</code> の結果は？',
        },
        answer: '0',
        placeholder: '数字を入力…',
        hint: '9 ÷ 3 = 3 余り ?',
        points: 3,
        explanation: '<code>%</code> は割り算の「余り」を返します。9 ÷ 3 = 3 余り 0 → 結果は <strong>0</strong>。<code>9 % 3 == 0</code> が True になるので「9は3の倍数」と判定できます。全言語で同じ動作です。',
      },
      {
        type: 'choice',
        question: '🤔 Q2：FizzBuzz で i = 15 のとき、最初に判定すべき条件は？',
        choices: ['i % 3 == 0', 'i % 5 == 0', 'i % 15 == 0', 'i == 15'],
        answer: 2,
        points: 3,
        explanation: '15は3の倍数でも5の倍数でもあるため、先に <code>i % 3</code> や <code>i % 5</code> を判定すると「FizzBuzz」ではなく「Fizz」や「Buzz」になります。全言語で <code>i % 15</code> を最初に判定します。',
      },
      {
        type: 'choice',
        question: '🤔 Q3：Python の <code>range(1, 31)</code> と、C++・Java の for ループで1〜30を表示する場合の違いは？',
        choices: [
          'Pythonは range(1,31) で終端31は含まれない / 他言語は i<=30 で終端30を含む',
          '違いはない',
          'C++/Javaは1〜31を表示してしまう',
          'Pythonは0から始まる',
        ],
        answer: 0,
        points: 3,
        explanation: 'Pythonの <code>range(1, 31)</code> は1〜30を生成（31は含まれない）。C++/JavaのforはPythonと違い <code>i &lt;= 30</code> と書くことで終端30を含みます。どちらも結果は1〜30です。',
      },
      {
        type: 'choice',
        scenarioByLang: {
          python:     '就職面接でFizzBuzzを実装するよう求められ、以下のコードを書きました。\nfor i in range(1, 31):\n    if i % 3 == 0: print("Fizz")\n    elif i % 5 == 0: print("Buzz")\n    else: print(i)\n面接官から「15の倍数の処理が足りていませんが？」と指摘されました。',
          javascript: '就職面接でFizzBuzzを実装するよう求められ、以下のコードを書きました。\nfor (let i = 1; i <= 30; i++) {\n  if (i % 3 === 0) console.log("Fizz");\n  else if (i % 5 === 0) console.log("Buzz");\n  else console.log(i);\n}\n面接官から「15の倍数の処理が足りていませんが？」と指摘されました。',
          java:       '就職面接でFizzBuzzを実装するよう求められ、以下のコードを書きました。\nfor (int i = 1; i <= 30; i++) {\n  if (i % 3 == 0) System.out.println("Fizz");\n  else if (i % 5 == 0) System.out.println("Buzz");\n  else System.out.println(i);\n}\n面接官から「15の倍数の処理が足りていませんが？」と指摘されました。',
          cpp:        '就職面接でFizzBuzzを実装するよう求められ、以下のコードを書きました。\nfor (int i = 1; i <= 30; i++) {\n  if (i % 3 == 0) cout << "Fizz\\n";\n  else if (i % 5 == 0) cout << "Buzz\\n";\n  else cout << i << "\\n";\n}\n面接官から「15の倍数の処理が足りていませんが？」と指摘されました。',
        },
        question: '🤔 Q4：最もよくある原因は？',
        choices: [
          '% 演算子の使い方が間違っている',
          'i % 3 と i % 5 を先に判定したため、i % 15 の場合が「FizzBuzz」ではなく「Fizz」になっている',
          'for ループの範囲が間違っている',
          'print / console.log の書き方が間違っている',
        ],
        answer: 1,
        points: 5,
        explanation: '15は3の倍数かつ5の倍数なので、<code>i % 3 == 0</code> を先に判定すると「FizzBuzz」ではなく「Fizz」が出力されます。<strong>i % 15 を最初に判定</strong>することが必須です。面接でのFizzBuzzで最も多いミスで、条件分岐の順序への理解を見るために出題されます。',
      },
      {
        type: 'choice',
        scenarioByLang: {
          python:     '上司から「FizzBuzzを拡張して、7の倍数は Bazz、21（3×7）の倍数は FizzBazz と表示するよう修正して」と依頼されました。現在のコードは for i in range(1, 31): if i % 15 == 0: ... の構造です。',
          javascript: '上司から「FizzBuzzを拡張して、7の倍数は Bazz、21（3×7）の倍数は FizzBazz と表示するよう修正して」と依頼されました。現在のコードは for (let i = 1; i <= 30; i++) { if (i % 15 === 0) ... } の構造です。',
          java:       '上司から「FizzBuzzを拡張して、7の倍数は Bazz、21（3×7）の倍数は FizzBazz と表示するよう修正して」と依頼されました。現在のコードは for (int i = 1; i <= 30; i++) { if (i % 15 == 0) ... } の構造です。',
          cpp:        '上司から「FizzBuzzを拡張して、7の倍数は Bazz、21（3×7）の倍数は FizzBazz と表示するよう修正して」と依頼されました。現在のコードは for (int i = 1; i <= 30; i++) { if (i % 15 == 0) ... } の構造です。',
        },
        question: '🤔 Q5：21の倍数（3かつ7の倍数）を正しく処理するには？',
        choices: [
          'i % 3 == 0 を最初に判定する',
          'i % 21 == 0 を最初に判定して FizzBazz を出力する',
          'i % 7 == 0 を最初に判定する',
          'i == 21 のみを判定する',
        ],
        answer: 1,
        points: 5,
        explanation: 'FizzBuzzと同じ原則です。複数条件が重なる数（21 = 3×7）は<strong>最初に</strong>判定します。正しい優先順序: <code>i%21→FizzBazz</code>、<code>i%15→FizzBuzz</code>、<code>i%3→Fizz</code>、<code>i%7→Bazz</code>、<code>i%5→Buzz</code>。仕様変更への対応力も実務で重要なスキルです。',
      },
    ],
  },
];

// ===== アプリ状態 =====
let currentStep = 0;
let currentLang = 'python';
let answered = STEPS.map(s => new Array(s.quizzes.length).fill(false));
let scores = STEPS.map(s => new Array(s.quizzes.length).fill(0));
let completed = new Array(STEPS.length).fill(false);

const MAX_SCORE = STEPS.reduce((sum, s) => sum + s.quizzes.reduce((a, q) => a + q.points, 0), 0);

// ===== 状態の保存/読み込み =====
function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem('langflow_state') || '{}');
    if (s.currentStep !== undefined) currentStep = s.currentStep;
    if (s.currentLang) currentLang = s.currentLang;
    if (s.scores) scores = s.scores;
    if (s.answered) answered = s.answered;
    if (s.completed) completed = s.completed;
  } catch (e) { }
  applyLangColor();
  renderLangSwitcher();
  renderStep(currentStep);
}

function saveState() {
  localStorage.setItem('langflow_state', JSON.stringify({ currentStep, currentLang, scores, answered, completed }));
}

// ===== 言語カラー適用 =====
function applyLangColor() {
  const lang = LANGUAGES.find(l => l.id === currentLang);
  if (!lang) return;
  document.documentElement.style.setProperty('--lang-color', lang.color);
  document.documentElement.style.setProperty('--lang-color-bg', lang.colorBg);
}

// ===== 言語切替タブ描画 =====
function renderLangSwitcher() {
  const lang = LANGUAGES.find(l => l.id === currentLang);
  document.getElementById('langSwitcher').innerHTML = LANGUAGES.map(l => `
    <button class="lang-tab ${currentLang === l.id ? 'active' : ''}"
      onclick="switchLang('${l.id}')"
      style="${currentLang === l.id ? `--tab-color:${l.color};--tab-bg:${l.colorBg}` : ''}"
      role="tab" aria-selected="${currentLang === l.id}">
      <span class="lang-tab-icon">${l.icon}</span>
      <span class="lang-tab-name">${l.name}</span>
      <span class="lang-tab-env">${l.env}</span>
    </button>
  `).join('');
}

// ===== 言語切替 =====
function switchLang(langId) {
  currentLang = langId;
  saveState();
  applyLangColor();
  renderLangSwitcher();
  renderStep(currentStep);
}

// ===== フローチャートSVG生成 =====
function buildFlowchart(nodes) {
  const W = 220, nodeH = 44, DIAW = 180, DIAY = 64;
  const padX = 30, startY = 20, gap = 24;
  let svgH = startY;
  const items = nodes.map(n => {
    const h = (n.type === 'diamond') ? DIAY : nodeH;
    const y = svgH;
    svgH += h + gap;
    return { ...n, y, h };
  });
  svgH += 10;
  const cx = W / 2;
  const colorMap = {
    start: { fill: '#6366f1', stroke: '#818cf8' },
    end: { fill: '#6366f1', stroke: '#818cf8' },
    io: { fill: '#0e7490', stroke: '#06b6d4' },
    proc: { fill: '#1e3a5f', stroke: '#3b82f6' },
    'proc-yes': { fill: '#064e3b', stroke: '#10b981' },
    'proc-no': { fill: '#450a0a', stroke: '#ef4444' },
    diamond: { fill: '#3b1f6e', stroke: '#8b5cf6' },
    'fn-call': { fill: '#1a3a1a', stroke: '#22c55e' },
  };
  let paths = '', rects = '';
  items.forEach((n, i) => {
    const c = colorMap[n.type] || colorMap.proc;
    const cy = n.y + n.h / 2;
    if (i > 0) {
      const prev = items[i - 1];
      paths += `<line x1="${cx}" y1="${prev.y + prev.h}" x2="${cx}" y2="${n.y}" stroke="#475569" stroke-width="1.5" marker-end="url(#arrow)" />`;
      if (n.type === 'proc' && n.label && n.label.includes('↑')) {
        const lt = items[1];
        paths += `<path d="M ${cx + DIAW / 2 + 20} ${cy} L ${W - padX + 40} ${cy} L ${W - padX + 40} ${lt.y + lt.h / 2} L ${cx + DIAW / 2} ${lt.y + lt.h / 2}" stroke="#f59e0b" stroke-width="1.5" fill="none" stroke-dasharray="5,3" marker-end="url(#arrowWarn)" />`;
      }
    }
    if (n.type === 'diamond') {
      const hw = DIAW / 2;
      paths += `<polygon points="${cx},${n.y} ${cx + hw},${n.y + n.h / 2} ${cx},${n.y + n.h} ${cx - hw},${n.y + n.h / 2}" fill="${c.fill}" stroke="${c.stroke}" stroke-width="1.5" />`;
      paths += `<text x="${cx + hw + 8}" y="${n.y + n.h / 2 + 4}" fill="#10b981" font-size="11" font-family="Inter">Yes</text>`;
      paths += `<text x="${cx - hw - 8}" y="${n.y + n.h / 2 + 4}" fill="#ef4444" font-size="11" font-family="Inter" text-anchor="end">No</text>`;
      n.label.split('\n').forEach((ln, li, arr) => {
        paths += `<text x="${cx}" y="${n.y + n.h / 2 + (li - (arr.length - 1) / 2) * 14}" fill="#e2e8f0" font-size="11" font-family="Inter" text-anchor="middle" dominant-baseline="middle">${ln}</text>`;
      });
    } else {
      const rx = (n.type === 'start' || n.type === 'end') ? 22 : 8;
      const fw = (n.type === 'start' || n.type === 'end') ? 120 : W - padX * 2;
      rects += `<rect x="${cx - fw / 2}" y="${n.y}" width="${fw}" height="${n.h}" rx="${rx}" fill="${c.fill}" stroke="${c.stroke}" stroke-width="1.5" />`;
      n.label.split('\n').forEach((ln, li, arr) => {
        rects += `<text x="${cx}" y="${n.y + n.h / 2 + (li - (arr.length - 1) / 2) * 15}" fill="#e2e8f0" font-size="11" font-family="Inter" text-anchor="middle" dominant-baseline="middle">${ln}</text>`;
      });
    }
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${svgH}" class="flowchart-svg">
    <defs>
      <marker id="arrow" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#475569" /></marker>
      <marker id="arrowWarn" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#f59e0b" /></marker>
    </defs>
    ${paths}${rects}
  </svg>`;
}

// ===== クイズUI生成 =====
function buildQuizzes(step, stepIdx) {
  return step.quizzes.map((q, qi) => {
    const isAnswered = answered[stepIdx][qi];
    const userScore = scores[stepIdx][qi];
    const isCorrect = isAnswered && userScore > 0;
    const question = gl(q.questionByLang, currentLang) || gl(q.question, currentLang);
    const choices = gl(q.choicesByLang, currentLang) || q.choices;
    const answer = (q.answerByLang && q.answerByLang[currentLang] !== undefined) ? q.answerByLang[currentLang] : q.answer;
    let inner = '';
    if (q.type === 'choice') {
      inner = `<div class="quiz-options">
        ${choices.map((c, ci) => {
        let cls = '';
        if (isAnswered && ci === answer) cls = 'correct';
        else if (isAnswered && !isCorrect) cls = '';
        return `<button class="quiz-option ${cls}" id="opt-${stepIdx}-${qi}-${ci}"
            onclick="checkChoice(${stepIdx},${qi},${ci})" ${isAnswered ? 'disabled' : ''}>
            <span class="option-key">${'ABCD'[ci]}</span>${c}
          </button>`;
      }).join('')}
      </div>`;
    } else {
      inner = `<div class="quiz-input-wrap">
        <input class="quiz-input ${isAnswered ? (isCorrect ? 'correct' : 'wrong') : ''}"
          id="quiz-input-${stepIdx}-${qi}" type="text"
          placeholder="${q.placeholder || '答えを入力…'}"
          ${isAnswered ? 'disabled' : ''}
          onkeydown="if(event.key==='Enter')checkText(${stepIdx},${qi})"
          value="${isAnswered ? (isCorrect ? q.answer : '') : ''}" />
        <button class="btn btn-primary btn-sm" onclick="checkText(${stepIdx},${qi})" ${isAnswered ? 'disabled' : ''}>答える</button>
      </div>`;
    }
    const feedbackText = isAnswered ? (isCorrect ? `✅ 正解！ +${q.points}点` : `❌ 不正解。${q.hint || '正解は「' + (q.type === 'choice' ? choices[answer] : q.answer) + '」'}`) : '';
    const feedbackCls = isAnswered ? (isCorrect ? 'correct' : 'wrong') : '';
    const explanation = gl(q.explanationByLang, currentLang) || gl(q.explanation, currentLang);
    const explanationHtml = explanation
      ? `<div class="quiz-explanation ${isAnswered ? 'show' : ''}" id="explanation-${stepIdx}-${qi}">
          <div class="explanation-label">📖 解説</div>
          <div class="explanation-body">${explanation}</div>
        </div>` : '';
    const scenario = gl(q.scenarioByLang, currentLang) || q.scenario || '';
    const scenarioHtml = scenario
      ? `<div class="quiz-scenario"><div class="scenario-label">📋 シナリオ</div><p class="scenario-text">${scenario}</p></div>`
      : '';
    return `<div class="quiz-item" id="quiz-item-${stepIdx}-${qi}">
      ${scenarioHtml}<div class="quiz-q">${question}</div>
      ${inner}
      <div class="quiz-feedback ${feedbackCls} ${isAnswered ? 'show' : ''}" id="feedback-${stepIdx}-${qi}">${feedbackText}</div>
      ${explanationHtml}
      <div class="quiz-points" id="qpts-${stepIdx}-${qi}">⭐ <span class="pts">${q.points}pts</span> 獲得チャンス ／ 取得済み: <span class="pts">${userScore}</span>pts</div>
    </div>`;
  }).join('<hr class="quiz-divider">');
}

// ===== ステップ描画 =====
function renderStep(idx) {
  const step = STEPS[idx];
  const lang = LANGUAGES.find(l => l.id === currentLang);
  const concepts = step.concepts[currentLang] || [];
  const usageEnv = step.usageEnv[currentLang] || '';
  const code = step.code[currentLang] || '';
  document.getElementById('contentArea').innerHTML = `
    <div class="step-hero fade-enter">
      <div class="step-number-display">${step.badge}</div>
      <h1 class="step-main-title">${step.title}</h1>
      <p class="step-desc">${step.desc}</p>
    </div>
    <div class="usage-env-banner fade-enter" style="animation-delay:.03s">
      <span class="usage-env-icon">${lang.icon}</span>
      <div class="usage-env-body">
        <span class="usage-env-label">${lang.name} の現場では</span>
        <span class="usage-env-text">${usageEnv}</span>
      </div>
    </div>
    <div class="cards-grid">
      <div class="card flowchart-card fade-enter" style="animation-delay:.06s">
        <div class="card-title"><span class="icon">🗺️</span>フローチャート</div>
        <div class="fc-wrap">${buildFlowchart(step.flowchart)}</div>
      </div>
      <div class="card code-card fade-enter" style="animation-delay:.09s">
        <div class="card-title"><span class="icon">💻</span>${lang.name} コード例</div>
        <pre class="code-block">${code}</pre>
      </div>
      <div class="card concept-card fade-enter" style="animation-delay:.12s">
        <div class="card-title"><span class="icon">📚</span>ポイント整理</div>
        <div class="concept-list">
          ${concepts.map(c => `
            <div class="concept-item">
              <span class="concept-item-icon">${c.icon}</span>
              <div class="concept-item-text">${c.text}</div>
            </div>`).join('')}
        </div>
      </div>
      <div class="card quiz-card fade-enter" style="animation-delay:.15s">
        <div class="card-title">
          <span class="icon">🎯</span>理解度チェック
          <span class="quiz-count-badge">${step.quizzes.length}問</span>
        </div>
        <div class="quiz-list">${buildQuizzes(step, idx)}</div>
      </div>
    </div>
  `;
  document.getElementById('stepBadge').textContent = step.badge;
  document.getElementById('conceptTag').textContent = step.concept;
  updateNav();
  updateSidebar();
  updateProgress();
}

// ===== ナビゲーション =====
function updateNav() {
  document.getElementById('prevBtn').disabled = currentStep === 0;
  document.getElementById('nextBtn').textContent = currentStep === STEPS.length - 1 ? '完了 🎉' : '次のステップ →';
  document.getElementById('stepDots').innerHTML = STEPS.map((_, i) => {
    let cls = i === currentStep ? 'active' : (completed[i] ? 'done' : '');
    return `<div class="dot ${cls}" onclick="goToStep(${i})" title="STEP ${i + 1}"></div>`;
  }).join('');
}

function updateSidebar() {
  document.getElementById('stepList').innerHTML = STEPS.map((s, i) => {
    const stepScore = scores[i].reduce((a, b) => a + b, 0);
    const stepMax = s.quizzes.reduce((a, q) => a + q.points, 0);
    let cls = i === currentStep ? 'active' : '';
    if (completed[i]) cls += ' completed';
    return `<li>
      <div class="step-item ${cls}" onclick="goToStep(${i})">
        <div class="step-num">${completed[i] ? '✓' : i + 1}</div>
        <div class="step-info">
          <div class="step-title">${s.title}</div>
          <div class="step-sub">${s.quizzes.length}問 ／ ${stepScore}/${stepMax}pts</div>
        </div>
      </div>
    </li>`;
  }).join('');
}

function updateProgress() {
  const done = completed.filter(Boolean).length;
  const pct = Math.round((done / STEPS.length) * 100);
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('progressPct').textContent = pct + '%';
  document.getElementById('totalScore').textContent = scores.flat().reduce((a, b) => a + b, 0);
}

function navigate(dir) {
  const next = currentStep + dir;
  if (next < 0) return;
  if (next >= STEPS.length) { showComplete(); return; }
  completed[currentStep] = true;
  currentStep = next;
  saveState();
  renderStep(currentStep);
  document.getElementById('mainContent').scrollTo({ top: 0, behavior: 'smooth' });
}

function goToStep(idx) {
  currentStep = idx;
  saveState();
  renderStep(currentStep);
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('mainContent').scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== クイズ判定 =====
function checkChoice(stepIdx, quizIdx, choiceIdx) {
  if (answered[stepIdx][quizIdx]) return;
  const q = STEPS[stepIdx].quizzes[quizIdx];
  const answer = (q.answerByLang && q.answerByLang[currentLang] !== undefined) ? q.answerByLang[currentLang] : q.answer;
  const correct = choiceIdx === answer;
  answered[stepIdx][quizIdx] = true;
  scores[stepIdx][quizIdx] = correct ? q.points : 0;
  saveState();
  const choices = gl(q.choicesByLang, currentLang) || q.choices;
  choices.forEach((_, ci) => {
    const btn = document.getElementById(`opt-${stepIdx}-${quizIdx}-${ci}`);
    if (!btn) return;
    btn.disabled = true;
    if (ci === answer) btn.classList.add('correct');
    else if (ci === choiceIdx && !correct) btn.classList.add('wrong');
  });
  showFeedback(stepIdx, quizIdx, correct, q.points);
}

function checkText(stepIdx, quizIdx) {
  if (answered[stepIdx][quizIdx]) return;
  const q = STEPS[stepIdx].quizzes[quizIdx];
  const input = document.getElementById(`quiz-input-${stepIdx}-${quizIdx}`);
  if (!input) return;
  const correct = input.value.trim().toLowerCase() === q.answer.toLowerCase();
  answered[stepIdx][quizIdx] = true;
  scores[stepIdx][quizIdx] = correct ? q.points : 0;
  saveState();
  input.disabled = true;
  input.classList.add(correct ? 'correct' : 'wrong');
  showFeedback(stepIdx, quizIdx, correct, q.points);
}

function showFeedback(stepIdx, quizIdx, correct, pts) {
  const q = STEPS[stepIdx].quizzes[quizIdx];
  const fb = document.getElementById(`feedback-${stepIdx}-${quizIdx}`);
  const exp = document.getElementById(`explanation-${stepIdx}-${quizIdx}`);
  const ptsEl = document.getElementById(`qpts-${stepIdx}-${quizIdx}`);
  if (fb) {
    const answer = (q.answerByLang && q.answerByLang[currentLang] !== undefined) ? q.answerByLang[currentLang] : q.answer;
    const choices = gl(q.choicesByLang, currentLang) || q.choices;
    const ans = q.type === 'choice' ? choices[answer] : q.answer;
    fb.textContent = correct ? `✅ 正解！ +${pts}点 獲得！` : `❌ 不正解。${q.hint || '正解は「' + ans + '」です'}`;
    fb.className = `quiz-feedback ${correct ? 'correct' : 'wrong'} show`;
  }
  if (exp) exp.classList.add('show');
  if (ptsEl) {
    const got = scores[stepIdx][quizIdx];
    ptsEl.innerHTML = `⭐ <span class="pts">${pts}pts</span> 獲得チャンス ／ 取得済み: <span class="pts">${got}</span>pts`;
  }
  updateProgress();
  updateSidebar();
}

// ===== 完了画面 =====
function showComplete() {
  completed[currentStep] = true;
  saveState();
  updateProgress();
  const total = scores.flat().reduce((a, b) => a + b, 0);
  document.getElementById('finalScore').textContent = total;
  document.getElementById('finalMax').textContent = ` / ${MAX_SCORE}`;
  document.getElementById('completeOverlay').style.display = 'flex';
}

// ===== リセット確認 =====
function showResetConfirm() {
  document.getElementById('resetOverlay').classList.add('show');
}

function closeReset() {
  document.getElementById('resetOverlay').classList.remove('show');
}

function confirmReset() {
  closeReset();
  restartAll();
}

function restartAll() {
  currentStep = 0;
  answered = STEPS.map(s => new Array(s.quizzes.length).fill(false));
  scores = STEPS.map(s => new Array(s.quizzes.length).fill(0));
  completed = new Array(STEPS.length).fill(false);
  saveState();
  document.getElementById('completeOverlay').style.display = 'none';
  renderStep(0);
}

// ===== 初期化 =====
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('menuBtn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });
  document.getElementById('resetOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('resetOverlay')) closeReset();
  });
});

loadState();
