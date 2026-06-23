import { useState } from 'react';
import { 
  Star, Trophy, Medal, Crown, Zap, Clock,
  MapPin, Camera, CheckCircle, ThumbsUp, 
  ChevronRight, Award, TrendingUp, Gift
} from 'lucide-react';
import { Tabs, Tag, Progress, Card, Empty } from 'antd';
import './UserContributions.css';

// 模拟用户数据
const mockUser = {
  id: 'u1',
  name: '旅游达人小王',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
  points: 2850,
  level: '资深旅者',
  levelProgress: 85,
  badges: [
    { code: 'first_spot', name: '首发达人', icon: '🎯', earned: true },
    { code: 'spot_creator', name: '景点创造者', icon: '🏔️', earned: true },
    { code: 'photo_master', name: '摄影大师', icon: '📸', earned: true },
    { code: 'checkin_king', name: '打卡之王', icon: '👑', earned: true },
    { code: 'reviewer', name: '金牌点评', icon: '⭐', earned: false },
    { code: 'explorer', name: '探索先锋', icon: '🚀', earned: false },
  ],
  stats: {
    submittedSpots: 12,
    approvedSpots: 10,
    checkins: 86,
    reviews: 45,
    photos: 328,
    likes: 1256,
    followers: 234,
    following: 89
  },
  contributions: [
    {
      id: '1',
      type: 'spot',
      title: '深圳湾公园',
      status: 'approved',
      approvedAt: '2024-01-15',
      likes: 234,
      checkins: 56,
      reward: '+150积分'
    },
    {
      id: '2',
      type: 'spot',
      title: '大梅沙海滨公园',
      status: 'approved',
      approvedAt: '2024-01-10',
      likes: 189,
      checkins: 42,
      reward: '+150积分'
    },
    {
      id: '3',
      type: 'spot',
      title: '东湖绿道',
      status: 'pending',
      submittedAt: '2024-01-14',
      reward: '+50积分(提交)'
    },
    {
      id: '4',
      type: 'review',
      title: '故宫博物院',
      rating: 5,
      content: '非常震撼！建议早上开门就去，人少体验更好...',
      likes: 56,
      createdAt: '2024-01-12'
    }
  ],
  leaderboard: [
    { rank: 1, name: '旅行家小明', points: 12500, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
    { rank: 2, name: '摄影达人', points: 9800, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bailey' },
    { rank: 3, name: '探险家阿杰', points: 8600, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Evie' },
    { rank: 4, name: '旅游达人小王', points: 2850, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack', isCurrent: true },
    { rank: 5, name: '城市探索者', points: 2100, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pepper' },
  ],
  rewardsHistory: [
    { date: '2024-01-15', action: '审核通过', points: 100, detail: '深圳湾公园' },
    { date: '2024-01-14', action: '提交景点', points: 50, detail: '东湖绿道' },
    { date: '2024-01-12', action: '发布点评', points: 20, detail: '故宫博物院' },
    { date: '2024-01-10', action: '审核通过', points: 100, detail: '大梅沙海滨公园' },
    { date: '2024-01-08', action: '获得点赞', points: 5, detail: '+5积分/次' },
  ]
};

const BADGES_INFO = {
  first_spot: { name: '首发达人', desc: '提交第一个景点', icon: '🎯' },
  spot_creator: { name: '景点创造者', desc: '提交并审核通过5个景点', icon: '🏔️' },
  photo_master: { name: '摄影大师', desc: '上传100张景点照片', icon: '📸' },
  checkin_king: { name: '打卡之王', desc: '打卡50个不同景点', icon: '👑' },
  reviewer: { name: '金牌点评', desc: '发布30篇优质点评', icon: '⭐' },
  explorer: { name: '探索先锋', desc: '打卡10个省份', icon: '🚀' },
  local_guide: { name: '本地向导', desc: '对某城市贡献30+景点', icon: '🗺️' },
  popular_contributor: { name: '人气贡献者', desc: '单景点获得500+点赞', icon: '💫' },
};

export default function UserContributions() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderBadge = (badge: any) => (
    <div
      key={badge.code}
      className={`badge-item ${badge.earned ? 'earned' : 'locked'}`}
    >
      <div className="badge-icon">{badge.icon}</div>
      <div className="badge-info">
        <span className="badge-name">{badge.name}</span>
        <span className="badge-desc">{BADGES_INFO[badge.code]?.desc}</span>
      </div>
      {badge.earned ? (
        <CheckCircle size={20} className="badge-check" />
      ) : (
        <Lock size={16} className="badge-lock" />
      )}
    </div>
  );

  const renderContributionItem = (item: any) => (
    <div key={item.id} className="contribution-item">
      <div className="contribution-icon">
        {item.type === 'spot' ? <MapPin size={20} /> : <Star size={20} />}
      </div>
      <div className="contribution-info">
        <h4>{item.title}</h4>
        {item.type === 'spot' ? (
          <div className="contribution-meta">
            {item.status === 'approved' ? (
              <>
                <Tag color="success">已通过</Tag>
                <span>{item.checkins}人打卡 · {item.likes}点赞</span>
                <span className="reward">{item.reward}</span>
              </>
            ) : (
              <>
                <Tag color="orange">审核中</Tag>
                <span className="reward pending">{item.reward}</span>
              </>
            )}
          </div>
        ) : (
          <div className="contribution-meta">
            <span>评分：{item.rating}星</span>
            <span>{item.likes}点赞</span>
            <span>{item.content.slice(0, 30)}...</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="user-contributions-page">
      {/* 用户概览卡片 */}
      <div className="user-overview">
        <div className="user-header">
          <img src={mockUser.avatar} alt={mockUser.name} className="user-avatar" />
          <div className="user-info">
            <h2>{mockUser.name}</h2>
            <div className="user-level">
              <Crown size={16} />
              <span>{mockUser.level}</span>
            </div>
          </div>
          <div className="user-points">
            <span className="points-value">{mockUser.points}</span>
            <span className="points-label">积分</span>
          </div>
        </div>

        <div className="level-progress">
          <div className="progress-info">
            <span>距离下一级还需 {mockUser.points % 1000} 积分</span>
            <span>{mockUser.levelProgress}%</span>
          </div>
          <Progress
            percent={mockUser.levelProgress}
            showInfo={false}
            strokeColor="#FFD700"
            trailColor="rgba(255,255,255,0.2)"
          />
        </div>

        <div className="user-stats">
          <div className="stat-item">
            <span className="stat-value">{mockUser.stats.submittedSpots}</span>
            <span className="stat-label">贡献景点</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{mockUser.stats.checkins}</span>
            <span className="stat-label">打卡次数</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{mockUser.stats.reviews}</span>
            <span className="stat-label">发布点评</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{mockUser.stats.photos}</span>
            <span className="stat-label">上传照片</span>
          </div>
        </div>
      </div>

      {/* 徽章墙 */}
      <div className="badges-section">
        <h3><Award size={20} /> 徽章墙</h3>
        <div className="badges-grid">
          {mockUser.badges.map(renderBadge)}
        </div>
      </div>

      {/* 排行榜入口 */}
      <Card className="leaderboard-card" title={
        <span><Trophy size={18} />贡献排行榜</span>
      }>
        <div className="leaderboard-list">
          {mockUser.leaderboard.map((user) => (
            <div
              key={user.rank}
              className={`leaderboard-item ${user.isCurrent ? 'current' : ''}`}
            >
              <span className={`rank ${user.rank <= 3 ? `top-${user.rank}` : ''}`}>
                {user.rank <= 3 ? ['🥇', '🥈', '🥉'][user.rank - 1] : user.rank}
              </span>
              <img src={user.avatar} alt={user.name} className="leaderboard-avatar" />
              <span className="leaderboard-name">{user.name}</span>
              <span className="leaderboard-points">{user.points}积分</span>
            </div>
          ))}
        </div>
      </Card>

      {/* 贡献记录 */}
      <div className="contributions-section">
        <h3><Clock size={20} /> 我的贡献</h3>
        <div className="contributions-list">
          {mockUser.contributions.map(renderContributionItem)}
        </div>
      </div>

      {/* 积分历史 */}
      <div className="points-history">
        <h3><TrendingUp size={20} /> 积分明细</h3>
        <div className="history-list">
          {mockUser.rewardsHistory.map((item, index) => (
            <div key={index} className="history-item">
              <div className="history-icon">
                <Gift size={16} />
              </div>
              <div className="history-info">
                <span className="history-action">{item.action}</span>
                <span className="history-detail">{item.detail}</span>
              </div>
              <span className={`history-points ${item.points > 0 ? 'positive' : 'negative'}`}>
                {item.points > 0 ? '+' : ''}{item.points}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 如何获得积分 */}
      <Card className="tips-card" title={<><Zap size={18} /> 积分获取攻略</>}>
        <div className="tips-list">
          <div className="tip-item">
            <span className="tip-points">+150</span>
            <span className="tip-desc">提交景点审核通过</span>
          </div>
          <div className="tip-item">
            <span className="tip-points">+100</span>
            <span className="tip-desc">景点被10人打卡</span>
          </div>
          <div className="tip-item">
            <span className="tip-points">+50</span>
            <span className="tip-desc">发布优质点评</span>
          </div>
          <div className="tip-item">
            <span className="tip-points">+20</span>
            <span className="tip-desc">上传景点照片</span>
          </div>
          <div className="tip-item">
            <span className="tip-points">+10</span>
            <span className="tip-desc">打卡一个新景点</span>
          </div>
          <div className="tip-item">
            <span className="tip-points">+5</span>
            <span className="tip-desc">内容被点赞</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

function Lock(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
