// CalendarService.swift
// PixelLife
//
// カレンダー同期サービス
// EventKit を使用して Apple カレンダーの予定を取得し、ScheduleState に変換

import Foundation
import EventKit
import Combine

/// カレンダー同期サービス
/// Apple カレンダー (EventKit) から予定を取得し、
/// キャラクターの行動に反映するための ScheduleState を決定
@MainActor
final class CalendarService: ObservableObject {
    /// 現在の予定状態
    @Published private(set) var currentState: ScheduleState = .none
    /// 次の予定のタイトル
    @Published private(set) var nextEventTitle: String?
    /// 次の予定の開始時刻
    @Published private(set) var nextEventDate: Date?
    /// カレンダーアクセス許可状態
    @Published private(set) var authorizationStatus: EKAuthorizationStatus = .notDetermined
    /// エラーメッセージ
    @Published private(set) var errorMessage: String?

    private let eventStore = EKEventStore()

    init() {
        updateAuthorizationStatus()
    }

    /// カレンダーアクセス許可をリクエスト
    func requestAccess() async -> Bool {
        do {
            let granted = try await eventStore.requestFullAccessToEvents()
            await MainActor.run {
                updateAuthorizationStatus()
            }
            return granted
        } catch {
            errorMessage = "カレンダーへのアクセスが拒否されました: \(error.localizedDescription)"
            return false
        }
    }

    /// 現在の予定状態を更新
    func updateScheduleState() {
        guard authorizationStatus == .fullAccess else {
            currentState = .none
            return
        }

        let now = Date()
        let endOfDay = Calendar.current.date(byAdding: .hour, value: 2, to: now) ?? now

        // 現在から2時間以内の予定を取得
        let predicate = eventStore.predicateForEvents(
            withStart: now,
            end: endOfDay,
            calendars: nil
        )

        let events = eventStore.events(matching: predicate)
            .filter { !$0.isAllDay } // 終日イベントは除外
            .sorted { $0.startDate < $1.startDate }

        if let nextEvent = events.first {
            let title = nextEvent.title ?? ""
            self.nextEventTitle = title
            self.nextEventDate = nextEvent.startDate
            self.currentState = ScheduleState.classify(from: title)
        } else {
            self.nextEventTitle = nil
            self.nextEventDate = nil
            self.currentState = .none
        }

        // App Group 経由でウィジェットと共有
        SharedDataManager.shared.saveScheduleState(currentState)
        if let title = nextEventTitle {
            SharedDataManager.shared.saveNextEventTitle(title)
        }
    }

    /// 今日の予定一覧を取得
    func fetchTodayEvents() -> [CalendarEvent] {
        guard authorizationStatus == .fullAccess else {
            return []
        }

        let calendar = Calendar.current
        let startOfDay = calendar.startOfDay(for: Date())
        let endOfDay = calendar.date(byAdding: .day, value: 1, to: startOfDay) ?? startOfDay

        let predicate = eventStore.predicateForEvents(
            withStart: startOfDay,
            end: endOfDay,
            calendars: nil
        )

        return eventStore.events(matching: predicate)
            .map { event in
                CalendarEvent(
                    title: event.title ?? "無題",
                    startDate: event.startDate,
                    endDate: event.endDate,
                    isAllDay: event.isAllDay,
                    scheduleType: ScheduleState.classify(from: event.title ?? "")
                )
            }
            .sorted { $0.startDate < $1.startDate }
    }

    /// アクセス許可状態を更新
    private func updateAuthorizationStatus() {
        authorizationStatus = EKEventStore.authorizationStatus(for: .event)
    }
}

// MARK: - カレンダーイベントモデル

/// カレンダーイベント（アプリ内表示用）
struct CalendarEvent: Identifiable {
    let id = UUID()
    let title: String
    let startDate: Date
    let endDate: Date
    let isAllDay: Bool
    let scheduleType: ScheduleState

    /// 時刻の表示文字列
    var timeString: String {
        if isAllDay { return "終日" }
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm"
        return "\(formatter.string(from: startDate))〜\(formatter.string(from: endDate))"
    }
}
