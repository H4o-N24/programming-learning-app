from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

import sys
sys.path.append('..')
from database import get_db
from models import ApplicationHistory, UserProfile, SubsidyMaster
from schemas import (
    ApplicationCreate, 
    ApplicationResponse, 
    DraftGenerateRequest, 
    DraftGenerateResponse,
    ApplicationStatusUpdate,
    ManualApplicationCreate,
    RefineRequest
)
from services.ai_service import ai_service
from datetime import datetime

router = APIRouter(prefix="/api/v1/application", tags=["申請"])


@router.post("/import", response_model=ApplicationResponse)
def create_manual_application(request: ManualApplicationCreate, db: Session = Depends(get_db)):
    """申請履歴の手動インポート"""
    # ユーザー確認
    user = db.query(UserProfile).filter(UserProfile.user_id == request.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="ユーザーが見つかりません")
    
    # 手動登録用ダミー補助金のIDを取得
    dummy_subsidy = db.query(SubsidyMaster).filter(SubsidyMaster.name == "手動登録案件").first()
    if not dummy_subsidy:
        # 万が一無い場合は作成する（フェイルセーフ）
        dummy_subsidy = SubsidyMaster(
            name="手動登録案件",
            target_industry="全部",
            target_region="全国",
            description="ユーザーによる手動登録用のプレースホルダー"
        )
        db.add(dummy_subsidy)
        db.commit()
        db.refresh(dummy_subsidy)
    
    # 日付の処理
    created_at = datetime.now()
    if request.created_at:
        created_at = datetime.combine(request.created_at, datetime.min.time())

    application = ApplicationHistory(
        user_id=request.user_id,
        subsidy_id=dummy_subsidy.id,
        status=request.status,
        manual_subsidy_name=request.manual_subsidy_name,
        plan_details="手動インポートされた案件",
        created_at=created_at
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    
    return ApplicationResponse(
        id=application.id,
        user_id=application.user_id,
        subsidy_id=application.subsidy_id,
        subsidy_name=dummy_subsidy.name,
        manual_subsidy_name=application.manual_subsidy_name,
        status=application.status,
        ai_draft_text=application.ai_draft_text,
        plan_details=application.plan_details,
        created_at=application.created_at,
        official_url=dummy_subsidy.official_url
    )


@router.post("/refine", response_model=DraftGenerateResponse)
def refine_draft(request: RefineRequest, db: Session = Depends(get_db)):
    """
    既存の事業計画書をAI添削
    """
    # ユーザー情報取得
    user = db.query(UserProfile).filter(UserProfile.user_id == request.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="ユーザーが見つかりません")
    
    # 補助金情報取得
    subsidy = db.query(SubsidyMaster).filter(SubsidyMaster.id == request.subsidy_id).first()
    if not subsidy:
        raise HTTPException(status_code=404, detail="補助金が見つかりません")
    
    # AIで添削
    refined_text = ai_service.refine_business_plan(
        subsidy_name=subsidy.name,
        current_text=request.current_text,
        focus_point=request.focus_point
    )
    
    # 申請履歴を保存
    application = ApplicationHistory(
        user_id=request.user_id,
        subsidy_id=request.subsidy_id,
        status="下書き",
        ai_draft_text=refined_text,
        plan_details=f"【AI添削依頼】\n{request.current_text[:200]}..." # 元テキストの一部を保存
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    
    return DraftGenerateResponse(
        draft_id=application.id,
        draft_text=refined_text,
        subsidy_name=subsidy.name,
        official_url=subsidy.official_url
    )


@router.post("/generate_draft", response_model=DraftGenerateResponse)
def generate_draft(request: DraftGenerateRequest, db: Session = Depends(get_db)):
    """
    事業計画書AI生成API
    ユーザー情報と計画詳細を元にLLMにプロンプトを送り、事業計画書のドラフトを生成
    """
    # ユーザー情報取得
    user = db.query(UserProfile).filter(UserProfile.user_id == request.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="ユーザーが見つかりません")
    
    # 補助金情報取得
    subsidy = db.query(SubsidyMaster).filter(SubsidyMaster.id == request.subsidy_id).first()
    if not subsidy:
        raise HTTPException(status_code=404, detail="補助金が見つかりません")
    
    # AIで事業計画書ドラフトを生成
    draft_text = ai_service.generate_business_plan_draft(
        business_name=user.business_name,
        industry=user.industry,
        subsidy_name=subsidy.name,
        plan_details=request.plan_details,
        max_amount=subsidy.max_amount
    )
    
    # 申請履歴を保存
    application = ApplicationHistory(
        user_id=request.user_id,
        subsidy_id=request.subsidy_id,
        status="下書き",
        ai_draft_text=draft_text,
        plan_details=request.plan_details
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    
    return DraftGenerateResponse(
        draft_id=application.id,
        draft_text=draft_text,
        subsidy_name=subsidy.name,
        official_url=subsidy.official_url
    )


@router.get("/history/{user_id}", response_model=List[ApplicationResponse])
def get_user_applications(user_id: int, db: Session = Depends(get_db)):
    """ユーザーの申請履歴を取得"""
    applications = db.query(ApplicationHistory).filter(
        ApplicationHistory.user_id == user_id
    ).order_by(ApplicationHistory.created_at.desc()).all()
    
    result = []
    for app in applications:
        subsidy = db.query(SubsidyMaster).filter(SubsidyMaster.id == app.subsidy_id).first()
        # 手動入力名があれば優先、なければマスタ名
        display_name = app.manual_subsidy_name if app.manual_subsidy_name else (subsidy.name if subsidy else None)
        
        result.append(ApplicationResponse(
            id=app.id,
            user_id=app.user_id,
            subsidy_id=app.subsidy_id,
            subsidy_name=display_name,
            manual_subsidy_name=app.manual_subsidy_name,
            status=app.status,
            ai_draft_text=app.ai_draft_text,
            plan_details=app.plan_details,
            created_at=app.created_at,
            official_url=subsidy.official_url if subsidy else None
        ))
    
    return result


@router.get("/{application_id}", response_model=ApplicationResponse)
def get_application(application_id: int, db: Session = Depends(get_db)):
    """申請詳細を取得"""
    application = db.query(ApplicationHistory).filter(
        ApplicationHistory.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="申請が見つかりません")
    
    subsidy = db.query(SubsidyMaster).filter(
        SubsidyMaster.id == application.subsidy_id
    ).first()
    
    display_name = application.manual_subsidy_name if application.manual_subsidy_name else (subsidy.name if subsidy else None)

    return ApplicationResponse(
        id=application.id,
        user_id=application.user_id,
        subsidy_id=application.subsidy_id,
        subsidy_name=display_name,
        manual_subsidy_name=application.manual_subsidy_name,
        status=application.status,
        ai_draft_text=application.ai_draft_text,
        plan_details=application.plan_details,
        created_at=application.created_at,
        official_url=subsidy.official_url if subsidy else None
    )


@router.patch("/{application_id}/status")
def update_application_status(
    application_id: int, 
    status_update: ApplicationStatusUpdate,
    db: Session = Depends(get_db)
):
    """申請ステータスを更新"""
    application = db.query(ApplicationHistory).filter(
        ApplicationHistory.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="申請が見つかりません")
    
    valid_statuses = ["下書き", "申請中", "採択", "不採択"]
    if status_update.status not in valid_statuses:
        raise HTTPException(
            status_code=400, 
            detail=f"無効なステータスです。有効な値: {valid_statuses}"
        )
    
    application.status = status_update.status
    db.commit()
    
    return {"message": "ステータスを更新しました", "status": status_update.status}


@router.delete("/{application_id}")
def delete_application(application_id: int, db: Session = Depends(get_db)):
    """申請を削除"""
    application = db.query(ApplicationHistory).filter(
        ApplicationHistory.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="申請が見つかりません")
    
    db.delete(application)
    db.commit()
    
    return {"message": "申請を削除しました", "id": application_id}
