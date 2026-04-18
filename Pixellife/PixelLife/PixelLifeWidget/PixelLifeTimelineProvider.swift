// PixelLifeTimelineProvider.swift
// PixelLifeWidget
//
// TimelineProvider の実装
// バッテリー、天気、カレンダーの状態に基づいて
// ウィジェットの更新タイムラインを生成

import WidgetKit
import Foundation

/// ウィジェットのタイムラインプロバイダー
/// 15〜30分ごとの自動更新と、アニメーション用のフレーム切り替えを管理
struct PixelLifeTimelineProvider: TimelineProvider {

    typealias Entry = PixelLifeWidgetEntry

    /// プレースホルダー（ウィジェット追加時の初期表示）
    func placeholder(in context: Context) -> PixelLifeWidgetEntry {
        return .placeholder
    }

    /// スナップショット（ウィジェットギャラリーでの表示）
    func getSnapshot(in context: Context, completion: @escaping (PixelLifeWidgetEntry) -> Void) {
        let entry = createEntry(date: Date(), frameIndex: 0)
        completion(entry)
    }

    /// タイムライン生成（定期更新の本体）
    func getTimeline(in context: Context, completion: @escaping (Timeline<PixelLifeWidgetEntry>) -> Void) {
        let currentDate = Date()
        let sharedData = SharedDataManager.shared
        let tier = sharedData.loadSubscriptionTier()
        let useAnimation = sharedData.loadUseAnimation() && tier.canUseAnimation

        var entries: [PixelLifeWidgetEntry] = []

        if useAnimation {
            // アニメーション有効: 数秒間のフレーム切り替えエントリを生成
            // 更新タイミングで4フレーム分のアニメーションを再生
            let animationDuration: TimeInterval = 2.0 // 2秒間
            let frameInterval = animationDuration / Double(AssetManager.frameCount)

            for frameIndex in 0..<AssetManager.frameCount {
                let entryDate = currentDate.addingTimeInterval(frameInterval * Double(frameIndex))
                let entry = createEntry(date: entryDate, frameIndex: frameIndex)
                entries.append(entry)
            }

            // アニメーション終了後は最初のフレームで固定
            let afterAnimation = currentDate.addingTimeInterval(animationDuration)
            entries.append(createEntry(date: afterAnimation, frameIndex: 0))
        } else {
            // アニメーション無効: 静止画のみ
            entries.append(createEntry(date: currentDate, frameIndex: 0))
        }

        // 次の更新タイミング
        let updateInterval = TimeInterval(tier.updateIntervalMinutes * 60)
        let nextUpdate = currentDate.addingTimeInterval(updateInterval)

        let timeline = Timeline(entries: entries, policy: .after(nextUpdate))
        completion(timeline)
    }

    // MARK: - エントリ生成

    /// 共有データからエントリを生成
    private func createEntry(date: Date, frameIndex: Int) -> PixelLifeWidgetEntry {
        let sharedData = SharedDataManager.shared

        let batteryState = sharedData.loadBatteryState()
        let weatherState = sharedData.loadWeatherState()
        let scheduleState = sharedData.loadScheduleState()
        let characterName = sharedData.loadCurrentCharacter()
        let tier = sharedData.loadSubscriptionTier()
        let nextEvent = sharedData.loadNextEventTitle()
        let useAnimation = sharedData.loadUseAnimation()

        let state = PixelLifeState(
            battery: batteryState,
            weather: weatherState,
            schedule: scheduleState
        )

        return PixelLifeWidgetEntry(
            date: date,
            characterName: characterName,
            state: state,
            frameIndex: frameIndex,
            subscriptionTier: tier,
            nextEventTitle: nextEvent,
            useAnimation: useAnimation
        )
    }
}
