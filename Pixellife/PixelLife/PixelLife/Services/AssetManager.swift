// AssetManager.swift
// PixelLife
//
// ドット絵アセットの選択とアニメーション管理

import Foundation
import SwiftUI

/// アセット管理サービス
/// 100パターンの状態に対応するドット絵画像の選択と
/// 2〜4フレームのアニメーション管理を担当
final class AssetManager: ObservableObject {
    /// キャラクター名一覧
    static let characters = [
        "pixel_chan",  // デフォルトキャラクター
        "pixel_kun",
        "pixel_neko",
        "pixel_inu",
        "pixel_usagi",
        "pixel_kuma",
        "pixel_panda",
        "pixel_tori",
        "pixel_sakana",
        "pixel_robo"
    ]

    /// 現在選択中のキャラクター
    @Published var currentCharacter: String = "pixel_chan"
    /// アニメーションの現在フレーム
    @Published private(set) var currentFrame: Int = 0

    private var animationTimer: Timer?

    /// アニメーションフレーム数
    static let frameCount = 4

    /// アニメーション間隔（秒）- 1秒に2〜4フレーム
    static let animationInterval: TimeInterval = 0.4

    // MARK: - アセットキー生成

    /// 状態に対応する画像アセット名を取得
    /// - Parameters:
    ///   - state: 現在のピクセルライフ状態
    ///   - frame: フレーム番号 (0〜3)
    /// - Returns: アセット名（例: "pixel_chan_sunny_max_work_frame0"）
    func assetName(for state: PixelLifeState, frame: Int = 0) -> String {
        return "\(currentCharacter)_\(state.assetKey)_frame\(frame)"
    }

    /// 背景アセット名を取得
    /// - Parameters:
    ///   - weather: 天気状態
    ///   - frame: フレーム番号
    /// - Returns: 背景アセット名
    func backgroundAssetName(for weather: WeatherState, frame: Int = 0) -> String {
        return "\(weather.backgroundPrefix)_frame\(frame)"
    }

    /// キャラクター画像を取得（アセットカタログから）
    /// - Parameters:
    ///   - state: 現在の状態
    ///   - frame: フレーム番号
    /// - Returns: UIImage（見つからない場合はプレースホルダー）
    func characterImage(for state: PixelLifeState, frame: Int = 0) -> Image {
        let name = assetName(for: state, frame: frame)
        // アセットカタログから画像を検索
        // 見つからない場合はデフォルト画像を返す
        if let _ = UIImage(named: name) {
            return Image(name)
        } else {
            return Image(systemName: characterFallbackIcon(for: state))
        }
    }

    /// 背景画像を取得
    /// - Parameters:
    ///   - weather: 天気状態
    ///   - frame: フレーム番号
    /// - Returns: UIImage
    func backgroundImage(for weather: WeatherState, frame: Int = 0) -> Image {
        let name = backgroundAssetName(for: weather, frame: frame)
        if let _ = UIImage(named: name) {
            return Image(name)
        } else {
            return Image(systemName: weather.iconName)
        }
    }

    // MARK: - アニメーション制御

    /// アニメーションを開始
    func startAnimation() {
        stopAnimation()
        animationTimer = Timer.scheduledTimer(
            withTimeInterval: Self.animationInterval,
            repeats: true
        ) { [weak self] _ in
            guard let self = self else { return }
            DispatchQueue.main.async {
                self.currentFrame = (self.currentFrame + 1) % Self.frameCount
            }
        }
    }

    /// アニメーションを停止
    func stopAnimation() {
        animationTimer?.invalidate()
        animationTimer = nil
        currentFrame = 0
    }

    // MARK: - フォールバック

    /// アセットが見つからない場合のフォールバック SF Symbol
    private func characterFallbackIcon(for state: PixelLifeState) -> String {
        switch state.battery {
        case .max: return "face.smiling.inverse"
        case .high: return "face.smiling"
        case .medium: return "face.dashed"
        case .low: return "zzz"
        case .charging: return "bolt.fill"
        }
    }

    // MARK: - アセット検証

    /// 全パターンのアセットが存在するかチェック
    /// 開発時のデバッグ用
    func validateAllAssets() -> [String] {
        var missingAssets: [String] = []

        for state in PixelLifeState.allCombinations {
            for frame in 0..<Self.frameCount {
                let name = assetName(for: state, frame: frame)
                if UIImage(named: name) == nil {
                    missingAssets.append(name)
                }
            }
        }

        return missingAssets
    }

    /// アセット統計情報
    var assetStats: String {
        let total = PixelLifeState.totalPatterns * Self.frameCount
        return "必要アセット数: \(total) (100パターン × \(Self.frameCount)フレーム)"
    }
}
