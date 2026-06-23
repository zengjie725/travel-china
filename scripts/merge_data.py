import json
import os
from typing import List, Dict, Any

class DataMerger:
    def __init__(self):
        # A级景区名录（示例数据）
        self.a_level_spots = {
            "5A": [
                "故宫博物院", "颐和园", "八达岭长城", "天坛公园", "天安门广场",
                "圆明园遗址公园", "奥林匹克公园", "明十三陵", "慕田峪长城", "恭王府"
            ],
            "4A": [
                "鸟巢", "水立方", "北京动物园", "景山公园", "北海公园",
                "什刹海", "南锣鼓巷", "三里屯", "798艺术区", "国贸CBD"
            ],
            "3A": [
                "中山公园", "劳动人民文化宫", "地坛公园", "日坛公园", "月坛公园"
            ]
        }
    
    def load_gaode_data(self, filepath: str) -> List[Dict]:
        """加载高德POI数据"""
        if not os.path.exists(filepath):
            return []
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data.get("spots", [])
    
    def load_ctrip_data(self, filepath: str) -> Dict[str, Dict]:
        """加载携程数据，以名称为key建立索引"""
        if not os.path.exists(filepath):
            return {}
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)
            spots = data.get("spots", [])
            return {spot.get("name", ""): spot for spot in spots if spot.get("name")}
    
    def get_a_level(self, spot_name: str) -> str:
        """获取景点A级等级"""
        for level, spots in self.a_level_spots.items():
            if spot_name in spots:
                return level
        return ""
    
    def merge_data(self, gaode_spots: List[Dict], ctrip_index: Dict[str, Dict]) -> List[Dict]:
        """合并数据"""
        merged_spots = []
        
        for gaode_spot in gaode_spots:
            merged = {
                "id": gaode_spot.get("id", ""),
                "name": gaode_spot.get("name", ""),
                "province": gaode_spot.get("pname", ""),
                "city": gaode_spot.get("city", ""),
                "district": gaode_spot.get("adname", ""),
                "address": gaode_spot.get("address", ""),
                "location": gaode_spot.get("location", {"lat": 0, "lng": 0}),
                "type": gaode_spot.get("type", ""),
                "tel": gaode_spot.get("tel", ""),
                "level": self.get_a_level(gaode_spot.get("name", "")),
                "rating": None,
                "review_count": None,
                "ticket_price": None,
                "description": None,
                "opening_hours": None,
                "images": [],
                "tags": [],
                "best_season": None
            }
            
            # 从携程数据补充详情
            spot_name = gaode_spot.get("name", "")
            if spot_name in ctrip_index:
                ctrip_spot = ctrip_index[spot_name]
                merged["rating"] = ctrip_spot.get("rating", merged["rating"])
                merged["review_count"] = ctrip_spot.get("review_count", merged["review_count"])
                merged["ticket_price"] = ctrip_spot.get("ticket_price", merged["ticket_price"])
                merged["description"] = ctrip_spot.get("description", merged["description"])
                merged["opening_hours"] = ctrip_spot.get("opening_hours", merged["opening_hours"])
                merged["images"] = ctrip_spot.get("images", []) or ctrip_spot.get("image", "")
                merged["tags"] = ctrip_spot.get("tags", merged["tags"])
                merged["best_season"] = ctrip_spot.get("best_season", merged["best_season"])
            
            # 标准化图片格式
            if isinstance(merged["images"], str):
                merged["images"] = [merged["images"]]
            
            merged_spots.append(merged)
        
        return merged_spots

def main():
    with open("scripts/config.json", "r", encoding="utf-8") as f:
        config = json.load(f)
    
    merger = DataMerger()
    
    # 加载数据
    gaode_data = merger.load_gaode_data(config["output"]["gaode_data"])
    ctrip_index = merger.load_ctrip_data(config["output"]["ctrip_data"])
    
    print(f"高德数据: {len(gaode_data)} 个景点")
    print(f"携程数据: {len(ctrip_index)} 个景点")
    
    # 合并数据
    merged_spots = merger.merge_data(gaode_data, ctrip_index)
    
    # 统计A级景区数量
    level_counts = {"5A": 0, "4A": 0, "3A": 0, "无等级": 0}
    for spot in merged_spots:
        level = spot.get("level", "")
        if level in level_counts:
            level_counts[level] += 1
        else:
            level_counts["无等级"] += 1
    
    # 保存合并后的数据
    os.makedirs("data", exist_ok=True)
    output_file = config["output"]["merged_data"]
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump({
            "version": "1.0",
            "update_time": __import__('time').strftime("%Y-%m-%d %H:%M:%S"),
            "count": len(merged_spots),
            "level_counts": level_counts,
            "spots": merged_spots
        }, f, ensure_ascii=False, indent=2)
    
    print(f"\n合并完成！")
    print(f"总景点数: {len(merged_spots)}")
    print(f"等级分布: {level_counts}")
    print(f"数据已保存到 {output_file}")

if __name__ == "__main__":
    main()
