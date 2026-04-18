// CharacterSelectionView.swift
// PixelLife
//
// 動物キャラクター選択 + 成長表示画面

import SwiftUI

struct CharacterSelectionView: View {
    @EnvironmentObject var assetManager: AssetManager
    @EnvironmentObject var subscriptionService: SubscriptionService

    @State private var selectedCharacter: String = "mike_neko"
    @State private var growthData: CharacterGrowthData?

    /// 動物キャラクター情報
    struct AnimalInfo: Identifiable {
        let id: String
        let name: String
        let species: String
        let description: String
        let iconName: String
        let emoji: String
        let isPremium: Bool
    }

    private let animals: [AnimalInfo] = [
        AnimalInfo(id: "mike_neko",  name: "ミケ",     species: "三毛猫",     description: "のんびり屋の三毛猫。日だまりが大好き", iconName: "cat.fill",      emoji: "🐱", isPremium: false),
        AnimalInfo(id: "shiba_inu",  name: "コタロウ",  species: "柴犬",      description: "忠実でがんばり屋の柴犬",           iconName: "dog.fill",      emoji: "🐕", isPremium: false),
        AnimalInfo(id: "usagi",      name: "モフモフ",  species: "うさぎ",     description: "ふわふわで甘えん坊なうさぎ",       iconName: "hare.fill",     emoji: "🐰", isPremium: true),
        AnimalInfo(id: "kotori",     name: "ピヨ",     species: "小鳥",      description: "歌が上手な小さなインコ",           iconName: "bird.fill",     emoji: "🐦", isPremium: true),
        AnimalInfo(id: "hamster",    name: "ハムちゃん", species: "ハムスター",  description: "ほっぺパンパンのハムスター",       iconName: "pawprint.fill", emoji: "🐹", isPremium: true),
        AnimalInfo(id: "penguin",    name: "ペンタ",    species: "ペンギン",   description: "ちょこちょこ歩くペンギン",         iconName: "snowflake",     emoji: "🐧", isPremium: true),
        AnimalInfo(id: "fukuro",     name: "ホウ",     species: "フクロウ",   description: "夜型で博識なフクロウ",            iconName: "moon.stars.fill", emoji: "🦉", isPremium: true),
        AnimalInfo(id: "kitsune",    name: "コン",     species: "キツネ",    description: "いたずら好きなキツネ",            iconName: "flame.fill",    emoji: "🦊", isPremium: true),
        AnimalInfo(id: "kame",       name: "カメきち",  species: "カメ",      description: "マイペースだけど意外と速い",       iconName: "leaf.fill",     emoji: "🐢", isPremium: true),
        AnimalInfo(id: "dragon",     name: "リュウ",    species: "ドラゴン",   description: "小さな伝説のドラゴン",           iconName: "bolt.fill",     emoji: "🐉", isPremium: true),
    ]

