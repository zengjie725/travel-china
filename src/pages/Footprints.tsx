import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CheckCircle, Trophy, Star, Award } from 'lucide-react';
import { storage } from '../utils/storage';
import { provinces } from '../data/provinces';

export default function Footprints() {
  const { user, isLoggedIn } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  if (!isLoggedIn || !user) {
    navigate('/login');
    return null;
  }

  const footprints = storage.getFootprints(user.userId);

  const getCityInfo = (cityId: string) => {
    for (const province of provinces) {
      const city = province.cities.find((c) => c.id === cityId);
      if (city) {
        return { city, province };
      }
    }
    return null;
  };

  const visitedCities = footprints.map((cityId) => getCityInfo(cityId)).filter(Boolean);

  // 计算省份解锁情况
  const visitedProvinces = new Set(visitedCities.map(item => item?.province.id));
  
  // 等级系统
  const getLevel = (count: number) => {
    if (count >= 50) return { name: '旅行达人', icon: <Trophy size={24} />, color: '#FFD700' };
    if (count >= 20) return { name: '旅行爱好者', icon: <Star size={24} />, color: '#C0C0C0' };
    if (count >= 5) return { name: '旅行新手', icon: <Award size={24} />, color: '#CD7F32' };
    return { name: '初出茅庐', icon: <MapPin size={24} />, color: '#1890ff' };
  };

  const level = getLevel(visitedCities.length);

  // 计算探索进度百分比
  const totalCities = provinces.reduce((acc, p) => acc + p.cities.length, 0);
  const progress = (visitedCities.length / totalCities) * 100;

  return (
    <div className="footprints-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/profile')}>
          <ArrowLeft size={20} />
          返回
        </button>
        <div className="header-content">
          <h1>我的足迹</h1>
          <p>记录我走过的城市</p>
        </div>
      </div>

      {/* 用户等级卡片 */}
      <div className="level-card">
        <div className="level-icon" style={{ background: `linear-gradient(135deg, ${level.color}, ${level.color}88)` }}>
          {level.icon}
        </div>
        <div className="level-info">
          <span className="level-name">{level.name}</span>
          <span className="level-desc">
            已解锁 {visitedCities.length} 个城市 · {visitedProvinces.size} 个省份
          </span>
        </div>
        <div className="level-progress">
          <div className="level-progress-ring">
            <svg viewBox="0 0 36 36">
              <path
                className="ring-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="ring-progress"
                strokeDasharray={`${progress}, 100`}
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="progress-percent">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>

      <div className="footprints-stats">
        <div className="stat-item">
          <span className="stat-value">{visitedCities.length}</span>
          <span className="stat-label">已访问城市</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{visitedProvinces.size}</span>
          <span className="stat-label">已解锁省份</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{totalCities}</span>
          <span className="stat-label">全国城市</span>
        </div>
      </div>

      {/* 可视化地图 */}
      <div className="map-visualization">
        <div className="map-header">
          <h3>足迹地图</h3>
          <span className="map-subtitle">点亮你走过的每一座城市</span>
        </div>
        <div className="china-map">
          {/* 简化的中国地图区域 */}
          <div className="map-grid">
            {provinces.map(province => {
              const isUnlocked = visitedProvinces.has(province.id);
              return (
                <div 
                  key={province.id} 
                  className={`province-dot ${isUnlocked ? 'unlocked' : 'locked'}`}
                  title={`${province.name}${isUnlocked ? '（已解锁）' : ''}`}
                >
                  <div className="dot-inner">
                    {isUnlocked && <CheckCircle size={12} />}
                  </div>
                  <span className="province-name">{province.name}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="map-legend">
          <div className="legend-item">
            <div className="legend-dot unlocked"></div>
            <span>已探索</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot locked"></div>
            <span>未探索</span>
          </div>
        </div>
      </div>

      {visitedCities.length > 0 ? (
        <div className="visited-cities">
          <h2>已访问的城市</h2>
          <div className="cities-grid">
            {visitedCities.map((item, index) => {
              if (!item) return null;
              return (
                <div 
                  key={index} 
                  className="visited-city-card"
                  onClick={() => navigate(`/cities/${item.city.id}/spots`)}
                >
                  <div className="city-badge">
                    <CheckCircle size={16} />
                  </div>
                  <div className="city-image">
                    <img 
                      src={`https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(item.city.name + ' city landmark')}&image_size=landscape_16_9`} 
                      alt={item.city.name}
                    />
                  </div>
                  <div className="city-info">
                    <h3>{item.city.name}</h3>
                    <p>{item.province.name}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <MapPin size={64} />
          <h2>还没有足迹</h2>
          <p>开始探索，记录你的第一个足迹吧！</p>
          <button className="explore-btn" onClick={() => navigate('/provinces')}>
            开始探索
          </button>
        </div>
      )}
    </div>
  );
}
