// AIGenerationView.swift
// PixelLife
//
// AI カスタム生成画面
// テキスト入力でオリジナルドット絵アセットを生成

import SwiftUI

struct AIGenerationView: View {
    @EnvironmentObject var subscriptionService: SubscriptionService
    @EnvironmentObject var assetManager: AssetManager

    @State private var promptText: String = ""
    @State private var selectedStyle: AIStyle = .retro8bit
    @State private var isGenerating: Bool = false
    @State private var generatedImageURL: URL?
    @State private var showingResult: Bool = false
    @State private var errorMessage: String?

    enum AIStyle: String, CaseIterable, Identifiable {
        case retro8bit = "8-bitレトロ"
        case cyberpunk = "サイバーパンク"
        case japanese = "和風"
        case fantasy = "ファンタジー"
        case scifi = "SF"
        case cute = "かわいい"

        var id: String { rawValue }

        var promptSuffix: String {
            switch self {
            case .retro8bit: return "retro 8-bit game style"
            case .cyberpunk: return "cyberpunk neon style"
            case .japanese: return "japanese traditional style with pixel art"
            case .fantasy: return "fantasy medieval pixel style"
            case .scifi: return "sci-fi futuristic pixel style"
            case .cute: return "kawaii cute pastel pixel style"
            }
        }
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // クレジット残高
                    creditSection

                    // プロンプト入力
                    promptSection

                    // スタイル選択
                    styleSection

                    // プレビュー/結果
                    if showingResult {
                        resultSection
                    }

                    // 生成ボタン
                    generateButton

                    // ヒント
                    tipsSection
                }
                .padding()
            }
            .navigationTitle("AI生成")
            .background(Color("BackgroundMuted").ignoresSafeArea())
        }
    }

    // MARK: - クレジット残高

    private var creditSection: some View {
        HStack {
            Image(systemName: "sparkles")
                .font(.title2)
                .foregroundStyle(
                    LinearGradient(
                        colors: [.purple, .pink],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )

            VStack(alignment: .leading) {
                Text("AIクレジット残高")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                Text("\(subscriptionService.remainingAICredits()) / \(subscriptionService.currentTier.monthlyAICredits)")
                    .font(.title2)
                    .fontWeight(.bold)
            }

            Spacer()

            Text("今月分")
                .font(.caption)
                .padding(.horizontal, 10)
                .padding(.vertical, 4)
                .background(Color.purple.opacity(0.15))
                .foregroundColor(.purple)
                .cornerRadius(8)
        }
        .padding()
        .background(Color("CardBackground"))
        .cornerRadius(16)
    }

    // MARK: - プロンプト入力

    private var promptSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("キャラクターの説明")
                .font(.headline)

            TextEditor(text: $promptText)
                .frame(height: 100)
                .padding(8)
                .background(Color("CardBackground"))
                .cornerRadius(12)
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(Color.gray.opacity(0.3))
                )

            Text("例: 「青い帽子をかぶった猫のキャラクター」「宇宙飛行士のロボット」")
                .font(.caption)
                .foregroundColor(.secondary)
        }
    }

    // MARK: - スタイル選択

    private var styleSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("スタイル")
                .font(.headline)

            LazyVGrid(columns: [
                GridItem(.flexible()),
                GridItem(.flexible()),
                GridItem(.flexible())
            ], spacing: 12) {
                ForEach(AIStyle.allCases) { style in
                    Button {
                        selectedStyle = style
                    } label: {
                        Text(style.rawValue)
                            .font(.caption)
                            .fontWeight(.medium)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 12)
                            .background(
                                selectedStyle == style
                                    ? Color.accentColor
                                    : Color("CardBackground")
                            )
                            .foregroundColor(
                                selectedStyle == style ? .white : .primary
                            )
                            .cornerRadius(12)
                    }
                    .buttonStyle(.plain)
                }
            }
        }
    }

    // MARK: - 結果

    private var resultSection: some View {
        VStack(spacing: 12) {
            Text("生成結果")
                .font(.headline)
                .frame(maxWidth: .infinity, alignment: .leading)

            RoundedRectangle(cornerRadius: 16)
                .fill(Color("CardBackground"))
                .frame(height: 200)
                .overlay(
                    VStack {
                        if isGenerating {
                            ProgressView("生成中...")
                                .font(.caption)
                        } else if generatedImageURL != nil {
                            // 生成された画像を表示
                            Image(systemName: "sparkles.square.filled.on.square")
                                .font(.system(size: 60))
                                .foregroundColor(.purple)
                            Text("生成完了！")
                                .font(.subheadline)
                                .fontWeight(.medium)
                        }
                    }
                )

            if generatedImageURL != nil {
                Button("ウィジェットに適用") {
                    // TODO: 生成画像をウィジェットに適用
                }
                .buttonStyle(.borderedProminent)
            }
        }
    }

    // MARK: - 生成ボタン

    private var generateButton: some View {
        Button {
            Task {
                await generateImage()
            }
        } label: {
            HStack {
                if isGenerating {
                    ProgressView()
                        .tint(.white)
                }
                Image(systemName: "sparkles")
                Text("生成する（1クレジット消費）")
                    .fontWeight(.bold)
            }
            .frame(maxWidth: .infinity)
            .padding()
            .background(
                LinearGradient(
                    colors: canGenerate ? [.purple, .pink] : [.gray],
                    startPoint: .leading,
                    endPoint: .trailing
                )
            )
            .foregroundColor(.white)
            .cornerRadius(16)
        }
        .disabled(!canGenerate || isGenerating)
    }

    // MARK: - ヒント

    private var tipsSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("生成のコツ")
                .font(.subheadline)
                .fontWeight(.medium)

            VStack(alignment: .leading, spacing: 6) {
                tipRow("🎨", "色や雰囲気を具体的に指定すると良い結果が得られます")
                tipRow("✨", "生成されるドット絵はミュートカラーのパステル調に統一されます")
                tipRow("📐", "8-bit低解像度スタイルで自動生成されます")
                tipRow("🔄", "結果が気に入らない場合は、プロンプトを変えて再生成できます")
            }
        }
        .padding()
        .background(Color("CardBackground"))
        .cornerRadius(12)
    }

    private func tipRow(_ emoji: String, _ text: String) -> some View {
        HStack(alignment: .top, spacing: 8) {
            Text(emoji)
            Text(text)
                .font(.caption)
                .foregroundColor(.secondary)
        }
    }

    // MARK: - ロジック

    private var canGenerate: Bool {
        !promptText.isEmpty &&
        subscriptionService.remainingAICredits() > 0
    }

    private func generateImage() async {
        isGenerating = true
        showingResult = true

        // AI 画像生成プロンプトの構築
        let fullPrompt = """
        8-bit pixel art style, low resolution, chunky pixels,
        muted colors, pastel tones, low saturation, soft lighting,
        \(selectedStyle.promptSuffix),
        \(promptText),
        single character sprite, transparent background, PNG format
        """

        // TODO: Firebase Functions 経由で AI API を呼び出し
        // let url = try await AIService.generate(prompt: fullPrompt)
        // self.generatedImageURL = url

        // 仮の遅延（API呼び出しのシミュレーション）
        try? await Task.sleep(nanoseconds: 3_000_000_000)

        isGenerating = false
        // TODO: 実際にはここで generatedImageURL を設定
    }
}
