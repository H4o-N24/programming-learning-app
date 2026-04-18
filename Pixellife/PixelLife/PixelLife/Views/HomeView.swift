// HomeView.swift
// PixelLife
//
// ホーム画面 - 現在のキャラクター状態プレビューとステータス表示

import SwiftUI

struct HomeView: View {
    @EnvironmentObject var batteryService: BatteryService
    @EnvironmentObject var weatherService: WeatherService
    @EnvironmentObject var calendarService: CalendarService
    @EnvironmentObject var subscriptionService: SubscriptionService
    @EnvironmentObject var assetManager: AssetManager

    @State private var showingWidgetPreview = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // MARK: - キャラクタープレビュー
                    characterPreviewSection

                    // MARK: - 現在のステータス
                    currentStatusSection

                    // MARK: - 今日の予定
                    if subscriptionService.currentTier.canAccessCalendar {
                        todayScheduleSection
                    }

                    // MARK: - ウィジェットプレビュー
                    widgetPreviewSection
                }
                .padding()
            }
            .navigationTitle("ピクセルライフ")
            .background(Color("BackgroundMuted").ignoresSafeArea())
            .onAppear {
                Task {
                    await weatherService.fetchWeather()
                    calendarService.updateScheduleState()
                }
            }
        }
    }

    // MARK: - キャラクタープレビュー

    private var characterPreviewSection: some View {
        let currentState = PixelLifeState(
            battery: batteryService.currentState,
            weather: weatherService.currentState,
            schedule: calendarService.currentState
        )

        return VStack(spacing: 12) {
            // ドット絵キャラクター表示エリア
            ZStack {
                // 背景
                RoundedRectangle(cornerRadius: 20)
                    .fill(
                        LinearGradient(
                            colors: backgroundColors(for: weatherService.currentState),
                            startPoint: .top,
                            endPoint: .bottom
                        )
                    )
                    .frame(height: 280)

                VStack {
                    // キャラクター画像
                    assetManager.characterImage(
                        for: currentState,
                        frame: assetManager.currentFrame
                    )
                    .resizable()
                    .interpolation(.none) // ドット絵のピクセルを鮮明に表示
                    .scaledToFit()
                    .frame(width: 120, height: 120)

                    // シーン説明
                    let scene = StateMapping.sceneInfo(for: currentState)
                    Text(scene.title)
                        .font(.headline)
                        .foregroundColor(.white)
                    Text(scene.description)
                        .font(.caption)
                        .foregroundColor(.white.opacity(0.8))
                }
            }
            .shadow(color: .black.opacity(0.1), radius: 10, y: 5)
        }
        .onAppear {
            if subscriptionService.currentTier.canUseAnimation {
                assetManager.startAnimation()
            }
        }
        .onDisappear {
            assetManager.stopAnimation()
        }
    }

    // MARK: - ステータスセクション

    private var currentStatusSection: some View {
        VStack(spacing: 16) {
            Text("現在のステータス")
                .font(.headline)
                .frame(maxWidth: .infinity, alignment: .leading)

            HStack(spacing: 16) {
                statusCard(
                    icon: batteryService.currentState.iconName,
                    title: "バッテリー",
                    value: "\(batteryService.batteryPercentage)%",
                    subtitle: batteryService.currentState.displayName,
                    color: batteryColor
                )

                statusCard(
                    icon: weatherService.currentState.iconName,
                    title: "天気",
                    value: weatherService.currentState.displayName,
                    subtitle: weatherService.lastFetchedData?.cityName ?? "取得中...",
                    color: .cyan
                )

                statusCard(
                    icon: calendarService.currentState.iconName,
                    title: "予定",
                    value: calendarService.currentState.displayName,
                    subtitle: calendarService.nextEventTitle ?? "なし",
                    color: .purple
                )
            }
        }
    }

    // MARK: - 今日の予定

    private var todayScheduleSection: some View {
        VStack(spacing: 12) {
            Text("今日の予定")
                .font(.headline)
                .frame(maxWidth: .infinity, alignment: .leading)

            let events = calendarService.fetchTodayEvents()

            if events.isEmpty {
                HStack {
                    Image(systemName: "calendar")
                        .foregroundColor(.secondary)
                    Text("今日の予定はありません")
                        .foregroundColor(.secondary)
                }
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color("CardBackground"))
                .cornerRadius(12)
            } else {
                ForEach(events) { event in
                    HStack {
                        Image(systemName: event.scheduleType.iconName)
                            .foregroundColor(.accentColor)
                            .frame(width: 30)

                        VStack(alignment: .leading, spacing: 2) {
                            Text(event.title)
                                .font(.subheadline)
                                .fontWeight(.medium)
                            Text(event.timeString)
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }

                        Spacer()

                        Text(event.scheduleType.displayName)
                            .font(.caption2)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 4)
                            .background(Color.accentColor.opacity(0.15))
                            .cornerRadius(8)
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 12)
                    .background(Color("CardBackground"))
                    .cornerRadius(12)
                }
            }
        }
    }

    // MARK: - ウィジェットプレビュー

    private var widgetPreviewSection: some View {
        VStack(spacing: 12) {
            Text("ウィジェットプレビュー")
                .font(.headline)
                .frame(maxWidth: .infinity, alignment: .leading)

            HStack(spacing: 16) {
                ForEach(subscriptionService.currentTier.availableWidgetSizes, id: \.self) { size in
                    VStack {
                        RoundedRectangle(cornerRadius: 16)
                            .fill(Color("CardBackground"))
                            .frame(
                                width: widgetWidth(for: size),
                                height: widgetHeight(for: size)
                            )
                            .overlay(
                                VStack {
                                    Image(systemName: "widget.small")
                                        .font(.title2)
                                        .foregroundColor(.secondary)
                                    Text(size.displayName)
                                        .font(.caption2)
                                        .foregroundColor(.secondary)
                                }
                            )
                            .shadow(color: .black.opacity(0.05), radius: 5)

                        Text(size.displayName)
                            .font(.caption)
                    }
                }
            }
        }
    }

    // MARK: - ヘルパー

    private func statusCard(icon: String, title: String, value: String, subtitle: String, color: Color) -> some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(color)

            Text(title)
                .font(.caption2)
                .foregroundColor(.secondary)

            Text(value)
                .font(.caption)
                .fontWeight(.bold)

            Text(subtitle)
                .font(.caption2)
                .foregroundColor(.secondary)
                .lineLimit(1)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 16)
        .background(Color("CardBackground"))
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.05), radius: 5)
    }

    private var batteryColor: Color {
        switch batteryService.currentState {
        case .max, .high: return .green
        case .medium: return .yellow
        case .low: return .red
        case .charging: return .blue
        }
    }

    private func backgroundColors(for weather: WeatherState) -> [Color] {
        switch weather {
        case .sunny: return [Color("SunnyTop"), Color("SunnyBottom")]
        case .cloudy: return [Color("CloudyTop"), Color("CloudyBottom")]
        case .rainy: return [Color("RainyTop"), Color("RainyBottom")]
        case .snowy: return [Color("SnowyTop"), Color("SnowyBottom")]
        case .warning: return [Color("WarningTop"), Color("WarningBottom")]
        }
    }

    private func widgetWidth(for size: WidgetSizeOption) -> CGFloat {
        switch size {
        case .small: return 80
        case .medium: return 170
        case .large: return 170
        }
    }

    private func widgetHeight(for size: WidgetSizeOption) -> CGFloat {
        switch size {
        case .small: return 80
        case .medium: return 80
        case .large: return 170
        }
    }
}
