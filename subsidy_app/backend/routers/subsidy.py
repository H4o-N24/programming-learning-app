from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

import sys
sys.path.append('..')
from database import get_db
from models import SubsidyMaster
from schemas import SubsidyMatchRequest, SubsidyMatchResponse, SubsidyResponse

router = APIRouter(prefix="/api/v1/subsidy", tags=["補助金"])


@router.get("/list", response_model=List[SubsidyResponse])
def get_all_subsidies(db: Session = Depends(get_db)):
    """全補助金一覧を取得"""
    subsidies = db.query(SubsidyMaster).all()
    return subsidies


@router.get("/{subsidy_id}", response_model=SubsidyResponse)
def get_subsidy(subsidy_id: int, db: Session = Depends(get_db)):
    """補助金詳細を取得"""
    subsidy = db.query(SubsidyMaster).filter(SubsidyMaster.id == subsidy_id).first()
    if not subsidy:
        raise HTTPException(status_code=404, detail="補助金が見つかりません")
    return subsidy


@router.post("/match", response_model=SubsidyMatchResponse)
def match_subsidies(request: SubsidyMatchRequest, db: Session = Depends(get_db)):
    """
    補助金マッチングAPI
    業種、所在地、目的に基づいて最適な補助金をリストアップ
    
    適合度の算出基準（各項目0〜100%で評価し、加重平均）:
    - 業種適合: 40% (全業種=80%, 完全一致=100%, 不一致=0%)
    - 地域適合: 30% (全国=80%, 完全一致=100%, 不一致=0%)
    - 目的適合: 30% (1つ以上一致=100%, 不一致=0%)
    """
    query = db.query(SubsidyMaster)
    
    matched_subsidies = []
    all_subsidies = query.all()
    
    for subsidy in all_subsidies:
        # 各項目のスコア (0〜100)
        industry_score = 0
        region_score = 0
        purpose_score = 0
        match_reasons = []
        
        # 業種マッチング (40%の重み)
        if subsidy.target_industry:
            if subsidy.target_industry == "全業種":
                industry_score = 80  # 全業種対応は80点
            elif request.industry in subsidy.target_industry:
                industry_score = 100  # 完全一致は100点
                match_reasons.append(f"業種「{request.industry}」に適合")
        
        # 地域マッチング (30%の重み)
        if subsidy.target_region:
            if subsidy.target_region == "全国":
                region_score = 80  # 全国対応は80点
            elif request.region in subsidy.target_region:
                region_score = 100  # 完全一致は100点
                match_reasons.append(f"地域「{request.region}」に適合")
        
        # 目的マッチング (30%の重み)
        if subsidy.purposes:
            purposes_list = [p.strip() for p in subsidy.purposes.split(",")]
            request_purposes = [p.strip() for p in request.purpose.split(",")]
            match_count = 0
            matched_purposes = []
            for req_purpose in request_purposes:
                for subsidy_purpose in purposes_list:
                    if req_purpose in subsidy_purpose or subsidy_purpose in req_purpose:
                        match_count += 1
                        matched_purposes.append(req_purpose)
                        break
            if match_count > 0:
                # 1つ以上の目的が一致すれば100点
                purpose_score = 100
                reason_str = "・".join(matched_purposes)
                match_reasons.append(f"目的「{reason_str}」に合致")
        
        # 加重平均で総合スコアを算出 (業種40%, 地域30%, 目的30%)
        total_score = int(
            industry_score * 0.4 +
            region_score * 0.3 +
            purpose_score * 0.3
        )
        
        # スコアが0より大きい場合のみ結果に含める
        if total_score > 0:
            subsidy_dict = {
                "id": subsidy.id,
                "name": subsidy.name,
                "target_industry": subsidy.target_industry,
                "target_region": subsidy.target_region,
                "max_amount": subsidy.max_amount,
                "subsidy_rate": subsidy.subsidy_rate,
                "deadline": subsidy.deadline,
                "official_url": subsidy.official_url,
                "description": subsidy.description,
                "purposes": subsidy.purposes,
                "match_score": total_score,
                "match_reason": match_reasons
            }
            matched_subsidies.append(subsidy_dict)
    
    # スコア順にソート
    matched_subsidies.sort(key=lambda x: x["match_score"], reverse=True)
    
    return SubsidyMatchResponse(
        subsidies=[SubsidyResponse(**s) for s in matched_subsidies],
        total_count=len(matched_subsidies)
    )
