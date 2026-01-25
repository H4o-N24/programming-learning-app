# SubsidyPro - 補助金申請支援プラットフォーム

「専門家いらず、スマホで完結。あなたの店に眠るお金を見つける」

## 🎯 概要

SubsidyProは、個人事業主・小規模事業者向けの補助金マッチングとAI申請支援を行うWebアプリケーションです。

## ✨ 主な機能

- **適合性診断**: 業種・所在地・投資目的から最適な補助金を自動抽出
- **AI計画書生成**: 審査基準を踏まえた事業計画書ドラフトを自動生成
- **申請準備チェックリスト**: 必要書類の準備状況を管理
- **案件管理**: 申請履歴の一元管理

## 🛠️ 技術スタック

### Backend
- Python 3.12
- FastAPI
- SQLAlchemy + SQLite
- OpenAI API（AI計画書生成）

### Frontend
- HTML5 / CSS3 / JavaScript
- モバイルファースト設計

## 🚀 セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/H4o-N24/Subsidy_app.git
cd Subsidy_app

# 仮想環境を作成・有効化
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate  # Windows

# 依存関係をインストール
pip install -r requirements.txt

# バックエンドを起動
cd backend
python seed_data.py  # 初回のみ：サンプルデータ投入
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

ブラウザで http://localhost:8000 にアクセス

## 📁 プロジェクト構成

```
subsidy_app/
├── backend/
│   ├── main.py           # FastAPIエントリーポイント
│   ├── database.py       # DB設定
│   ├── models.py         # SQLAlchemyモデル
│   ├── schemas.py        # Pydanticスキーマ
│   ├── seed_data.py      # サンプルデータ投入
│   ├── routers/          # APIルーター
│   │   ├── subsidy.py    # 補助金マッチングAPI
│   │   ├── application.py # 申請・AI生成API
│   │   ├── user.py       # ユーザー管理API
│   │   └── auth.py       # 認証・課金API
│   └── services/
│       └── ai_service.py # OpenAI連携
├── frontend/
│   ├── index.html        # メインHTML
│   ├── style.css         # スタイルシート
│   └── app.js            # フロントエンドロジック
└── requirements.txt
```

## 💰 料金プラン

| プラン | 月額 | AI計画書生成 | 診断 |
|--------|------|-------------|------|
| フリー | ¥0 | 月1回 | 無制限 |
| プレミアム | ¥2,980 | 無制限 | 無制限 |

## 🔧 環境変数（本番用）

```bash
# OpenAI API
OPENAI_API_KEY=sk-xxx

# Stripe（課金用）
STRIPE_SECRET_KEY=sk_xxx
STRIPE_PRICE_ID=price_xxx

# Google OAuth（認証用）
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
```

## 📝 ライセンス

MIT License

## 👤 開発者

H4o-N24
