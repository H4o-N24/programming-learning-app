#!/usr/bin/env python3
"""
ピクセルライフ アセット一括生成スクリプト

このスクリプトは、100パターン×4フレーム=400枚のドット絵アセットを
AI画像生成APIを使って一括生成します。

使い方:
  python3 generate_assets.py --api-key YOUR_OPENAI_API_KEY --output ./Assets

必要: pip install openai Pillow
"""

import os
import sys
import json
import time
import argparse
from pathlib import Path

# バッテリー状態
BATTERY_STATES = ["max", "high", "medium", "low", "charging"]
BATTERY_DESCRIPTIONS = {
    "max": "very energetic and overjoyed",
    "high": "happy and cheerful",
    "medium": "calm and focused",
    "low": "tired and sleepy",
    "charging": "resting and recovering energy with sparkle effects"
}

# 天気状態
WEATHER_STATES = ["sunny", "cloudy", "rainy", "snowy", "warning"]
WEATHER_DESCRIPTIONS = {
    "sunny": "sunny blue sky with warm sunlight",
    "cloudy": "overcast cloudy sky, soft diffused light",
    "rainy": "rainy weather with raindrops on window",
    "snowy": "snowy weather with falling snowflakes",
    "warning": "dark stormy sky with dramatic lighting"
}

# 予定状態
SCHEDULE_STATES = ["none", "work", "private", "travel"]
SCHEDULE_DESCRIPTIONS = {
    "none": "relaxing at home in a cozy room",
    "work": "working at a desk with laptop and documents",
    "private": "enjoying leisure time at a park or cafe",
    "travel": "traveling outdoors with a bag, exploring"
}

# 動物キャラクター一覧
CHARACTERS = [
    "mike_neko",   # 三毛猫（デフォルト）
    "shiba_inu",   # 柴犬
    "usagi",       # うさぎ
    "kotori",      # 小鳥
    "hamster",     # ハムスター
    "penguin",     # ペンギン
    "fukuro",      # フクロウ
    "kitsune",     # キツネ
    "kame",        # カメ
    "dragon",      # ドラゴン
]

# キャラクター別プロンプト
CHARACTER_PROMPTS = {
    "mike_neko": "cute round chubby calico cat with big eyes, tiny paws",
    "shiba_inu": "adorable shiba inu puppy with curled tail, loyal expression",
    "usagi": "fluffy round white rabbit with long floppy ears, pink nose",
    "kotori": "small colorful parakeet bird with tiny wings, perched",
    "hamster": "chubby golden hamster with full cheek pouches, tiny body",
    "penguin": "baby penguin with round body, waddling pose",
    "fukuro": "wise-looking owl with large round eyes, small beak",
    "kitsune": "playful fox with bushy tail, mischievous expression",
    "kame": "small green turtle with patterned shell, cute face",
    "dragon": "tiny baby dragon with small wings and round body, friendly",
}

# 成長段階
GROWTH_STAGES = ["baby", "child", "teen", "adult", "elder"]
GROWTH_DESCRIPTIONS = {
    "baby": "very tiny and round, newborn proportions, oversized head",
    "child": "small and curious, playful young animal",
    "teen": "medium-sized, developing features, energetic",
    "adult": "full-grown, elegant and confident",
    "elder": "wise and serene, slightly larger, gentle expression",
}

# ベースプロンプト（仕様書のデザインガイドラインに準拠）
BASE_PROMPT = (
    "8-bit pixel art style, low resolution, chunky pixels, "
    "muted colors, pastel tones, low saturation, soft lighting, "
    "sophisticated and easy on the eyes, "
    "single animal character sprite, retro game aesthetic, "
    "PNG format with transparent background, no text"
)

# フレームバリエーション
FRAME_VARIATIONS = {
    0: "",  # 基本ポーズ
    1: "slightly tilted head curiously",  # 首をかしげる
    2: "paws raised playfully",  # 手足を上げる
    3: "eyes half closed sleepy blinking",  # まばたき・うとうと
}


def generate_prompt(character: str, battery: str, weather: str, schedule: str,
                    frame: int, growth: str = "child") -> str:
    """状態の組み合わせからプロンプトを生成"""
    battery_desc = BATTERY_DESCRIPTIONS[battery]
    weather_desc = WEATHER_DESCRIPTIONS[weather]
    schedule_desc = SCHEDULE_DESCRIPTIONS[schedule]
    frame_desc = FRAME_VARIATIONS[frame]
    char_desc = CHARACTER_PROMPTS.get(character, CHARACTER_PROMPTS["mike_neko"])
    growth_desc = GROWTH_DESCRIPTIONS.get(growth, GROWTH_DESCRIPTIONS["child"])

    prompt = (
        f"{BASE_PROMPT}, "
        f"{char_desc}, {growth_desc}, "
        f"looking {battery_desc}, "
        f"{schedule_desc}, "
        f"background shows {weather_desc}, "
        f"{frame_desc}"
    ).strip().rstrip(",")

    return prompt


