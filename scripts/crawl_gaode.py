import requests
import json
import time
import os
from typing import List, Dict, Any

# 景点分类类型
SCENIC_TYPES = [
    {"code": "110000", "name": "风景名胜"},
    {"code": "120000", "name": "公园广场"},
    {"code": "130000", "name": "宗教场所"},
    {"code": "140000", "name": "文化场馆"}
]

class GaodePOICrawler:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.search_url = "https://restapi.amap.com/v3/place/text"
        self.detail_url = "https://restapi.amap.com/v3/place/detail"
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
    
    def search_poi_by_city(self, city: str, type_code: str, page: int = 1, offset: int = 20) -> Dict:
        """搜索指定城市的POI"""
        params = {
            "key": self.api_key,
            "keywords": "",
            "types": type_code,
            "city": city,
            "citylimit": "true",
            "page": page,
            "offset": offset,
            "output": "json"
        }
        
        try:
            response = requests.get(self.search_url, params=params, headers=self.headers, timeout=10)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"搜索失败: {e}")
            return {"status": "0", "pois": []}
    
    def get_poi_detail(self, poi_id: str) -> Dict:
        """获取POI详情"""
        params = {
            "key": self.api_key,
            "id": poi_id,
            "output": "json"
        }
        
        try:
            response = requests.get(self.detail_url, params=params, headers=self.headers, timeout=10)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"获取详情失败: {e}")
            return {"status": "0"}
    
    def crawl_city_scenic_spots(self, city_name: str) -> List[Dict]:
        """爬取一个城市的所有景点"""
        all_spots = []
        
        for spot_type in SCENIC_TYPES:
            print(f"正在采集 {city_name} 的 {spot_type['name']}...")
            page = 1
            
            while True:
                result = self.search_poi_by_city(city_name, spot_type['code'], page)
                
                if result.get("status") != "1":
                    break
                
                pois = result.get("pois", [])
                if not pois:
                    break
                
                for poi in pois:
                    spot = {
                        "id": poi.get("id", ""),
                        "name": poi.get("name", ""),
                        "address": poi.get("address", ""),
                        "location": {
                            "lat": float(poi.get("location", "0,0").split(",")[1]),
                            "lng": float(poi.get("location", "0,0").split(",")[0])
                        },
                        "type": spot_type['name'],
                        "type_code": spot_type['code'],
                        "tel": poi.get("tel", ""),
                        "city": city_name,
                        "adname": poi.get("adname", ""),
                        "pname": poi.get("pname", ""),
                        "business_area": poi.get("business_area", ""),
                        "distance": poi.get("distance", "")
                    }
                    all_spots.append(spot)
                
                total = int(result.get("count", "0"))
                if page * 20 >= total:
                    break
                
                page += 1
                time.sleep(0.5)
            
            time.sleep(1)
        
        return all_spots

def main():
    # 读取配置
    with open("scripts/config.json", "r", encoding="utf-8") as f:
        config = json.load(f)
    
    api_key = config["gaode"]["api_key"]
    
    if not api_key or api_key == "YOUR_GAODE_API_KEY":
        print("请先在config.json中配置高德API密钥！")
        print("获取地址: https://console.amap.com/dev/key/app")
        return
    
    crawler = GaodePOICrawler(api_key)
    
    # 测试北京市
    cities = ["北京市"]
    
    all_data = []
    for city in cities:
        print(f"\n=== 开始采集 {city} ===")
        spots = crawler.crawl_city_scenic_spots(city)
        print(f"采集完成，共 {len(spots)} 个景点")
        all_data.extend(spots)
    
    # 保存数据
    os.makedirs("data", exist_ok=True)
    output_file = config["output"]["gaode_data"]
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump({
            "version": "1.0",
            "update_time": time.strftime("%Y-%m-%d %H:%M:%S"),
            "count": len(all_data),
            "spots": all_data
        }, f, ensure_ascii=False, indent=2)
    
    print(f"\n数据已保存到 {output_file}")
    print(f"共采集 {len(all_data)} 个景点")

if __name__ == "__main__":
    main()
