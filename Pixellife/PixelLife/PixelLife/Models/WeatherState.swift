// WeatherState.swift
// PixelLife
//
// 天気に基づく背景/シチュエーションを定義

import Foundation

/// 天気状態（5種類）
/// 背景の風景、ライティング、小物に影響
enum WeatherState: String, Codable, CaseIterable {
    /// 晴れ - 明るい背景
    case sunny = "Sunny"
    /// 曇り - やや暗い背景
    case cloudy = "Cloudy"
    /// 雨 - 雨の背景エフェクト
    case rainy = "Rainy"
    /// 雪 - 雪の背景エフェクト
    case snowy = "Snowy"
    /// 警報 - 荒天・特別な背景
    case warning = "Warning"

    /// OpenWeatherMap の weather condition code から変換
    /// https://openweathermap.org/weather-conditions
    /// - Parameter code: OpenWeatherMap weather condition ID
    init(fromWeatherCode code: Int) {
        switch code {
        case 200...232:
            // Thunderstorm
            self = .warning
        case 300...321:
            // Drizzle
            self = .rainy
        case 500...531:
            // Rain
            self = .rainy
        case 600...622:
            // Snow
            self = .snowy
        case 701...781:
            // Atmosphere (霧、砂嵐など)
            if code >= 762 {
                self = .warning // 火山灰、竜巻など
            } else {
                self = .cloudy
            }
        case 800:
            // Clear sky
            self = .sunny
        case 801...804:
            // Clouds
            self = .cloudy
        default:
            self = .sunny
        }
    }

    /// 表示用の日本語名
    var displayName: String {
        switch self {
        case .sunny: return "晴れ"
        case .cloudy: return "曇り"
        case .rainy: return "雨"
        case .snowy: return "雪"
        case .warning: return "警報"
        }
    }

    /// 表示用のアイコン名（SF Symbols）
    var iconName: String {
        switch self {
        case .sunny: return "sun.max.fill"
        case .cloudy: return "cloud.fill"
        case .rainy: return "cloud.rain.fill"
        case .snowy: return "cloud.snow.fill"
        case .warning: return "exclamationmark.triangle.fill"
        }
    }

    /// 背景に対応するプレフィックス
    var backgroundPrefix: String {
        switch self {
        case .sunny: return "bg_sunny"
        case .cloudy: return "bg_cloudy"
        case .rainy: return "bg_rainy"
        case .snowy: return "bg_snowy"
        case .warning: return "bg_warning"
        }
    }
}
