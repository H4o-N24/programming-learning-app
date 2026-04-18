// BatteryState.swift
// PixelLife
//
// バッテリー残量に基づくキャラクターの元気度/表情を定義

import Foundation

/// バッテリー状態（5種類）
/// キャラクターの動き、表情、エフェクトに影響
enum BatteryState: String, Codable, CaseIterable {
    /// 76%〜100% - 元気いっぱい
    case max = "Max"
    /// 51%〜75% - 普通に元気
    case high = "High"
    /// 26%〜50% - 少し疲れ気味
    case medium = "Medium"
    /// 0%〜25% - 疲れている
    case low = "Low"
    /// 充電中 - 回復中の特別状態
    case charging = "Charging"

    /// バッテリーレベルと充電状態から自動変換
    /// - Parameters:
    ///   - level: バッテリーレベル (0.0〜1.0)
    ///   - isCharging: 充電中かどうか
    init(level: Float, isCharging: Bool) {
        if isCharging {
            self = .charging
            return
        }
        switch level {
        case 0.76...1.0:
            self = .max
        case 0.51..<0.76:
            self = .high
        case 0.26..<0.51:
            self = .medium
        default:
            self = .low
        }
    }

    /// 表示用の日本語名
    var displayName: String {
        switch self {
        case .max: return "元気MAX"
        case .high: return "元気"
        case .medium: return "普通"
        case .low: return "疲れ気味"
        case .charging: return "充電中"
        }
    }

    /// 表示用のアイコン名
    var iconName: String {
        switch self {
        case .max: return "battery.100"
        case .high: return "battery.75"
        case .medium: return "battery.50"
        case .low: return "battery.25"
        case .charging: return "battery.100.bolt"
        }
    }

    /// キャラクターの表情に対応するサフィックス
    var expressionSuffix: String {
        switch self {
        case .max: return "happy"
        case .high: return "normal"
        case .medium: return "tired"
        case .low: return "sleepy"
        case .charging: return "recovering"
        }
    }
}
