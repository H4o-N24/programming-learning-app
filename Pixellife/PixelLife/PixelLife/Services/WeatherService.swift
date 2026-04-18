// WeatherService.swift
// PixelLife
//
// 天気データの取得と状態管理サービス
// Firebase Functions 経由で OpenWeatherMap API を呼び出し

import Foundation
import CoreLocation
import Combine

/// 天気サービス
/// 位置情報を元に天気データを取得し、WeatherState に変換
@MainActor
final class WeatherService: ObservableObject {
    /// 現在の天気状態
    @Published private(set) var currentState: WeatherState = .sunny
    /// 最後に取得した天気データ
    @Published private(set) var lastFetchedData: WeatherData?
    /// エラーメッセージ
    @Published private(set) var errorMessage: String?

    private let locationManager = LocationManager()

    // TODO: Firebase Functions の URL に置き換え
    private let weatherEndpoint = "https://YOUR-FIREBASE-PROJECT.cloudfunctions.net/getWeather"

    /// 天気データを取得
    func fetchWeather() async {
        do {
            guard let location = locationManager.lastLocation else {
                // 位置情報が取得できない場合はデフォルト
                errorMessage = "位置情報を取得できません"
                return
            }

            let data = try await requestWeatherData(
                lat: location.coordinate.latitude,
                lon: location.coordinate.longitude
            )

            self.lastFetchedData = data
            self.currentState = WeatherState(fromWeatherCode: data.weatherCode)
            self.errorMessage = nil

            // App Group 経由でウィジェットと共有
            SharedDataManager.shared.saveWeatherState(currentState)

        } catch {
            self.errorMessage = "天気データの取得に失敗: \(error.localizedDescription)"
        }
    }

    /// Firebase Functions 経由で天気 API を呼び出し
    private func requestWeatherData(lat: Double, lon: Double) async throws -> WeatherData {
        var urlComponents = URLComponents(string: weatherEndpoint)!
        urlComponents.queryItems = [
            URLQueryItem(name: "lat", value: String(lat)),
            URLQueryItem(name: "lon", value: String(lon))
        ]

        guard let url = urlComponents.url else {
            throw WeatherError.invalidURL
        }

        let (data, response) = try await URLSession.shared.data(from: url)

        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw WeatherError.serverError
        }

        let decoder = JSONDecoder()
        return try decoder.decode(WeatherData.self, from: data)
    }
}

// MARK: - 天気データモデル

/// 天気レスポンスデータ
struct WeatherData: Codable {
    let weatherCode: Int
    let temperature: Double
    let description: String
    let cityName: String

    enum CodingKeys: String, CodingKey {
        case weatherCode = "weather_code"
        case temperature
        case description
        case cityName = "city_name"
    }
}

/// 天気関連エラー
enum WeatherError: Error, LocalizedError {
    case invalidURL
    case serverError
    case decodingError

    var errorDescription: String? {
        switch self {
        case .invalidURL: return "無効なURL"
        case .serverError: return "サーバーエラー"
        case .decodingError: return "データの解析エラー"
        }
    }
}

// MARK: - 位置情報マネージャー

/// Core Location を使った位置情報取得ヘルパー
final class LocationManager: NSObject, ObservableObject, CLLocationManagerDelegate {
    private let manager = CLLocationManager()
    @Published var lastLocation: CLLocation?
    @Published var authorizationStatus: CLAuthorizationStatus = .notDetermined

    override init() {
        super.init()
        manager.delegate = self
        manager.desiredAccuracy = kCLLocationAccuracyKilometer // 天気取得には大まかな位置で十分
    }

    func requestPermission() {
        manager.requestWhenInUseAuthorization()
    }

    func requestLocation() {
        manager.requestLocation()
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        lastLocation = locations.last
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        print("Location error: \(error.localizedDescription)")
    }

    func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        authorizationStatus = manager.authorizationStatus
        if manager.authorizationStatus == .authorizedWhenInUse ||
           manager.authorizationStatus == .authorizedAlways {
            manager.requestLocation()
        }
    }
}
