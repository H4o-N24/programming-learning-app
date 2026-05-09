// ==================== State Management ====================
// Changed to let to allow state restoration
let state = {
    currentScreen: 'home',
    currentStep: 1,
    diagnosis: {
        industry: '',
        region: '',
        purposes: []
    },
    matchedSubsidies: [],
    selectedSubsidy: null,
    currentUser: null,
    currentDraft: null,
    currentSubsidy: null // Alias for safe keeping
};

const STORAGE_KEY = 'subsidy_app_state_v1';

function saveAppState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.error('Save state failed', e);
    }
}

function loadAppState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            // Deep merge or overwrite
            state = { ...state, ...parsed };

            // Restore UI based on state
            if (state.currentUser) {
                updateAuthUI();
                loadDashboard();
            }
            // Restore screens that need data
            if (state.currentScreen === 'results') {
                renderResults();
            }
            if (state.currentScreen === 'detail' && state.selectedSubsidy) {
                // Restore detail view
                // We need to wait for DOM or just call showSubsidyDetail with ID
                // But showSubsidyDetail fetches data or uses state... it uses state.matchedSubsidies
                // Re-rendering detail might require DOM manipulation logic present in showSubsidyDetail
                setTimeout(() => showSubsidyDetail(state.selectedSubsidy.id), 100);
            }

            // Restore active screen
            showScreen(state.currentScreen, false);
        }
    } catch (e) {
        console.error('Load state failed', e);
        localStorage.removeItem(STORAGE_KEY);
    }
}

const API_BASE = '';

// ==================== Screen Navigation ====================
// ==================== Screen Navigation ====================
function showScreen(screenName, resetScroll = true) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

    // Show target screen
    const targetScreen = document.getElementById(`screen-${screenName}`);
    if (targetScreen) {
        targetScreen.classList.add('active');
        state.currentScreen = screenName;
        saveAppState(); // Persist state change
    }

    // Update nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.screen === screenName) {
            item.classList.add('active');
        }
    });

    // Screen-specific actions
    if (screenName === 'dashboard') {
        loadDashboard();
    }

    // Reset diagnosis to step 1 when entering diagnosis screen
    // Only reset if explicitly navigating via menu, not when restoring state
    if (screenName === 'diagnosis' && resetScroll) {
        state.currentStep = 1;
        state.diagnosis = { industry: '', region: '', purposes: [] };
        updateStepUI();
        // Clear any selected options
        document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
        document.getElementById('region-select').value = '';
        document.getElementById('submit-btn').disabled = true;
    }

    // Scroll to top
    if (resetScroll) window.scrollTo(0, 0);
}

// ==================== Diagnosis Flow ====================
function selectOption(type, value) {
    if (type === 'industry') {
        state.diagnosis.industry = value;
        // Update UI
        document.querySelectorAll('#step-1 .option-btn').forEach(btn => {
            btn.classList.toggle('selected', btn.dataset.value === value);
        });
        // Auto advance
        setTimeout(() => nextStep(), 300);
    } else if (type === 'region') {
        state.diagnosis.region = value;
        if (value) {
            setTimeout(() => nextStep(), 300);
        }
    }
}

function togglePurpose(purpose) {
    const index = state.diagnosis.purposes.indexOf(purpose);
    if (index > -1) {
        state.diagnosis.purposes.splice(index, 1);
    } else {
        state.diagnosis.purposes.push(purpose);
    }

    // Update UI
    document.querySelectorAll('#step-3 .option-btn').forEach(btn => {
        btn.classList.toggle('selected', state.diagnosis.purposes.includes(btn.dataset.value));
    });

    // Enable/disable submit button
    document.getElementById('submit-btn').disabled = state.diagnosis.purposes.length === 0;
}

function nextStep() {
    if (state.currentStep < 3) {
        state.currentStep++;
        updateStepUI();
    }
}

function prevStep() {
    if (state.currentStep > 1) {
        state.currentStep--;
        updateStepUI();
    }
}

function handleDiagnosisBack() {
    if (state.currentStep === 1) {
        showScreen('home');
    } else {
        prevStep();
    }
}

function updateStepUI() {
    // Hide all steps
    document.querySelectorAll('.diagnosis-step').forEach(s => s.classList.remove('active'));

    // Show current step
    document.getElementById(`step-${state.currentStep}`).classList.add('active');

    // Update progress
    document.getElementById('current-step').textContent = state.currentStep;
    document.getElementById('progress-fill').style.width = `${(state.currentStep / 3) * 100}%`;
}

