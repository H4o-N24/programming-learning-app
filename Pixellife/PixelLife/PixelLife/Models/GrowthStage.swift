// GrowthStage.swift
// PixelLife
//
// キャラクター成長段階モデル
// 使用日数に応じて動物キャラクターが成長・進化する

import Foundation

/// 成長段階
enum GrowthStage: Int, Codable, CaseIterable {
    case baby = 0      // 赤ちゃん（0-6日）
    case child = 1     // 子供（7-29日）
    case teen = 2      // 若者（30-89日）
    case adult = 3     // 大人（90-179日）
    case elder = 4     // 長老（180日+）

    /// 表示名
    var displayName: String {
        switch self {
        case .baby:  return "ベビー"
        case .child: return "こども"
        case .teen:  return "わかもの"
        case .adult: return "おとな"
        case .elder: return "ちょうろう"
        }
    }

    /// 成長段階の詳細説明
    var stageDescription: String {
        switch self {
        case .baby:  return "生まれたばかり。まだ目がうるうる"
        case .child: return "好奇心旺盛！いろんなことに興味津々"
        case .teen:  return "だんだん個性が出てきた！"
        case .adult: return "立派に成長！頼もしい姿に"
        case .elder: return "全てを見守る、穏やかな長老"
        }
    }

    /// 成長に必要な日数
    var requiredDays: Int {
        switch self {
        case .baby:  return 0
        case .child: return 7
        case .teen:  return 30
        case .adult: return 90
        case .elder: return 180
        }
    }

    /// 次の成長段階
    var nextStage: GrowthStage? {
        switch self {
        case .baby:  return .child
        case .child: return .teen
        case .teen:  return .adult
        case .adult: return .elder
        case .elder: return nil
        }
    }

    /// 次の成長までの残り日数
    func daysUntilNextStage(currentDays: Int) -> Int? {
        guard let next = nextStage else { return nil }
        return max(0, next.requiredDays - currentDays)
    }

    /// 使用日数から成長段階を判定
    static func fromDays(_ days: Int) -> GrowthStage {
        if days >= 180 { return .elder }
        if days >= 90  { return .adult }
        if days >= 30  { return .teen }
        if days >= 7   { return .child }
        return .baby
    }

    /// アセットキーのサフィックス
    var assetSuffix: String {
        switch self {
        case .baby:  return "baby"
        case .child: return "child"
        case .teen:  return "teen"
        case .adult: return "adult"
        case .elder: return "elder"
        }
    }

    /// 成長段階に応じたサイズ倍率（表示用）
    var sizeMultiplier: Double {
        switch self {
        case .baby:  return 0.6
        case .child: return 0.75
        case .teen:  return 0.9
        case .adult: return 1.0
        case .elder: return 1.1
        }
    }

    /// 成長段階の進捗率（0.0〜1.0）
    func progress(currentDays: Int) -> Double {
        guard let next = nextStage else { return 1.0 }
        let stageStart = Double(requiredDays)
        let stageEnd = Double(next.requiredDays)
        let current = Double(min(currentDays, next.requiredDays))
        guard stageEnd > stageStart else { return 1.0 }
        return (current - stageStart) / (stageEnd - stageStart)
    }
}

/// キャラクターの成長データ
struct CharacterGrowthData: Codable {
    var characterId: String
    var startDate: Date
    var totalDaysActive: Int
    var currentStage: GrowthStage
    var feedCount: Int      // エサをあげた回数（ボーナス）
    var playCount: Int      // 遊んだ回数（ボーナス）

    init(characterId: String) {
        self.characterId = characterId
        self.startDate = Date()
        self.totalDaysActive = 0
        self.currentStage = .baby
        self.feedCount = 0
        self.playCount = 0
    }

    /// 今日の日数を更新
    mutating func updateDays() {
        let calendar = Calendar.current
        let days = calendar.dateComponents([.day], from: startDate, to: Date()).day ?? 0
        totalDaysActive = days
        currentStage = GrowthStage.fromDays(days)
    }

    /// 完全なアセットキーを生成
    func assetKey(weather: String, battery: String, schedule: String, frame: Int) -> String {
        return "\(characterId)_\(currentStage.assetSuffix)_\(weather)_\(battery)_\(schedule)_frame\(frame)"
    }
}
