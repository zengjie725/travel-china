import json
import os

# 模拟高德POI数据
def generate_mock_gaode_data():
    mock_data = {
        "version": "1.0",
        "update_time": "2024-01-01 12:00:00",
        "count": 20,
        "spots": [
            {
                "id": "1",
                "name": "故宫博物院",
                "address": "北京市东城区景山前街4号",
                "location": {"lat": 39.9163, "lng": 116.3972},
                "type": "风景名胜",
                "type_code": "110000",
                "tel": "010-65132255",
                "city": "北京市",
                "adname": "东城区",
                "pname": "北京市",
                "business_area": "故宫",
                "distance": ""
            },
            {
                "id": "2",
                "name": "颐和园",
                "address": "北京市海淀区新建宫门路19号",
                "location": {"lat": 39.9999, "lng": 116.2755},
                "type": "风景名胜",
                "type_code": "110000",
                "tel": "010-62881144",
                "city": "北京市",
                "adname": "海淀区",
                "pname": "北京市",
                "business_area": "颐和园",
                "distance": ""
            },
            {
                "id": "3",
                "name": "八达岭长城",
                "address": "北京市延庆区军都山关沟古道北口",
                "location": {"lat": 40.3629, "lng": 116.0028},
                "type": "风景名胜",
                "type_code": "110000",
                "tel": "010-69121383",
                "city": "北京市",
                "adname": "延庆区",
                "pname": "北京市",
                "business_area": "八达岭",
                "distance": ""
            },
            {
                "id": "4",
                "name": "天坛公园",
                "address": "北京市东城区天坛东路甲1号",
                "location": {"lat": 39.8822, "lng": 116.4066},
                "type": "公园广场",
                "type_code": "120000",
                "tel": "010-67028866",
                "city": "北京市",
                "adname": "东城区",
                "pname": "北京市",
                "business_area": "天坛",
                "distance": ""
            },
            {
                "id": "5",
                "name": "鸟巢",
                "address": "北京市朝阳区国家体育场南路1号",
                "location": {"lat": 39.9916, "lng": 116.4067},
                "type": "文化场馆",
                "type_code": "140000",
                "tel": "010-84373000",
                "city": "北京市",
                "adname": "朝阳区",
                "pname": "北京市",
                "business_area": "奥林匹克公园",
                "distance": ""
            },
            {
                "id": "6",
                "name": "南锣鼓巷",
                "address": "北京市东城区南锣鼓巷",
                "location": {"lat": 39.9270, "lng": 116.4054},
                "type": "风景名胜",
                "type_code": "110000",
                "tel": "",
                "city": "北京市",
                "adname": "东城区",
                "pname": "北京市",
                "business_area": "南锣鼓巷",
                "distance": ""
            },
            {
                "id": "7",
                "name": "什刹海",
                "address": "北京市西城区什刹海",
                "location": {"lat": 39.9373, "lng": 116.3969},
                "type": "公园广场",
                "type_code": "120000",
                "tel": "",
                "city": "北京市",
                "adname": "西城区",
                "pname": "北京市",
                "business_area": "什刹海",
                "distance": ""
            },
            {
                "id": "8",
                "name": "798艺术区",
                "address": "北京市朝阳区酒仙桥路2号",
                "location": {"lat": 39.9947, "lng": 116.4788},
                "type": "文化场馆",
                "type_code": "140000",
                "tel": "",
                "city": "北京市",
                "adname": "朝阳区",
                "pname": "北京市",
                "business_area": "798",
                "distance": ""
            },
            {
                "id": "9",
                "name": "北京动物园",
                "address": "北京市西城区西直门外大街137号",
                "location": {"lat": 39.9465, "lng": 116.3474},
                "type": "文化场馆",
                "type_code": "140000",
                "tel": "010-68314411",
                "city": "北京市",
                "adname": "西城区",
                "pname": "北京市",
                "business_area": "动物园",
                "distance": ""
            },
            {
                "id": "10",
                "name": "景山公园",
                "address": "北京市西城区景山西街44号",
                "location": {"lat": 39.9210, "lng": 116.3978},
                "type": "公园广场",
                "type_code": "120000",
                "tel": "010-64044071",
                "city": "北京市",
                "adname": "西城区",
                "pname": "北京市",
                "business_area": "景山",
                "distance": ""
            },
            {
                "id": "11",
                "name": "北海公园",
                "address": "北京市西城区文津街1号",
                "location": {"lat": 39.9243, "lng": 116.3840},
                "type": "公园广场",
                "type_code": "120000",
                "tel": "010-64033225",
                "city": "北京市",
                "adname": "西城区",
                "pname": "北京市",
                "business_area": "北海",
                "distance": ""
            },
            {
                "id": "12",
                "name": "恭王府",
                "address": "北京市西城区柳荫街甲14号",
                "location": {"lat": 39.9398, "lng": 116.3846},
                "type": "风景名胜",
                "type_code": "110000",
                "tel": "010-83288149",
                "city": "北京市",
                "adname": "西城区",
                "pname": "北京市",
                "business_area": "恭王府",
                "distance": ""
            },
            {
                "id": "13",
                "name": "明十三陵",
                "address": "北京市昌平区十三陵镇",
                "location": {"lat": 40.2208, "lng": 116.2025},
                "type": "风景名胜",
                "type_code": "110000",
                "tel": "010-60761424",
                "city": "北京市",
                "adname": "昌平区",
                "pname": "北京市",
                "business_area": "十三陵",
                "distance": ""
            },
            {
                "id": "14",
                "name": "慕田峪长城",
                "address": "北京市怀柔区渤海镇慕田峪村",
                "location": {"lat": 40.3252, "lng": 116.6355},
                "type": "风景名胜",
                "type_code": "110000",
                "tel": "010-61626022",
                "city": "北京市",
                "adname": "怀柔区",
                "pname": "北京市",
                "business_area": "慕田峪",
                "distance": ""
            },
            {
                "id": "15",
                "name": "圆明园",
                "address": "北京市海淀区清华西路28号",
                "location": {"lat": 40.0077, "lng": 116.2754},
                "type": "风景名胜",
                "type_code": "110000",
                "tel": "010-62628501",
                "city": "北京市",
                "adname": "海淀区",
                "pname": "北京市",
                "business_area": "圆明园",
                "distance": ""
            },
            {
                "id": "16",
                "name": "清华大学",
                "address": "北京市海淀区清华园1号",
                "location": {"lat": 40.0098, "lng": 116.3056},
                "type": "文化场馆",
                "type_code": "140000",
                "tel": "010-62782165",
                "city": "北京市",
                "adname": "海淀区",
                "pname": "北京市",
                "business_area": "清华",
                "distance": ""
            },
            {
                "id": "17",
                "name": "北京大学",
                "address": "北京市海淀区颐和园路5号",
                "location": {"lat": 39.9998, "lng": 116.2753},
                "type": "文化场馆",
                "type_code": "140000",
                "tel": "010-62752114",
                "city": "北京市",
                "adname": "海淀区",
                "pname": "北京市",
                "business_area": "北大",
                "distance": ""
            },
            {
                "id": "18",
                "name": "雍和宫",
                "address": "北京市东城区雍和宫大街12号",
                "location": {"lat": 39.9389, "lng": 116.4106},
                "type": "宗教场所",
                "type_code": "130000",
                "tel": "010-84191906",
                "city": "北京市",
                "adname": "东城区",
                "pname": "北京市",
                "business_area": "雍和宫",
                "distance": ""
            },
            {
                "id": "19",
                "name": "国子监",
                "address": "北京市东城区国子监街15号",
                "location": {"lat": 39.9353, "lng": 116.4103},
                "type": "文化场馆",
                "type_code": "140000",
                "tel": "010-84027277",
                "city": "北京市",
                "adname": "东城区",
                "pname": "北京市",
                "business_area": "国子监",
                "distance": ""
            },
            {
                "id": "20",
                "name": "三里屯太古里",
                "address": "北京市朝阳区三里屯路19号",
                "location": {"lat": 39.9320, "lng": 116.4425},
                "type": "风景名胜",
                "type_code": "110000",
                "tel": "",
                "city": "北京市",
                "adname": "朝阳区",
                "pname": "北京市",
                "business_area": "三里屯",
                "distance": ""
            }
        ]
    }
    
    return mock_data