async function submitDiagnosis() {
    if (state.diagnosis.purposes.length === 0) {
        showToast('投資目的を1つ以上選択してください', 'error');
        return;
    }

    showLoading(true);

    try {
        const response = await fetch(`${API_BASE}/api/v1/subsidy/match`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                industry: state.diagnosis.industry,
                region: state.diagnosis.region,
                purpose: state.diagnosis.purposes.join(','),
                employee_count: 5
            })
        });

        const data = await response.json();
        state.matchedSubsidies = data.subsidies || [];

        renderResults();
        showScreen('results');
    } catch (error) {
        console.error('Error:', error);
        showToast('エラーが発生しました', 'error');
    } finally {
        showLoading(false);
    }
}

// ==================== Results Display ====================
function renderResults() {
    const container = document.getElementById('results-list');
    const countEl = document.getElementById('results-count');

    countEl.textContent = `${state.matchedSubsidies.length}件の制度が該当しました`;

    if (state.matchedSubsidies.length === 0) {
        container.innerHTML = `
            <div class="empty-message">
                <p>条件に合致する補助金制度がありませんでした</p>
                <p>条件を変更して再度診断してください</p>
            </div>
        `;
        return;
    }

    container.innerHTML = state.matchedSubsidies.map((subsidy, index) => {
        const isBestMatch = index === 0 && subsidy.match_score >= 80;
        const reasonsHtml = subsidy.match_reason && subsidy.match_reason.length > 0
            ? `<div class="match-tags">
                ${subsidy.match_reason.map(r => `<span class="match-tag">✨ ${r}</span>`).join('')}
               </div>`
            : '';

        // Determine application status based on deadline
        const today = new Date();
        const deadline = subsidy.deadline ? new Date(subsidy.deadline) : null;
        let statusBadge = '';
        if (deadline) {
            if (deadline >= today) {
                const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
                if (daysLeft <= 14) {
                    statusBadge = `<span class="status-badge status-ending">締切間近（残${daysLeft}日）</span>`;
                } else {
                    statusBadge = `<span class="status-badge status-open">募集中</span>`;
                }
            } else {
                statusBadge = `<span class="status-badge status-closed">募集終了</span>`;
            }
        }

        return `
        <div class="result-card compact-mode ${isBestMatch ? 'best-match' : ''}" onclick="showSubsidyDetail(${subsidy.id})">
            ${isBestMatch ? '<div class="best-match-badge">👑 ベストマッチ</div>' : ''}
            
            <div class="card-header">
                <div class="header-main">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                        ${statusBadge}
                    </div>
                    <h3 class="result-name">${subsidy.name}</h3>
                    ${reasonsHtml}
                </div>
                <div class="match-score-box">
                    <span class="score-label">適合度</span>
                    <div>
                        <span class="score-val">${subsidy.match_score}</span>
                        <span class="score-unit">%</span>
                    </div>
                </div>
            </div>

            <div class="card-body">
                <div class="amount-area compact">
                    <span class="amount-label">最大補助額</span>
                    <span class="amount-value">${formatAmount(subsidy.max_amount)}円</span>
                </div>
                
                <div class="meta-inline">
                    <span class="meta-tag">補助率: ${subsidy.subsidy_rate || '-'}</span>
                    <span class="meta-tag">締切: ${subsidy.deadline ? new Date(subsidy.deadline).toLocaleDateString('ja-JP') : '未定'}</span>
                </div>
            </div>
        </div>
    `}).join('');
}

async function showSubsidyDetail(subsidyId) {
    showLoading(true);

    try {
        const response = await fetch(`${API_BASE}/api/v1/subsidy/${subsidyId}`);
        const subsidy = await response.json();
        state.selectedSubsidy = subsidy;

        renderDetail(subsidy);
        showScreen('detail');
    } catch (error) {
        console.error('Error:', error);
        showToast('エラーが発生しました', 'error');
    } finally {
        showLoading(false);
    }
}

function renderDetail(subsidy) {
    const container = document.getElementById('detail-card');

    const deadline = subsidy.deadline ? new Date(subsidy.deadline).toLocaleDateString('ja-JP') : '未定';

    container.innerHTML = `
        <h2 class="detail-title">${subsidy.name}</h2>
        <div class="detail-amount">最大 ${formatAmount(subsidy.max_amount)}円</div>
        
        <div class="detail-info">
            <div class="detail-row">
                <span class="detail-label">補助率</span>
                <span class="detail-value">${subsidy.subsidy_rate || '要確認'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">対象業種</span>
                <span class="detail-value">${subsidy.target_industry || '全業種'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">対象地域</span>
                <span class="detail-value">${subsidy.target_region || '全国'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">申請期限</span>
                <span class="detail-value">${deadline}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">対象用途</span>
                <span class="detail-value">${subsidy.purposes || '-'}</span>
            </div>
        </div>
        
        <p class="detail-desc">${subsidy.description || ''}</p>
        
        <div class="btn-group">
            ${subsidy.official_url ? `<a href="${subsidy.official_url}" target="_blank" class="btn btn-secondary">公式サイトを確認</a>` : ''}
            <button class="btn btn-primary" onclick="startApplication()">事業計画書作成を開始</button>
        </div>
    `;
}

