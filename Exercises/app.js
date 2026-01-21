// Python練習問題100選 - アプリケーションロジック

class ExerciseApp {
    constructor() {
        this.currentExerciseId = 1;
        this.completedExercises = this.loadCompleted();
        this.userCodes = this.loadUserCodes();

        this.init();
    }

    init() {
        this.renderExerciseLists();
        this.loadExercise(this.currentExerciseId);
        this.bindEvents();
        this.updateProgress();
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
