// PixelLifeWidget.swift
// PixelLifeWidget
//
// ウィジェット定義
// 小/中/大の3サイズに対応するウィジェットを定義

import WidgetKit
import SwiftUI

/// ピクセルライフ ウィジェット
@main
struct PixelLifeWidgetBundle: WidgetBundle {
    var body: some Widget {
        PixelLifeWidget()
    }
}

struct PixelLifeWidget: Widget {
    let kind: String = "PixelLifeWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: PixelLifeTimelineProvider()) { entry in
            PixelLifeWidgetEntryView(entry: entry)
                .containerBackground(.fill.tertiary, for: .widget)
        }
        .configurationDisplayName("ピクセルライフ")
        .description("バッテリー、天気、予定に連動して変化するドット絵キャラクター")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

// MARK: - ウィジェットエントリービュー（サイズ振り分け）

struct PixelLifeWidgetEntryView: View {
    var entry: PixelLifeWidgetEntry
    @Environment(\.widgetFamily) var family

    var body: some View {
        switch family {
        case .systemSmall:
            SmallWidgetView(entry: entry)
        case .systemMedium:
            MediumWidgetView(entry: entry)
        case .systemLarge:
            LargeWidgetView(entry: entry)
        default:
            SmallWidgetView(entry: entry)
        }
    }
}

// MARK: - プレビュー

#Preview(as: .systemSmall) {
    PixelLifeWidget()
} timeline: {
    PixelLifeWidgetEntry.preview
}

#Preview(as: .systemMedium) {
    PixelLifeWidget()
} timeline: {
    PixelLifeWidgetEntry.preview
}

#Preview(as: .systemLarge) {
    PixelLifeWidget()
} timeline: {
    PixelLifeWidgetEntry.preview
}