// ==================== Application Flow ====================
function startApplication() {
    if (!state.selectedSubsidy) return;

    // Pre-fill form with diagnosis data
    document.getElementById('user-industry').value = state.diagnosis.industry;
    document.getElementById('user-region').value = state.diagnosis.region;
    document.getElementById('apply-subsidy-name').textContent = state.selectedSubsidy.name;

    showScreen('apply');
}

function goBackFromApply() {
    if (state.selectedSubsidy) {
        showScreen('detail');
    } else {
        showScreen('results');
    }
}

async function generateDraft() {
    // Collect all form data
    const businessName = document.getElementById('business-name').value.trim();
    const employeeCount = parseInt(document.getElementById('employee-count').value) || 0;
    const annualSales = document.getElementById('annual-sales').value.trim();
    const businessHistory = document.getElementById('business-history').value.trim();

    const currentProblem = document.getElementById('current-problem').value.trim();
    const problemImpact = document.getElementById('problem-impact').value.trim();

    const investmentContent = document.getElementById('investment-content').value.trim();
    const investmentAmount = document.getElementById('investment-amount').value.trim();
    const investmentTiming = document.getElementById('investment-timing').value.trim();

    const expectedEffect = document.getElementById('expected-effect').value.trim();
    const salesIncrease = document.getElementById('sales-increase').value.trim();
    const costReduction = document.getElementById('cost-reduction').value.trim();

    // Validation
    if (!businessName) {
        showToast('事業者名を入力してください', 'error');
        return;
    }
    if (!currentProblem) {
        showToast('現状の課題を入力してください', 'error');
        return;
    }
    if (!investmentContent) {
        showToast('導入予定の設備・システムを入力してください', 'error');
        return;
    }
    if (!expectedEffect) {
        showToast('期待される効果を入力してください', 'error');
        return;
    }

    // Build structured plan details for AI
    let planDetails = `【現状の課題】
${currentProblem}`;

    if (problemImpact) {
        planDetails += `

【課題による影響】
${problemImpact}`;
    }

    planDetails += `

【投資計画】
導入予定: ${investmentContent}`;

    if (investmentAmount) {
        planDetails += `
投資予定額: ${investmentAmount}万円`;
    }
    if (investmentTiming) {
        planDetails += `
導入時期: ${investmentTiming}`;
    }

    planDetails += `

【期待される効果】
${expectedEffect}`;

    if (salesIncrease) {
        planDetails += `
売上向上見込: ${salesIncrease}%`;
    }
    if (costReduction) {
        planDetails += `
コスト削減見込: ${costReduction}%`;
    }

    // Additional context
    let additionalInfo = '';
    if (annualSales) {
        additionalInfo += `年間売上: ${annualSales}万円、`;
    }
    if (businessHistory) {
        additionalInfo += `事業歴: ${businessHistory}、`;
    }
    if (employeeCount) {
        additionalInfo += `従業員数: ${employeeCount}名`;
    }
    if (additionalInfo) {
        planDetails = `【事業規模】
${additionalInfo.replace(/、$/, '')}

` + planDetails;
    }

    showLoading(true);

    try {
        // First, register or update user
        let userId = state.currentUser?.user_id;

        if (!userId) {
            const userResponse = await fetch(`${API_BASE}/api/v1/user/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    business_name: businessName,
                    industry: state.diagnosis.industry,
                    region: state.diagnosis.region,
                    employee_count: employeeCount
                })
            });
            const userData = await userResponse.json();
            state.currentUser = userData;
            userId = userData.user_id;
        }

        // Generate draft
        const response = await fetch(`${API_BASE}/api/v1/application/generate_draft`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                subsidy_id: state.selectedSubsidy.id,
                plan_details: planDetails
            })
        });

        const data = await response.json();
        state.currentDraft = data;

        renderDraft(data);
        showScreen('draft');
    } catch (error) {
        console.error('Error:', error);
        showToast('エラーが発生しました', 'error');
    } finally {
        showLoading(false);
    }
}

function renderDraft(data) {
    document.getElementById('draft-subsidy-name').textContent = data.subsidy_name;

    // Convert markdown-like text to HTML
    let htmlContent = data.draft_text
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/---/g, '<hr>')
        .replace(/\n/g, '<br>');

    document.getElementById('draft-content').innerHTML = htmlContent;

    // Set the official URL for the apply button (use subsidy-specific URL, not jGrants)
    const applyLink = document.getElementById('official-apply-link');
    if (applyLink && data.official_url) {
        applyLink.href = data.official_url;
        applyLink.textContent = '公式申請ページへ移動';
    }

    // Store current draft in state for checklist context
    state.currentDraft = data;
}





// ==================== Apply Mode Switching ====================
function switchApplyMode(mode) {
    const createTab = document.getElementById('tab-create');
    const refineTab = document.getElementById('tab-refine');
    const createMode = document.getElementById('apply-mode-create');
    const refineMode = document.getElementById('apply-mode-refine');

    if (mode === 'create') {
        createTab.classList.add('active');
        refineTab.classList.remove('active');
        createMode.style.display = 'block';
        refineMode.style.display = 'none';
    } else {
        createTab.classList.remove('active');
        refineTab.classList.add('active');
        createMode.style.display = 'none';
        refineMode.style.display = 'block';
    }
}

async function refineDraft() {
    if (!state.currentSubsidy) return;
    if (!state.currentUser) {
        showLoginModal();
        return;
    }

    const currentText = document.getElementById('refine-text').value;
    const focusPoint = document.getElementById('refine-focus').value;

    if (!currentText) {
        showToast('添削対象のテキストを入力してください', 'error');
        return;
    }

    showLoading(true);

    try {
        const response = await fetch(`${API_BASE}/api/v1/application/refine`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: state.currentUser.user_id,
                subsidy_id: state.currentSubsidy.id,
                current_text: currentText,
                focus_point: focusPoint
            })
        });

        if (!response.ok) throw new Error('添削に失敗しました');

        const data = await response.json();
        renderDraft(data); // Reuse existing render function
        showScreen('draft');
        showToast('添削が完了しました', 'success');

    } catch (error) {
        console.error('Error:', error);
        showToast('エラーが発生しました', 'error');
    } finally {
        showLoading(false);
    }
}


function saveDraft() {
    showToast('一時保存しました', 'success');
    // Implement API call if needed
}

function saveAndGoToDashboard() {
    showToast('保存しました', 'success');
    setTimeout(() => showScreen('dashboard'), 1000);
}

function downloadDraft() {
    if (!state.currentDraft) return;

    // Create HTML content for Word
    const subsidyName = state.currentDraft.subsidy_name || 'business_plan';
    const filename = `${subsidyName}_事業計画書案.doc`;

    // Convert content to HTML with basic styling for Word
    const content = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset="utf-8">
            <title>${subsidyName} 事業計画書</title>
            <style>
                body { font-family: 'MS Mincho', serif; line-height: 1.5; }
                h1 { font-size: 18pt; font-weight: bold; margin-bottom: 20px; }
                h2 { font-size: 14pt; font-weight: bold; margin-top: 20px; background-color: #f0f0f0; padding: 5px; }
                h3 { font-size: 12pt; font-weight: bold; margin-top: 15px; border-bottom: 1px solid #000; }
                p { font-size: 10.5pt; margin-bottom: 10px; }
            </style>
        </head>
        <body>
            ${document.getElementById('draft-content').innerHTML}
        </body>
        </html>
    `;

    const blob = new Blob([content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Word形式でダウンロードしました', 'success');
}

function showExpertModal() {
    alert('現在、提携専門家とのマッチング機能は準備中です。\n正式リリースまで今しばらくお待ちください。');
}

// ==================== Dashboard ====================
async function loadDashboard() {
    if (!state.currentUser) {
        document.getElementById('application-list').innerHTML = `
            <p class="empty-message">登録済みの申請案件はありません<br>適合性診断から開始してください</p>
        `;
        updateDashboardStats([]);
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/api/v1/application/history/${state.currentUser.user_id}`);
        const applications = await response.json();

        updateDashboardStats(applications);
        renderApplicationList(applications);
    } catch (error) {
        console.error('Error:', error);
    }
}

function updateDashboardStats(applications) {
    const draftCount = applications.filter(a => a.status === '下書き').length;
    const applyingCount = applications.filter(a => a.status === '申請中').length;
    const approvedCount = applications.filter(a => a.status === '採択').length;

    document.getElementById('dash-draft-count').textContent = draftCount;
    document.getElementById('dash-applying-count').textContent = applyingCount;
    document.getElementById('dash-approved-count').textContent = approvedCount;
}

function renderApplicationList(applications) {
    const container = document.getElementById('application-list');

    if (applications.length === 0) {
        container.innerHTML = `<p class="empty-message">登録済みの申請案件はありません</p>`;
        return;
    }

    container.innerHTML = applications.map(app => {
        const statusClass = getStatusClass(app.status);
        const date = app.created_at ? new Date(app.created_at).toLocaleDateString('ja-JP') : '-';
        const summary = app.plan_details ? (app.plan_details.length > 50 ? app.plan_details.substring(0, 50) + '...' : app.plan_details) : '事業計画の詳細なし';

        // Hide badge if status is "下書き"
        const statusBadge = app.status === '下書き' ? '' : `<span class="status-badge ${statusClass}">${app.status}</span>`;

        return `
            <div class="app-card">
                <div class="app-info" onclick="viewApplication(${app.id})" style="cursor: pointer;">
                    <div class="app-header-row">
                        <h4>${app.subsidy_name || '補助金制度'}</h4>
                        ${statusBadge}
                    </div>
                    <p class="app-summary">${summary}</p>
                    <span class="app-date">作成日: ${date}</span>
                </div>
                <div class="app-card-actions">
                    <button class="btn btn-outline btn-sm" onclick="viewApplication(${app.id})">詳細を見る</button>
                    <button class="btn-delete" onclick="deleteApplication(${app.id}, event)">×</button>
                </div>
            </div>
        `;
    }).join('');
}

function getStatusClass(status) {
    switch (status) {
        case '下書き': return 'draft';
        case '申請中': return 'applying';
        case '採択': return 'approved';
        case '不採択': return 'rejected';
        default: return 'draft';
    }
}

async function viewApplication(appId) {
    showLoading(true);

    try {
        const response = await fetch(`${API_BASE}/api/v1/application/${appId}`);
        const app = await response.json();

        state.currentDraft = {
            draft_id: app.id,
            draft_text: app.ai_draft_text,
            subsidy_name: app.subsidy_name,
            official_url: app.official_url
        };

        renderDraft(state.currentDraft);
        showScreen('draft');
    } catch (error) {
        console.error('Error:', error);
        showToast('エラーが発生しました', 'error');
    } finally {
        showLoading(false);
    }
}

// ==================== Utilities ====================
function formatAmount(amount) {
    if (!amount) return '-';
    return amount.toLocaleString('ja-JP');
}

function showLoading(show) {
    document.getElementById('loading').classList.toggle('active', show);
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ==================== Delete Application ====================
async function deleteApplication(appId, event) {
    event.stopPropagation();

    if (!confirm('この申請案件を削除しますか？')) {
        return;
    }

    showLoading(true);

    try {
        const response = await fetch(`${API_BASE}/api/v1/application/${appId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showToast('削除しました', 'success');
            loadDashboard();  // Reload the list
        } else {
            showToast('削除に失敗しました', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('エラーが発生しました', 'error');
    } finally {
        showLoading(false);
    }
}

// ==================== Login Modal ====================
function showLoginModal() {
    document.getElementById('login-modal').classList.add('active');
}

function closeLoginModal() {
    document.getElementById('login-modal').classList.remove('active');
}

// function loginOrRegister() {
// This function handles the manual login with just a name
async function loginOrRegister() {
    // Note: email input was removed from HTML
    const name = document.getElementById('login-name').value;
    if (!name) {
        showToast('事業者名を入力してください', 'error');
        return;
    }

    showLoading(true);
    try {
        const response = await fetch(`${API_BASE}/api/v1/user/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                business_name: name,
                industry: state.diagnosis?.industry || '未設定',
                region: state.diagnosis?.region || '未設定',
                employee_count: 0
            })
        });
        const userData = await response.json();
        completeLogin(userData);
    } catch (error) {
        console.error('Login error:', error);
        showToast('ログインに失敗しました', 'error');
        showLoading(false);
    }
}

async function loginWithGoogle() {
    showLoading(true);
    try {
        // Simulate Google login by registering with mock Google data
        const response = await fetch(`${API_BASE}/api/v1/user/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                business_name: '山田 太郎',
                industry: state.diagnosis?.industry || '未設定',
                region: state.diagnosis?.region || '未設定',
                employee_count: 0
            })
        });
        const userData = await response.json();
        completeLogin(userData);
        showToast('Googleアカウントでログインしました', 'success');
    } catch (error) {
        console.error('Google login error:', error);
        showToast('ログインに失敗しました', 'error');
        showLoading(false);
    }
}

function completeLogin(userData) {
    state.currentUser = userData;
    // Persist
    localStorage.setItem('subsidyProUser', JSON.stringify(userData));
    saveAppState();

    closeLoginModal();
    updateAuthUI();

    // Redirect if needed
    if (state.currentScreen === 'dashboard') {
        loadDashboard();
    } else {
        showToast('ようこそ、' + (userData.business_name || userData.name) + '様', 'success');
    }
    showLoading(false);
}

function logout() {
    state.currentUser = null;
    localStorage.removeItem('subsidyProUser');
    saveAppState();
    updateAuthUI();
    showToast('ログアウトしました', 'success');
    showScreen('home');
}

function updateAuthUI() {
    const navAuth = document.getElementById('nav-auth');
    if (!navAuth) return;

    if (state.currentUser) {
        navAuth.innerHTML = `
            <div class="user-profile" onclick="showScreen('dashboard')">
                <div class="user-avatar">${(state.currentUser.business_name || state.currentUser.name || '?').charAt(0)}</div>
                <span>${state.currentUser.business_name || state.currentUser.name || 'ユーザー'}</span>
            </div>
            <button class="btn btn-outline btn-sm" onclick="logout()" style="margin-left: 8px;">ログアウト</button>
        `;
    } else {
        navAuth.innerHTML = `
            <button class="btn btn-primary btn-sm btn-login-nav" onclick="showLoginModal()">ログイン</button>
        `;
    }
}

// ==================== Custom Link Logic ====================
function editApplicationUrl() {
    const linkBtn = document.getElementById('official-apply-link');
    if (!linkBtn) return;

    const currentUrl = linkBtn.href;
    const newUrl = prompt('申請ページのURLを入力してください（自治体のサイトなど）:', currentUrl);

    if (newUrl) {
        if (newUrl.startsWith('http')) {
            linkBtn.href = newUrl;
            linkBtn.classList.remove('btn-outline');
            linkBtn.classList.add('btn-primary');
            linkBtn.innerHTML = '申請ページへ移動 <small>(設定済)</small>';
            showToast('リンクを変更しました', 'success');
        } else {
            showToast('正しいURLを入力してください(http...)', 'error');
        }
    }
}

// ==================== Custom Region Selector ====================
const regionData = {
    "北海道・東北": ["北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"],
    "関東": ["茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県"],
    "中部": ["新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県"],
    "近畿": ["三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県"],
    "中国・四国": ["鳥取県", "島根県", "岡山県", "広島県", "山口県", "徳島県", "香川県", "愛媛県", "高知県"],
    "九州・沖縄": ["福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"]
};

function renderRegionSelector() {
    const container = document.getElementById('region-selector');
    if (!container) return;

    container.innerHTML = Object.keys(regionData).map((region, index) => `
        <div class="region-group" id="region-group-${index}">
            <button class="region-group-btn" onclick="toggleRegion(${index})">${region}</button>
            <div class="region-prefectures">
                <div class="prefecture-grid">
                    ${regionData[region].map(pref => `
                        <button class="prefecture-btn" onclick="selectPrefecture('${pref}')">${pref}</button>
                    `).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

function toggleRegion(index) {
    // Close others
    document.querySelectorAll('.region-group').forEach((grp, i) => {
        if (i !== index) grp.classList.remove('active');
    });

    // Toggle current
    const group = document.getElementById(`region-group-${index}`);
    group.classList.toggle('active');
}

function selectPrefecture(pref) {
    // Set hidden input value
    const input = document.getElementById('region-select');
    input.value = pref;

    // Trigger standard select logic
    selectOption('region', pref);

    // Update highlights
    document.querySelectorAll('.prefecture-btn').forEach(btn => {
        if (btn.textContent === pref) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });

    // Don't close selector, just update state
}

function resetRegionSelection() {
    // Just clear value and highlights
    document.getElementById('region-select').value = '';
    selectOption('region', '');

    document.querySelectorAll('.prefecture-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
}

// ==================== Import Modal ====================
function openImportModal() {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('import-date').value = today;

    document.getElementById('import-modal').classList.add('active');
}

function closeImportModal() {
    document.getElementById('import-modal').classList.remove('active');
    // Clear inputs
    document.getElementById('import-name').value = '';
}

async function importApplication() {
    if (!state.currentUser) {
        showLoginModal();
        return;
    }

    const name = document.getElementById('import-name').value;
    const dateVal = document.getElementById('import-date').value;
    const status = document.querySelector('input[name="import-status"]:checked').value;

    if (!name) {
        showToast('補助金・制度名を入力してください', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/api/v1/application/import`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: state.currentUser.user_id,
                manual_subsidy_name: name,
                status: status,
                created_at: dateVal || null
            })
        });

        if (!response.ok) throw new Error('インポートに失敗しました');

        showToast('申請履歴を追加しました', 'success');
        closeImportModal();
        loadDashboard(); // Reload list

    } catch (error) {
        console.error('Error:', error);
        showToast('追加に失敗しました', 'error');
    }
}

