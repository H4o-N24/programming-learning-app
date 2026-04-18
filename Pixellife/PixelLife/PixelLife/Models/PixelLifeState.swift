// PixelLifeState.swift
// PixelLife
//
// バッテリー・天気・予定の3つの状態を統合し、
// ウィジェット表示に必要な情報を管理する統合モデル

import Foundation

/// ピクセルライフの統合状態
/// 3つの状態変数の組み合わせで100パターンの表示を実現
struct PixelLifeState: Codable, Equatable {
    let battery: BatteryState
    let weather: WeatherState
    let schedule: ScheduleState
    let timestamp: Date

    init(battery: BatteryState, weather: WeatherState, schedule: ScheduleState) {
        self.battery = battery
        self.weather = weather
        self.schedule = schedule
        self.timestamp = Date()
    }

    /// アセットキー（状態の一意識別子）
    /// 例: "sunny_max_work", "rainy_low_none"
    var assetKey: String {
        return "\(weather.rawValue.lowercased())_\(battery.rawValue.lowercased())_\(schedule.rawValue.lowercased())"
    }

    /// アニメーションフレーム用のアセットキー配列
    /// - Parameter frameCount: フレーム数 (2〜4)
    /// - Returns: フレーム番号付きのアセットキー配列
    func frameKeys(frameCount: Int = 4) -> [String] {
        return (0..<frameCount).map { "\(assetKey)_frame\($0)" }
    }

    /// 状態の説明文（デバッグ・プレビュー用）
    var description: String {
        return "[\(weather.displayName)] × [\(battery.displayName)] × [\(schedule.displayName)]"
    }

    /// デフォルト状態（初回起動時やデータ未取得時）
    static let `default` = PixelLifeState(
        battery: .high,
        weather: .sunny,
        schedule: .none
    )
}

// MARK: - 状態パターン数の検証

extension PixelLifeState {
    /// 全状態の組み合わせ数
    static var totalPatterns: Int {
        return BatteryState.allCases.count *
               WeatherState.allCases.count *
               ScheduleState.allCases.count
    }

    /// 全状態の組み合わせを生成（アセット生成時に使用）
    static var allCombinations: [PixelLifeState] {
        var combinations: [PixelLifeState] = []
        for battery in BatteryState.allCases {
            for weather in WeatherState.allCases {
                for schedule in ScheduleState.allCases {
                    combinations.append(
                        PixelLifeState(battery: battery, weather: weather, schedule: schedule)
                    )
                }
            }
        }
        return combinations
    }
}
