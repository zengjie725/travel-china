import { useParams, useNavigate } from 'react-router-dom';
import { getProvinceById, getCitiesByProvinceId } from '../data/index';
import { MapPin, ArrowLeft, Loader } from 'lucide-react';

export default function CityList() {
  const { provinceId } = useParams<{ provinceId: string }>();
  const navigate = useNavigate();

  const province = getProvinceById(provinceId || '');
  const cityList = getCitiesByProvinceId(provinceId || '');

  if (!province) {
    return <div className="page-not-found">省份未找到</div>;
  }

  const handleCityClick = (cityId: string, cityName: string) => {
    navigate(`/cities/${cityId}/spots`, { state: { cityName } });
  };

  return (
    <div className="city-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/provinces')}>
          <ArrowLeft size={20} />
          返回
        </button>
        <div className="header-content">
          <h1>{province.name}</h1>
          <p>省会：{province.capital}</p>
        </div>
      </div>

      <div className="city-list">
        {cityList.map((city) => (
          <div
            key={city.id}
            className="city-item"
            onClick={() => handleCityClick(city.id, city.name)}
          >
            <div className="city-icon">
              <MapPin size={24} />
            </div>
            <div className="city-info">
              <h3>{city.name}</h3>
              <div className="collecting-badge">
                <Loader size={12} className="spin" />
                <span>景点数据收集中</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .collecting-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #999;
          margin-top: 4px;
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