// ==================== Checklist Modal ====================
const checklistItems = [
    { id: 'item1', text: '事業計画書の作成', hint: 'AIで生成したドラフトを確認・修正', url: null },
    { id: 'item2', text: '履歴事項全部証明書', hint: '法務局で取得（発行から3ヶ月以内）', url: 'https://www.touki-kyoutaku-online.moj.go.jp/' },
    { id: 'item3', text: '決算書（直近2期分）', hint: '貸借対照表・損益計算書', url: null },
    { id: 'item4', text: '納税証明書', hint: '税務署で取得', url: 'https://www.e-tax.nta.go.jp/' },
    { id: 'item5', text: '見積書', hint: '導入予定設備・システムの見積もり', url: null },
    { id: 'item6', text: '経営力向上計画（該当する場合）', hint: '設備投資系補助金で必要な場合あり', url: 'https://www.chusho.meti.go.jp/keiei/kyoka/' },
    { id: 'item7', text: 'GビズIDの取得', hint: '電子申請に必要（取得に数週間かかる場合あり）', url: 'https://gbiz-id.go.jp/' },
];

function showChecklistModal() {
    const container = document.getElementById('checklist-items');
    const subsidyName = state.currentDraft?.subsidy_name || state.selectedSubsidy?.name || '対象制度';
    const officialUrl = state.currentDraft?.official_url || state.selectedSubsidy?.official_url || '#';

    // Update subsidy name
    document.getElementById('checklist-subsidy-name').textContent = `${subsidyName} の申請準備`;

    // Set official link
    const officialLink = document.getElementById('checklist-official-link');
    if (officialLink) {
        officialLink.href = officialUrl;
    }

    // Load saved checklist state from localStorage
    const savedChecklist = JSON.parse(localStorage.getItem('checklist_state') || '{}');

    // Generate checklist items
    container.innerHTML = checklistItems.map(item => {
        const isChecked = savedChecklist[item.id] || false;
        const linkHtml = item.url
            ? `<a href="${item.url}" target="_blank" class="checklist-link" onclick="event.stopPropagation()">🔗 サイトへ</a>`
            : '';
        return `
            <label class="checklist-item ${isChecked ? 'checked' : ''}" data-id="${item.id}">
                <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="toggleChecklistItem('${item.id}', this)">
                <div class="checklist-item-text">
                    <div>${item.text} ${linkHtml}</div>
                    <div class="checklist-item-hint">${item.hint}</div>
                </div>
            </label>
        `;
    }).join('');

    // Update progress
    updateChecklistProgress();

    document.getElementById('checklist-modal').classList.add('active');
}

