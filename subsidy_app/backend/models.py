from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class SubsidyMaster(Base):
    """補助金マスタテーブル"""
    __tablename__ = "subsidy_master"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, comment="補助金名")
    target_industry = Column(String(100), comment="対象業種")
    target_region = Column(String(100), comment="対象地域")
    max_amount = Column(Integer, comment="最大補助額")
    subsidy_rate = Column(String(50), comment="補助率（例：2/3）")
    deadline = Column(Date, comment="申請締切日")
    official_url = Column(String(500), comment="公式サイトURL")
    description = Column(Text, comment="補助金概要")
    criteria_json = Column(JSON, comment="マッチング用詳細条件")
    purposes = Column(String(500), comment="対象目的（カンマ区切り）")

    applications = relationship("ApplicationHistory", back_populates="subsidy")


class UserProfile(Base):
    """ユーザー情報テーブル"""
    __tablename__ = "user_profile"

    user_id = Column(Integer, primary_key=True, index=True)
    business_name = Column(String(255), comment="店舗・会社名")
    email = Column(String(255), nullable=True, comment="メールアドレス")
    google_id = Column(String(255), nullable=True, comment="Google OAuth ID")
    industry = Column(String(100), comment="業種")
    region = Column(String(100), comment="所在地")
    employee_count = Column(Integer, comment="従業員数")
    annual_sales = Column(Integer, nullable=True, comment="年間売上")
    investment_plan = Column(Text, nullable=True, comment="投資予定")
    
    # Subscription fields
    plan = Column(String(50), default="free", comment="プラン: free / premium")
    stripe_customer_id = Column(String(255), nullable=True, comment="Stripe顧客ID")
    stripe_subscription_id = Column(String(255), nullable=True, comment="StripeサブスクリプションID")
    monthly_draft_count = Column(Integer, default=0, comment="今月のドラフト生成回数")
    draft_reset_date = Column(Date, nullable=True, comment="ドラフトカウントリセット日")
    
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    applications = relationship("ApplicationHistory", back_populates="user")


class ApplicationHistory(Base):
    """申請履歴テーブル"""
    __tablename__ = "application_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user_profile.user_id"), nullable=False)
    subsidy_id = Column(Integer, ForeignKey("subsidy_master.id"), nullable=False)
    status = Column(String(50), default="下書き", comment="申請ステータス")
    manual_subsidy_name = Column(String(255), nullable=True, comment="手動入力時の補助金名")
    ai_draft_text = Column(Text, comment="AIが生成した事業計画書本文")
    plan_details = Column(Text, comment="ユーザー入力の計画詳細")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    user = relationship("UserProfile", back_populates="applications")
    subsidy = relationship("SubsidyMaster", back_populates="applications")
