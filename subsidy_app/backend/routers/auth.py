"""
認証・サブスクリプション管理APIルーター
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import UserProfile
from schemas import UserCreate, UserResponse
from datetime import date, timedelta
import os

router = APIRouter(prefix="/api/v1/auth", tags=["認証"])

# 環境変数からStripe設定を読み込み（モック用にデフォルト値あり）
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "sk_test_mock")
STRIPE_PRICE_ID = os.getenv("STRIPE_PRICE_ID", "price_mock_premium")

# 無料プランの制限
FREE_PLAN_DRAFT_LIMIT = 1


@router.post("/google-login")
def google_login(token: str, db: Session = Depends(get_db)):
    """
    Google OAuthトークンでログイン/登録
    実際の実装ではトークンを検証してユーザー情報を取得
    """
    # TODO: 本番実装時はGoogle APIでトークンを検証
    # 現在はモック実装
    return {"message": "Google認証はGCP設定後に有効になります", "mock": True}


@router.get("/user/{user_id}/subscription")
def get_subscription_status(user_id: int, db: Session = Depends(get_db)):
    """ユーザーのサブスクリプション状態を取得"""
    user = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="ユーザーが見つかりません")
    
    # 月次リセットチェック
    today = date.today()
    if user.draft_reset_date is None or user.draft_reset_date < today.replace(day=1):
        user.monthly_draft_count = 0
        user.draft_reset_date = today
        db.commit()
    
    remaining_drafts = None
    if user.plan == "free":
        remaining_drafts = max(0, FREE_PLAN_DRAFT_LIMIT - (user.monthly_draft_count or 0))
    
    return {
        "user_id": user.user_id,
        "plan": user.plan or "free",
        "monthly_draft_count": user.monthly_draft_count or 0,
        "remaining_drafts": remaining_drafts,
        "is_premium": user.plan == "premium",
        "stripe_customer_id": user.stripe_customer_id
    }


@router.post("/user/{user_id}/upgrade")
def upgrade_to_premium(user_id: int, db: Session = Depends(get_db)):
    """
    プレミアムプランへアップグレード
    Stripeアカウント設定後に本番実装
    """
    user = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="ユーザーが見つかりません")
    
    # TODO: Stripe Checkout Session作成
    # 現在はモック実装（即座にアップグレード）
    user.plan = "premium"
    db.commit()
    
    return {
        "success": True,
        "message": "プレミアムプランにアップグレードしました（モック）",
        "checkout_url": None  # 本番ではStripe Checkout URLを返す
    }


@router.post("/user/{user_id}/cancel")
def cancel_subscription(user_id: int, db: Session = Depends(get_db)):
    """サブスクリプションをキャンセル"""
    user = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="ユーザーが見つかりません")
    
    # TODO: Stripeサブスクリプションキャンセル
    user.plan = "free"
    user.stripe_subscription_id = None
    db.commit()
    
    return {"success": True, "message": "プランを無料版に変更しました"}


@router.post("/user/{user_id}/increment-draft")
def increment_draft_count(user_id: int, db: Session = Depends(get_db)):
    """ドラフト生成カウントを増加（内部API）"""
    user = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="ユーザーが見つかりません")
    
    # 月次リセットチェック
    today = date.today()
    if user.draft_reset_date is None or user.draft_reset_date < today.replace(day=1):
        user.monthly_draft_count = 0
        user.draft_reset_date = today
    
    # 無料プランの制限チェック
    if user.plan == "free" and (user.monthly_draft_count or 0) >= FREE_PLAN_DRAFT_LIMIT:
        raise HTTPException(
            status_code=403, 
            detail="無料プランの月間制限に達しました。プレミアムプランにアップグレードしてください。"
        )
    
    user.monthly_draft_count = (user.monthly_draft_count or 0) + 1
    db.commit()
    
    return {"success": True, "new_count": user.monthly_draft_count}