function toggleChecklistItem(itemId, checkbox) {
    const savedChecklist = JSON.parse(localStorage.getItem('checklist_state') || '{}');
    savedChecklist[itemId] = checkbox.checked;
    localStorage.setItem('checklist_state', JSON.stringify(savedChecklist));

    // Update visual state
    const label = checkbox.closest('.checklist-item');
    if (checkbox.checked) {
        label.classList.add('checked');
    } else {
        label.classList.remove('checked');
    }

    updateChecklistProgress();
}

function updateChecklistProgress() {
    const savedChecklist = JSON.parse(localStorage.getItem('checklist_state') || '{}');
    const total = checklistItems.length;
    const completed = Object.values(savedChecklist).filter(v => v).length;

    document.getElementById('checklist-progress-count').textContent = completed;
    document.getElementById('checklist-total-count').textContent = total;
    document.getElementById('checklist-progress-bar').style.width = `${(completed / total) * 100}%`;
}

function closeChecklistModal() {
    document.getElementById('checklist-modal').classList.remove('active');
}

// ==================== Initialize ====================
// ==================== Initialize ====================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize custom selector
    renderRegionSelector();

    // Default initialization (will be overwritten by loadAppState if data exists)
    state.currentStep = 1;
    state.diagnosis = { industry: '', region: '', purposes: [] };

    // Restore state from localStorage
    loadAppState();

    // Setup auto-save on page unload
    window.addEventListener('beforeunload', () => {
        saveAppState();
    });

    console.log('SubsidyPro 補助金申請支援プラットフォームが起動しました');
});