# 模拟携程数据
def generate_mock_ctrip_data():
    mock_data = {
        "version": "1.0",
        "update_time": "2024-01-01 12:00:00",
        "count": 10,
        "spots": [
            {
                "name": "故宫博物院",
                "url": "https://you.ctrip.com/sight/beijing1/13735.html",
                "rating": 4.9,
                "review_count": 125632,
                "image": "https://example.com/gugong.jpg",
                "ticket_price": 60,
                "description": "世界现存最大木质古建筑群，明清两代皇家宫殿",
                "opening_hours": "08:30-17:00",
                "images": ["https://example.com/gugong1.jpg", "https://example.com/gugong2.jpg"],
                "tags": ["历史", "文化", "古迹"],
                "best_season": "春秋两季"
            },
            {
                "name": "颐和园",
                "url": "https://you.ctrip.com/sight/beijing1/13736.html",
                "rating": 4.8,
                "review_count": 89543,
                "image": "https://example.com/summer.jpg",
                "ticket_price": 30,
                "description": "中国现存规模最大、保存最完整的皇家园林",
                "opening_hours": "06:30-18:00",
                "images": ["https://example.com/summer1.jpg"],
                "tags": ["园林", "皇家", "自然"],
                "best_season": "夏季"
            },
            {
                "name": "八达岭长城",
                "url": "https://you.ctrip.com/sight/beijing1/13737.html",
                "rating": 4.8,
                "review_count": 156789,
                "image": "https://example.com/greatwall.jpg",
                "ticket_price": 40,
                "description": "万里长城的重要组成部分，世界文化遗产",
                "opening_hours": "07:30-18:00",
                "images": ["https://example.com/greatwall1.jpg", "https://example.com/greatwall2.jpg", "https://example.com/greatwall3.jpg"],
                "tags": ["长城", "历史", "自然"],
                "best_season": "秋季"
            },
            {
                "name": "天坛公园",
                "url": "https://you.ctrip.com/sight/beijing1/13738.html",
                "rating": 4.7,
                "review_count": 67890,
                "image": "https://example.com/temple.jpg",
                "ticket_price": 15,
                "description": "明清两代皇帝祭天祈谷的场所",
                "opening_hours": "06:00-22:00",
                "images": ["https://example.com/temple1.jpg"],
                "tags": ["古迹", "宗教", "文化"],
                "best_season": "春季"
            },
            {
                "name": "鸟巢",
                "url": "https://you.ctrip.com/sight/beijing1/13739.html",
                "rating": 4.6,
                "review_count": 45678,
                "image": "https://example.com/birdnest.jpg",
                "ticket_price": 50,
                "description": "2008年北京奥运会主体育场",
                "opening_hours": "09:00-21:00",
                "images": ["https://example.com/birdnest1.jpg", "https://example.com/birdnest2.jpg"],
                "tags": ["现代", "体育", "地标"],
                "best_season": "全年"
            },
            {
                "name": "南锣鼓巷",
                "url": "https://you.ctrip.com/sight/beijing1/13740.html",
                "rating": 4.5,
                "review_count": 78901,
                "image": "https://example.com/nanluo.jpg",
                "ticket_price": 0,
                "description": "北京最古老的街区之一，保存完好的四合院建筑群",
                "opening_hours": "全天开放",
                "images": ["https://example.com/nanluo1.jpg"],
                "tags": ["老街", "文化", "美食"],
                "best_season": "秋季"
            },
            {
                "name": "什刹海",
                "url": "https://you.ctrip.com/sight/beijing1/13741.html",
                "rating": 4.5,
                "review_count": 56789,
                "image": "https://example.com/shichahai.jpg",
                "ticket_price": 0,
                "description": "北京城内面积最大的历史街区，拥有众多王府古迹",
                "opening_hours": "全天开放",
                "images": ["https://example.com/shichahai1.jpg", "https://example.com/shichahai2.jpg"],
                "tags": ["湖泊", "夜景", "文化"],
                "best_season": "夏季"
            },
            {
                "name": "798艺术区",
                "url": "https://you.ctrip.com/sight/beijing1/13742.html",
                "rating": 4.4,
                "review_count": 34567,
                "image": "https://example.com/798.jpg",
                "ticket_price": 0,
                "description": "由老厂房改造的艺术区，汇集众多画廊和艺术机构",
                "opening_hours": "10:00-18:00",
                "images": ["https://example.com/798_1.jpg"],
                "tags": ["艺术", "创意", "拍照"],
                "best_season": "全年"
            },
            {
                "name": "北京动物园",
                "url": "https://you.ctrip.com/sight/beijing1/13743.html",
                "rating": 4.6,
                "review_count": 98765,
                "image": "https://example.com/zoo.jpg",
                "ticket_price": 15,
                "description": "中国最大的动物园之一，拥有众多珍稀动物",
                "opening_hours": "07:30-18:00",
                "images": ["https://example.com/zoo1.jpg", "https://example.com/zoo2.jpg"],
                "tags": ["动物", "亲子", "科普"],
                "best_season": "春季"
            },
            {
                "name": "恭王府",
                "url": "https://you.ctrip.com/sight/beijing1/13744.html",
                "rating": 4.7,
                "review_count": 23456,
                "image": "https://example.com/gongwangfu.jpg",
                "ticket_price": 40,
                "description": "清代规模最大的王府，曾是和珅的府邸",
                "opening_hours": "08:30-17:00",
                "images": ["https://example.com/gongwangfu1.jpg"],
                "tags": ["历史", "文化", "古迹"],
                "best_season": "秋季"
            }
        ]
    }
    
    return mock_data

def main():
    # 创建数据目录
    os.makedirs("data", exist_ok=True)
    
    # 生成模拟数据
    gaode_data = generate_mock_gaode_data()
    ctrip_data = generate_mock_ctrip_data()
    
    # 保存模拟数据
    with open("data/gaode_poi_data.json", "w", encoding="utf-8") as f:
        json.dump(gaode_data, f, ensure_ascii=False, indent=2)
    
    with open("data/ctrip_data.json", "w", encoding="utf-8") as f:
        json.dump(ctrip_data, f, ensure_ascii=False, indent=2)
    
    print("✅ 模拟数据生成完成！")
    print(f"  - 高德POI数据: {gaode_data['count']} 个景点")
    print(f"  - 携程数据: {ctrip_data['count']} 个景点")
    
    # 运行合并脚本
    import subprocess
    result = subprocess.run(["python", "scripts/merge_data.py"], capture_output=True, text=True, encoding="utf-8")
    print("\n📊 数据合并结果:")
    print(result.stdout)
    
    if result.stderr:
        print("❌ 合并错误:")
        print(result.stderr)

if __name__ == "__main__":
    main()
