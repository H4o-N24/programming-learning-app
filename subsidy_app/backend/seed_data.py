"""
サンプル補助金データを投入するスクリプト
"""
from datetime import date, timedelta
from database import SessionLocal, engine, Base
from models import SubsidyMaster, UserProfile

# テーブル作成
Base.metadata.create_all(bind=engine)

def seed_subsidies():
    db = SessionLocal()
    
    # 既存データ確認
    existing = db.query(SubsidyMaster).first()
    if existing:
        print("データは既に存在します。スキップします。")
        db.close()
        return
    
    subsidies = [
        SubsidyMaster(
            name="小規模事業者持続化補助金（一般型）",
            target_industry="全業種",
            target_region="全国",
            max_amount=500000,
            subsidy_rate="2/3",
            deadline=date.today() + timedelta(days=60),
            official_url="https://r3.jizokukahojokin.info/",
            description="小規模事業者が行う販路開拓等の取り組みを支援する補助金です。チラシ作成、ウェブサイト構築、店舗改装等に活用できます。",
            purposes="販路開拓,広告宣伝,設備導入,店舗改装,EC構築",
            criteria_json={"max_employees": 20, "types": ["個人事業主", "法人"]}
        ),
        SubsidyMaster(
            name="IT導入補助金",
            target_industry="全業種",
            target_region="全国",
            max_amount=4500000,
            subsidy_rate="1/2〜3/4",
            deadline=date.today() + timedelta(days=45),
            official_url="https://it-shien.smrj.go.jp/",
            description="中小企業・小規模事業者がITツールを導入する経費の一部を補助します。会計ソフト、受発注システム、決済システム等が対象です。",
            purposes="IT導入,業務効率化,デジタル化,会計システム,受発注システム,POS導入",
            criteria_json={"max_employees": 300, "types": ["中小企業", "小規模事業者"]}
        ),
        SubsidyMaster(
            name="ものづくり補助金",
            target_industry="製造業,建設業,サービス業",
            target_region="全国",
            max_amount=12500000,
            subsidy_rate="1/2〜2/3",
            deadline=date.today() + timedelta(days=30),
            official_url="https://portal.monodukuri-hojo.jp/",
            description="革新的な製品・サービス開発や生産プロセスの改善に必要な設備投資を支援します。",
            purposes="設備導入,生産性向上,新製品開発,技術革新",
            criteria_json={"max_employees": 300, "required": ["事業計画書", "賃上げ計画"]}
        ),
        SubsidyMaster(
            name="事業再構築補助金",
            target_industry="全業種",
            target_region="全国",
            max_amount=150000000,
            subsidy_rate="1/2〜3/4",
            deadline=date.today() + timedelta(days=90),
            official_url="https://jigyou-saikouchiku.go.jp/",
            description="ポストコロナ時代の新たな事業展開を支援する補助金です。新分野展開、事業転換、業種転換等が対象です。",
            purposes="事業転換,新分野展開,業態転換,事業再編",
            criteria_json={"sales_decrease": True, "types": ["中小企業"]}
        ),
        SubsidyMaster(
            name="東京都創業助成金",
            target_industry="全業種",
            target_region="東京都",
            max_amount=3000000,
            subsidy_rate="2/3",
            deadline=date.today() + timedelta(days=120),
            official_url="https://www.tokyo-kosha.or.jp/support/josei/sogyo/",
            description="東京都内で創業する方を対象とした助成金です。賃借料、広告費、設備費等が対象です。",
            purposes="創業支援,起業,スタートアップ,新規事業",
            criteria_json={"region": "東京都", "stage": "創業5年以内"}
        ),
        SubsidyMaster(
            name="大阪府中小企業デジタル化促進補助金",
            target_industry="全業種",
            target_region="大阪府",
            max_amount=1000000,
            subsidy_rate="1/2",
            deadline=date.today() + timedelta(days=75),
            official_url="https://www.pref.osaka.lg.jp/",
            description="大阪府内の中小企業がデジタル技術を活用した業務効率化を支援します。",
            purposes="デジタル化,IT導入,業務効率化,DX推進",
            criteria_json={"region": "大阪府", "max_employees": 100}
        ),
        SubsidyMaster(
            name="キャリアアップ助成金",
            target_industry="全業種",
            target_region="全国",
            max_amount=800000,
            subsidy_rate="定額",
            deadline=date.today() + timedelta(days=365),
            official_url="https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/part_haken/jigyounushi/career.html",
            description="非正規雇用労働者の正社員化、処遇改善を行う事業主を支援する助成金です。",
            purposes="人材育成,正社員化,処遇改善,雇用支援",
            criteria_json={"employment_type": "非正規雇用あり"}
        ),
        SubsidyMaster(
            name="飲食店向け設備導入補助金",
            target_industry="飲食業",
            target_region="全国",
            max_amount=2000000,
            subsidy_rate="1/2",
            deadline=date.today() + timedelta(days=50),
            official_url="https://example.com/inshoku-hojo",
            description="飲食店の衛生管理設備、厨房設備の導入を支援する補助金です。",
            purposes="設備導入,衛生管理,厨房設備,店舗改装",
            criteria_json={"industry": "飲食業", "max_employees": 50}
        ),
    ]
    
    for subsidy in subsidies:
        db.add(subsidy)
    
    db.commit()
    print(f"{len(subsidies)}件の補助金データを登録しました。")
    db.close()


def seed_demo_user():
    db = SessionLocal()
    
    existing = db.query(UserProfile).first()
    if existing:
        print("デモユーザーは既に存在します。スキップします。")
        db.close()
        return
    
    demo_user = UserProfile(
        business_name="サンプル商店",
        industry="小売業",
        region="東京都",
        employee_count=3,
        annual_sales=30000000,
        investment_plan="新しいPOSレジシステムを導入し、在庫管理と顧客管理を効率化したい"
    )
    
    db.add(demo_user)
    db.commit()
    print("デモユーザーを登録しました。")
    db.close()


if __name__ == "__main__":
    seed_subsidies()
    seed_demo_user()
    print("シードデータの投入が完了しました。")
