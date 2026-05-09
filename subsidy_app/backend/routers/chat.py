"""
AIチャット相談APIルーター
OpenAI APIを使用して補助金に関する相談に回答
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os

router = APIRouter(prefix="/api/v1/chat", tags=["AIチャット"])

# OpenAI APIキー
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# システムプロンプト
SYSTEM_PROMPT = """あなたは日本の中小企業向け補助金・助成金の専門アドバイザーです。
以下のガイドラインに従って回答してください：

1. 補助金・助成金に関する質問に対して、正確で実用的な情報を提供してください
2. 小規模事業者持続化補助金、IT導入補助金、ものづくり補助金など主要な制度について説明できます
3. 申請のポイント、必要書類、スケジュールなどについてアドバイスできます
4. 分からないことは正直に「専門家への相談をお勧めします」と回答してください
5. 回答は簡潔で分かりやすく、箇条書きを活用してください
6. 法的なアドバイスや確定的な審査結果の予測は避けてください

親切で丁寧な口調で回答してください。"""


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    user_id: Optional[int] = None


class ChatResponse(BaseModel):
    response: str
    mock: bool = False


@router.post("/", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest):
    """AIチャット相談エンドポイント"""
    
    if not request.messages:
        raise HTTPException(status_code=400, detail="メッセージが必要です")
    
    user_message = request.messages[-1].content
    
    # OpenAI APIキーがある場合は本番モード
    if OPENAI_API_KEY and OPENAI_API_KEY != "sk_test_mock":
        try:
            import openai
            client = openai.OpenAI(api_key=OPENAI_API_KEY)
            
            messages = [{"role": "system", "content": SYSTEM_PROMPT}]
            for msg in request.messages:
                messages.append({"role": msg.role, "content": msg.content})
            
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                max_tokens=1000,
                temperature=0.7
            )
            
            return ChatResponse(
                response=response.choices[0].message.content,
                mock=False
            )
        except Exception as e:
            print(f"OpenAI API error: {e}")
            # フォールバックとしてモック応答を返す
    
    # モック応答（OpenAI APIキーがない場合）
    mock_response = generate_mock_response(user_message)
    return ChatResponse(response=mock_response, mock=True)


def generate_mock_response(message: str) -> str:
    """モック応答を生成"""
    message_lower = message.lower()
    
    if "持続化" in message or "小規模" in message:
        return """**小規模事業者持続化補助金**について回答します。

📋 **概要**
- 対象: 小規模事業者（従業員20名以下、商業・サービス業は5名以下）
- 補助上限: 50万円〜200万円（類型による）
- 補助率: 2/3

📝 **申請のポイント**
1. 経営計画書で「強み」と「課題」を明確に
2. 補助事業計画書で具体的な取り組みを記載
3. 数値目標（売上増加率など）を設定

⚠️ ご不明な点は商工会・商工会議所にご相談ください。"""
    
    elif "IT" in message or "it" in message:
        return """**IT導入補助金**について回答します。

📋 **概要**
- 対象: 中小企業・小規模事業者
- 補助上限: 最大450万円
- 補助率: 1/2〜3/4

💡 **主な対象ツール**
- 会計ソフト、受発注システム
- 顧客管理（CRM）、在庫管理
- ECサイト構築

📝 **申請の流れ**
1. gBizIDプライムを取得
2. IT導入支援事業者を選定
3. ツールを選定し申請

詳細は公式サイトをご確認ください。"""
    
    elif "ものづくり" in message:
        return """**ものづくり補助金**について回答します。

📋 **概要**
- 対象: 中小企業・小規模事業者
- 補助上限: 750万円〜3,000万円
- 補助率: 1/2〜2/3

🎯 **対象となる取り組み**
- 革新的な製品・サービス開発
- 生産プロセスの改善
- 試作品開発

📝 **採択のポイント**
1. 技術面の革新性
2. 事業化面の実現可能性
3. 政策面への貢献

専門家（認定支援機関）のサポートをお勧めします。"""
    
    elif "申請" in message or "書類" in message:
        return """**申請に必要な主な書類**をお伝えします。

📄 **共通で必要な書類**
1. 履歴事項全部証明書（法務局で取得、3ヶ月以内）
2. 決算書（直近2期分）
3. 納税証明書
4. 事業計画書

📝 **事業計画書のポイント**
- 現状の課題を具体的に
- 補助事業による解決策
- 期待される効果（数値で）

⏰ **準備期間**
- GビズIDの取得に2〜3週間かかる場合があります
- 余裕を持って準備を始めましょう

アプリの「チェックリスト」機能もご活用ください！"""
    
    else:
        return """ご質問ありがとうございます。

私は補助金・助成金に関する相談に対応しています。

💡 **よくあるご質問**
- 「小規模事業者持続化補助金について教えて」
- 「IT導入補助金の申請方法は？」
- 「申請に必要な書類は？」

具体的な制度名や、お知りになりたい内容をお聞かせいただければ、より詳しくお答えできます。

※ 本チャットはAIによる参考情報です。正式な申請の際は公式情報をご確認ください。"""