def generate_asset_key(character: str, growth: str, battery: str, weather: str, schedule: str, frame: int) -> str:
    """アセットキーを生成"""
    return f"{character}_{growth}_{weather}_{battery}_{schedule}_frame{frame}"


def create_imageset_contents(filename: str) -> dict:
    """Contents.json の内容を生成"""
    return {
        "images": [
            {"filename": filename, "idiom": "universal", "scale": "1x"},
            {"idiom": "universal", "scale": "2x"},
            {"idiom": "universal", "scale": "3x"}
        ],
        "info": {"author": "xcode", "version": 1},
        "properties": {"template-rendering-intent": "original"}
    }


def generate_all_assets(api_key: str, output_dir: str, character: str = "mike_neko",
                        growth: str = "child", dry_run: bool = False, delay: float = 1.0):
    """全アセットを生成"""
    try:
        from openai import OpenAI
    except ImportError:
        print("Error: openai パッケージが必要です")
        print("  pip install openai")
        sys.exit(1)

    client = OpenAI(api_key=api_key)
    output_path = Path(output_dir)

    total = len(BATTERY_STATES) * len(WEATHER_STATES) * len(SCHEDULE_STATES) * len(FRAME_VARIATIONS)
    current = 0
    success = 0
    errors = []

    print(f"🐾 ピクセルライフ アセット生成開始")
    print(f"   キャラクター: {character}（成長段階: {growth}）")
    print(f"   合計: {total} 枚")
    print(f"   出力先: {output_path}")
    print()

    for battery in BATTERY_STATES:
        for weather in WEATHER_STATES:
            for schedule in SCHEDULE_STATES:
                for frame in range(len(FRAME_VARIATIONS)):
                    current += 1
                    asset_key = generate_asset_key(character, growth, battery, weather, schedule, frame)
                    filename = f"{asset_key}.png"

                    # 出力ディレクトリ
                    imageset_dir = output_path / f"{asset_key}.imageset"
                    imageset_dir.mkdir(parents=True, exist_ok=True)

                    # 既存チェック
                    image_path = imageset_dir / filename
                    if image_path.exists():
                        print(f"  ⏩ [{current}/{total}] {asset_key} (既存)")
                        success += 1
                        continue

                    prompt = generate_prompt(character, battery, weather, schedule, frame, growth)

                    if dry_run:
                        print(f"  🔍 [{current}/{total}] {asset_key}")
                        print(f"      Prompt: {prompt[:80]}...")
                        # Contents.json を作成
                        contents_path = imageset_dir / "Contents.json"
                        with open(contents_path, "w") as f:
                            json.dump(create_imageset_contents(filename), f, indent=2)
                        success += 1
                        continue

                    try:
                        print(f"  🎨 [{current}/{total}] {asset_key}...", end="", flush=True)

                        response = client.images.generate(
                            model="dall-e-3",
                            prompt=prompt,
                            n=1,
                            size="1024x1024",
                            quality="standard"
                        )

                        image_url = response.data[0].url

                        # 画像をダウンロード
                        import urllib.request
                        urllib.request.urlretrieve(image_url, str(image_path))

                        # Contents.json 作成
                        contents_path = imageset_dir / "Contents.json"
                        with open(contents_path, "w") as f:
                            json.dump(create_imageset_contents(filename), f, indent=2)

                        print(" ✅")
                        success += 1
                        time.sleep(delay)  # API レートリミット対策

                    except Exception as e:
                        print(f" ❌ {str(e)[:50]}")
                        errors.append({"asset": asset_key, "error": str(e)})

    # サマリー
    print()
    print(f"📊 結果サマリー")
    print(f"   成功: {success}/{total}")
    print(f"   エラー: {len(errors)}")

    if errors:
        print(f"\n❌ エラー一覧:")
        for err in errors:
            print(f"   - {err['asset']}: {err['error'][:60]}")

        # エラーログを保存
        error_log_path = output_path / "generation_errors.json"
        with open(error_log_path, "w") as f:
            json.dump(errors, f, indent=2, ensure_ascii=False)
        print(f"\n   エラーログ: {error_log_path}")


def main():
    parser = argparse.ArgumentParser(description="ピクセルライフ アセット一括生成")
    parser.add_argument("--api-key", required=True, help="OpenAI API キー")
    parser.add_argument("--output", default="./PixelLife/Resources/Assets.xcassets/Characters",
                        help="出力ディレクトリ")
    parser.add_argument("--character", default="mike_neko", choices=CHARACTERS,
                        help="生成する動物キャラクター")
    parser.add_argument("--growth", default="child", choices=GROWTH_STAGES,
                        help="成長段階（baby/child/teen/adult/elder）")
    parser.add_argument("--dry-run", action="store_true",
                        help="APIを呼ばずにプロンプトを確認")
    parser.add_argument("--delay", type=float, default=1.0,
                        help="API呼び出し間の待機時間（秒）")

    args = parser.parse_args()

    generate_all_assets(
        api_key=args.api_key,
        output_dir=args.output,
        character=args.character,
        growth=args.growth,
        dry_run=args.dry_run,
        delay=args.delay
    )


if __name__ == "__main__":
    main()
