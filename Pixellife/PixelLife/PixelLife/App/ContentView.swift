// ContentView.swift
// PixelLife
//
// ルートビュー - タブバーナビゲーション

import SwiftUI

struct ContentView: View {
    @EnvironmentObject var subscriptionService: SubscriptionService

    var body: some View {
        TabView {
            HomeView()
                .tabItem {
                    Label("ホーム", systemImage: "house.fill")
                }

            CharacterSelectionView()
                .tabItem {
                    Label("キャラ", systemImage: "person.fill")
                }

            if subscriptionService.currentTier.canUseAIGeneration {
                AIGenerationView()
                    .tabItem {
                        Label("AI生成", systemImage: "sparkles")
                    }
            }

            SubscriptionView()
                .tabItem {
                    Label("プラン", systemImage: "crown.fill")
                }

            SettingsView()
                .tabItem {
                    Label("設定", systemImage: "gearshape.fill")
                }
        }
        .tint(Color("AccentTurquoise"))
    }
}