    private let columns = [
        GridItem(.flexible(), spacing: 16),
        GridItem(.flexible(), spacing: 16),
    ]

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    currentCharacterHeader
                    growthProgressSection
                    characterGrid
                }
                .padding()
            }
            .navigationTitle("なかま")
            .background(Color("BackgroundMuted").ignoresSafeArea())
            .onAppear {
                selectedCharacter = assetManager.currentCharacter
                loadGrowthData()
            }
        }
    }

    // MARK: - 現在のキャラクター + 成長段階

    private var currentCharacterHeader: some View {
        VStack(spacing: 12) {
            if let animal = animals.first(where: { $0.id == selectedCharacter }) {
                ZStack {
                    Circle()
                        .fill(
                            LinearGradient(
                                colors: [Color("AccentTurquoise"), Color("AccentTurquoise").opacity(0.5)],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 100, height: 100)

                    Text(animal.emoji)
                        .font(.system(size: 44))
                }

                HStack(spacing: 4) {
                    Text(animal.name)
                        .font(.title2)
                        .fontWeight(.bold)
                    if let data = growthData {
                        Text("(\(data.currentStage.displayName))")
                            .font(.subheadline)
                            .foregroundColor(Color("AccentTurquoise"))
                    }
                }

                Text(animal.species)
                    .font(.caption)
                    .foregroundColor(.secondary)

                Text(animal.description)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
        }
        .padding(.vertical)
    }

    // MARK: - 成長進捗

    private var growthProgressSection: some View {
        VStack(spacing: 12) {
            if let data = growthData {
                // 成長段階バー
                VStack(spacing: 8) {
                    HStack {
                        Text("🌱 成長")
                            .font(.headline)
                        Spacer()
                        Text("\(data.totalDaysActive)日目")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }

                    // 進化プログレス
                    HStack(spacing: 4) {
                        ForEach(GrowthStage.allCases, id: \.rawValue) { stage in
                            VStack(spacing: 4) {
                                Circle()
                                    .fill(data.currentStage.rawValue >= stage.rawValue
                                        ? Color("AccentTurquoise")
                                        : Color.gray.opacity(0.3))
                                    .frame(width: 20, height: 20)
                                    .overlay(
                                        Text(stageEmoji(stage))
                                            .font(.system(size: 10))
                                    )

                                Text(stage.displayName)
                                    .font(.system(size: 8))
                                    .foregroundColor(data.currentStage == stage ? .primary : .secondary)
                            }

                            if stage != .elder {
                                Rectangle()
                                    .fill(data.currentStage.rawValue > stage.rawValue
                                        ? Color("AccentTurquoise")
                                        : Color.gray.opacity(0.3))
                                    .frame(height: 2)
                            }
                        }
                    }

                    // 次の進化までの情報
                    if let remaining = data.currentStage.daysUntilNextStage(currentDays: data.totalDaysActive) {
                        Text("次の成長まであと \(remaining) 日")
                            .font(.caption)
                            .foregroundColor(Color("AccentTurquoise"))

                        ProgressView(value: data.currentStage.progress(currentDays: data.totalDaysActive))
                            .tint(Color("AccentTurquoise"))
                    } else {
                        Text("✨ 最終段階に到達！")
                            .font(.caption)
                            .foregroundColor(.orange)
                    }

                    Text(data.currentStage.stageDescription)
                        .font(.caption2)
                        .foregroundColor(.secondary)
                        .italic()
                }
                .padding()
                .background(Color("CardBackground"))
                .cornerRadius(16)
            }
        }
    }

    // MARK: - キャラクターグリッド

    private var characterGrid: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("なかま一覧")
                .font(.headline)

            LazyVGrid(columns: columns, spacing: 16) {
                ForEach(animals) { animal in
                    animalCard(animal)
                }
            }
        }
    }

    private func animalCard(_ animal: AnimalInfo) -> some View {
        let isSelected = selectedCharacter == animal.id
        let isLocked = animal.isPremium && subscriptionService.currentTier == .basic

        return Button {
            if !isLocked {
                selectedCharacter = animal.id
                assetManager.currentCharacter = animal.id
                SharedDataManager.shared.saveCurrentCharacter(animal.id)
                loadGrowthData()
            }
        } label: {
            VStack(spacing: 8) {
                ZStack {
                    RoundedRectangle(cornerRadius: 16)
                        .fill(Color("CardBackground"))
                        .frame(height: 130)

                    VStack(spacing: 6) {
                        Text(animal.emoji)
                            .font(.system(size: 36))

                        Text(animal.name)
                            .font(.caption)
                            .fontWeight(.semibold)
                            .foregroundColor(isLocked ? .gray : .primary)

                        Text(animal.species)
                            .font(.system(size: 10))
                            .foregroundColor(.secondary)
                    }

                    if isLocked {
                        VStack {
                            HStack {
                                Spacer()
                                Image(systemName: "lock.fill")
                                    .font(.caption)
                                    .foregroundColor(.white)
                                    .padding(6)
                                    .background(Color.orange)
                                    .clipShape(Circle())
                            }
                            Spacer()
                        }
                        .padding(8)
                    }

                    if isSelected {
                        VStack {
                            HStack {
                                Image(systemName: "checkmark.circle.fill")
                                    .font(.title3)
                                    .foregroundColor(.green)
                                Spacer()
                            }
                            Spacer()
                        }
                        .padding(8)
                    }
                }
                .overlay(
                    RoundedRectangle(cornerRadius: 16)
                        .stroke(isSelected ? Color.accentColor : Color.clear, lineWidth: 3)
                )
            }
        }
        .buttonStyle(.plain)
        .shadow(color: .black.opacity(0.05), radius: 5)
    }

    // MARK: - ヘルパー

    private func stageEmoji(_ stage: GrowthStage) -> String {
        switch stage {
        case .baby:  return "🥚"
        case .child: return "🐣"
        case .teen:  return "🌱"
        case .adult: return "⭐"
        case .elder: return "👑"
        }
    }

    private func loadGrowthData() {
        // UserDefaultsから成長データを読み込み
        if let data = UserDefaults.standard.data(forKey: "growth_\(selectedCharacter)"),
           var growth = try? JSONDecoder().decode(CharacterGrowthData.self, from: data) {
            growth.updateDays()
            growthData = growth
        } else {
            // 新規キャラクター
            growthData = CharacterGrowthData(characterId: selectedCharacter)
            saveGrowthData()
        }
    }

    private func saveGrowthData() {
        guard let data = growthData,
              let encoded = try? JSONEncoder().encode(data) else { return }
        UserDefaults.standard.set(encoded, forKey: "growth_\(selectedCharacter)")
    }
}
