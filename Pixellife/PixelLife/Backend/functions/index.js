// Firebase Cloud Functions
// PixelLife Backend

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

admin.initializeApp();

// ============================================================
// 1. 天気データプロキシ
// ============================================================

/**
 * 天気データ取得 API
 * OpenWeatherMap API への通信を仲介し、APIキーをクライアントから隠蔽
 *
 * @param {number} lat - 緯度
 * @param {number} lon - 経度
 * @returns {Object} 天気データ
 */
exports.getWeather = functions.https.onRequest(async (req, res) => {
    // CORS 設定
    res.set("Access-Control-Allow-Origin", "*");

    try {
        const { lat, lon } = req.query;

        if (!lat || !lon) {
            res.status(400).json({ error: "lat と lon パラメータが必要です" });
            return;
        }

        // TODO: 環境変数に設定した OpenWeatherMap API キーを使用
        const apiKey = functions.config().openweather?.key || "YOUR_API_KEY";
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ja`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== 200) {
            res.status(data.cod).json({ error: data.message });
            return;
        }

        // クライアント向けにデータを整形
        const result = {
            weather_code: data.weather[0].id,
            temperature: data.main.temp,
            description: data.weather[0].description,
            city_name: data.name,
            humidity: data.main.humidity,
            wind_speed: data.wind.speed,
            icon: data.weather[0].icon,
            timestamp: Date.now(),
        };

        // Firestore にキャッシュ（任意）
        await admin.firestore().collection("weather_cache").doc(`${lat}_${lon}`).set({
            ...result,
            cached_at: admin.firestore.FieldValue.serverTimestamp(),
        });

        res.json(result);
    } catch (error) {
        console.error("Weather API error:", error);
        res.status(500).json({ error: "天気データの取得に失敗しました" });
    }
});

// ============================================================
// 2. AI 画像生成
// ============================================================

/**
 * AI ドット絵生成 API
 * OpenAI DALL-E API を使用してカスタムドット絵を生成
 *
 * @param {string} prompt - 生成プロンプト
 * @param {string} userId - ユーザーID
 * @returns {Object} 生成された画像のURL
 */
exports.generatePixelArt = functions.https.onCall(async (data, context) => {
    // 認証チェック
    if (!context.auth) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "ログインが必要です"
        );
    }

    const userId = context.auth.uid;
    const { prompt, style } = data;

    if (!prompt) {
        throw new functions.https.HttpsError(
            "invalid-argument",
            "プロンプトが必要です"
        );
    }

    // サブスクリプション確認
    const userDoc = await admin.firestore().collection("users").doc(userId).get();
    const userData = userDoc.data();

    if (!userData || userData.subscription_tier !== "ai_pro") {
        throw new functions.https.HttpsError(
            "permission-denied",
            "AIプロプランへの登録が必要です"
        );
    }

    // 月間クレジットチェック
    const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
    const creditDoc = await admin.firestore()
        .collection("users")
        .doc(userId)
        .collection("ai_credits")
        .doc(currentMonth)
        .get();

    const usedCredits = creditDoc.exists ? creditDoc.data().used || 0 : 0;
    const maxCredits = 50; // AIプロプランの月間上限

    if (usedCredits >= maxCredits) {
        throw new functions.https.HttpsError(
            "resource-exhausted",
            "今月のAIクレジットを使い切りました"
        );
    }

    try {
        // ピクセルアートスタイルを強制するプロンプト構築
        const fullPrompt = `8-bit pixel art style, low resolution, chunky pixels, muted colors, pastel tones, low saturation, soft lighting, sophisticated and easy on the eyes, ${style || ""}, ${prompt}, single character sprite, PNG format, white background`;

        // TODO: OpenAI API キーを環境変数から取得
        const apiKey = functions.config().openai?.key || "YOUR_OPENAI_API_KEY";

        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "dall-e-3",
                prompt: fullPrompt,
                n: 1,
                size: "1024x1024",
                quality: "standard",
                response_format: "url",
            }),
        });

        const result = await response.json();

        if (!result.data || result.data.length === 0) {
            throw new Error("画像の生成に失敗しました");
        }

        const imageUrl = result.data[0].url;

        // 生成画像を Firebase Storage にダウンロード・保存
        const imageResponse = await fetch(imageUrl);
        const imageBuffer = await imageResponse.buffer();

        const bucket = admin.storage().bucket();
        const fileName = `ai_generated/${userId}/${Date.now()}.png`;
        const file = bucket.file(fileName);

        await file.save(imageBuffer, {
            metadata: {
                contentType: "image/png",
                metadata: {
                    userId: userId,
                    prompt: prompt,
                    style: style || "default",
                    generated_at: new Date().toISOString(),
                },
            },
        });

        // 公開 URL を取得
        const [signedUrl] = await file.getSignedUrl({
            action: "read",
            expires: "03-01-2030",
        });

        // クレジットを消費
        await admin.firestore()
            .collection("users")
            .doc(userId)
            .collection("ai_credits")
            .doc(currentMonth)
            .set(
                { used: admin.firestore.FieldValue.increment(1) },
                { merge: true }
            );

        // 生成履歴を保存
        await admin.firestore()
            .collection("users")
            .doc(userId)
            .collection("generated_assets")
            .add({
                prompt: prompt,
                style: style || "default",
                image_url: signedUrl,
                storage_path: fileName,
                created_at: admin.firestore.FieldValue.serverTimestamp(),
            });

        return {
            image_url: signedUrl,
            remaining_credits: maxCredits - usedCredits - 1,
        };
    } catch (error) {
        console.error("AI generation error:", error);
        throw new functions.https.HttpsError(
            "internal",
            "画像の生成中にエラーが発生しました"
        );
    }
});

// ============================================================
// 3. Google カレンダー同期
// ============================================================

/**
 * Google カレンダーの予定を取得
 *
 * @param {string} accessToken - Google OAuth アクセストークン
 * @returns {Array} 今日の予定リスト
 */
exports.getGoogleCalendarEvents = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "ログインが必要です"
        );
    }

    const userId = context.auth.uid;

    try {
        // Firestore からユーザーの Google アクセストークンを取得
        const tokenDoc = await admin.firestore()
            .collection("users")
            .doc(userId)
            .collection("tokens")
            .doc("google")
            .get();

        if (!tokenDoc.exists) {
            throw new functions.https.HttpsError(
                "not-found",
                "Googleアカウントが連携されていません"
            );
        }

        const accessToken = tokenDoc.data().access_token;

        // 今日の予定を取得
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

        const calendarUrl = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${startOfDay.toISOString()}&timeMax=${endOfDay.toISOString()}&singleEvents=true&orderBy=startTime`;

        const response = await fetch(calendarUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const calendarData = await response.json();

        if (calendarData.error) {
            throw new Error(calendarData.error.message);
        }

        const events = (calendarData.items || []).map((event) => ({
            title: event.summary || "無題",
            start_time: event.start.dateTime || event.start.date,
            end_time: event.end.dateTime || event.end.date,
            is_all_day: !event.start.dateTime,
            location: event.location || null,
        }));

        return { events };
    } catch (error) {
        console.error("Google Calendar error:", error);
        throw new functions.https.HttpsError(
            "internal",
            "カレンダーデータの取得に失敗しました"
        );
    }
});

// ============================================================
// 4. ユーザー管理
// ============================================================

/**
 * 新規ユーザー作成時のセットアップ
 */
exports.onUserCreated = functions.auth.user().onCreate(async (user) => {
    try {
        await admin.firestore().collection("users").doc(user.uid).set({
            email: user.email || null,
            display_name: user.displayName || null,
            subscription_tier: "basic",
            current_character: "pixel_chan",
            current_theme: "default",
            created_at: admin.firestore.FieldValue.serverTimestamp(),
            last_login: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log(`New user created: ${user.uid}`);
    } catch (error) {
        console.error("Error creating user document:", error);
    }
});

/**
 * ユーザー削除時のクリーンアップ
 */
exports.onUserDeleted = functions.auth.user().onDelete(async (user) => {
    try {
        // ユーザーデータを削除
        await admin.firestore().collection("users").doc(user.uid).delete();

        // 生成画像を削除
        const bucket = admin.storage().bucket();
        await bucket.deleteFiles({
            prefix: `ai_generated/${user.uid}/`,
        });

        console.log(`User data cleaned up: ${user.uid}`);
    } catch (error) {
        console.error("Error cleaning up user data:", error);
    }
});
