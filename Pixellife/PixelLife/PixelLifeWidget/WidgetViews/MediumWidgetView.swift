// MediumWidgetView.swift
// PixelLifeWidget
//
// 中サイズウィジェットビュー
// キャラクターとステータス情報を横並び表示

import SwiftUI
import WidgetKit

/// 中サイズウィジェット（プレミアム版で利用可能）
/// キャラクターと詳細なステータス情報を表示
struct MediumWidgetView: View {
    let entry: PixelLifeWidgetEntry

    var body: some View {
        ZStack {
            // 背景
            backgroundGradient

            HStack(spacing: 16) {
                // 左側: キャラクター
                characterSection
                    .frame(maxWidth: .infinity)

                // 右側: 情報表示
                infoSection
                    .frame(maxWidth: .infinity)
            }
            .padding(12)
        }
    }

    // MARK: - キャラクターセクション

    private var characterSection: some View {
        VStack(spacing: 4) {
            // キャラクター画像
            characterImage
                .frame(width: 80, height: 80)

            // シーンタイトル
            Text(entry.sceneInfo.title)
                .font(.caption2)
                .fontWeight(.medium)
                .foregroundColor(.white)
                .lineLimit(1)
        }
    }

    private var characterImage: some View {
        Group {
            if let uiImage = UIImage(named: entry.assetName) {
                Image(uiImage: uiImage)
                    .resizable()
                    .interpolation(.none)
                    .scaledToFit()
            } else {
                Image(systemName: fallbackIcon)
                    .font(.system(size: 44))
                    .foregroundColor(.white)
            }
        }
    }

    // MARK: - 情報セクション

    private var infoSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            // バッテリー
            statusRow(
                icon: entry.state.battery.iconName,
                label: entry.state.battery.displayName,
                color: batteryColor
            )

            // 天気
            statusRow(
                icon: entry.state.weather.iconName,
                label: entry.state.weather.displayName,
                color: .cyan
            )

            // 予定
            if entry.subscriptionTier.canAccessCalendar {
                statusRow(
                    icon: entry.state.schedule.iconName,
                    label: entry.nextEventTitle ?? entry.state.schedule.displayName,
                    color: .purple
                )
            }

            // 気分
            Text(entry.sceneInfo.mood)
                .font(.system(size: 9))
                .foregroundColor(.white.opacity(0.7))
                .lineLimit(1)
        }
    }

    private func statusRow(icon: String, label: String, color: Color) -> some View {
        HStack(spacing: 6) {
            Image(systemName: icon)
                .font(.caption2)
                .foregroundColor(color)
                .frame(width: 14)

            Text(label)
                .font(.caption2)
                .foregroundColor(.white.opacity(0.9))
                .lineLimit(1)
        }
    }

    // MARK: - ヘルパー

    private var backgroundGradient: some View {
        LinearGradient(
            colors: backgroundColors,
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    }

    private var batteryColor: Color {
        switch entry.state.battery {
        case .max, .high: return .green
        case .medium: return .yellow
        case .low: return .red
        case .charging: return .cyan
        }
    }

    private var backgroundColors: [Color] {
        switch entry.state.weather {
        case .sunny: return [Color(hex: "87CEEB"), Color(hex: "E0F7FA")]
        case .cloudy: return [Color(hex: "90A4AE"), Color(hex: "CFD8DC")]
        case .rainy: return [Color(hex: "546E7A"), Color(hex: "78909C")]
        case .snowy: return [Color(hex: "B0BEC5"), Color(hex: "ECEFF1")]
        case .warning: return [Color(hex: "455A64"), Color(hex: "607D8B")]
        }
    }

    private var fallbackIcon: String {
        switch entry.state.battery {
        case .max: return "face.smiling.inverse"
        case .high: return "face.smiling"
        case .medium: return "face.dashed"
        case .low: return "zzz"
        case .charging: return "bolt.fill"
        }
    }
}
