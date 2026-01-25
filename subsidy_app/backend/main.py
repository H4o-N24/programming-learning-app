from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from database import engine, Base
from routers import subsidy, application, user, auth

# データベーステーブル作成
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="補助金・助成金マッチング＆AI申請支援アプリ",
    description="専門家いらず、スマホで完結。あなたの店に眠るお金を見つける",
    version="1.0.0"
)

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ルーター登録
app.include_router(subsidy.router)
app.include_router(application.router)
app.include_router(user.router)
app.include_router(auth.router)

# 静的ファイル配信
frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend")
if os.path.exists(frontend_path):
    app.mount("/static", StaticFiles(directory=frontend_path), name="static")


@app.get("/")
async def root():
    """フロントエンドのindex.htmlを返す"""
    index_path = os.path.join(frontend_path, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "補助金・助成金マッチング＆AI申請支援アプリ API", "docs": "/docs"}


@app.get("/health")
async def health_check():
    """ヘルスチェック"""
    return {"status": "ok"}
