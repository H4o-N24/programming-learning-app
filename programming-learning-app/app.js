// ===== STEP データ定義 =====
const STEPS = [
  // ──────────────── STEP 1: 入力と出力 ────────────────
  {
    id: 1,
    badge: 'STEP 1',
    concept: '入力と出力',
    title: '入力と出力',
    desc: 'プログラムの基本は「何かを受け取り、処理して、結果を返す」こと。まずはユーザーから名前をもらって挨拶するプログラムを作ってみよう！',
    flowchart: [
      { type:'start',  label:'開始' },
      { type:'io',     label:'名前を入力' },
      { type:'proc',   label:'「こんにちは〇〇さん」\nと組み立てる' },
      { type:'io',     label:'結果を表示' },
      { type:'end',    label:'終了' },
    ],
    code: `<span class="cmt"># STEP1: 入力と出力</span>

<span class="cmt"># 入力: ユーザーから名前を受け取る</span>
<span class="var">name</span> = <span class="fn">input</span>(<span class="str">"名前を入力してください: "</span>)

<span class="cmt"># 処理: 挨拶文を組み立てる</span>
<span class="var">message</span> = <span class="str">"こんにちは、"</span> + <span class="var">name</span> + <span class="str">"さん！"</span>

<span class="cmt"># 出力: 結果を表示する</span>
<span class="fn">print</span>(<span class="var">message</span>)`,
    concepts: [
      { icon:'📥', text:'<strong>入力 (Input)</strong> ── <code>input()</code> でユーザーから文字を受け取る' },
      { icon:'⚙️', text:'<strong>処理 (Process)</strong> ── 受け取ったデータを変形・計算する' },
      { icon:'📤', text:'<strong>出力 (Output)</strong> ── <code>print()</code> で結果を画面に表示する' },
    ],
    quizzes: [
      {
        type: 'text',
        question: '🤔 Q1：<code>print("Hello")</code> を実行するとどうなる？',
        answer: 'Hello',
        placeholder: '答えを入力…',
        hint: '「Hello」がそのまま画面に表示されます',
        points: 3,
      },
      {
        type: 'choice',
        question: '🤔 Q2：<code>input()</code> の役割は？',
        choices: ['計算する', 'ユーザーからデータを受け取る', '画面に表示する', '変数を作る'],
        answer: 1,
        points: 3,
      },
      {
        type: 'choice',
        question: '🤔 Q3：<code>print("Python")</code> の出力に含まれるのは？',
        choices: ['"Python"（ダブルクォートあり）', 'Python（ダブルクォートなし）', 'エラーになる', '何も表示されない'],
        answer: 1,
        points: 3,
      },
    ],
  },

  // ──────────────── STEP 2: 条件分岐 ────────────────
  {
    id: 2,
    badge: 'STEP 2',
    concept: '条件分岐 (if)',
    title: '条件分岐 (if)',
    desc: '「もし〇〇なら△△する、そうでなければ□□する」という処理。クイズゲームの正解判定に使います！',
    flowchart: [
      { type:'start',   label:'問題を表示' },
      { type:'io',      label:'答えを入力' },
      { type:'diamond', label:'答え\n== 2 ?' },
      { type:'proc-yes',label:'✅ 正解！' },
      { type:'proc-no', label:'❌ 不正解\n正解は 2' },
      { type:'end',     label:'次へ' },
    ],
    code: `<span class="cmt"># STEP2: 条件分岐</span>

<span class="fn">print</span>(<span class="str">"問題: 1 + 1 = ?"</span>)
<span class="var">answer</span> = <span class="fn">input</span>(<span class="str">"あなたの答え: "</span>)

<span class="kw">if</span> <span class="var">answer</span> == <span class="str">"2"</span>:
    <span class="fn">print</span>(<span class="str">"✅ 正解！"</span>)
<span class="kw">elif</span> <span class="var">answer</span> == <span class="str">"3"</span>:
    <span class="fn">print</span>(<span class="str">"惜しい！でも不正解"</span>)
<span class="kw">else</span>:
    <span class="fn">print</span>(<span class="str">"❌ 不正解。正解は 2 です"</span>)`,
    concepts: [
      { icon:'🔀', text:'<strong>if 文</strong> ── 条件が True のときだけ実行される' },
      { icon:'↔️', text:'<strong>elif / else 句</strong> ── 複数条件・デフォルト処理を書ける' },
      { icon:'🔍', text:'<strong>比較演算子</strong> ── <code>==</code> <code>!=</code> <code>&gt;</code> <code>&lt;</code> <code>&gt;=</code> <code>&lt;=</code>' },
    ],
    quizzes: [
      {
        type: 'choice',
        question: '🤔 Q1：<code>x = 5</code> のとき <code>if x > 3:</code> の中は実行される？',
        choices: ['Yes、実行される', 'No、実行されない', 'エラーになる', 'わからない'],
        answer: 0,
        points: 3,
      },
      {
        type: 'text',
        question: '🤔 Q2：<code>if</code> の条件が False のときに実行されるキーワードは？',
        answer: 'else',
        placeholder: 'キーワードを入力…',
        hint: '英語で4文字です',
        points: 3,
      },
      {
        type: 'choice',
        question: '🤔 Q3：<code>x = 10</code> のとき <code>x != 10</code> の結果は？',
        choices: ['True', 'False', '10', 'エラー'],
        answer: 1,
        points: 3,
      },
    ],
  },

  // ──────────────── STEP 3: 繰り返し ────────────────
  {
    id: 3,
    badge: 'STEP 3',
    concept: '繰り返し (loop)',
    title: '繰り返し (while / for)',
    desc: '同じ処理を何度も繰り返すのがループ。「問題が残っている間は続ける」という処理に使います！',
    flowchart: [
      { type:'proc',    label:'count = 0\n問題数 = 3' },
      { type:'diamond', label:'count < 3 ?' },
      { type:'io',      label:'問題を出す' },
      { type:'io',      label:'答えを受け取る' },
      { type:'proc',    label:'count = count + 1\n↑ループ先頭へ戻る' },
      { type:'end',     label:'結果表示' },
    ],
    code: `<span class="cmt"># STEP3: while ループ</span>
<span class="var">count</span> = <span class="num">0</span>
<span class="kw">while</span> <span class="var">count</span> < <span class="num">3</span>:
    <span class="fn">print</span>(<span class="str">f"問題 {count + 1}"</span>)
    <span class="var">count</span> = <span class="var">count</span> + <span class="num">1</span>  <span class="cmt"># 忘れると無限ループ！</span>

<span class="cmt"># STEP3: for ループ（同じ意味）</span>
<span class="kw">for</span> <span class="var">i</span> <span class="kw">in</span> <span class="fn">range</span>(<span class="num">3</span>):
    <span class="fn">print</span>(<span class="str">f"問題 {i + 1}"</span>)

<span class="cmt"># ループを途中で抜ける</span>
<span class="kw">if</span> <span class="var">miss</span> >= <span class="num">3</span>:
    <span class="kw">break</span>`,
    concepts: [
      { icon:'🔁', text:'<strong>while 文</strong> ── 条件が True の間、処理を繰り返す' },
      { icon:'🔂', text:'<strong>for 文</strong> ── <code>range(n)</code> で n 回繰り返す' },
      { icon:'⚠️', text:'<strong>break</strong> ── ループを途中で強制終了する' },
    ],
    quizzes: [
      {
        type: 'choice',
        question: '🤔 Q1：<code>count = 0</code> で始まる <code>while count < 3:</code> は何回繰り返す？',
        choices: ['2回', '3回', '4回', '0回'],
        answer: 1,
        points: 3,
      },
      {
        type: 'text',
        question: '🤔 Q2：ループを途中で強制終了するキーワードは？',
        answer: 'break',
        placeholder: 'キーワードを入力…',
        hint: '英語5文字です',
        points: 3,
      },
      {
        type: 'choice',
        question: '🤔 Q3：<code>for i in range(5):</code> で <code>i</code> が取る最大の値は？',
        choices: ['5', '4', '3', '6'],
        answer: 1,
        points: 3,
      },
    ],
  },

  // ──────────────── STEP 4: 変数とスコア ────────────────
  {
    id: 4,
    badge: 'STEP 4',
    concept: '変数とスコア管理',
    title: '変数でスコア管理',
    desc: '変数はプログラムが覚えておくための「箱」。スコアを変数に入れて、正解するたびに増やしていこう！',
    flowchart: [
      { type:'proc',    label:'score = 0' },
      { type:'io',      label:'問題を解く' },
      { type:'diamond', label:'正解？' },
      { type:'proc-yes',label:'score = score + 1' },
      { type:'proc-no', label:'正解表示' },
      { type:'end',     label:'スコア表示' },
    ],
    code: `<span class="cmt"># STEP4: 変数でスコア管理</span>

<span class="var">score</span> = <span class="num">0</span>    <span class="cmt"># スコアを初期化</span>
<span class="var">miss</span>  = <span class="num">0</span>    <span class="cmt"># ミス回数</span>

<span class="kw">if</span> <span class="var">answer</span> == <span class="var">correct</span>:
    <span class="var">score</span> += <span class="num">1</span>   <span class="cmt"># score = score + 1 と同じ</span>
    <span class="fn">print</span>(<span class="str">f"✅ スコア: {score}"</span>)
<span class="kw">else</span>:
    <span class="var">miss</span> += <span class="num">1</span>
    <span class="fn">print</span>(<span class="str">f"❌ ミス: {miss}回"</span>)

<span class="cmt"># スコア判定（演習問題①）</span>
<span class="kw">if</span> <span class="var">score</span> >= <span class="num">80</span>:
    <span class="fn">print</span>(<span class="str">"🎉 合格！"</span>)`,
    concepts: [
      { icon:'📦', text:'<strong>変数</strong> ── 値を名前付きで記憶しておく「箱」' },
      { icon:'➕', text:'<strong>+= 演算子</strong> ── <code>score += 1</code> は <code>score = score + 1</code> の短縮形' },
      { icon:'🎯', text:'<strong>スコア判定</strong> ── <code>score >= 80</code> で合否を判定できる' },
    ],
    quizzes: [
      {
        type: 'text',
        question: '🤔 Q1：<code>score = 0</code> の後、<code>score += 1</code> を3回実行すると score はいくつ？',
        answer: '3',
        placeholder: '数字を入力…',
        hint: '0 + 1 + 1 + 1 = ?',
        points: 3,
      },
      {
        type: 'choice',
        question: '🤔 Q2：<code>score += 5</code> と同じ意味の式は？',
        choices: ['score = 5', 'score = score + 5', 'score + 5', 'score == 5'],
        answer: 1,
        points: 3,
      },
      {
        type: 'choice',
        question: '🤔 Q3：<code>score = 75</code> のとき <code>score >= 80</code> の結果は？',
        choices: ['True', 'False', '75', '80'],
        answer: 1,
        points: 3,
      },
    ],
  },

  // ──────────────── STEP 5: 関数 ────────────────
  {
    id: 5,
    badge: 'STEP 5',
    concept: '関数 (function)',
    title: '関数で整理しよう',
    desc: '同じ処理をまとめて名前をつけたものが「関数」。クイズゲームを関数に分けることで、コードが読みやすくなる！',
    flowchart: [
      { type:'start',   label:'main()' },
      { type:'fn-call', label:'show_rules()' },
      { type:'fn-call', label:'quiz(問題, 正解)' },
      { type:'fn-call', label:'show_result(score)' },
      { type:'end',     label:'終了' },
    ],
    code: `<span class="cmt"># STEP5: 関数で整理</span>

<span class="kw">def</span> <span class="fn">show_rules</span>():
    <span class="fn">print</span>(<span class="str">"=== クイズゲーム ==="</span>)

<span class="kw">def</span> <span class="fn">quiz</span>(<span class="var">question</span>, <span class="var">correct</span>):
    <span class="fn">print</span>(<span class="var">question</span>)
    <span class="var">ans</span> = <span class="fn">input</span>(<span class="str">"答え: "</span>)
    <span class="kw">return</span> <span class="var">ans</span> == <span class="var">correct</span>  <span class="cmt"># True / False</span>

<span class="kw">def</span> <span class="fn">show_result</span>(<span class="var">score</span>):
    <span class="fn">print</span>(<span class="str">f"あなたのスコアは {score} 点"</span>)

<span class="cmt"># メイン処理</span>
<span class="fn">show_rules</span>()
<span class="var">score</span> = <span class="num">0</span>
<span class="kw">if</span> <span class="fn">quiz</span>(<span class="str">"1+1は？"</span>, <span class="str">"2"</span>):
    <span class="var">score</span> += <span class="num">1</span>
<span class="fn">show_result</span>(<span class="var">score</span>)`,
    concepts: [
      { icon:'📦', text:'<strong>def 文</strong> ── 関数を定義する。名前と処理のかたまりを作る' },
      { icon:'📨', text:'<strong>引数 (argument)</strong> ── 関数に渡す値。呼び出すたびに変えられる' },
      { icon:'↩️', text:'<strong>return</strong> ── 関数の結果を呼び出し元に返す' },
    ],
    quizzes: [
      {
        type: 'choice',
        question: '🤔 Q1：<code>def greet():</code> で定義した関数を呼び出すには？',
        choices: ['greet', 'greet()', 'call greet()', 'run greet'],
        answer: 1,
        points: 3,
      },
      {
        type: 'text',
        question: '🤔 Q2：関数の結果を呼び出し元に返すキーワードは？',
        answer: 'return',
        placeholder: 'キーワードを入力…',
        hint: '英語6文字です',
        points: 3,
      },
      {
        type: 'choice',
        question: '🤔 Q3：<code>def add(a, b): return a + b</code> で <code>add(3, 4)</code> の結果は？',
        choices: ['3', '4', '7', '34'],
        answer: 2,
        points: 3,
      },
    ],
  },
];

