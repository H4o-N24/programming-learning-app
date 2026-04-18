// LargeWidgetView.swift
// PixelLifeWidget
//
// 大サイズウィジェットビュー
// キャラクター、詳細ステータス、予定情報を表示

import SwiftUI
import WidgetKit

/// 大サイズウィジェット（プレミアム版で利用可能）
/// 大きなキャラクター表示と全ステータス情報を表示
struct LargeWidgetView: View {
    let entry: PixelLifeWidgetEntry

    var body: some View {
        ZStack {
            // 背景
            backgroundGradient

            VStack(spacing: 12) {
                // 上部: キャラクターと背景のメインエリア
                mainCharacterArea

                // 下部: 詳細情報
                detailInfoArea
            }
            .padding(16)
        }
    }

    // MARK: - メインキャラクターエリア

    private var mainCharacterArea: some View {
        ZStack {
            // 背景画像（あれば）
            RoundedRectangle(cornerRadius: 16)
                .fill(Color.white.opacity(0.1))

            VStack(spacing: 8) {
                // キャラクター画像
                characterImage
                    .frame(width: 120, height: 120)

                // シーンタイトル
                Text(entry.sceneInfo.title)
                    .font(.subheadline)
                    .fontWeight(.bold)
                    .foregroundColor(.white)

                // シーン説明
                Text(entry.sceneInfo.description)
                    .font(.caption)
                    .foregroundColor(.white.opacity(0.8))
                    .lineLimit(2)
                    .multilineTextAlignment(.center)
            }
            .padding()
        }
        .frame(maxHeight: .infinity)
    }

    private var characterImage: some View {
        Group {
            if let uiImage = UIImage(named: entry.assetName) {
                Image(uiImage: uiImage)
                    .resizable()
                    .interpolation(.none)
                    .scaledToFit()
            } else {
                ZStack {
                    Circle()
                        .fill(Color.white.opacity(0.15))
                        .frame(width: 100, height: 100)

                    Image(systemName: fallbackIcon)
                        .font(.system(size: 52))
                        .foregroundColor(.white)
                }
            }
        }
    }

    // MARK: - 詳細情報エリア

    private var detailInfoArea: some View {
        VStack(spacing: 8) {
            // ステータスカード横並び
            HStack(spacing: 8) {
                statusCard(
                    icon: entry.state.battery.iconName,
                    title: "バッテリー",
                    value: entry.state.battery.displayName,
                    color: batteryColor
                )

                statusCard(
                    icon: entry.state.weather.iconName,
                    title: "天気",
                    value: entry.state.weather.displayName,
                    color: .cyan
                )

                statusCard(
                    icon: entry.state.schedule.iconName,
                    title: "予定",
                    value: entry.state.schedule.displayName,
                    color: .purple
                )
            }

            // 次の予定情報
            if let nextEvent = entry.nextEventTitle,
               entry.subscriptionTier.canAccessCalendar {
                HStack(spacing: 6) {
                    Image(systemName: "calendar")
                        .font(.caption2)
                        .foregroundColor(.white.opacity(0.7))

                    Text("次の予定: \(nextEvent)")
                        .font(.caption2)
                        .foregroundColor(.white.opacity(0.7))
                        .lineLimit(1)

                    Spacer()
                }
                .padding(.horizontal, 4)
            }

            // 雰囲気テキスト
            HStack {
                Text("🌟 \(entry.sceneInfo.mood)な気分")
                    .font(.caption2)
                    .foregroundColor(.white.opacity(0.6))
                Spacer()
            }
            .padding(.horizontal, 4)
        }
    }

    private func statusCard(icon: String, title: String, value: String, color: Color) -> some View {
        VStack(spacing: 4) {
            Image(systemName: icon)
                .font(.caption)
                .foregroundColor(color)

            Text(title)
                .font(.system(size: 8))
                .foregroundColor(.white.opacity(0.6))

            Text(value)
                .font(.caption2)
                .fontWeight(.semibold)
                .foregroundColor(.white)
                .lineLimit(1)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 8)
        .background(Color.white.opacity(0.1))
        .cornerRadius(10)
    }

    // MARK: - ヘルパー

    private var backgroundGradient: some View {
        LinearGradient(
            colors: backgroundColors,
            startPoint: .top,
            endPoint: .bottom
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
        case .sunny: return [Color(hex: "4FC3F7"), Color(hex: "81D4FA"), Color(hex: "E0F7FA")]
        case .cloudy: return [Color(hex: "78909C"), Color(hex: "90A4AE"), Color(hex: "CFD8DC")]
        case .rainy: return [Color(hex: "37474F"), Color(hex: "546E7A"), Color(hex: "78909C")]
        case .snowy: return [Color(hex: "90A4AE"), Color(hex: "B0BEC5"), Color(hex: "ECEFF1")]
        case .warning: return [Color(hex: "263238"), Color(hex: "37474F"), Color(hex: "455A64")]
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
