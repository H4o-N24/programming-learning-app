// SubscriptionService.swift
// PixelLife
//
// StoreKit 2 を使用したサブスクリプション管理サービス

import Foundation
import StoreKit

/// サブスクリプション管理サービス
/// StoreKit 2 を使用して課金処理、購入復元を管理
@MainActor
final class SubscriptionService: ObservableObject {
    /// 現在のサブスクリプションプラン
    @Published private(set) var currentTier: SubscriptionTier = .basic
    /// 利用可能な商品一覧
    @Published private(set) var products: [Product] = []
    /// 購入処理中フラグ
    @Published private(set) var isPurchasing: Bool = false
    /// エラーメッセージ
    @Published private(set) var errorMessage: String?

    /// StoreKit の Product ID 一覧
    private let productIDs: Set<String> = [
        SubscriptionTier.premium.productId,
        SubscriptionTier.aiPro.productId
    ]

    private var updateListenerTask: Task<Void, Error>?

    init() {
        updateListenerTask = listenForTransactions()
        Task {
            await loadProducts()
            await updateCurrentSubscription()
        }
    }

    deinit {
        updateListenerTask?.cancel()
    }

    // MARK: - 商品の取得

    /// App Store Connect から商品情報を取得
    func loadProducts() async {
        do {
            let storeProducts = try await Product.products(for: productIDs)
            self.products = storeProducts.sorted { $0.price < $1.price }
        } catch {
            errorMessage = "商品情報の取得に失敗しました: \(error.localizedDescription)"
        }
    }

    // MARK: - 購入処理

    /// サブスクリプションを購入
    /// - Parameter product: 購入する商品
    func purchase(_ product: Product) async -> Bool {
        isPurchasing = true
        defer { isPurchasing = false }

        do {
            let result = try await product.purchase()

            switch result {
            case .success(let verification):
                let transaction = try checkVerified(verification)
                await transaction.finish()
                await updateCurrentSubscription()
                return true

            case .pending:
                errorMessage = "購入が保留中です。承認後に有効になります。"
                return false

            case .userCancelled:
                return false

            @unknown default:
                return false
            }
        } catch {
            errorMessage = "購入処理に失敗しました: \(error.localizedDescription)"
            return false
        }
    }

    // MARK: - 購入の復元

    /// 購入情報を復元
    func restorePurchases() async {
        do {
            try await AppStore.sync()
            await updateCurrentSubscription()
        } catch {
            errorMessage = "購入の復元に失敗しました: \(error.localizedDescription)"
        }
    }

    // MARK: - トランザクション監視

    /// バックグラウンドでトランザクションの更新を監視
    private func listenForTransactions() -> Task<Void, Error> {
        return Task.detached { [weak self] in
            for await result in Transaction.updates {
                do {
                    let transaction = try self?.checkVerified(result)
                    await transaction?.finish()
                    await self?.updateCurrentSubscription()
                } catch {
                    print("Transaction verification failed: \(error)")
                }
            }
        }
    }

    // MARK: - 現在のサブスクリプション確認

    /// 現在有効なサブスクリプションを確認・更新
    func updateCurrentSubscription() async {
        var highestTier: SubscriptionTier = .basic

        for await result in Transaction.currentEntitlements {
            do {
                let transaction = try checkVerified(result)

                if transaction.productID == SubscriptionTier.aiPro.productId {
                    highestTier = .aiPro
                    break // AI Pro は最上位なので確定
                } else if transaction.productID == SubscriptionTier.premium.productId {
                    highestTier = .premium
                }
            } catch {
                print("Entitlement verification failed: \(error)")
            }
        }

        self.currentTier = highestTier

        // App Group 経由でウィジェットと共有
        SharedDataManager.shared.saveSubscriptionTier(highestTier)
    }

    // MARK: - 検証ヘルパー

    /// トランザクションの署名検証
    private func checkVerified<T>(_ result: VerificationResult<T>) throws -> T {
        switch result {
        case .unverified(_, let error):
            throw error
        case .verified(let safe):
            return safe
        }
    }

    // MARK: - ヘルパー

    /// 指定されたティアの Product を取得
    func product(for tier: SubscriptionTier) -> Product? {
        return products.first { $0.id == tier.productId }
    }

    /// AI クレジットの残数（AIプロプラン用）
    func remainingAICredits() -> Int {
        guard currentTier == .aiPro else { return 0 }
        // TODO: Firestore からユーザーの今月の使用回数を取得
        return currentTier.monthlyAICredits
    }
}
