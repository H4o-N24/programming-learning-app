// SharedDataManager.swift
// PixelLife (Shared)
//
// App Group UserDefaults を使った
// メインアプリとウィジェット間のデータ共有マネージャー

import Foundation

/// 共有データマネージャー
/// App Group を介してメインアプリとウィジェット拡張機能間でデータを共有
final class SharedDataManager {
    static let shared = SharedDataManager()

    /// App Group の識別子
    /// TODO: Apple Developer Portal で作成した App Group ID に置き換え
    private let appGroupID = "group.com.pixellife.shared"

    /// App Group UserDefaults
    private lazy var sharedDefaults: UserDefaults? = {
        UserDefaults(suiteName: appGroupID)
    }()

    private init() {}

    // MARK: - Keys

    private enum Keys {
        static let batteryState = "battery_state"
        static let weatherState = "weather_state"
        static let scheduleState = "schedule_state"
        static let subscriptionTier = "subscription_tier"
        static let currentCharacter = "current_character"
        static let nextEventTitle = "next_event_title"
        static let lastUpdateTime = "last_update_time"
        static let useAnimation = "use_animation"
        static let currentTheme = "current_theme"
    }

    // MARK: - バッテリー状態

    func saveBatteryState(_ state: BatteryState) {
        sharedDefaults?.set(state.rawValue, forKey: Keys.batteryState)
        updateTimestamp()
    }

    func loadBatteryState() -> BatteryState {
        guard let raw = sharedDefaults?.string(forKey: Keys.batteryState),
              let state = BatteryState(rawValue: raw) else {
            return .high
        }
        return state
    }

    // MARK: - 天気状態

    func saveWeatherState(_ state: WeatherState) {
        sharedDefaults?.set(state.rawValue, forKey: Keys.weatherState)
        updateTimestamp()
    }

    func loadWeatherState() -> WeatherState {
        guard let raw = sharedDefaults?.string(forKey: Keys.weatherState),
              let state = WeatherState(rawValue: raw) else {
            return .sunny
        }
        return state
    }

    // MARK: - 予定状態

    func saveScheduleState(_ state: ScheduleState) {
        sharedDefaults?.set(state.rawValue, forKey: Keys.scheduleState)
        updateTimestamp()
    }

    func loadScheduleState() -> ScheduleState {
        guard let raw = sharedDefaults?.string(forKey: Keys.scheduleState),
              let state = ScheduleState(rawValue: raw) else {
            return .none
        }
        return state
    }

    // MARK: - サブスクリプション

    func saveSubscriptionTier(_ tier: SubscriptionTier) {
        sharedDefaults?.set(tier.rawValue, forKey: Keys.subscriptionTier)
    }

    func loadSubscriptionTier() -> SubscriptionTier {
        guard let raw = sharedDefaults?.string(forKey: Keys.subscriptionTier),
              let tier = SubscriptionTier(rawValue: raw) else {
            return .basic
        }
        return tier
    }

    // MARK: - キャラクター

    func saveCurrentCharacter(_ name: String) {
        sharedDefaults?.set(name, forKey: Keys.currentCharacter)
    }

    func loadCurrentCharacter() -> String {
        return sharedDefaults?.string(forKey: Keys.currentCharacter) ?? "pixel_chan"
    }

    // MARK: - 次のイベント

    func saveNextEventTitle(_ title: String) {
        sharedDefaults?.set(title, forKey: Keys.nextEventTitle)
    }

    func loadNextEventTitle() -> String? {
        return sharedDefaults?.string(forKey: Keys.nextEventTitle)
    }

    // MARK: - アニメーション設定

    func saveUseAnimation(_ enabled: Bool) {
        sharedDefaults?.set(enabled, forKey: Keys.useAnimation)
    }

    func loadUseAnimation() -> Bool {
        return sharedDefaults?.bool(forKey: Keys.useAnimation) ?? false
    }

    // MARK: - テーマ

    func saveCurrentTheme(_ theme: String) {
        sharedDefaults?.set(theme, forKey: Keys.currentTheme)
    }

    func loadCurrentTheme() -> String {
        return sharedDefaults?.string(forKey: Keys.currentTheme) ?? "default"
    }

    // MARK: - 統合状態の読み込み

    /// メインアプリから保存された全状態を統合して PixelLifeState を生成
    func loadCurrentState() -> PixelLifeState {
        return PixelLifeState(
            battery: loadBatteryState(),
            weather: loadWeatherState(),
            schedule: loadScheduleState()
        )
    }

    // MARK: - タイムスタンプ

    private func updateTimestamp() {
        sharedDefaults?.set(Date(), forKey: Keys.lastUpdateTime)
    }

    func lastUpdateTime() -> Date? {
        return sharedDefaults?.object(forKey: Keys.lastUpdateTime) as? Date
    }
}
