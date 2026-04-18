// SmallWidgetView.swift
// PixelLifeWidget
//
// 小サイズウィジェットビュー
// コンパクトなドット絵表示

import SwiftUI
import WidgetKit

/// 小サイズウィジェット（無料版で利用可能）
/// キャラクターと最小限のステータス情報を表示
struct SmallWidgetView: View {
    let entry: PixelLifeWidgetEntry

    var body: some View {
        ZStack {
            // 背景（天気に応じたグラデーション）
            backgroundGradient

            VStack(spacing: 4) {
                Spacer()

                // キャラクター画像
                characterImage
                    .frame(width: 60, height: 60)

                Spacer()

                // ステータスバー
                HStack(spacing: 8) {
                    // バッテリーアイコン
                    Image(systemName: entry.state.battery.iconName)
                        .font(.caption2)
                        .foregroundColor(batteryColor)

                    // 天気アイコン
                    Image(systemName: entry.state.weather.iconName)
                        .font(.caption2)
                        .foregroundColor(.white.opacity(0.9))

                    // 予定アイコン
                    if entry.subscriptionTier.canAccessCalendar {
                        Image(systemName: entry.state.schedule.iconName)
                            .font(.caption2)
                            .foregroundColor(.white.opacity(0.9))
                    }
                }
                .padding(.bottom, 4)
            }
            .padding(8)
        }
    }

    // MARK: - コンポーネント

    private var characterImage: some View {
        Group {
            if let uiImage = UIImage(named: entry.assetName) {
                Image(uiImage: uiImage)
                    .resizable()
                    .interpolation(.none) // ドット絵のピクセルを鮮明に
                    .scaledToFit()
            } else {
                // フォールバック: SF Symbol
                Image(systemName: fallbackIcon)
                    .font(.system(size: 36))
                    .foregroundColor(.white)
            }
        }
    }

    private var backgroundGradient: some View {
        LinearGradient(
            colors: backgroundColors,
            startPoint: .top,
            endPoint: .bottom
        )
    }

    // MARK: - ヘルパー

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

// MARK: - Color Extension

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3:
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6:
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8:
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}
