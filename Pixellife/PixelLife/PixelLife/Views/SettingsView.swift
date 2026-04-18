// SettingsView.swift
// PixelLife
//
// 設定画面 - ウィジェット設定、カレンダー連携、テーマ切替、アカウント管理

import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var calendarService: CalendarService
    @EnvironmentObject var subscriptionService: SubscriptionService
    @EnvironmentObject var assetManager: AssetManager

    @AppStorage("widgetUpdateInterval") private var updateInterval: Int = 30
    @AppStorage("enableAnimation") private var enableAnimation: Bool = false
    @AppStorage("selectedTheme") private var selectedTheme: String = "default"
    @AppStorage("enableNotifications") private var enableNotifications: Bool = true

    @State private var showingPrivacyPolicy = false
    @State private var showingTermsOfUse = false
    @State private var showingDeleteConfirm = false

    var body: some View {
        NavigationStack {
            List {
                // MARK: - ウィジェット設定
                Section {
                    Picker("更新間隔", selection: $updateInterval) {
                        Text("15分").tag(15)
                        Text("30分").tag(30)
                    }
                    .disabled(!subscriptionService.currentTier.canUseAnimation)

                    Toggle("アニメーション", isOn: $enableAnimation)
                        .disabled(!subscriptionService.currentTier.canUseAnimation)
                        .onChange(of: enableAnimation) { _, newValue in
                            SharedDataManager.shared.saveUseAnimation(newValue)
                        }

                    if !subscriptionService.currentTier.canUseAnimation {
                        HStack {
                            Image(systemName: "crown.fill")
                                .foregroundColor(.yellow)
                            Text("プレミアム機能です")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                    }
                } header: {
                    Text("ウィジェット設定")
                } footer: {
                    Text("更新間隔を短くするとバッテリー消費が増えます。")
                }

                // MARK: - データ連携
                Section("データ連携") {
                    // カレンダー連携
                    HStack {
                        Image(systemName: "calendar")
                            .foregroundColor(.red)
                        VStack(alignment: .leading) {
                            Text("カレンダー連携")
                            Text(calendarAccessStatusText)
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                        Spacer()
                        if calendarService.authorizationStatus != .fullAccess {
                            Button("許可") {
                                Task {
                                    await calendarService.requestAccess()
                                }
                            }
                            .buttonStyle(.borderedProminent)
                            .controlSize(.small)
                            .disabled(!subscriptionService.currentTier.canAccessCalendar)
                        } else {
                            Image(systemName: "checkmark.circle.fill")
                                .foregroundColor(.green)
                        }
                    }

                    // 位置情報
                    HStack {
                        Image(systemName: "location.fill")
                            .foregroundColor(.blue)
                        VStack(alignment: .leading) {
                            Text("位置情報（天気取得用）")
                            Text("天気データの取得に使用します")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                    }
                }

                // MARK: - テーマ設定
                Section("テーマ") {
                    Picker("テーマ", selection: $selectedTheme) {
                        Text("デフォルト").tag("default")
                        Text("ダーク").tag("dark")
                        Text("パステル").tag("pastel")
                        Text("レトロ").tag("retro")
                    }
                    .onChange(of: selectedTheme) { _, newValue in
                        SharedDataManager.shared.saveCurrentTheme(newValue)
                    }
                }

                // MARK: - 通知
                Section("通知") {
                    Toggle("プッシュ通知", isOn: $enableNotifications)
                    if enableNotifications {
                        Text("キャラクターの状態変化やイベントリマインダーをお知らせします")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }

                // MARK: - アカウント
                Section("アカウント") {
                    HStack {
                        Text("現在のプラン")
                        Spacer()
                        Text(subscriptionService.currentTier.displayName)
                            .foregroundColor(.accentColor)
                            .fontWeight(.semibold)
                    }

                    NavigationLink("サブスクリプション管理") {
                        SubscriptionView()
                    }

                    Button("購入情報を復元") {
                        Task {
                            await subscriptionService.restorePurchases()
                        }
                    }
                }

                // MARK: - サポート
                Section("サポート") {
                    Button("プライバシーポリシー") {
                        showingPrivacyPolicy = true
                    }
                    .foregroundColor(.primary)

                    Button("利用規約") {
                        showingTermsOfUse = true
                    }
                    .foregroundColor(.primary)

                    HStack {
                        Text("バージョン")
                        Spacer()
                        Text("1.0.0")
                            .foregroundColor(.secondary)
                    }

                    HStack {
                        Text("アセット状況")
                        Spacer()
                        Text(assetManager.assetStats)
                            .font(.caption2)
                            .foregroundColor(.secondary)
                    }
                }

                // MARK: - 解約情報
                Section {
                    VStack(alignment: .leading, spacing: 8) {
                        Label("サブスクリプションの解約方法", systemImage: "info.circle")
                            .font(.subheadline)
                            .fontWeight(.medium)

                        Text("「設定」アプリ → Apple ID → サブスクリプション → ピクセルライフ → サブスクリプションをキャンセル")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
            }
            .navigationTitle("設定")
        }
    }

    private var calendarAccessStatusText: String {
        switch calendarService.authorizationStatus {
        case .fullAccess: return "接続済み"
        case .notDetermined: return "未設定"
        case .denied, .restricted: return "アクセスが拒否されています"
        default: return "確認中..."
        }
    }
}
