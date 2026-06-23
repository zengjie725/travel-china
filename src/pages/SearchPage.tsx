import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, X, ArrowLeft } from 'lucide-react';
import { Input, Select, Checkbox, Button, Empty } from 'antd';
import { spots } from '../data/spots';
import Card from '../components/Card';

const SPOT_TYPES = [
  { label: '历史古迹', value: '历史' },
  { label: '自然风光', value: '自然' },
  { label: '主题乐园', value: '主题乐园' },
  { label: '城市地标', value: '城市' },
  { label: '世界遗产', value: '世界遗产' },
  { label: '古镇村落', value: '古城' },
  { label: '山水景观', value: '山水' },
];

const THEMES = [
  { label: '亲子游', value: '亲子' },
  { label: '美食之旅', value: '美食' },
  { label: '徒步探险', value: '徒步' },
  { label: '历史文化', value: '文化' },
  { label: '海滨度假', value: '海滩' },
  { label: '摄影采风', value: '摄影' },
];

const POPULAR_DESTINATIONS = [
  '北京', '上海', '成都', '杭州', '西安', '桂林', '丽江', '大理', '九寨沟', '三亚'
];

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [searchKeyword, setSearchKeyword] = useState(initialQuery);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setSearchKeyword(q);
    }
  }, [searchParams]);

  const filteredSpots = useMemo(() => {
    return spots.filter((spot) => {
      // 关键词搜索
      if (searchKeyword) {
        const keyword = searchKeyword.toLowerCase();
        const matchName = spot.name.toLowerCase().includes(keyword);
        const matchCity = spot.city.toLowerCase().includes(keyword);
        const matchProvince = spot.province.toLowerCase().includes(keyword);
        const matchTags = spot.tags.some(tag => tag.toLowerCase().includes(keyword));
        
        if (!matchName && !matchCity && !matchProvince && !matchTags) {
          return false;
        }
      }

      // 类型筛选
      if (selectedTypes.length > 0) {
        const hasType = selectedTypes.some(type => spot.tags.includes(type));
        if (!hasType) return false;
      }

      // 主题筛选
      if (selectedThemes.length > 0) {
        const hasTheme = selectedThemes.some(theme => spot.tags.includes(theme));
        if (!hasTheme) return false;
      }

      // 城市筛选
      if (selectedCity) {
        if (spot.city !== selectedCity) return false;
      }

      return true;
    });
  }, [searchKeyword, selectedTypes, selectedThemes, selectedCity]);

  const handleSpotClick = (spotId: string) => {
    navigate(`/spots/${spotId}`);
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedThemes([]);
    setSelectedCity('');
  };

  const hasActiveFilters = selectedTypes.length > 0 || selectedThemes.length > 0 || selectedCity;

  return (
    <div className="search-page">
      <div className="search-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          返回
        </button>
        <div className="header-content">
          <h1>探索景点</h1>
          <p>发现全国各地的精彩目的地</p>
        </div>
      </div>

      <div className="search-box-section">
        <div className="search-input-wrapper">
          <Search className="search-icon" />
          <Input
            placeholder="搜索景点、城市或标签..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="search-input"
            allowClear
          />
          <Button 
            type={showFilters ? 'primary' : 'default'}
            icon={<Filter size={16} />}
            onClick={() => setShowFilters(!showFilters)}
          >
            筛选
            {hasActiveFilters && <span className="filter-badge">{selectedTypes.length + selectedThemes.length + (selectedCity ? 1 : 0)}</span>}
          </Button>
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="filter-section">
              <h4>景点类型</h4>
              <Checkbox.Group
                options={SPOT_TYPES}
                value={selectedTypes}
                onChange={(values) => setSelectedTypes(values as string[])}
                className="filter-checkbox-group"
              />
            </div>

            <div className="filter-section">
              <h4>游玩主题</h4>
              <Checkbox.Group
                options={THEMES}
                value={selectedThemes}
                onChange={(values) => setSelectedThemes(values as string[])}
                className="filter-checkbox-group"
              />
            </div>

            <div className="filter-section">
              <h4>热门目的地</h4>
              <Select
                placeholder="选择城市"
                value={selectedCity || undefined}
                onChange={setSelectedCity}
                allowClear
                className="filter-select"
                options={POPULAR_DESTINATIONS.map(city => ({ label: city, value: city }))}
              />
            </div>

            {hasActiveFilters && (
              <Button 
                type="link" 
                onClick={clearFilters}
                icon={<X size={14} />}
              >
                清除所有筛选
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="search-results-info">
        <span>共找到 <strong>{filteredSpots.length}</strong> 个景点</span>
        {hasActiveFilters && (
          <div className="active-filters">
            {selectedTypes.map(type => (
              <span key={type} className="filter-tag">
                {type}
                <X size={12} onClick={() => setSelectedTypes(types => types.filter(t => t !== type))} />
              </span>
            ))}
            {selectedThemes.map(theme => (
              <span key={theme} className="filter-tag">
                {theme}
                <X size={12} onClick={() => setSelectedThemes(themes => themes.filter(t => t !== theme))} />
              </span>
            ))}
            {selectedCity && (
              <span className="filter-tag">
                {selectedCity}
                <X size={12} onClick={() => setSelectedCity('')} />
              </span>
            )}
          </div>
        )}
      </div>

      {filteredSpots.length > 0 ? (
        <div className="card-grid">
          {filteredSpots.map((spot) => (
            <Card
              key={spot.spotId}
              title={spot.name}
              image={spot.images[0]}
              tags={spot.tags}
              rating={spot.rating}
              subtitle={spot.city}
              onClick={() => handleSpotClick(spot.spotId)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-search">
          <Empty
            description={
              <span>
                未找到符合条件的景点<br />
                尝试调整筛选条件或搜索关键词
              </span>
            }
          />
          <Button type="primary" onClick={clearFilters}>
            清除筛选
          </Button>
        </div>
      )}
    </div>
  );
}
