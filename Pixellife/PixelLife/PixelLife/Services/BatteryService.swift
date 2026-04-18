// BatteryService.swift
// PixelLife
//
// バッテリー残量の監視と状態管理サービス

import Foundation
import UIKit
import Combine

/// バッテリー監視サービス
/// UIDevice.current を使用してバッテリーレベルと状態をリアルタイム監視
@MainActor
final class BatteryService: ObservableObject {
    /// 現在のバッテリー状態
    @Published private(set) var currentState: BatteryState = .high
    /// 現在のバッテリーレベル (0.0〜1.0)
    @Published private(set) var batteryLevel: Float = 1.0
    /// 充電中かどうか
    @Published private(set) var isCharging: Bool = false

    private var cancellables = Set<AnyCancellable>()

    init() {
        startMonitoring()
    }

    deinit {
        stopMonitoring()
    }

    /// バッテリー監視を開始
    func startMonitoring() {
        UIDevice.current.isBatteryMonitoringEnabled = true
        updateBatteryState()

        // バッテリーレベル変更通知
        NotificationCenter.default.publisher(for: UIDevice.batteryLevelDidChangeNotification)
            .receive(on: DispatchQueue.main)
            .sink { [weak self] _ in
                self?.updateBatteryState()
            }
            .store(in: &cancellables)

        // バッテリー状態変更通知
        NotificationCenter.default.publisher(for: UIDevice.batteryStateDidChangeNotification)
            .receive(on: DispatchQueue.main)
            .sink { [weak self] _ in
                self?.updateBatteryState()
            }
            .store(in: &cancellables)
    }

    /// バッテリー監視を停止
    func stopMonitoring() {
        UIDevice.current.isBatteryMonitoringEnabled = false
        cancellables.removeAll()
    }

    /// バッテリー状態を更新
    private func updateBatteryState() {
        let level = UIDevice.current.batteryLevel
        let state = UIDevice.current.batteryState
        let charging = (state == .charging || state == .full)

        self.batteryLevel = level
        self.isCharging = charging
        self.currentState = BatteryState(level: level, isCharging: charging)

        // App Group 経由でウィジェットと共有
        SharedDataManager.shared.saveBatteryState(currentState)
    }

    /// バッテリーレベルのパーセンテージ表示
    var batteryPercentage: Int {
        return Int(batteryLevel * 100)
    }
}
