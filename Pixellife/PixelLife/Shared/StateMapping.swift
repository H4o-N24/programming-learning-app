// StateMapping.swift
// PixelLife (Shared)
//
// 100パターンのアセットキー→ファイル名マッピングテーブル

import Foundation

/// 状態マッピングテーブル
/// 各状態の組み合わせに対する具体的な描写・シーン情報を管理
struct StateMapping {

    /// シーン情報
    struct SceneInfo {
        let title: String           // シーンタイトル
        let description: String     // キャラクターの状態説明
        let backgroundDesc: String  // 背景の説明
        let mood: String            // 雰囲気
    }

    /// 状態の組み合わせからシーン情報を取得
    static func sceneInfo(for state: PixelLifeState) -> SceneInfo {
        let battery = state.battery
        let weather = state.weather
        let schedule = state.schedule

        // 天気 × 予定の組み合わせで場所/背景を決定
        let location = locationDescription(weather: weather, schedule: schedule)
        // バッテリーでキャラクターの表情/動きを決定
        let characterMood = moodDescription(battery: battery)

        return SceneInfo(
            title: "\(weather.displayName)の\(schedule.displayName)",
            description: characterMood,
            backgroundDesc: location,
            mood: overallMood(battery: battery, weather: weather)
        )
    }

    /// AI画像生成用のプロンプトを生成
    /// 仕様書のデザインガイドラインに準拠したプロンプト
    static func generatePrompt(for state: PixelLifeState, character: String = "pixel_chan") -> String {
        let scene = sceneInfo(for: state)

        return """
        8-bit pixel art style, low resolution, chunky pixels,
        muted colors, pastel tones, low saturation, soft lighting,
        sophisticated and easy on the eyes,
        a cute \(character) character \(scene.description),
        background: \(scene.backgroundDesc),
        mood: \(scene.mood),
        PNG-8 format, transparent background option
        """
    }

    // MARK: - 場所の描写

    private static func locationDescription(weather: WeatherState, schedule: ScheduleState) -> String {
        switch (weather, schedule) {
        // 晴れ
        case (.sunny, .none):
            return "明るい部屋の窓際、太陽の光が差し込む"
        case (.sunny, .work):
            return "明るいオフィス、窓から青空が見える"
        case (.sunny, .private):
            return "公園のベンチ、木漏れ日が差す"
        case (.sunny, .travel):
            return "電車の窓から見える青空と街並み"

        // 曇り
        case (.cloudy, .none):
            return "やや薄暗い部屋、窓の外は曇り空"
        case (.cloudy, .work):
            return "室内のデスク、落ち着いた雰囲気"
        case (.cloudy, .private):
            return "カフェの窓際、曇り空を眺める"
        case (.cloudy, .travel):
            return "駅のホーム、曇り空の下"

        // 雨
        case (.rainy, .none):
            return "部屋の中、窓に雨粒が流れる"
        case (.rainy, .work):
            return "雨の日のオフィス、デスクライトが灯る"
        case (.rainy, .private):
            return "室内のソファ、雨音が聞こえる"
        case (.rainy, .travel):
            return "傘をさして歩く雨の街並み"

        // 雪
        case (.snowy, .none):
            return "暖かい部屋、窓の外に雪が降る"
        case (.snowy, .work):
            return "暖房の効いたオフィス、窓の外は雪景色"
        case (.snowy, .private):
            return "雪の積もった庭を眺める暖かい部屋"
        case (.snowy, .travel):
            return "マフラーを巻いて歩く雪の街"

        // 警報
        case (.warning, .none):
            return "安全な部屋の中、嵐の音が聞こえる"
        case (.warning, .work):
            return "室内で作業、窓の外は荒天"
        case (.warning, .private):
            return "部屋の中で過ごす、天気が荒れている"
        case (.warning, .travel):
            return "室内に避難、天気の回復を待つ"
        }
    }

    // MARK: - キャラクターの気分

    private static func moodDescription(battery: BatteryState) -> String {
        switch battery {
        case .max:
            return "とても元気、笑顔で活発に動く"
        case .high:
            return "元気、にこやかに過ごしている"
        case .medium:
            return "少し疲れ気味、穏やかな表情"
        case .low:
            return "疲れている、うとうとしている"
        case .charging:
            return "充電中、キラキラ回復エフェクト"
        }
    }

    // MARK: - 全体の雰囲気

    private static func overallMood(battery: BatteryState, weather: WeatherState) -> String {
        switch (weather, battery) {
        case (.sunny, .max), (.sunny, .high):
            return "明るく活気のある"
        case (.sunny, .medium), (.sunny, .low):
            return "穏やかで暖かい"
        case (.cloudy, .max), (.cloudy, .high):
            return "落ち着いた"
        case (.cloudy, .medium), (.cloudy, .low):
            return "静かでまったりした"
        case (.rainy, _):
            return "しっとりとした"
        case (.snowy, _):
            return "ほっこり温かみのある"
        case (.warning, _):
            return "少し緊張感のある"
        default:
            return "穏やかな"
        }
    }
}
