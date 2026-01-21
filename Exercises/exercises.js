/**
 * ============================================================================
 * Python練習問題100選 - 練習問題データ
 * ============================================================================
 * 
 * このファイルは100問の練習問題データを定義します。
 * 
 * データ構造:
 * - id: 問題番号 (1-100)
 * - title: 問題タイトル
 * - skill: 学習スキル
 * - category: カテゴリ (basics, input, condition, loop, list, advanced)
 * - task: 課題説明文
 * - expected: 期待される出力 (オプション)
 *   - type: "output" | "contains" | "output_regex" | "io"
 *   - value: 期待値
 * - explanation: 解説文
 * 
 * カテゴリ:
 * - basics (1-20): 出力と変数
 * - input (21-30): 入力処理
 * - condition (31-50): 条件分岐
 * - loop (51-70): 繰り返し処理
 * - list (71-85): リスト操作
 * - advanced (86-100): 辞書・関数・クラス
 */

const exercises = [
    // =========================================================================
    // 基礎編（1-20）: 出力と変数
    // =========================================================================
    {
        id: 1, title: "Hello World", skill: "print文の基本", category: "basics",
        task: "「Hello World」と表示するプログラムを作成してください。",
        expected: { type: "output", value: "Hello World" },
        explanation: `print()関数は、括弧内の文字列や値を画面に表示します。
文字列を表示するときは、ダブルクォート(")またはシングルクォート(')で囲みます。

例:
print("Hello World")  # Hello World と表示される` },

    {
        id: 2, title: "自己紹介", skill: "変数と文字列結合", category: "basics",
        task: "名前、年齢、趣味を変数に入れて自己紹介文を表示してください。",
        expected: { type: "contains", value: ["私の名前は", "年齢は", "趣味は"] },
        explanation: `変数はデータを格納する箱のようなものです。
= を使って値を代入します。
f文字列（f"..."）を使うと、{変数名}で変数の値を文字列に埋め込めます。

例:
name = "太郎"
print(f"私の名前は{name}です")` },

    {
        id: 3, title: "足し算", skill: "変数と算術演算", category: "basics",
        task: "2つの数値を変数に入れて、足し算の結果を表示してください。",
        expected: { type: "output_regex", value: /^[0-9]+$/ },
        explanation: `+ 演算子を使って足し算ができます。
数値はクォートで囲まず、そのまま書きます。

例:
a = 5
b = 3
result = a + b
print(result)  # 8` },

    {
        id: 4, title: "引き算", skill: "算術演算", category: "basics",
        task: "2つの数値を変数に入れて、引き算の結果を表示してください。",
        expected: { type: "output_regex", value: /^-?[0-9]+$/ },
        explanation: `- 演算子を使って引き算ができます。

例:
a = 10
b = 4
result = a - b
print(result)  # 6` },

    {
        id: 5, title: "掛け算", skill: "算術演算", category: "basics",
        task: "2つの数値を変数に入れて、掛け算の結果を表示してください。",
        expected: { type: "output_regex", value: /^[0-9]+$/ },
        explanation: `* 演算子を使って掛け算ができます。

例:
a = 6
b = 7
result = a * b
print(result)  # 42` },

    {
        id: 6, title: "割り算", skill: "算術演算", category: "basics",
        task: "2つの数値を変数に入れて、割り算の結果を表示してください。",
        expected: { type: "output_regex", value: /^[0-9]+\.[0-9]+/ },
        explanation: `/ 演算子を使って割り算ができます。
結果は常に小数（float）になります。
整数の結果が欲しい場合は // を使います。

例:
a = 15
b = 4
print(a / b)   # 3.75
print(a // b)  # 3` },

    {
        id: 7, title: "余り計算", skill: "剰余演算子", category: "basics",
        task: "2つの数値を変数に入れて、割り算の余りを表示してください。",
        expected: { type: "output_regex", value: /^[0-9]+$/ },
        explanation: `% 演算子（剰余演算子）を使うと余りを求められます。
偶数・奇数の判定などでよく使われます。

例:
a = 17
b = 5
print(a % b)  # 2 (17 ÷ 5 = 3 余り 2)` },

    {
        id: 8, title: "複合計算", skill: "複数の演算", category: "basics",
        task: "3つ以上の数値を使って複合的な計算結果を表示してください。",
        expected: { type: "output_regex", value: /^-?[0-9.]+$/ },
        explanation: `複数の演算子を組み合わせることができます。
計算の優先順位: () → ** → * / % → + -
括弧を使って優先順位を明示しましょう。

例:
a = 10
b = 5
c = 2
result = (a + b) * c
print(result)  # 30` },

    {
        id: 9, title: "文字列長", skill: "len関数", category: "basics",
        task: "文字列の長さを表示するプログラムを作成してください。",
        expected: { type: "output_regex", value: /^[0-9]+$/ },
        explanation: `len()関数で文字列の文字数を取得できます。
日本語の場合、1文字ずつカウントされます。

例:
text = "こんにちは"
print(len(text))  # 5` },

    {
        id: 10, title: "文字列繰り返し", skill: "文字列の乗算", category: "basics",
        task: "文字列を5回繰り返して表示してください。",
        expected: { type: "output_regex", value: /^(.{1,})\1{4}$/ },
        explanation: `文字列に * 演算子を使うと繰り返しができます。

例:
text = "Hello"
print(text * 3)  # HelloHelloHello` },

    {
        id: 11, title: "型変換", skill: "str関数", category: "basics",
        task: "数値を文字列に変換して他の文字列と結合してください。",
        explanation: `str()関数で数値を文字列に変換できます。
文字列と数値は直接 + では結合できないため、変換が必要です。

例:
age = 20
message = "年齢は" + str(age) + "歳です"
print(message)` },

    {
        id: 12, title: "整数変換", skill: "int関数", category: "basics",
        task: "文字列の数字を整数に変換して計算してください。",
        explanation: `int()関数で文字列を整数に変換できます。
input()で受け取った値は文字列なので、計算には変換が必要です。

例:
num_str = "42"
num = int(num_str)
print(num + 8)  # 50` },

    {
        id: 13, title: "浮動小数点", skill: "float型", category: "basics",
        task: "小数を含む計算を行ってください。",
        explanation: `float型は小数を扱う型です。
float()関数で変換できます。

例:
price = 100.5
tax = 1.1
total = price * tax
print(total)  # 110.55` },

    {
        id: 14, title: "円の面積", skill: "数学的計算", category: "basics",
        task: "半径を入力し、円の面積を計算してください（π=3.14）。",
        explanation: `円の面積 = π × 半径²（半径の2乗）
累乗は ** 演算子を使います。

例:
pi = 3.14
radius = 5
area = pi * radius ** 2
print(area)  # 78.5` },

    {
        id: 15, title: "温度変換", skill: "数式の適用", category: "basics",
        task: "摂氏温度を華氏温度に変換してください。",
        explanation: `華氏 = 摂氏 × 9/5 + 32
数式を使った問題では、公式をそのままコードに置き換えます。

例:
celsius = 25
fahrenheit = celsius * 9/5 + 32
print(fahrenheit)  # 77.0` },

    {
        id: 16, title: "BMI計算", skill: "実用的な計算", category: "basics",
        task: "身長と体重からBMIを計算してください。",
        explanation: `BMI = 体重(kg) ÷ 身長(m)²
身長がcmの場合は100で割ってmに変換します。

例:
weight = 60
height_cm = 170
height_m = height_cm / 100
bmi = weight / height_m ** 2
print(f"BMI: {bmi:.1f}")` },

    {
        id: 17, title: "複数行出力", skill: "複数のprint", category: "basics",
        task: "複数行のメッセージを表示してください。",
        explanation: `print()を複数回呼び出すと、それぞれ改行されて表示されます。
または '''（三重クォート）で複数行文字列を作成できます。

例:
print("1行目")
print("2行目")
# または
print('''1行目
2行目''')` },

    {
        id: 18, title: "エスケープ文字", skill: "エスケープシーケンス", category: "basics",
        task: "タブや改行を使って整形された出力を作成してください。",
        explanation: `\\n は改行、\\t はタブ（インデント）を表します。

例:
print("名前\\t年齢")
print("太郎\\t20")
print("花子\\t25")
# 出力:
# 名前    年齢
# 太郎    20
# 花子    25` },

    {
        id: 19, title: "文字列フォーマット", skill: "f-string", category: "basics",
        task: "f文字列を使って変数を埋め込んだ文を表示してください。",
        explanation: `f文字列は Python 3.6以降で使える便利な機能です。
{変数名}で値を埋め込み、{変数名:.2f}で小数点以下の桁数を指定できます。

例:
name = "太郎"
score = 89.5
print(f"{name}さんの点数は{score:.1f}点です")` },

    {
        id: 20, title: "コメント", skill: "コメントの書き方", category: "basics",
        task: "コメントを使ってコードを説明してください。",
        explanation: `# は1行コメント、"""は複数行コメント（docstring）に使います。
コメントはプログラムの動作に影響しません。

例:
# これは1行コメント
"""
これは
複数行コメント
"""
print("Hello")  # 行末にもコメント可能` },

    // 入力編（21-30）
    {
        id: 21, title: "名前入力", skill: "input関数", category: "input",
        task: "名前を入力させて挨拶を表示してください。",
        expected: { type: "io", inputs: ["花子"], output_contains: ["花子"] },
        explanation: `input()関数はユーザーからの入力を受け取ります。
括弧内にプロンプト（表示メッセージ）を書けます。

例:
name = input("名前を入力してください: ")
print(f"こんにちは、{name}さん！")` },

    {
        id: 22, title: "数値入力", skill: "input + int", category: "input",
        task: "数値を入力させて計算結果を表示してください。",
        expected: { type: "io", inputs: ["5"], output_regex: /10|25|0/ }, /* 2倍, 2乗など何らかの計算 */
        explanation: `input()は常に文字列を返すので、計算には型変換が必要です。

例:
num = int(input("数値を入力: "))
result = num * 2
print(f"{num}の2倍は{result}です")` },

    {
        id: 23, title: "2つの入力", skill: "複数のinput", category: "input",
        task: "2つの数値を入力させて合計を表示してください。",
        expected: { type: "io", inputs: ["10", "20"], output_contains: ["30"] },
        explanation: `input()を複数回使って、複数の値を受け取れます。

例:
a = int(input("1つ目の数値: "))
b = int(input("2つ目の数値: "))
print(f"合計: {a + b}")` },

    {
        id: 24, title: "年齢計算", skill: "現実的な入力処理", category: "input",
        task: "生まれ年を入力させて年齢を計算してください。",
        expected: { type: "io", inputs: ["2000"], output_regex: /2[0-9]/ },
        explanation: `現在の年から生まれ年を引くと年齢が計算できます。

例:
current_year = 2026
birth_year = int(input("生まれ年を入力: "))
age = current_year - birth_year
print(f"あなたは{age}歳です")` },

    {
        id: 25, title: "割り勘計算", skill: "実用アプリ", category: "input",
        task: "金額と人数を入力させて割り勘額を計算してください。",
        expected: { type: "io", inputs: ["1000", "4"], output_contains: ["250"] },
        explanation: `割り勘 = 合計金額 ÷ 人数
端数処理には int() や round() を使います。

例:
total = int(input("合計金額: "))
people = int(input("人数: "))
per_person = total // people
print(f"1人あたり: {per_person}円")` },

    {
        id: 26, title: "消費税計算", skill: "パーセント計算", category: "input",
        task: "価格を入力させて消費税込みの金額を計算してください。",
        explanation: `税込価格 = 価格 × (1 + 税率)
消費税10%なら 1.1 を掛けます。

例:
price = int(input("価格: "))
tax_included = int(price * 1.1)
print(f"税込価格: {tax_included}円")` },

    {
        id: 27, title: "単位変換", skill: "単位変換", category: "input",
        task: "センチメートルを入力させてメートルに変換してください。",
        explanation: `cm → m は 100 で割ります。
他の単位変換も同様に換算式を使います。

例:
cm = float(input("センチメートル: "))
m = cm / 100
print(f"{cm}cmは{m}mです")` },

    {
        id: 28, title: "平均計算", skill: "平均の計算", category: "input",
        task: "3つの数値を入力させて平均を計算してください。",
        explanation: `平均 = 合計 ÷ 個数

例:
a = int(input("1つ目: "))
b = int(input("2つ目: "))
c = int(input("3つ目: "))
average = (a + b + c) / 3
print(f"平均: {average}")` },

    {
        id: 29, title: "秒変換", skill: "時間の変換", category: "input",
        task: "秒を入力させて分と秒に変換してください。",
        explanation: `分 = 秒 // 60、残りの秒 = 秒 % 60
// は整数除算、% は余りを求めます。

例:
total_seconds = int(input("秒数: "))
minutes = total_seconds // 60
seconds = total_seconds % 60
print(f"{minutes}分{seconds}秒")` },

    {
        id: 30, title: "挨拶文作成", skill: "文字列操作", category: "input",
        task: "名前と時間帯を入力させて適切な挨拶を作成してください。",
        explanation: `入力された情報を組み合わせて文章を作成します。

例:
name = input("名前: ")
time = input("時間帯（朝/昼/夜）: ")
if time == "朝":
    print(f"おはようございます、{name}さん")
elif time == "昼":
    print(f"こんにちは、{name}さん")` },

    // 条件分岐編（31-50）
    {
        id: 31, title: "正負判定", skill: "if-elif-else", category: "condition",
        task: "数値が正か負かゼロかを判定してください。",
        explanation: `if-elif-else で複数の条件を順番に判定します。

例:
num = int(input("数値: "))
if num > 0:
    print("正の数")
elif num < 0:
    print("負の数")
else:
    print("ゼロ")` },

    {
        id: 32, title: "偶数奇数", skill: "剰余演算子とif", category: "condition",
        task: "数値が偶数か奇数かを判定してください。",
        explanation: `2で割った余りが0なら偶数、1なら奇数です。

例:
num = int(input("数値: "))
if num % 2 == 0:
    print("偶数")
else:
    print("奇数")` },

    {
        id: 33, title: "合否判定", skill: "比較演算子", category: "condition",
        task: "点数を入力させて合格(60点以上)か不合格かを判定してください。",
        explanation: `>=（以上）、<=（以下）、>（より大きい）、<（より小さい）

例:
score = int(input("点数: "))
if score >= 60:
    print("合格")
else:
    print("不合格")` },

    {
        id: 34, title: "成績判定", skill: "複数条件", category: "condition",
        task: "点数に応じてA,B,C,D,Fの成績を表示してください。",
        explanation: `複数の条件を elif で連結します。
上から順に判定されるので、条件の順序に注意。

例:
score = int(input("点数: "))
if score >= 90:
    print("A")
elif score >= 80:
    print("B")
elif score >= 70:
    print("C")
elif score >= 60:
    print("D")
else:
    print("F")` },

    {
        id: 35, title: "最大値", skill: "比較", category: "condition",
        task: "2つの数値のうち大きい方を表示してください。",
        explanation: `if文で比較するか、max()関数を使います。

例:
a = int(input("1つ目: "))
b = int(input("2つ目: "))
if a > b:
    print(f"大きい方: {a}")
else:
    print(f"大きい方: {b}")
# または
print(f"大きい方: {max(a, b)}")` },

    {
        id: 36, title: "3つの最大値", skill: "複数比較", category: "condition",
        task: "3つの数値のうち最大のものを表示してください。",
        explanation: `max()関数に複数の値を渡せます。

例:
a = int(input("1つ目: "))
b = int(input("2つ目: "))
c = int(input("3つ目: "))
print(f"最大値: {max(a, b, c)}")` },

    {
        id: 37, title: "年齢区分", skill: "範囲判定", category: "condition",
        task: "年齢に応じて子供/大人/シニアを判定してください。",
        explanation: `年齢の範囲に応じて条件分岐します。

例:
age = int(input("年齢: "))
if age < 18:
    print("子供")
elif age < 65:
    print("大人")
else:
    print("シニア")` },

    {
        id: 38, title: "うるう年", skill: "複合条件", category: "condition",
        task: "入力された年がうるう年かどうか判定してください。",
        explanation: `うるう年の条件：
①4で割り切れる ②100で割り切れない、または400で割り切れる

例:
year = int(input("年: "))
if (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0):
    print("うるう年")
else:
    print("うるう年ではない")` },

    {
        id: 39, title: "三角形判定", skill: "論理演算", category: "condition",
        task: "3辺の長さから三角形が作れるか判定してください。",
        explanation: `三角形の成立条件：任意の2辺の和 > 残りの1辺

例:
a = int(input("辺a: "))
b = int(input("辺b: "))
c = int(input("辺c: "))
if a + b > c and b + c > a and c + a > b:
    print("三角形が作れる")
else:
    print("三角形は作れない")` },

    {
        id: 40, title: "パスワード確認", skill: "文字列比較", category: "condition",
        task: "入力されたパスワードが正しいか判定してください。",
        explanation: `== で文字列を比較できます。

例:
correct_password = "secret123"
user_input = input("パスワード: ")
if user_input == correct_password:
    print("ログイン成功")
else:
    print("パスワードが違います")` },

    {
        id: 41, title: "数値範囲", skill: "and演算子", category: "condition",
        task: "数値が指定範囲内にあるか判定してください。",
        explanation: `and演算子で複数条件を組み合わせます。

例:
num = int(input("数値(1-100): "))
if num >= 1 and num <= 100:
    print("範囲内")
else:
    print("範囲外")
# または
if 1 <= num <= 100:
    print("範囲内")` },

    {
        id: 42, title: "複数条件", skill: "論理演算子", category: "condition",
        task: "複数の条件を満たすか判定してください。",
        explanation: `and（かつ）、or（または）、not（否定）で複数条件を組み合わせます。

例:
age = int(input("年齢: "))
has_license = input("免許あり(y/n): ") == "y"
if age >= 18 and has_license:
    print("運転できます")` },

    {
        id: 43, title: "絶対値", skill: "条件分岐", category: "condition",
        task: "数値の絶対値を計算してください（abs関数を使わずに）。",
        explanation: `絶対値：負の数なら符号を反転、正の数ならそのまま。

例:
num = int(input("数値: "))
if num < 0:
    result = -num
else:
    result = num
print(f"絶対値: {result}")` },

    {
        id: 44, title: "電卓", skill: "複数分岐", category: "condition",
        task: "2つの数値と演算子を入力させて計算結果を表示してください。",
        explanation: `演算子に応じて異なる計算を行います。

例:
a = float(input("1つ目: "))
op = input("演算子(+,-,*,/): ")
b = float(input("2つ目: "))
if op == "+":
    print(a + b)
elif op == "-":
    print(a - b)
# ...他の演算子も同様` },

    {
        id: 45, title: "月の日数", skill: "多分岐", category: "condition",
        task: "月を入力させてその月の日数を表示してください。",
        explanation: `月によって日数が異なります。
31日：1,3,5,7,8,10,12月
30日：4,6,9,11月
28/29日：2月

例:
month = int(input("月: "))
if month in [1,3,5,7,8,10,12]:
    print("31日")
elif month in [4,6,9,11]:
    print("30日")
elif month == 2:
    print("28日または29日")` },

    {
        id: 46, title: "季節判定", skill: "範囲判定", category: "condition",
        task: "月を入力させて季節を表示してください。",
        explanation: `日本の一般的な季節区分で判定します。

例:
month = int(input("月: "))
if month in [3, 4, 5]:
    print("春")
elif month in [6, 7, 8]:
    print("夏")
elif month in [9, 10, 11]:
    print("秋")
else:
    print("冬")` },

    {
        id: 47, title: "入場料計算", skill: "実用的な条件分岐", category: "condition",
        task: "年齢に応じて入場料を計算してください。",
        explanation: `年齢区分ごとに料金を設定します。

例:
age = int(input("年齢: "))
if age < 6:
    price = 0
elif age < 12:
    price = 300
elif age < 18:
    price = 500
elif age < 65:
    price = 1000
else:
    price = 700
print(f"入場料: {price}円")` },

    {
        id: 48, title: "おみくじ", skill: "random + if", category: "condition",
        task: "ランダムにおみくじの結果を表示してください。",
        explanation: `randomモジュールでランダムな数を生成します。

例:
import random
result = random.randint(1, 5)
if result == 1:
    print("大吉")
elif result == 2:
    print("中吉")
elif result == 3:
    print("小吉")
elif result == 4:
    print("吉")
else:
    print("凶")` },

    {
        id: 49, title: "じゃんけん", skill: "random + 条件分岐", category: "condition",
        task: "コンピュータとじゃんけんをするプログラムを作成してください。",
        explanation: `randomでコンピュータの手を決め、勝敗を判定します。

例:
import random
hands = ["グー", "チョキ", "パー"]
user = input("手を入力(グー/チョキ/パー): ")
com = random.choice(hands)
print(f"コンピュータ: {com}")
# 勝敗判定のロジックを書く` },

    {
        id: 50, title: "数当てゲーム", skill: "ゲームロジック", category: "condition",
        task: "コンピュータが選んだ数を当てるゲームを作成してください。",
        explanation: `ヒントを出しながら繰り返し当てさせます。

例:
import random
answer = random.randint(1, 100)
while True:
    guess = int(input("数を当てて: "))
    if guess == answer:
        print("正解！")
        break
    elif guess < answer:
        print("もっと大きい")
    else:
        print("もっと小さい")` },

    // 繰り返し編（51-70）
    {
        id: 51, title: "カウントアップ", skill: "for range", category: "loop",
        task: "1から10まで表示してください。",
        explanation: `range(start, end)は start から end-1 までの数を生成します。

例:
for i in range(1, 11):
    print(i)
# 1, 2, 3, ... 10` },

    {
        id: 52, title: "カウントダウン", skill: "逆順ループ", category: "loop",
        task: "10から1まで表示してください。",
        explanation: `range(start, end, step)でステップを-1にすると逆順になります。

例:
for i in range(10, 0, -1):
    print(i)
# 10, 9, 8, ... 1` },

    {
        id: 53, title: "偶数表示", skill: "条件付きループ", category: "loop",
        task: "1から20までの偶数を表示してください。",
        explanation: `ステップを2にするか、if文で偶数を判定します。

例:
for i in range(2, 21, 2):
    print(i)
# または
for i in range(1, 21):
    if i % 2 == 0:
        print(i)` },

    {
        id: 54, title: "合計計算", skill: "累積加算", category: "loop",
        task: "1から100までの合計を計算してください。",
        explanation: `変数を0で初期化し、ループ内で加算します。

例:
total = 0
for i in range(1, 101):
    total += i  # total = total + i と同じ
print(total)  # 5050` },

    {
        id: 55, title: "掛け算表", skill: "ループと計算", category: "loop",
        task: "指定した段の九九を表示してください。",
        explanation: `入力された段の1～9倍を計算します。

例:
dan = int(input("何の段？: "))
for i in range(1, 10):
    print(f"{dan} × {i} = {dan * i}")` },

    {
        id: 56, title: "九九表", skill: "二重ループ", category: "loop",
        task: "九九の表全体を表示してください。",
        explanation: `ネストしたfor文で2次元の処理ができます。

例:
for i in range(1, 10):
    for j in range(1, 10):
        print(f"{i*j:2d}", end=" ")
    print()  # 改行` },

    {
        id: 57, title: "階乗計算", skill: "累積乗算", category: "loop",
        task: "入力された数の階乗を計算してください。",
        explanation: `階乗: n! = n × (n-1) × ... × 2 × 1

例:
n = int(input("数値: "))
result = 1
for i in range(1, n + 1):
    result *= i
print(f"{n}! = {result}")` },

    {
        id: 58, title: "フィボナッチ", skill: "数列", category: "loop",
        task: "フィボナッチ数列を指定個数表示してください。",
        explanation: `フィボナッチ: 各項 = 前の2項の和 (0, 1, 1, 2, 3, 5, 8, ...)

例:
n = int(input("何項まで？: "))
a, b = 0, 1
for _ in range(n):
    print(a, end=" ")
    a, b = b, a + b` },

    {
        id: 59, title: "素数判定", skill: "ループと条件", category: "loop",
        task: "入力された数が素数かどうか判定してください。",
        explanation: `素数: 1とその数自身でしか割り切れない数

例:
n = int(input("数値: "))
is_prime = True
if n < 2:
    is_prime = False
for i in range(2, n):
    if n % i == 0:
        is_prime = False
        break
print("素数" if is_prime else "素数ではない")` },

    {
        id: 60, title: "約数列挙", skill: "条件付きループ", category: "loop",
        task: "入力された数の約数をすべて表示してください。",
        explanation: `約数: その数を割り切れる数

例:
n = int(input("数値: "))
for i in range(1, n + 1):
    if n % i == 0:
        print(i, end=" ")
# 12 → 1 2 3 4 6 12` },

    {
        id: 61, title: "文字列逆転", skill: "文字列ループ", category: "loop",
        task: "文字列を逆順に表示してください。",
        explanation: `スライス[::-1]で簡単に逆順にできます。

例:
text = input("文字列: ")
print(text[::-1])
# または
for i in range(len(text) - 1, -1, -1):
    print(text[i], end="")` },

    {
        id: 62, title: "文字カウント", skill: "カウント処理", category: "loop",
        task: "文字列中の特定文字の個数を数えてください。",
        explanation: `count()メソッドか、ループでカウントします。

例:
text = input("文字列: ")
char = input("探す文字: ")
count = 0
for c in text:
    if c == char:
        count += 1
print(f"{char}は{count}個")
# または: print(text.count(char))` },

    {
        id: 63, title: "星のピラミッド", skill: "パターン出力", category: "loop",
        task: "星で三角形を描いてください。",
        explanation: `各行で星の数を増やします。

例:
n = int(input("高さ: "))
for i in range(1, n + 1):
    print("*" * i)
# 高さ5の場合:
# *
# **
# ***
# ****
# *****` },

    {
        id: 64, title: "逆ピラミッド", skill: "パターン出力", category: "loop",
        task: "星で逆三角形を描いてください。",
        explanation: `各行で星の数を減らします。

例:
n = int(input("高さ: "))
for i in range(n, 0, -1):
    print("*" * i)
# 高さ5の場合:
# *****
# ****
# ***
# **
# *` },

    {
        id: 65, title: "while基本", skill: "while文", category: "loop",
        task: "whileループで1から10まで表示してください。",
        explanation: `条件が真の間ループを続けます。
無限ループに注意！カウンタの更新を忘れずに。

例:
i = 1
while i <= 10:
    print(i)
    i += 1` },

    {
        id: 66, title: "入力繰り返し", skill: "while + break", category: "loop",
        task: "「終了」と入力されるまで繰り返すプログラムを作成してください。",
        explanation: `break文でループを抜けられます。

例:
while True:
    text = input("入力(終了で終わり): ")
    if text == "終了":
        print("終了します")
        break
    print(f"入力内容: {text}")` },

    {
        id: 67, title: "数値合計", skill: "番兵法", category: "loop",
        task: "複数の数値を入力させて合計を計算してください（0で終了）。",
        explanation: `特定の値（番兵）が入力されたら終了します。

例:
total = 0
while True:
    num = int(input("数値(0で終了): "))
    if num == 0:
        break
    total += num
print(f"合計: {total}")` },

    {
        id: 68, title: "パスワード試行", skill: "while + 条件", category: "loop",
        task: "正しいパスワードが入力されるまで繰り返してください。",
        explanation: `条件を満たすまでループを続けます。

例:
password = "secret"
while True:
    user_input = input("パスワード: ")
    if user_input == password:
        print("ログイン成功！")
        break
    print("パスワードが違います")` },

    {
        id: 69, title: "メニュー選択", skill: "ループメニュー", category: "loop",
        task: "メニューを表示して選択を繰り返すプログラムを作成してください。",
        explanation: `メニューを表示し、選択に応じて処理を分岐します。

例:
while True:
    print("\\n1. 足し算")
    print("2. 引き算")
    print("0. 終了")
    choice = input("選択: ")
    if choice == "0":
        break
    elif choice == "1":
        print("足し算を実行")
    # ...` },

    {
        id: 70, title: "無限ループ脱出", skill: "break文", category: "loop",
        task: "特定条件でbreakするプログラムを作成してください。",
        explanation: `breakは最も内側のループを終了します。
continueは次の繰り返しにスキップします。

例:
for i in range(1, 100):
    if i > 10:
        break
    if i % 2 == 0:
        continue  # 偶数はスキップ
    print(i)  # 1, 3, 5, 7, 9` },

    // リスト編（71-85）
    {
        id: 71, title: "リスト作成", skill: "リストの基本", category: "list",
        task: "リストを作成して全要素を表示してください。",
        explanation: `リストは [] で作成し、複数の値を格納できます。

例:
fruits = ["りんご", "バナナ", "オレンジ"]
for fruit in fruits:
    print(fruit)
# または
print(fruits)` },

    {
        id: 72, title: "リスト追加", skill: "append", category: "list",
        task: "リストに要素を追加してください。",
        explanation: `append()で末尾に要素を追加します。
insert()で指定位置に挿入できます。

例:
fruits = ["りんご"]
fruits.append("バナナ")
fruits.insert(0, "メロン")  # 先頭に挿入
print(fruits)  # ["メロン", "りんご", "バナナ"]` },

    {
        id: 73, title: "リスト削除", skill: "remove, pop", category: "list",
        task: "リストから要素を削除してください。",
        explanation: `remove()は値で削除、pop()はインデックスで削除します。

例:
fruits = ["りんご", "バナナ", "オレンジ"]
fruits.remove("バナナ")  # 値で削除
last = fruits.pop()  # 最後の要素を削除して取得
print(fruits)` },

    {
        id: 74, title: "リスト合計", skill: "sum関数", category: "list",
        task: "リスト内の数値の合計を計算してください。",
        explanation: `sum()関数でリストの合計を計算できます。

例:
numbers = [10, 20, 30, 40, 50]
total = sum(numbers)
print(f"合計: {total}")  # 150` },

    {
        id: 75, title: "リスト最大最小", skill: "max, min", category: "list",
        task: "リスト内の最大値と最小値を求めてください。",
        explanation: `max()で最大値、min()で最小値を取得できます。

例:
numbers = [15, 8, 42, 23, 4]
print(f"最大: {max(numbers)}")  # 42
print(f"最小: {min(numbers)}")  # 4` },

    {
        id: 76, title: "リスト平均", skill: "平均計算", category: "list",
        task: "リスト内の数値の平均を計算してください。",
        explanation: `平均 = 合計 ÷ 要素数
len()で要素数を取得できます。

例:
numbers = [80, 75, 90, 85, 95]
average = sum(numbers) / len(numbers)
print(f"平均: {average}")` },

    {
        id: 77, title: "リストソート", skill: "sort", category: "list",
        task: "リストを昇順・降順にソートしてください。",
        explanation: `sort()でリスト自体を変更、sorted()で新しいリストを作成。

例:
numbers = [3, 1, 4, 1, 5, 9]
numbers.sort()  # 昇順
print(numbers)  # [1, 1, 3, 4, 5, 9]
numbers.sort(reverse=True)  # 降順
print(numbers)  # [9, 5, 4, 3, 1, 1]` },

    {
        id: 78, title: "リスト検索", skill: "in演算子", category: "list",
        task: "リスト内に特定の要素があるか検索してください。",
        explanation: `in演算子で要素の存在を確認できます。
index()で位置を取得できます。

例:
fruits = ["りんご", "バナナ", "オレンジ"]
if "バナナ" in fruits:
    print("バナナがあります")
    print(f"位置: {fruits.index('バナナ')}")` },

    {
        id: 79, title: "リストスライス", skill: "スライス", category: "list",
        task: "リストの一部を取り出してください。",
        explanation: `list[start:end]でstart～end-1の要素を取得。

例:
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
print(numbers[2:5])   # [2, 3, 4]
print(numbers[:3])    # [0, 1, 2]
print(numbers[7:])    # [7, 8, 9]
print(numbers[::2])   # [0, 2, 4, 6, 8]` },

    {
        id: 80, title: "リスト内包表記", skill: "内包表記", category: "list",
        task: "リスト内包表記で新しいリストを作成してください。",
        explanation: `リスト内包表記は簡潔にリストを作成する方法です。
[式 for 変数 in イテラブル if 条件]

例:
# 1-10の2乗のリスト
squares = [x**2 for x in range(1, 11)]
print(squares)  # [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]

# 偶数のみ
evens = [x for x in range(1, 11) if x % 2 == 0]` },

    {
        id: 81, title: "重複削除", skill: "set変換", category: "list",
        task: "リストから重複を削除してください。",
        explanation: `set()に変換すると重複が削除されます。

例:
with_duplicates = [1, 2, 2, 3, 3, 3, 4]
no_duplicates = list(set(with_duplicates))
print(no_duplicates)  # [1, 2, 3, 4]
# 注意: 順序が保持されない場合があります` },

    {
        id: 82, title: "リスト結合", skill: "リスト結合", category: "list",
        task: "2つのリストを結合してください。",
        explanation: `+ 演算子またはextend()でリストを結合できます。

例:
list1 = [1, 2, 3]
list2 = [4, 5, 6]
combined = list1 + list2
print(combined)  # [1, 2, 3, 4, 5, 6]
# または
list1.extend(list2)` },

    {
        id: 83, title: "インデックス操作", skill: "インデックス", category: "list",
        task: "リストの特定位置の要素を変更してください。",
        explanation: `インデックスは0から始まります。負のインデックスは末尾から数えます。

例:
fruits = ["りんご", "バナナ", "オレンジ"]
fruits[1] = "メロン"  # 2番目を変更
print(fruits[-1])  # 最後の要素: オレンジ
print(fruits)  # ["りんご", "メロン", "オレンジ"]` },

    {
        id: 84, title: "多次元リスト", skill: "ネストしたリスト", category: "list",
        task: "2次元リストを作成して操作してください。",
        explanation: `リストの中にリストを入れると多次元配列になります。

例:
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]
print(matrix[0][0])  # 1
print(matrix[1][2])  # 6
for row in matrix:
    print(row)` },

    {
        id: 85, title: "リストシャッフル", skill: "random.shuffle", category: "list",
        task: "リストの要素をランダムに並べ替えてください。",
        explanation: `random.shuffle()でリストをシャッフルします。

例:
import random
cards = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
random.shuffle(cards)
print(cards)  # ランダムな順序` },

    // 辞書・関数編（86-100）
    {
        id: 86, title: "辞書作成", skill: "辞書の基本", category: "advanced",
        task: "辞書を作成してキーと値を表示してください。",
        explanation: `辞書は {キー: 値} の形式でデータを格納します。

例:
person = {
    "name": "太郎",
    "age": 20,
    "city": "東京"
}
print(person["name"])  # 太郎
print(person)` },

    {
        id: 87, title: "辞書追加", skill: "辞書の更新", category: "advanced",
        task: "辞書に新しいキーと値を追加してください。",
        explanation: `新しいキーに値を代入すると追加されます。

例:
person = {"name": "太郎"}
person["age"] = 20  # 追加
person["name"] = "次郎"  # 更新
print(person)  # {"name": "次郎", "age": 20}` },

    {
        id: 88, title: "辞書検索", skill: "辞書のアクセス", category: "advanced",
        task: "辞書からキーを使って値を取得してください。",
        explanation: `dict[key]またはget()メソッドで値を取得します。
get()はキーがない場合にデフォルト値を返せます。

例:
scores = {"math": 80, "english": 90}
print(scores["math"])  # 80
print(scores.get("science", 0))  # 0 (キーがない場合)` },

    {
        id: 89, title: "辞書ループ", skill: "items()", category: "advanced",
        task: "辞書のすべてのキーと値をループで表示してください。",
        explanation: `items()でキーと値のペアを取得できます。

例:
scores = {"math": 80, "english": 90, "science": 85}
for subject, score in scores.items():
    print(f"{subject}: {score}点")
# keys()でキーのみ、values()で値のみ` },

    {
        id: 90, title: "関数基本", skill: "def文", category: "advanced",
        task: "引数なしの関数を作成して呼び出してください。",
        explanation: `def で関数を定義し、()で呼び出します。

例:
def greet():
    print("こんにちは！")
    print("ようこそ！")

greet()  # 関数を呼び出す` },

    {
        id: 91, title: "引数関数", skill: "関数の引数", category: "advanced",
        task: "引数を受け取る関数を作成してください。",
        explanation: `引数は関数に渡すデータです。

例:
def greet(name):
    print(f"こんにちは、{name}さん！")

greet("太郎")  # こんにちは、太郎さん！
greet("花子")  # こんにちは、花子さん！` },

    {
        id: 92, title: "戻り値関数", skill: "return文", category: "advanced",
        task: "値を返す関数を作成してください。",
        explanation: `returnで値を返すと、呼び出し元で使えます。

例:
def add(a, b):
    return a + b

result = add(5, 3)
print(result)  # 8
print(add(10, 20))  # 30` },

    {
        id: 93, title: "複数引数", skill: "複数パラメータ", category: "advanced",
        task: "複数の引数を受け取る関数を作成してください。",
        explanation: `カンマ区切りで複数の引数を定義できます。

例:
def introduce(name, age, hobby):
    print(f"{name}、{age}歳、趣味は{hobby}")

introduce("太郎", 20, "ゲーム")` },

    {
        id: 94, title: "デフォルト引数", skill: "デフォルト値", category: "advanced",
        task: "デフォルト引数を持つ関数を作成してください。",
        explanation: `引数にデフォルト値を設定すると、省略可能になります。

例:
def greet(name, greeting="こんにちは"):
    print(f"{greeting}、{name}さん！")

greet("太郎")  # こんにちは、太郎さん！
greet("太郎", "おはよう")  # おはよう、太郎さん！` },

    {
        id: 95, title: "簡易電話帳", skill: "実用アプリ", category: "advanced",
        task: "辞書を使った電話帳アプリを作成してください。",
        explanation: `辞書で名前と電話番号を管理します。

例:
phone_book = {}
while True:
    cmd = input("[1]追加 [2]検索 [0]終了: ")
    if cmd == "0":
        break
    elif cmd == "1":
        name = input("名前: ")
        number = input("番号: ")
        phone_book[name] = number
    elif cmd == "2":
        name = input("名前: ")
        print(phone_book.get(name, "見つかりません"))` },

    {
        id: 96, title: "成績管理", skill: "実用アプリ", category: "advanced",
        task: "辞書を使って成績を管理するプログラムを作成してください。",
        explanation: `科目をキー、点数を値として管理します。

例:
scores = {}
scores["数学"] = 85
scores["英語"] = 90
scores["国語"] = 78
avg = sum(scores.values()) / len(scores)
print(f"平均点: {avg:.1f}")
for subject, score in scores.items():
    print(f"{subject}: {score}点")` },

    {
        id: 97, title: "ToDoリスト", skill: "実用アプリ", category: "advanced",
        task: "リストを使ったToDoリストアプリを作成してください。",
        explanation: `リストでタスクを管理します。

例:
todos = []
while True:
    print("\\n[1]追加 [2]表示 [3]削除 [0]終了")
    cmd = input("> ")
    if cmd == "0":
        break
    elif cmd == "1":
        task = input("タスク: ")
        todos.append(task)
    elif cmd == "2":
        for i, task in enumerate(todos, 1):
            print(f"{i}. {task}")
    elif cmd == "3":
        idx = int(input("番号: ")) - 1
        todos.pop(idx)` },

    {
        id: 98, title: "単語帳", skill: "実用アプリ", category: "advanced",
        task: "辞書を使った単語帳アプリを作成してください。",
        explanation: `英単語と日本語訳を辞書で管理します。

例:
vocab = {"apple": "りんご", "book": "本"}
while True:
    cmd = input("[1]追加 [2]テスト [0]終了: ")
    if cmd == "0":
        break
    elif cmd == "1":
        eng = input("英語: ")
        jpn = input("日本語: ")
        vocab[eng] = jpn
    elif cmd == "2":
        import random
        word = random.choice(list(vocab.keys()))
        ans = input(f"{word}の意味は？: ")
        if ans == vocab[word]:
            print("正解！")
        else:
            print(f"不正解。答え: {vocab[word]}")` },

    {
        id: 99, title: "数学関数集", skill: "関数ライブラリ", category: "advanced",
        task: "様々な数学計算を行う関数を作成してください。",
        explanation: `よく使う計算を関数にまとめます。

例:
def factorial(n):
    """階乗を計算"""
    result = 1
    for i in range(1, n + 1):
        result *= i
    return result

def is_prime(n):
    """素数判定"""
    if n < 2:
        return False
    for i in range(2, n):
        if n % i == 0:
            return False
    return True

print(factorial(5))  # 120
print(is_prime(17))  # True` },

    {
        id: 100, title: "総合プロジェクト", skill: "総合演習", category: "advanced",
        task: "これまで学んだ内容を組み合わせたオリジナルアプリを作成してください。",
        explanation: `これまでに学んだスキルを組み合わせて、オリジナルアプリを作成しましょう！

アイデア例:
- じゃんけんゲーム（戦績記録付き）
- クイズアプリ
- 家計簿アプリ
- 占いアプリ
- ミニRPGゲーム

ポイント:
- 変数・リスト・辞書でデータを管理
- 関数で処理を整理
- ループとifで対話的に
- ファイル保存にも挑戦してみよう！` }
];
