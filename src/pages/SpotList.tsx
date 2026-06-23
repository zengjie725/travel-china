import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Loader } from 'lucide-react';

export default function SpotList() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const cityName = location.state?.cityName || '未知城市';

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="spot-list-page">
      <div className="page-header">
        <button className="back-btn" onClick={goBack}>
          <ArrowLeft size={20} />
          返回
        </button>
        <div className="header-content">
          <h1>{cityName}</h1>
          <p>景点列表</p>
        </div>
      </div>

      <div className="collecting-container">
        <div className="collecting-content">
          <Loader size={64} className="spin" />
          <h2>景点数据收集中</h2>
          <p>该城市的景点数据正在整理中...</p>
          <p className="sub-text">即将上线，敬请期待</p>
        </div>
      </div>

      <style>{`
        .collecting-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60vh;
          padding: 40px 20px;
        }
        .collecting-content {
          text-align: center;
          color: #666;
        }
        .collecting-content h2 {
          margin: 20px 0 10px;
          color: #333;
        }
        .collecting-content p {
          margin: 5px 0;
        }
        .sub-text {
          font-size: 14px;
          color: #999;
          margin-top: 20px !important;
        }
        .spin {
          animation: spin 1s linear infinite;
          color: #1890ff;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
