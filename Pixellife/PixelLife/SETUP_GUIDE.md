# ピクセルライフ Xcodeプロジェクト セットアップガイド

## 前提条件

- macOS 14.0 (Sonoma) 以上
- Xcode 15.0 以上
- Apple Developer Program アカウント（年間 $99）
- Firebase プロジェクト
- OpenWeatherMap API キー
- OpenAI API キー（AIプロ機能用）

## Step 1: Xcode プロジェクト作成

1. Xcode を起動し、**File → New → Project** を選択
2. **App** テンプレートを選択
3. 以下を入力:
   - **Product Name**: `PixelLife`
   - **Team**: あなたの開発チーム
   - **Organization Identifier**: `com.pixellife`
   - **Interface**: SwiftUI
   - **Language**: Swift
4. プロジェクトを作成

## Step 2: Widget Extension の追加

1. **File → New → Target** を選択
2. **Widget Extension** を選択
3. 以下を入力:
   - **Product Name**: `PixelLifeWidget`
   - **Include Configuration App Intent**: チェック
4. **Activate** をクリック

## Step 3: App Groups の設定

**メインアプリターゲット:**
1. PixelLife ターゲットを選択 → **Signing & Capabilities**
2. **+ Capability** → **App Groups** を追加
3. **group.com.pixellife.shared** を追加

**ウィジェットターゲット:**
1. PixelLifeWidget ターゲットを選択 → **Signing & Capabilities**
2. 同じ **App Groups** (`group.com.pixellife.shared`) を追加

## Step 4: ソースファイルの配置

本リポジトリのファイルを以下のようにXcodeプロジェクトに追加します:

```
PixelLife/
├── PixelLife/         → メインアプリターゲットに追加
│   ├── App/
│   ├── Models/
│   ├── Services/
│   ├── Views/
│   ├── Resources/     → Assets.xcassets, Localizable.strings
│   └── Info.plist
├── PixelLifeWidget/   → ウィジェットターゲットに追加
│   ├── WidgetViews/
│   └── Info.plist
└── Shared/            → 両方のターゲットに追加（重要！）
    ├── SharedDataManager.swift
    └── StateMapping.swift
```

> ⚠️ **重要**: `Shared/` フォルダの2ファイルは、メインアプリとウィジェット**両方**のターゲットメンバーシップに追加してください。
> `Models/` フォルダも同様に両方のターゲットに追加してください。

## Step 5: Firebase SDK の追加

1. **File → Add Package Dependencies**
2. URL: `https://github.com/firebase/firebase-ios-sdk.git`
3. 以下のライブラリを選択:
   - FirebaseAuth
   - FirebaseFirestore
   - FirebaseFunctions
   - FirebaseStorage

## Step 6: GoogleService-Info.plist

1. [Firebase Console](https://console.firebase.google.com/) でプロジェクトを作成
2. iOS アプリを追加（バンドルID: `com.pixellife.app`）
3. `GoogleService-Info.plist` をダウンロード
4. Xcode プロジェクトのルートに追加

## Step 7: Capabilities の追加設定

メインアプリターゲットで以下を追加:

- **Background Modes** → Background fetch にチェック
- **Sign in with Apple**（Apple IDログイン用）

## Step 8: Firebase Backend のデプロイ

```bash
# Firebase CLI インストール
npm install -g firebase-tools

# ログイン
firebase login

# プロジェクト設定
cd Backend/
firebase init

# 環境変数設定
firebase functions:config:set openweather.key="YOUR_OPENWEATHER_KEY"
firebase functions:config:set openai.key="YOUR_OPENAI_KEY"

# デプロイ
firebase deploy
```

## Step 9: アセット生成

```bash
# 依存パッケージインストール
pip install openai Pillow

# ドライラン（プロンプト確認）
python3 Scripts/generate_assets.py --api-key YOUR_KEY --dry-run

# 本番生成（全400枚）
python3 Scripts/generate_assets.py --api-key YOUR_KEY --output ./PixelLife/Resources/Assets.xcassets/Characters
```

## Step 10: ビルド & テスト

1. シミュレーターで **PixelLife** スキームを選択してビルド
2. ウィジェットのテスト: シミュレーターのホーム画面でウィジェットを追加
3. サブスクリプションテスト: Sandbox テストアカウントを使用

## Step 11: TestFlight

1. **Product → Archive** でアーカイブ
2. **Distribute App** → App Store Connect にアップロード
3. App Store Connect で TestFlight のテスターを招待

## Step 12: App Store 提出

1. App Store Connect で以下を設定:
   - `AppStoreMetadata/AppStoreMetadata.md` の内容を入力
   - `Legal/PrivacyPolicy.md` の URL を登録
   - `Legal/TermsOfUse.md` の URL を登録
   - サブスクリプション商品を設定
2. スクリーンショットをアップロード
3. 審査提出
