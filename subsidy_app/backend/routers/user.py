from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

import sys
sys.path.append('..')
from database import get_db
from models import UserProfile
from schemas import UserCreate, UserResponse

router = APIRouter(prefix="/api/v1/user", tags=["ユーザー"])


@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """ユーザー登録"""
    db_user = UserProfile(
        business_name=user.business_name,
        industry=user.industry,
        region=user.region,
        employee_count=user.employee_count,
        annual_sales=user.annual_sales,
        investment_plan=user.investment_plan
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    """ユーザー情報取得"""
    user = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="ユーザーが見つかりません")
    return user


@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user_update: UserCreate, db: Session = Depends(get_db)):
    """ユーザー情報更新"""
    user = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="ユーザーが見つかりません")
    
    user.business_name = user_update.business_name
    user.industry = user_update.industry
    user.region = user_update.region
    user.employee_count = user_update.employee_count
    user.annual_sales = user_update.annual_sales
    user.investment_plan = user_update.investment_plan
    
    db.commit()
    db.refresh(user)
    return user


@router.get("/list/all", response_model=List[UserResponse])
def get_all_users(db: Session = Depends(get_db)):
    """全ユーザー一覧取得（管理用）"""
    users = db.query(UserProfile).all()
    return users