// ==================== Pricing & Subscription ====================
async function selectPlan(plan) {
    if (!state.currentUser) {
        showLoginModal();
        return;
    }

    if (plan === 'free') {
        showToast('現在フリープランをご利用中です', 'info');
        return;
    }

    // Premium plan upgrade
    showLoading(true);
    try {
        const response = await fetch(`${API_BASE}/api/v1/auth/user/${state.currentUser.user_id}/upgrade`, {
            method: 'POST'
        });
        const data = await response.json();

        if (data.success) {
            state.currentUser.plan = 'premium';
            saveAppState();
            showToast('プレミアムプランにアップグレードしました！', 'success');
            updatePricingButtons();
        } else {
            showToast('アップグレードに失敗しました', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('エラーが発生しました', 'error');
    } finally {
        showLoading(false);
    }
}

function updatePricingButtons() {
    const isPremium = state.currentUser?.plan === 'premium';
    const freeBtn = document.querySelector('.pricing-card:not(.premium) button');
    const premiumBtn = document.querySelector('.pricing-card.premium button');

    if (freeBtn && premiumBtn) {
        if (isPremium) {
            freeBtn.textContent = 'ダウングレード';
            freeBtn.classList.remove('btn-outline');
            freeBtn.classList.add('btn-secondary');
            premiumBtn.textContent = '現在のプラン';
            premiumBtn.disabled = true;
        } else {
            freeBtn.textContent = '現在のプラン';
            freeBtn.disabled = true;
            premiumBtn.textContent = 'アップグレード';
            premiumBtn.disabled = false;
        }
    }
}

// ==================== Contact Form ====================
async function submitContact() {
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const message = document.getElementById('contact-message').value;

    if (!name || !email || !message) {
        showToast('すべての項目を入力してください', 'error');
        return;
    }

    // メールアドレス簡易バリデーション
    if (!email.includes('@')) {
        showToast('正しいメールアドレスを入力してください', 'error');
        return;
    }

    showLoading(true);

    // TODO: バックエンドにお問い合わせ送信API追加後に実装
    // 現在はモック実装
    setTimeout(() => {
        showLoading(false);
        showToast('お問い合わせを受け付けました。担当者より折り返しご連絡いたします。', 'success');

        // フォームクリア
        document.getElementById('contact-name').value = '';
        document.getElementById('contact-email').value = '';
        document.getElementById('contact-message').value = '';
    }, 1000);
}

// ==================== Plan Limit Check ====================
async function checkDraftLimit() {
    if (!state.currentUser) return true; // Not logged in, will be checked elsewhere

    try {
        const response = await fetch(`${API_BASE}/api/v1/auth/user/${state.currentUser.user_id}/subscription`);
        const data = await response.json();

        if (data.plan === 'free' && data.remaining_drafts === 0) {
            showToast('無料プランの月間制限に達しました。プレミアムプランにアップグレードしてください。', 'warning');
            showScreen('pricing');
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error checking limit:', error);
        return true; // Allow on error
    }
}

// ==================== AI Chat Widget ====================
let chatHistory = [];

function toggleChatPanel() {
    const panel = document.getElementById('chat-panel');
    const overlay = document.getElementById('chat-overlay');
    panel.classList.toggle('active');
    overlay.classList.toggle('active');

    if (panel.classList.contains('active')) {
        document.getElementById('chat-input').focus();
    }
}

function handleChatKeypress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();

    if (!message) return;

    // ユーザーメッセージを追加
    addChatMessage('user', message);
    chatHistory.push({ role: 'user', content: message });
    input.value = '';

    // タイピングインジケーターを表示
    showTypingIndicator();

    try {
        const response = await fetch(`${API_BASE}/api/v1/chat/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: chatHistory,
                user_id: state.currentUser?.user_id
            })
        });

        const data = await response.json();

        // タイピングインジケーターを削除
        removeTypingIndicator();

        // AI応答を追加
        addChatMessage('assistant', data.response);
        chatHistory.push({ role: 'assistant', content: data.response });

    } catch (error) {
        console.error('Chat error:', error);
        removeTypingIndicator();
        addChatMessage('assistant', 'すみません、エラーが発生しました。もう一度お試しください。');
    }
}

function addChatMessage(role, content) {
    // スクリーン用クラスを参照
    const messagesContainer = document.querySelector('.chat-messages-screen');
    if (!messagesContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${role}`;
    messageDiv.innerHTML = `<div class="message-content">${formatChatMessage(content)}</div>`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function formatChatMessage(content) {
    // 簡易的なマークダウン変換
    return content
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
}

function showTypingIndicator() {
    const messagesContainer = document.querySelector('.chat-messages-screen');
    if (!messagesContainer) return;

    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'chat-message assistant chat-typing';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

function sendQuickQuestion(question) {
    // クイック質問ボタンを非表示
    const quickQ = document.querySelector('.quick-questions');
    if (quickQ) quickQ.style.display = 'none';

    // 入力欄に質問をセットして送信
    document.getElementById('chat-input').value = question;
    sendChatMessage();
}

function toggleFaq(element) {
    // 他の開いているアイテムを閉じる（オプション）
    const items = document.querySelectorAll('.faq-item');
    items.forEach(item => {
        if (item !== element) {
            item.classList.remove('active');
        }
    });

    // クリックされたアイテムの開閉を切り替え
    element.classList.toggle('active');
}



