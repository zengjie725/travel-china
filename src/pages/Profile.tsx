import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { User, MapPin, Camera, Settings, Calendar, Award, Heart, Briefcase, ArrowLeft } from 'lucide-react';
import { Avatar, Card, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';

export default function Profile() {
  const { user, isLoggedIn } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  if (!isLoggedIn || !user) {
    navigate('/login');
    return null;
  }

  const records = storage.getRecords(user.userId);
  const footprints = storage.getFootprints(user.userId);

  return (
    <div className="profile-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          返回
        </button>
        <div className="header-content">
          <h1>个人中心</h1>
        </div>
      </div>
      
      <div className="profile-header">
        <div className="profile-info">
          <Avatar src={user.avatar} alt={user.username} size={80} />
          <div className="profile-detail">
            <h2>{user.username}</h2>
            <p>{user.email}</p>
          </div>
        </div>
        <Button type="primary" className="edit-btn">
          <Settings size={18} />
          编辑资料
        </Button>
      </div>

      <div className="stats-row">
        <Card className="stat-card">
          <div className="stat-icon">
            <Camera size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{records.length}</div>
            <div className="stat-label">打卡记录</div>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-icon">
            <MapPin size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{footprints.length}</div>
            <div className="stat-label">去过城市</div>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-icon">
            <Heart size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">0</div>
            <div className="stat-label">收藏景点</div>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-icon">
            <Award size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">3</div>
            <div className="stat-label">获得勋章</div>
          </div>
        </Card>
      </div>

      <div className="profile-content">
        <div className="section">
          <h2>我的足迹</h2>
          <Card className="action-card" onClick={() => navigate('/profile/footprints')}>
            <div className="card-icon">
              <MapPin size={32} />
            </div>
            <div className="card-info">
              <h3>足迹地图</h3>
              <p>查看我去过的城市</p>
            </div>
          </Card>
        </div>

        <div className="section">
          <h2>我的记录</h2>
          <Card className="action-card" onClick={() => navigate('/profile/checkin')}>
            <div className="card-icon">
              <Camera size={32} />
            </div>
            <div className="card-info">
              <h3>打卡中心</h3>
              <p>记录我的旅行照片和帖子</p>
            </div>
          </Card>
          <Card className="action-card" onClick={() => navigate('/profile/tools')}>
            <div className="card-icon">
              <Briefcase size={32} />
            </div>
            <div className="card-info">
              <h3>行前准备工具箱</h3>
              <p>行李清单、准备工作</p>
            </div>
          </Card>
          <Card className="action-card">
            <div className="card-icon">
              <Calendar size={32} />
            </div>
            <div className="card-info">
              <h3>旅行计划</h3>
              <p>规划我的下一次旅行</p>
            </div>
          </Card>
        </div>

        <div className="section">
          <h2>设置</h2>
          <Card className="action-card">
            <div className="card-icon">
              <User size={32} />
            </div>
            <div className="card-info">
              <h3>账号安全</h3>
              <p>修改密码、绑定手机</p>
            </div>
          </Card>
          <Card className="action-card">
            <div className="card-icon">
              <Settings size={32} />
            </div>
            <div className="card-info">
              <h3>系统设置</h3>
              <p>通知设置、隐私管理</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
