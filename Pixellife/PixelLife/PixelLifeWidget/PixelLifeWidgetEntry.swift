// PixelLifeWidgetEntry.swift
// PixelLifeWidget
//
// WidgetKit の TimelineEntry 定義

import WidgetKit
import Foundation

/// ウィジェットのタイムラインエントリ
/// WidgetKit が各更新タイミングで使用するデータモデル
struct PixelLifeWidgetEntry: TimelineEntry {
    /// 表示される日時
    let date: Date
    /// キャラクター名
    let characterName: String
    /// 統合状態
    let state: PixelLifeState
    /// アニメーションフレーム番号
    let frameIndex: Int
    /// サブスクリプションティア
    let subscriptionTier: SubscriptionTier
    /// 次のイベントのタイトル
    let nextEventTitle: String?
    /// アニメーション有効フラグ
    let useAnimation: Bool

    /// アセットキー（キャラクター画像の識別子）
    var assetName: String {
        return "\(characterName)_\(state.assetKey)_frame\(frameIndex)"
    }

    /// 背景アセットキー
    var backgroundAssetName: String {
        return "\(state.weather.backgroundPrefix)_frame\(frameIndex)"
    }

    /// シーン情報
    var sceneInfo: StateMapping.SceneInfo {
        return StateMapping.sceneInfo(for: state)
    }

    /// プレビュー用のサンプルエントリ
    static var preview: PixelLifeWidgetEntry {
        PixelLifeWidgetEntry(
            date: Date(),
            characterName: "pixel_chan",
            state: PixelLifeState(battery: .high, weather: .sunny, schedule: .none),
            frameIndex: 0,
            subscriptionTier: .premium,
            nextEventTitle: "チームミーティング",
            useAnimation: true
        )
    }

    /// プレースホルダー用のエントリ
    static var placeholder: PixelLifeWidgetEntry {
        PixelLifeWidgetEntry(
            date: Date(),
            characterName: "pixel_chan",
            state: .default,
            frameIndex: 0,
            subscriptionTier: .basic,
            nextEventTitle: nil,
            useAnimation: false
        )
    }
}
