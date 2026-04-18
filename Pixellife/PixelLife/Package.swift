// swift-tools-version: 5.9
// Package.swift
// PixelLife
//
// Swift Package Manager 設定
// Xcode で開く場合は、このファイルをダブルクリックしてプロジェクトを開きます。
//
// 注意: 実際のプロジェクトでは Xcode の .xcodeproj を使用することが推奨されます。
// Widget Extension は別ターゲットとして設定が必要です。

import PackageDescription

let package = Package(
    name: "PixelLife",
    platforms: [
        .iOS(.v17)
    ],
    products: [
        .library(
            name: "PixelLifeShared",
            targets: ["PixelLifeShared"]
        )
    ],
    dependencies: [
        // Firebase SDK
        .package(url: "https://github.com/firebase/firebase-ios-sdk.git", from: "10.0.0"),
        // Google Sign-In
        .package(url: "https://github.com/google/GoogleSignIn-iOS.git", from: "7.0.0"),
    ],
    targets: [
        // 共有モジュール（メインアプリとウィジェットで共有）
        .target(
            name: "PixelLifeShared",
            dependencies: [],
            path: "Shared"
        ),
    ]
)

// ============================================================
// 📋 Xcode プロジェクト設定手順
// ============================================================
//
// このプロジェクトを Xcode で正しく設定するには、以下の手順に従ってください。
//
// 1. Xcode で新規プロジェクトを作成
//    - File → New → Project → App
//    - Product Name: PixelLife
//    - Interface: SwiftUI
//    - Language: Swift
//    - Minimum Deployments: iOS 17.0
//
// 2. Widget Extension を追加
//    - File → New → Target → Widget Extension
//    - Product Name: PixelLifeWidget
//    - ✅ Include Configuration App Intent にチェック
//
// 3. App Group を設定
//    - メインターゲットとウィジェットの Signing & Capabilities で
//    - + Capability → App Groups
//    - group.com.pixellife.shared を追加
//
// 4. Firebase SDK を追加
//    - File → Add Package Dependencies
//    - URL: https://github.com/firebase/firebase-ios-sdk.git
//    - FirebaseAuth, FirebaseFirestore, FirebaseFunctions, FirebaseStorage を選択
//
// 5. GoogleService-Info.plist を追加
//    - Firebase コンソールからダウンロードしたファイルをプロジェクトに追加
//
// 6. ソースファイルを配置
//    - このディレクトリの PixelLife/ 以下のファイルを Xcode プロジェクトに追加
//    - PixelLifeWidget/ 以下のファイルはウィジェットターゲットに追加
//    - Shared/ 以下のファイルは両方のターゲットに追加
//
// 7. Info.plist の設定
//    - NSCalendarsUsageDescription を追加
//    - NSLocationWhenInUseUsageDescription を追加
