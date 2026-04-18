// ScheduleState.swift
// PixelLife
//
// カレンダー予定に基づくキャラクターの行動/場所を定義

import Foundation

/// 予定状態（4種類）
/// キャラクターのポーズ、周囲のオブジェクトに影響
enum ScheduleState: String, Codable, CaseIterable {
    /// 予定なし - リラックスしたポーズ
    case none = "None"
    /// 仕事 - PCやデスクに向かうポーズ
    case work = "Work"
    /// プライベート - 趣味や遊びのポーズ
    case `private` = "Private"
    /// 移動 - 外出・旅行のポーズ
    case travel = "Travel"

    /// 表示用の日本語名
    var displayName: String {
        switch self {
        case .none: return "予定なし"
        case .work: return "仕事"
        case .private: return "プライベート"
        case .travel: return "移動"
        }
    }

    /// 表示用のアイコン名（SF Symbols）
    var iconName: String {
        switch self {
        case .none: return "house.fill"
        case .work: return "briefcase.fill"
        case .private: return "heart.fill"
        case .travel: return "car.fill"
        }
    }

    /// キャラクターの行動に対応するプレフィックス
    var actionPrefix: String {
        switch self {
        case .none: return "act_relax"
        case .work: return "act_work"
        case .private: return "act_play"
        case .travel: return "act_travel"
        }
    }

    /// カレンダーイベントのタイトルからスケジュール状態を推測
    /// - Parameter title: カレンダーイベントのタイトル
    /// - Returns: 推測された ScheduleState
    static func classify(from title: String) -> ScheduleState {
        let lowered = title.lowercased()

        // 仕事関連キーワード
        let workKeywords = [
            "会議", "ミーティング", "meeting", "mtg", "打ち合わせ",
            "仕事", "work", "業務", "商談", "プレゼン",
            "レビュー", "review", "面接", "interview",
            "締め切り", "deadline", "リリース", "deploy"
        ]

        // 移動関連キーワード
        let travelKeywords = [
            "出張", "旅行", "travel", "trip", "移動",
            "フライト", "flight", "新幹線", "電車",
            "ドライブ", "drive", "空港", "airport",
            "駅", "station"
        ]

        // プライベート関連キーワード
        let privateKeywords = [
            "ランチ", "lunch", "ディナー", "dinner", "飲み会",
            "デート", "date", "映画", "movie", "買い物", "shopping",
            "ジム", "gym", "ヨガ", "yoga", "趣味",
            "友達", "friend", "パーティー", "party",
            "誕生日", "birthday", "記念日"
        ]

        for keyword in workKeywords {
            if lowered.contains(keyword) { return .work }
        }
        for keyword in travelKeywords {
            if lowered.contains(keyword) { return .travel }
        }
        for keyword in privateKeywords {
            if lowered.contains(keyword) { return .private }
        }

        // デフォルトは仕事（カレンダーに予定がある場合）
        return .work
    }
}
