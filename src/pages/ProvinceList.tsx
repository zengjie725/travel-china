import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { provinces, getCitiesByProvinceId } from '../data/index';
import { MapPin, Search, ArrowLeft } from 'lucide-react';

export default function ProvinceList() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  const filteredProvinces = provinces.filter((p) =>
    p.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleProvinceClick = (provinceId: string) => {
    navigate(`/provinces/${provinceId}/cities`);
  };

  return (
    <div className="province-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          返回
        </button>
        <div className="header-content">
          <h1>选择省份/直辖市</h1>
          <p>探索中国34个省份的绝美风景</p>
        </div>
      </div>

      <div className="search-box-wrapper">
        <div className="search-box">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="搜索省份..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <div className="province-grid">
        {filteredProvinces.map((province) => {
          const cityCount = getCitiesByProvinceId(province.id).length;
          return (
            <div
              key={province.id}
              className="province-card"
              onClick={() => handleProvinceClick(province.id)}
            >
              <div className="province-icon">
                <MapPin size={28} />
              </div>
              <div className="province-info">
                <h3>{province.name}</h3>
                <p>{cityCount} 个城市/区县</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