// ===== アプリ状態 =====
// answered[stepIdx][quizIdx], scores[stepIdx][quizIdx]
let currentStep = 0;
let answered = STEPS.map(s => new Array(s.quizzes.length).fill(false));
let scores    = STEPS.map(s => new Array(s.quizzes.length).fill(0));
let completed = new Array(STEPS.length).fill(false);

// ===== 最大スコア =====
const MAX_SCORE = STEPS.reduce((sum, s) => sum + s.quizzes.reduce((a, q) => a + q.points, 0), 0);

// localStorage から復元
function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem('codeflow_state') || '{}');
    if (s.currentStep !== undefined) currentStep = s.currentStep;
    if (s.scores)    scores    = s.scores;
    if (s.answered)  answered  = s.answered;
    if (s.completed) completed = s.completed;
  } catch(e) {}
}
function saveState() {
  localStorage.setItem('codeflow_state', JSON.stringify({ currentStep, scores, answered, completed }));
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
    start:     { fill:'#6366f1', stroke:'#818cf8' },
    end:       { fill:'#6366f1', stroke:'#818cf8' },
    io:        { fill:'#0e7490', stroke:'#06b6d4' },
    proc:      { fill:'#1e3a5f', stroke:'#3b82f6' },
    'proc-yes':{ fill:'#064e3b', stroke:'#10b981' },
    'proc-no': { fill:'#450a0a', stroke:'#ef4444' },
    diamond:   { fill:'#3b1f6e', stroke:'#8b5cf6' },
    'fn-call': { fill:'#1a3a1a', stroke:'#22c55e' },
  };

  let paths = '', rects = '';

  items.forEach((n, i) => {
    const c = colorMap[n.type] || colorMap.proc;
    const cy = n.y + n.h / 2;

    if (i > 0) {
      const prev = items[i - 1];
      const prevBottom = prev.y + prev.h;
      paths += `<line x1="${cx}" y1="${prevBottom}" x2="${cx}" y2="${n.y}"
        stroke="#475569" stroke-width="1.5" marker-end="url(#arrow)" />`;

      if (n.type === 'proc' && n.label && n.label.includes('↑ループ')) {
        const loopTarget = items[1];
        paths += `<path d="M ${cx + DIAW/2 + 20} ${cy} L ${W - padX + 40} ${cy}
          L ${W - padX + 40} ${loopTarget.y + loopTarget.h/2}
          L ${cx + DIAW/2} ${loopTarget.y + loopTarget.h/2}"
          stroke="#f59e0b" stroke-width="1.5" fill="none" stroke-dasharray="5,3"
          marker-end="url(#arrowWarn)" />`;
      }
    }

    if (n.type === 'diamond') {
      const dy = n.y, dh = n.h;
      const hw = DIAW / 2;
      paths += `<polygon points="${cx},${dy} ${cx+hw},${dy+dh/2} ${cx},${dy+dh} ${cx-hw},${dy+dh/2}"
        fill="${c.fill}" stroke="${c.stroke}" stroke-width="1.5" />`;
      paths += `<text x="${cx + hw + 8}" y="${dy + dh/2 + 4}" fill="#10b981" font-size="11" font-family="Inter">Yes</text>`;
      paths += `<text x="${cx - hw - 8}" y="${dy + dh/2 + 4}" fill="#ef4444" font-size="11" font-family="Inter" text-anchor="end">No</text>`;
      const lines = n.label.split('\n');
      lines.forEach((ln, li) => {
        paths += `<text x="${cx}" y="${dy + dh/2 + (li - (lines.length-1)/2)*14}"
          fill="#e2e8f0" font-size="11" font-family="Inter" text-anchor="middle" dominant-baseline="middle">${ln}</text>`;
      });
    } else {
      const rx = (n.type === 'start' || n.type === 'end') ? 22 : 8;
      const fw = (n.type === 'start' || n.type === 'end') ? 120 : W - padX * 2;
      const fx = cx - fw / 2;
      rects += `<rect x="${fx}" y="${n.y}" width="${fw}" height="${n.h}"
        rx="${rx}" fill="${c.fill}" stroke="${c.stroke}" stroke-width="1.5" />`;
      const lines = n.label.split('\n');
      lines.forEach((ln, li) => {
        rects += `<text x="${cx}" y="${n.y + n.h/2 + (li - (lines.length-1)/2)*15}"
          fill="#e2e8f0" font-size="11" font-family="Inter" text-anchor="middle" dominant-baseline="middle">${ln}</text>`;
      });
    }
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${svgH}" class="flowchart-svg">
    <defs>
      <marker id="arrow" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="#475569" />
      </marker>
      <marker id="arrowWarn" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="#f59e0b" />
      </marker>
    </defs>
    ${paths}${rects}
  </svg>`;
}

// ===== クイズ UIを生成（複数問対応） =====
function buildQuizzes(step, stepIdx) {
  return step.quizzes.map((q, qi) => {
    const isAnswered = answered[stepIdx][qi];
    const userScore  = scores[stepIdx][qi];
    let inner = '';

    if (q.type === 'choice') {
      inner = `<div class="quiz-options">
        ${q.choices.map((c, ci) => {
          let cls = '';
          if (isAnswered && ci === q.answer) cls = 'correct';
          return `<button class="quiz-option ${cls}" id="opt-${stepIdx}-${qi}-${ci}"
            onclick="checkChoice(${stepIdx},${qi},${ci})" ${isAnswered ? 'disabled' : ''}>
            <span class="option-key">${'ABCD'[ci]}</span>${c}
          </button>`;
        }).join('')}
      </div>`;
    } else {
      inner = `<div class="quiz-input-wrap">
        <input class="quiz-input ${isAnswered ? (userScore > 0 ? 'correct' : 'wrong') : ''}"
          id="quiz-input-${stepIdx}-${qi}" type="text"
          placeholder="${q.placeholder || '答えを入力…'}"
          ${isAnswered ? 'disabled' : ''}
          onkeydown="if(event.key==='Enter')checkText(${stepIdx},${qi})"
          value="${isAnswered ? (userScore > 0 ? q.answer : '') : ''}" />
        <button class="btn btn-primary btn-sm" onclick="checkText(${stepIdx},${qi})"
          ${isAnswered ? 'disabled' : ''}>答える</button>
      </div>`;
    }

    const feedbackText = isAnswered
      ? (userScore > 0 ? `✅ 正解！ +${q.points}点` : `❌ 不正解。${q.hint || '正解は「' + (q.type === 'choice' ? q.choices[q.answer] : q.answer) + '」'}`)
      : '';
    const feedbackClass = isAnswered ? (userScore > 0 ? 'correct' : 'wrong') : '';

    return `<div class="quiz-item" id="quiz-item-${stepIdx}-${qi}">
      <div class="quiz-q">${q.question}</div>
      ${inner}
      <div class="quiz-feedback ${feedbackClass} ${isAnswered ? 'show' : ''}" id="feedback-${stepIdx}-${qi}">${feedbackText}</div>
      <div class="quiz-points" id="qpts-${stepIdx}-${qi}">⭐ <span class="pts">${q.points}pts</span> 獲得チャンス ／ 取得済み: <span class="pts">${userScore}</span>pts</div>
    </div>`;
  }).join('<hr class="quiz-divider">');
}

// ===== ステップコンテンツを描画 =====
function renderStep(idx) {
  const step = STEPS[idx];
  const contentArea = document.getElementById('contentArea');

  contentArea.innerHTML = `
    <div class="step-hero fade-enter">
      <div class="step-number-display">${step.badge}</div>
      <h1 class="step-main-title">${step.title}</h1>
      <p class="step-desc">${step.desc}</p>
    </div>

    <div class="cards-grid">
      <div class="card flowchart-card fade-enter" style="animation-delay:.05s">
        <div class="card-title"><span class="icon">🗺️</span>フローチャート</div>
        <div class="fc-wrap">${buildFlowchart(step.flowchart)}</div>
      </div>

      <div class="card code-card fade-enter" style="animation-delay:.1s">
        <div class="card-title"><span class="icon">💻</span>Pythonコード例</div>
        <pre class="code-block">${step.code}</pre>
      </div>

      <div class="card concept-card fade-enter" style="animation-delay:.15s">
        <div class="card-title"><span class="icon">📚</span>ポイント整理</div>
        <div class="concept-list">
          ${step.concepts.map(c => `
            <div class="concept-item">
              <span class="concept-item-icon">${c.icon}</span>
              <div class="concept-item-text">${c.text}</div>
            </div>`).join('')}
        </div>
      </div>

      <div class="card quiz-card fade-enter" style="animation-delay:.2s">
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

// ===== ナビゲーション更新 =====
function updateNav() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  prevBtn.disabled = currentStep === 0;
  nextBtn.textContent = currentStep === STEPS.length - 1 ? '完了 🎉' : '次のステップ →';

  const dotsEl = document.getElementById('stepDots');
  dotsEl.innerHTML = STEPS.map((_, i) => {
    let cls = '';
    if (i === currentStep) cls = 'active';
    else if (completed[i]) cls = 'done';
    return `<div class="dot ${cls}" onclick="goToStep(${i})" title="STEP ${i+1}"></div>`;
  }).join('');
}

function updateSidebar() {
  const list = document.getElementById('stepList');
  list.innerHTML = STEPS.map((s, i) => {
    const stepScore = scores[i].reduce((a, b) => a + b, 0);
    const stepMax   = s.quizzes.reduce((a, q) => a + q.points, 0);
    let cls = i === currentStep ? 'active' : '';
    if (completed[i]) cls += ' completed';
    return `<li>
      <div class="step-item ${cls}" onclick="goToStep(${i})" id="nav-step-${i}">
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
  const total = scores.flat().reduce((a, b) => a + b, 0);
  document.getElementById('totalScore').textContent = total;
}

// ===== ナビゲーション =====
function navigate(dir) {
  const next = currentStep + dir;
  if (next < 0) return;
  if (next >= STEPS.length) {
    showComplete();
    return;
  }
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
  const correct = choiceIdx === q.answer;
  answered[stepIdx][quizIdx] = true;
  scores[stepIdx][quizIdx] = correct ? q.points : 0;
  saveState();

  q.choices.forEach((_, ci) => {
    const btn = document.getElementById(`opt-${stepIdx}-${quizIdx}-${ci}`);
    if (!btn) return;
    btn.disabled = true;
    if (ci === q.answer) btn.classList.add('correct');
    else if (ci === choiceIdx && !correct) btn.classList.add('wrong');
  });

  showFeedback(stepIdx, quizIdx, correct, q.points);
}

function checkText(stepIdx, quizIdx) {
  if (answered[stepIdx][quizIdx]) return;
  const q = STEPS[stepIdx].quizzes[quizIdx];
  const input = document.getElementById(`quiz-input-${stepIdx}-${quizIdx}`);
  if (!input) return;
  const val = input.value.trim();
  const correct = val.toLowerCase() === q.answer.toLowerCase();
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
  const ptsEl = document.getElementById(`qpts-${stepIdx}-${quizIdx}`);
  if (!fb) return;

  if (correct) {
    fb.textContent = `✅ 正解！ +${pts}点 獲得！`;
    fb.className = 'quiz-feedback correct show';
  } else {
    const ans = q.type === 'choice' ? q.choices[q.answer] : q.answer;
    fb.textContent = `❌ 不正解。${q.hint || '正解は「' + ans + '」です'}`;
    fb.className = 'quiz-feedback wrong show';
  }

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
  document.getElementById('finalMax').textContent = `/ ${MAX_SCORE}`;
  document.getElementById('completeOverlay').style.display = 'flex';
}

function restartAll() {
  currentStep = 0;
  answered  = STEPS.map(s => new Array(s.quizzes.length).fill(false));
  scores    = STEPS.map(s => new Array(s.quizzes.length).fill(0));
  completed = new Array(STEPS.length).fill(false);
  saveState();
  document.getElementById('completeOverlay').style.display = 'none';
  renderStep(0);
}

// ===== モーダル =====
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('modalBtn').addEventListener('click', () => {
    document.getElementById('modalOverlay').classList.remove('show');
  });
  document.getElementById('modalOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modalOverlay'))
      document.getElementById('modalOverlay').classList.remove('show');
  });
  document.getElementById('menuBtn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });
});

// ===== 初期化 =====
loadState();
renderStep(currentStep);
