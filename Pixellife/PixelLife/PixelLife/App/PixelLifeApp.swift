// PixelLifeApp.swift
// PixelLife
//
// アプリケーションのエントリーポイント

import SwiftUI

@main
struct PixelLifeApp: App {
    @StateObject private var batteryService = BatteryService()
    @StateObject private var weatherService = WeatherService()
    @StateObject private var calendarService = CalendarService()
    @StateObject private var subscriptionService = SubscriptionService()
    @StateObject private var assetManager = AssetManager()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(batteryService)
                .environmentObject(weatherService)
                .environmentObject(calendarService)
                .environmentObject(subscriptionService)
                .environmentObject(assetManager)
        }
    }
}
