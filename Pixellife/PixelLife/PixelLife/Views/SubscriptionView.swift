// SubscriptionView.swift
// PixelLife
//
// サブスクリプション購入画面
// プラン比較、購入、復元機能を提供

import SwiftUI

struct SubscriptionView: View {
    @EnvironmentObject var subscriptionService: SubscriptionService
    @State private var selectedTier: SubscriptionTier = .premium
    @State private var showingPurchaseAlert = false
    @State private var purchaseMessage = ""

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // ヘッダー
                    headerSection

                    // プランカード
                    planCardsSection

                    // 機能比較表
                    featureComparisonSection

                    // 購入ボタン
                    purchaseSection

                    // 復元 & 法的情報
                    footerSection
                }
                .padding()
            }
            .navigationTitle("プラン")
            .background(Color("BackgroundMuted").ignoresSafeArea())
            .alert("購入", isPresented: $showingPurchaseAlert) {
                Button("OK") {}
            } message: {
                Text(purchaseMessage)
            }
        }
    }

    // MARK: - ヘッダー

    private var headerSection: some View {
        VStack(spacing: 8) {
            Image(systemName: "crown.fill")
                .font(.system(size: 48))
                .foregroundStyle(
                    LinearGradient(
                        colors: [.yellow, .orange],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )

            Text("ピクセルライフをもっと楽しもう")
                .font(.title2)
                .fontWeight(.bold)

            Text("プレミアムにアップグレードして\n全機能を解放しよう")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
        }
        .padding(.vertical)
    }

    // MARK: - プランカード

    private var planCardsSection: some View {
        VStack(spacing: 12) {
            ForEach(SubscriptionTier.allCases) { tier in
                planCard(tier)
            }
        }
    }

    private func planCard(_ tier: SubscriptionTier) -> some View {
        let isSelected = selectedTier == tier
        let isCurrent = subscriptionService.currentTier == tier

        return Button {
            if tier != .basic {
                selectedTier = tier
            }
        } label: {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    HStack {
                        Text(tier.displayName)
                            .font(.headline)
                            .foregroundColor(.primary)

                        if isCurrent {
                            Text("現在のプラン")
                                .font(.caption2)
                                .fontWeight(.semibold)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 2)
                                .background(Color.green.opacity(0.2))
                                .foregroundColor(.green)
                                .cornerRadius(4)
                        }

                        if tier == .premium {
                            Text("おすすめ")
                                .font(.caption2)
                                .fontWeight(.semibold)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 2)
                                .background(Color.orange.opacity(0.2))
                                .foregroundColor(.orange)
                                .cornerRadius(4)
                        }
                    }

                    Text(tier.priceDisplayText)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }

                Spacer()

                if tier != .basic {
                    Image(systemName: isSelected ? "checkmark.circle.fill" : "circle")
                        .font(.title2)
                        .foregroundColor(isSelected ? .accentColor : .gray)
                }
            }
            .padding()
            .background(Color("CardBackground"))
            .cornerRadius(16)
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .stroke(isSelected && tier != .basic ? Color.accentColor : Color.clear, lineWidth: 2)
            )
        }
        .buttonStyle(.plain)
    }

    // MARK: - 機能比較

    private var featureComparisonSection: some View {
        VStack(spacing: 12) {
            Text("機能比較")
                .font(.headline)
                .frame(maxWidth: .infinity, alignment: .leading)

            VStack(spacing: 0) {
                featureRow("ウィジェットサイズ", basic: "小のみ", premium: "全サイズ", aiPro: "全サイズ")
                Divider()
                featureRow("キャラクター", basic: "1種", premium: "全て", aiPro: "全て")
                Divider()
                featureRow("データ連携", basic: "バッテリー\n天気", premium: "バッテリー\n天気\nカレンダー", aiPro: "全て")
                Divider()
                featureRow("アニメーション", basic: "✗", premium: "✓", aiPro: "✓")
                Divider()
                featureRow("AI生成", basic: "✗", premium: "✗", aiPro: "50回/月")
                Divider()
                featureRow("広告", basic: "あり", premium: "なし", aiPro: "なし")
                Divider()
                featureRow("更新間隔", basic: "30分", premium: "15分", aiPro: "15分")
            }
            .background(Color("CardBackground"))
            .cornerRadius(12)
        }
    }

    private func featureRow(_ feature: String, basic: String, premium: String, aiPro: String) -> some View {
        HStack {
            Text(feature)
                .font(.caption)
                .frame(width: 80, alignment: .leading)

            Text(basic)
                .font(.caption2)
                .frame(maxWidth: .infinity)
                .foregroundColor(.secondary)

            Text(premium)
                .font(.caption2)
                .frame(maxWidth: .infinity)
                .foregroundColor(.accentColor)

            Text(aiPro)
                .font(.caption2)
                .frame(maxWidth: .infinity)
                .foregroundColor(.purple)
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 10)
    }

    // MARK: - 購入セクション

    private var purchaseSection: some View {
        VStack(spacing: 12) {
            if subscriptionService.currentTier == .basic {
                Button {
                    Task {
                        await purchaseSelectedPlan()
                    }
                } label: {
                    HStack {
                        if subscriptionService.isPurchasing {
                            ProgressView()
                                .tint(.white)
                        }
                        Text("\(selectedTier.displayName)に登録 - \(selectedTier.priceDisplayText)")
                            .fontWeight(.bold)
                    }
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(
                        LinearGradient(
                            colors: [Color("AccentTurquoise"), Color("AccentTurquoise").opacity(0.7)],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                    .foregroundColor(.white)
                    .cornerRadius(16)
                }
                .disabled(subscriptionService.isPurchasing)

                // 自動更新の説明
                Text("サブスクリプションは自動更新されます。\n解約はいつでも可能です。")
                    .font(.caption2)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
            }
        }
    }

    // MARK: - フッター

    private var footerSection: some View {
        VStack(spacing: 12) {
            // 購入の復元ボタン（App Store 審査必須）
            Button("購入情報を復元") {
                Task {
                    await subscriptionService.restorePurchases()
                }
            }
            .font(.subheadline)

            HStack(spacing: 16) {
                Button("プライバシーポリシー") {
                    // TODO: プライバシーポリシーURLを開く
                }
                .font(.caption)
                .foregroundColor(.secondary)

                Button("利用規約") {
                    // TODO: 利用規約URLを開く
                }
                .font(.caption)
                .foregroundColor(.secondary)
            }

            // 解約方法の案内（App Store 審査推奨）
            VStack(spacing: 4) {
                Text("解約方法")
                    .font(.caption)
                    .fontWeight(.medium)
                Text("設定アプリ → Apple ID → サブスクリプション → ピクセルライフ → キャンセル")
                    .font(.caption2)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
            }
            .padding()
            .background(Color("CardBackground"))
            .cornerRadius(12)
        }
        .padding(.top)
    }

    // MARK: - 購入処理

    private func purchaseSelectedPlan() async {
        guard let product = subscriptionService.product(for: selectedTier) else {
            purchaseMessage = "商品情報を取得できませんでした。"
            showingPurchaseAlert = true
            return
        }

        let success = await subscriptionService.purchase(product)
        if success {
            purchaseMessage = "\(selectedTier.displayName)への登録が完了しました！"
        } else if let error = subscriptionService.errorMessage {
            purchaseMessage = error
        }
        showingPurchaseAlert = true
    }
}
