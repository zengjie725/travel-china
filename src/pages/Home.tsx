import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, ChevronRight, Sparkles } from 'lucide-react';
import { Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { spots } from '../data/spots';

const heroImages = [
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20Chinese%20landscape%20mountains%20lake%20sunset%20golden%20hour&image_size=landscape_16_9',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20Chinese%20city%20skyline%20night%20lights%20urban&image_size=landscape_16_9',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ancient%20Chinese%20temple%20architecture%20mist%20mountains&image_size=landscape_16_9',
];

const popularCities = [
  { id: 'beijing', name: '北京', desc: '古都风韵', spots: 128 },
  { id: 'shanghai', name: '上海', desc: '东方明珠', spots: 96 },
  { id: 'hangzhou', name: '杭州', desc: '人间天堂', spots: 86 },
  { id: 'chengdu', name: '成都', desc: '天府之国', spots: 72 },
  { id: 'xian', name: '西安', desc: '千年古都', spots: 68 },
];

export default function Home() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [currentImage, setCurrentImage] = useState(0);
  const [showRecommend, setShowRecommend] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRecommend(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = () => {
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue)}`);
    }
  };

  const handleCityClick = (cityId: string) => {
    navigate(`/cities/${cityId}/spots`);
  };

  const handleExplore = () => {
    navigate('/provinces');
  };

  return (
    <div className="home-page">
      {/* 液态渐变背景 */}
      <div className="hero-section">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            className="hero-bg"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          >
            <img src={heroImages[currentImage]} alt="Hero" />
          </motion.div>
        </AnimatePresence>

        {/* 动态渐变层 */}
        <div className="liquid-gradient"></div>

        {/* 内容层 */}
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-text"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="hero-badge"
            >
              <Sparkles size={16} />
              <span>发现中国之美</span>
            </motion.div>
            <h1>探索全国景点</h1>
            <p>从繁华都市到世外桃源，开启你的旅行故事</p>
          </motion.div>

          {/* 毛玻璃搜索栏 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="search-glass"
          >
            <div className="search-wrapper">
              <Search size={20} />
              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="搜索景点、城市或体验..."
                onPressEnter={handleSearch}
                className="search-input"
              />
              <button className="search-btn" onClick={handleSearch}>
                <Search size={18} />
              </button>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="explore-btn"
            onClick={handleExplore}
          >
            <span>开始探索</span>
            <ChevronRight size={20} />
          </motion.button>
        </div>
      </div>

      {/* 热门城市 */}
      <div className="section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-header"
        >
          <h2>热门城市</h2>
          <p>精选目的地，开启你的旅程</p>
        </motion.div>

        <div className="cities-scroll">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="cities-track"
          >
            {popularCities.map((city, index) => (
              <motion.div
                key={city.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="city-card"
                onClick={() => handleCityClick(city.id)}
              >
                <div className="city-image">
                  <img 
                    src={`https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(city.name + ' city skyline landmark')}&image_size=landscape_16_9`} 
                    alt={city.name}
                  />
                  <div className="city-overlay"></div>
                </div>
                <div className="city-info">
                  <h3>{city.name}</h3>
                  <span className="city-desc">{city.desc}</span>
                  <div className="city-stats">
                    <MapPin size={14} />
                    <span>{city.spots}个景点</span>
                  </div>
                </div>
                <div className="city-glow"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* 精选景点 */}
      <div className="section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-header"
        >
          <h2>精选景点</h2>
          <p>来自全国各地的宝藏目的地</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="spots-grid"
        >
          {spots.slice(0, 6).map((spot, index) => (
            <motion.div
              key={spot.spotId}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -12, scale: 1.02 }}
              className="spot-card"
              onClick={() => navigate(`/spots/${spot.spotId}`)}
            >
              <div className="spot-image">
                <img src={spot.images[0]} alt={spot.name} />
                <div className="spot-rating">
                  <span>{spot.rating}</span>
                </div>
              </div>
              <div className="spot-content">
                <h3>{spot.name}</h3>
                <p className="spot-location">
                  <MapPin size={14} />
                  {spot.city}
                </p>
                <div className="spot-tags">
                  {spot.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="spot-tag">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="spot-card-glow"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* 智能推荐弹出 */}
      <AnimatePresence>
        {showRecommend && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="recommend-popup"
          >
            <div className="recommend-content">
              <div className="recommend-icon">
                <Sparkles size={24} />
              </div>
              <div className="recommend-text">
                <h4>今日推荐</h4>
                <p>探索北京故宫，感受600年历史韵味</p>
              </div>
              <button 
                className="recommend-btn"
                onClick={() => navigate('/spots/bj-forbidden-city')}
              >
                去看看
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
