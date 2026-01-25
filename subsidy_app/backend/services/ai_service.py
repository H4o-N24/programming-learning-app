import os
from openai import OpenAI


class AIService:
    """AI事業計画書生成サービス"""
    
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.client = None
        if self.api_key:
            self.client = OpenAI(api_key=self.api_key)
    
    def generate_business_plan_draft(
        self,
        business_name: str,
        industry: str,
        subsidy_name: str,
        plan_details: str,
        max_amount: int = None
    ) -> str:
        """
        事業計画書のドラフトを生成
        
        Args:
            business_name: 事業者名
            industry: 業種
            subsidy_name: 補助金名
            plan_details: ユーザーが入力した計画詳細
            max_amount: 最大補助額
        
        Returns:
            生成された事業計画書ドラフト
        """
        
        prompt = f"""あなたは補助金申請の専門家です。以下の情報を基に、審査員に伝わりやすい事業計画書のドラフトを作成してください。

【事業者情報】
- 事業者名: {business_name}
- 業種: {industry}

【申請する補助金】
- 補助金名: {subsidy_name}
{f'- 最大補助額: {max_amount:,}円' if max_amount else ''}

【事業計画の概要】
{plan_details}

以下の構成で事業計画書を作成してください：

1. 事業概要
   - 現在の事業内容
   - 事業の強み・特徴

2. 課題と解決策
   - 現状の課題
   - 本事業による解決策

3. 事業計画
   - 具体的な取り組み内容
   - 導入予定の設備・システム
   - スケジュール

4. 期待される効果
   - 売上向上の見込み
   - 生産性向上の見込み
   - その他の効果

5. 資金計画
   - 事業費の内訳
   - 補助金申請額

※ 具体的な数値や事例を含め、説得力のある文章で記述してください。
"""

        if self.client:
            try:
                response = self.client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": "あなたは補助金申請書類の作成を支援する専門家です。論理的で説得力のある事業計画書を作成してください。"},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=2000
                )
                return response.choices[0].message.content
            except Exception as e:
                return self._generate_mock_draft(business_name, industry, subsidy_name, plan_details)
        else:
            return self._generate_mock_draft(business_name, industry, subsidy_name, plan_details)
    
    def _generate_mock_draft(
        self,
        business_name: str,
        industry: str,
        subsidy_name: str,
        plan_details: str
    ) -> str:
        """モック用のドラフト生成（OpenAI APIキーがない場合）"""
        
        return f"""# 事業計画書

## 1. 事業概要

### 現在の事業内容
{business_name}は、{industry}業として地域のお客様にサービスを提供しております。

### 事業の強み・特徴
- 地域密着型のきめ細やかなサービス
- 長年培った専門知識とノウハウ
- お客様との信頼関係

---

## 2. 課題と解決策

### 現状の課題
- 業務効率化の遅れ
- デジタル化への対応が不十分
- 競合他社との差別化

### 本事業による解決策
{plan_details}

上記の取り組みにより、業務効率の向上と顧客満足度の改善を実現します。

---

## 3. 事業計画

### 具体的な取り組み内容
1. 現状分析と課題の整理
2. 必要なシステム・設備の選定
3. 導入・実施
4. 効果測定と改善

### スケジュール
- 1ヶ月目: 準備・発注
- 2ヶ月目: 導入・設置
- 3ヶ月目: 運用開始・調整
- 4ヶ月目以降: 本格運用

---

## 4. 期待される効果

### 売上向上の見込み
- 業務効率化による対応件数の増加: 約20%向上
- 新規顧客獲得: 月5件増加見込み

### 生産性向上の見込み
- 作業時間の短縮: 約30%削減
- ミス・手戻りの減少

### その他の効果
- 従業員の働きやすさ向上
- 事業継続性の強化

---

## 5. 資金計画

### 事業費の内訳
| 項目 | 金額 |
|------|------|
| 設備費 | ○○円 |
| システム導入費 | ○○円 |
| その他経費 | ○○円 |
| **合計** | **○○円** |

### 補助金申請額
{subsidy_name}の補助率に基づき申請

---

※ この計画書はAIによるドラフトです。
※ 実際の申請時には、具体的な数値や詳細情報を追記してください。
"""


    
    def refine_business_plan(
        self,
        subsidy_name: str,
        current_text: str,
        focus_point: str = None
    ) -> str:
        """
        既存の事業計画書を添削・ブラッシュアップ
        """
        prompt = f"""あなたは補助金申請の審査員経験もあるプロのコンサルタントです。
以下の事業計画書ドラフトを、{subsidy_name}の採択率を高めるために添削・リライトしてください。

【添削のポイント】
1. 審査員に伝わりやすい、論理的で説得力のある文章にする
2. 具体的な数値や客観的な根拠を補完するような表現にする（数値が不明な場合は[数値]としてプレースホルダーにする）
3. 「～と思います」などの曖昧な表現を避け、言い切りの形にする
{f'4. 特に注力してほしい点: {focus_point}' if focus_point else ''}

【元のテキスト】
{current_text}

【出力形式】
修正後の事業計画書のみを出力してください。Markdown形式で見出しをつけてください。
"""

        if self.client:
            try:
                response = self.client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": "あなたは優秀な中小企業診断士です。ユーザーの事業計画書をブラッシュアップしてください。"},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=2500
                )
                return response.choices[0].message.content
            except Exception as e:
                return self._generate_mock_refinement(subsidy_name, current_text)
        else:
            return self._generate_mock_refinement(subsidy_name, current_text)

    def _generate_mock_refinement(self, subsidy_name: str, current_text: str) -> str:
        """モック用の添削生成"""
        return f"""# 【添削済】事業計画書 ({subsidy_name})

> プロによるブラッシュアップを行いました。より説得力のある構成になっています。

## 1. 事業概要（ブラッシュアップ）

{current_text[:100]}...

（中略：AIが論理構成を整理し、より具体的な表現に書き換えました）

## 2. 実施体制とスケジュール

...

## 3. 期待される成果

- 売上高: 導入後3年で150%成長を見込む
- 生産性: 業務時間を月20時間削減

---
※ これはモック添削です。APIキーを設定すると、実際の文章を解析してリライトします。
"""

# シングルトンインスタンス
ai_service = AIService()
