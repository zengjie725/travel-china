import requests
import json
import time
import os
import re
from typing import List, Dict, Any
from bs4 import BeautifulSoup

class CtripCrawler:
    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "Referer": "https://you.ctrip.com/"
        }
    
    def search_scenic_spots(self, city_name: str, keyword: str = "", page: int = 1) -> List[Dict]:
        """搜索景点列表"""
        url = f"https://you.ctrip.com/sight/{city_name.lower()}/s0-p{page}.html"
        
        if keyword:
            url = f"https://you.ctrip.com/sight/{city_name.lower()}/search?keyword={keyword}"
        
        try:
            response = requests.get(url, headers=self.headers, timeout=15)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            
            spots = []
            items = soup.find_all("div", class_="list_item")
            
            for item in items:
                try:
                    spot = {}
                    
                    # 名称
                    name_tag = item.find("h3", class_="sight_item_name") or item.find("a", class_="name")
                    if name_tag:
                        spot["name"] = name_tag.get_text(strip=True)
                    
                    # 链接
                    link_tag = item.find("a", href=True)
                    if link_tag:
                        spot["url"] = "https://you.ctrip.com" + link_tag["href"]
                    
                    # 评分
                    score_tag = item.find("span", class_="score")
                    if score_tag:
                        spot["rating"] = float(score_tag.get_text(strip=True))
                    
                    # 点评数
                    review_tag = item.find("span", class_="review_num")
                    if review_tag:
                        spot["review_count"] = int(re.search(r'\d+', review_tag.get_text()).group())
                    
                    # 图片
                    img_tag = item.find("img", class_="img")
                    if img_tag:
                        spot["image"] = img_tag.get("src", "")
                    
                    # 门票价格
                    price_tag = item.find("span", class_="sight_item_price")
                    if price_tag:
                        price_text = price_tag.get_text(strip=True)
                        match = re.search(r'¥(\d+(?:\.\d+)?)', price_text)
                        if match:
                            spot["ticket_price"] = float(match.group(1))
                    
                    if spot.get("name"):
                        spots.append(spot)
                except Exception as e:
                    continue
            
            return spots
        except Exception as e:
            print(f"搜索失败: {e}")
            return []
    
    def get_spot_detail(self, url: str) -> Dict:
        """获取景点详情"""
        try:
            response = requests.get(url, headers=self.headers, timeout=15)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            
            detail = {}
            
            # 简介
            intro_div = soup.find("div", class_="sight_intro")
            if intro_div:
                detail["description"] = intro_div.get_text(strip=True)
            
            # 开放时间
            open_time_tag = soup.find("div", class_="open_time")
            if open_time_tag:
                detail["opening_hours"] = open_time_tag.get_text(strip=True)
            
            # 地址
            address_tag = soup.find("div", class_="address")
            if address_tag:
                detail["address"] = address_tag.get_text(strip=True)
            
            # 图片列表
            image_tags = soup.find_all("img", class_="BMap_Marker")
            if image_tags:
                detail["images"] = [img.get("src", "") for img in image_tags[:5]]
            
            # 标签
            tag_tags = soup.find_all("span", class_="tag")
            if tag_tags:
                detail["tags"] = [tag.get_text(strip=True) for tag in tag_tags]
            
            # 最佳季节
            best_season_tag = soup.find("div", class_="best_season")
            if best_season_tag:
                detail["best_season"] = best_season_tag.get_text(strip=True)
            
            return detail
        except Exception as e:
            print(f"获取详情失败: {e}")
            return {}
    
    def crawl_city_spots(self, city_name: str, max_pages: int = 5) -> List[Dict]:
        """爬取城市景点"""
        all_spots = []
        
        for page in range(1, max_pages + 1):
            print(f"正在采集 {city_name} 第 {page} 页...")
            spots = self.search_scenic_spots(city_name, page=page)
            
            if not spots:
                break
            
            for spot in spots:
                if spot.get("url"):
                    detail = self.get_spot_detail(spot["url"])
                    spot.update(detail)
                    time.sleep(0.5)
                
                all_spots.append(spot)
            
            time.sleep(1)
        
        return all_spots

def main():
    # 读取配置
    with open("scripts/config.json", "r", encoding="utf-8") as f:
        config = json.load(f)
    
    crawler = CtripCrawler()
    
    # 测试北京市
    cities = ["beijing"]
    
    all_data = []
    for city in cities:
        print(f"\n=== 开始采集携程 {city} 景点 ===")
        spots = crawler.crawl_city_spots(city)
        print(f"采集完成，共 {len(spots)} 个景点")
        all_data.extend(spots)
    
    # 保存数据
    os.makedirs("data", exist_ok=True)
    output_file = config["output"]["ctrip_data"]
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
