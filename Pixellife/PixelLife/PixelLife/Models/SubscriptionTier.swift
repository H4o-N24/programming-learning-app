// SubscriptionTier.swift
// PixelLife
//
// サブスクリプションプランの定義

import Foundation

/// サブスクリプションプラン（3種類）
enum SubscriptionTier: String, Codable, CaseIterable, Identifiable {
    case basic = "basic"
    case premium = "premium"
    case aiPro = "ai_pro"

    var id: String { rawValue }

    /// App Store Connect の Product ID
    var productId: String {
        switch self {
        case .basic: return "com.pixellife.basic"
        case .premium: return "com.pixellife.premium"
        case .aiPro: return "com.pixellife.aipro"
        }
    }

    /// 表示用の日本語名
    var displayName: String {
        switch self {
        case .basic: return "ベーシック"
        case .premium: return "プレミアム"
        case .aiPro: return "AIプロ"
        }
    }

    /// 月額価格（税込想定）
    var monthlyPrice: Int {
        switch self {
        case .basic: return 0
        case .premium: return 480
        case .aiPro: return 980
        }
    }

    /// 価格表示文字列
    var priceDisplayText: String {
        switch self {
        case .basic: return "無料"
        case .premium: return "¥480/月"
        case .aiPro: return "¥980/月"
        }
    }

    /// 利用可能なウィジェットサイズ
    var availableWidgetSizes: [WidgetSizeOption] {
        switch self {
        case .basic: return [.small]
        case .premium, .aiPro: return [.small, .medium, .large]
        }
    }

    /// カレンダー連携が利用可能か
    var canAccessCalendar: Bool {
        switch self {
        case .basic: return false
        case .premium, .aiPro: return true
        }
    }

    /// アニメーションが利用可能か
    var canUseAnimation: Bool {
        switch self {
        case .basic: return false
        case .premium, .aiPro: return true
        }
    }

    /// AIカスタム生成が利用可能か
    var canUseAIGeneration: Bool {
        switch self {
        case .basic, .premium: return false
        case .aiPro: return true
        }
    }

    /// 月間AIクレジット数
    var monthlyAICredits: Int {
        switch self {
        case .basic, .premium: return 0
        case .aiPro: return 50
        }
    }

    /// 広告表示するか
    var showsAds: Bool {
        switch self {
        case .basic: return true
        case .premium, .aiPro: return false
        }
    }

    /// ウィジェット更新間隔（分）
    var updateIntervalMinutes: Int {
        switch self {
        case .basic: return 30
        case .premium, .aiPro: return 15
        }
    }

    /// 利用可能なキャラクター数
    var characterLimit: Int {
        switch self {
        case .basic: return 1
        case .premium: return 10
        case .aiPro: return .max
        }
    }

    /// プランの特典リスト
    var features: [String] {
        switch self {
        case .basic:
            return [
                "デフォルトキャラクター1種",
                "バッテリー・天気連動",
                "小サイズウィジェット",
                "30分ごとの更新"
            ]
        case .premium:
            return [
                "全キャラクター解放",
                "全テーマ解放",
                "広告非表示",
                "カレンダー連携",
                "全サイズウィジェット",
                "簡易アニメーション",
                "Apple/Google連携",
                "15分ごとの更新"
            ]
        case .aiPro:
            return [
                "プレミアムの全機能",
                "AIカスタム生成（50回/月）",
                "限定AIテーマ",
                "優先サポート"
            ]
        }
    }
}

/// ウィジェットサイズオプション
enum WidgetSizeOption: String, Codable, CaseIterable {
    case small = "small"
    case medium = "medium"
    case large = "large"

    var displayName: String {
        switch self {
        case .small: return "小"
        case .medium: return "中"
        case .large: return "大"
        }
    }
}
