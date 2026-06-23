import { useState } from 'react';
import { 
  Check, X, Eye, Clock, MapPin, Camera, 
  User, AlertCircle, Search, Filter, ChevronDown 
} from 'lucide-react';
import { Button, Tabs, Tag, Empty } from 'antd';
import './AdminReview.css';

// 模拟待审核数据
const mockPendingSpots = [
  {
    id: '1',
    name: '深圳湾公园',
    province: '广东省',
    city: '深圳市',
    district: '南山区',
    address: '深圳市南山区望海路',
    location: { lat: 22.4851, lng: 113.9403 },
    description: '深圳最著名的海滨公园，傍晚时分可以看绝美日落',
    ticket_price: '免费',
    opening_hours: '全天开放',
    images: [
      'https://picsum.photos/400/300?random=1',
      'https://picsum.photos/400/300?random=2'
    ],
    submitter: { id: 'u1', name: '旅游达人小王' },
    submittedAt: '2024-01-15 14:30',
    status: 'pending'
  },
  {
    id: '2',
    name: '东湖绿道',
    province: '湖北省',
    city: '武汉市',
    district: '武昌区',
    address: '武汉市武昌区东湖路',
    location: { lat: 30.5546, lng: 114.4052 },
    description: '国内最长的5A级城市环湖绿道，骑行爱好者的天堂',
    ticket_price: '免费',
    opening_hours: '06:00-22:00',
    images: ['https://picsum.photos/400/300?random=3'],
    submitter: { id: 'u2', name: '骑行侠客' },
    submittedAt: '2024-01-14 09:15',
    status: 'pending'
  },
  {
    id: '3',
    name: '大理双廊古镇',
    province: '云南省',
    city: '大理白族自治州',
    district: '大理市',
    address: '云南省大理白族自治州大理市双廊镇',
    location: { lat: 25.9132, lng: 100.1245 },
    description: '洱海东岸的白族古镇，临海而建，文艺清新',
    ticket_price: '免费',
    opening_hours: '全天开放',
    images: [
      'https://picsum.photos/400/300?random=4',
      'https://picsum.photos/400/300?random=5',
      'https://picsum.photos/400/300?random=6'
    ],
    submitter: { id: 'u3', name: '云南妹纸' },
    submittedAt: '2024-01-13 18:45',
    status: 'pending'
  }
];

const mockApprovedSpots = [
  {
    id: '4',
    name: '广州塔',
    province: '广东省',
    city: '广州市',
    district: '海珠区',
    address: '广州市海珠区阅江西路222号',
    location: { lat: 23.1141, lng: 113.3239 },
    description: '广州地标性建筑，昵称"小蛮腰"',
    ticket_price: '150元',
    opening_hours: '09:30-22:00',
    images: ['https://picsum.photos/400/300?random=7'],
    submitter: { id: 'u4', name: '摄影师阿杰' },
    submittedAt: '2024-01-10 10:00',
    reviewedAt: '2024-01-11 15:30',
    reviewer: { id: 'admin1', name: '管理员' }
  }
];

const mockRejectedSpots = [
  {
    id: '5',
    name: '某商场',
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    address: '北京市朝阳区某路',
    description: '这是一个商场，不是景点',
    reason: '该地点不属于旅游景区范畴',
    submitter: { id: 'u5', name: '测试用户' },
    submittedAt: '2024-01-09 08:00',
    reviewedAt: '2024-01-10 10:00',
    reviewer: { id: 'admin1', name: '管理员' }
  }
];

export default function AdminReview() {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedSpot, setSelectedSpot] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');

  const pendingSpots = mockPendingSpots.filter(spot =>
    spot.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const handleApprove = (spotId: string) => {
    alert(`景点 ID: ${spotId} 已通过审核！\n奖励：+100 积分给提交者`);
    setSelectedSpot(null);
  };

  const handleReject = (spotId: string) => {
    if (!rejectReason) {
      alert('请填写拒绝原因');
      return;
    }
    alert(`景点 ID: ${spotId} 已拒绝\n原因：${rejectReason}`);
    setRejectReason('');
    setSelectedSpot(null);
  };

  const renderPendingItem = (spot: any) => (
    <div key={spot.id} className="review-item">
      <div className="review-item-main">
        <div className="review-item-images">
          {spot.images.slice(0, 2).map((img: string, idx: number) => (
            <img key={idx} src={img} alt={spot.name} />
          ))}
          {spot.images.length > 2 && (
            <div className="more-images">+{spot.images.length - 2}</div>
          )}
        </div>
        <div className="review-item-info">
          <h3>{spot.name}</h3>
          <p className="location">
            <MapPin size={14} />
            {spot.province} · {spot.city} · {spot.district}
          </p>
          <p className="address">{spot.address}</p>
          <p className="description">{spot.description}</p>
          <div className="meta">
            <span><Clock size={14} /> {spot.submittedAt}</span>
            <span><User size={14} /> {spot.submitter.name}</span>
            <span><Camera size={14} /> {spot.images.length}张图片</span>
          </div>
        </div>
        <div className="review-item-actions">
          <Button
            type="primary"
            icon={<Check size={16} />}
            onClick={() => handleApprove(spot.id)}
          >
            通过
          </Button>
          <Button
            danger
            icon={<X size={16} />}
            onClick={() => setSelectedSpot(spot)}
          >
            拒绝
          </Button>
          <Button
            icon={<Eye size={16} />}
            onClick={() => setSelectedSpot(spot)}
          >
            详情
          </Button>
        </div>
      </div>
    </div>
  );

  const renderRejectModal = () => (
    <div className="reject-modal">
      <div className="reject-modal-content">
        <h3>拒绝理由</h3>
        <textarea
          placeholder="请输入拒绝原因，将通知提交者"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          rows={4}
        />
        <div className="reject-modal-actions">
          <Button onClick={() => setSelectedSpot(null)}>取消</Button>
          <Button
            type="primary"
            danger
            onClick={() => handleReject(selectedSpot?.id)}
          >
            确认拒绝
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-review-page">
      <div className="page-header">
        <h1>景点审核管理</h1>
        <div className="header-stats">
          <Tag color="orange" icon={<Clock size={14} />}>
            待审核 {pendingSpots.length}
          </Tag>
          <Tag color="green">
            今日已审 {mockApprovedSpots.length}
          </Tag>
        </div>
      </div>

      <div className="search-filter-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="搜索景点名称..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <Filter size={18} />
          <select>
            <option value="">全部省份</option>
            <option value="beijing">北京市</option>
            <option value="guangdong">广东省</option>
            <option value="shanghai">上海市</option>
          </select>
          <select>
            <option value="">全部状态</option>
            <option value="pending">待审核</option>
            <option value="approved">已通过</option>
            <option value="rejected">已拒绝</option>
          </select>
        </div>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'pending',
            label: (
              <span>
                <Clock size={16} /> 待审核 ({pendingSpots.length})
              </span>
            ),
            children: (
              <div className="review-list">
                {pendingSpots.length > 0 ? (
                  pendingSpots.map(renderPendingItem)
                ) : (
                  <Empty description="暂无待审核景点" />
                )}
              </div>
            )
          },
          {
            key: 'approved',
            label: (
              <span>
                <Check size={16} /> 已通过
              </span>
            ),
            children: (
              <div className="review-list">
                {mockApprovedSpots.map((spot) => (
                  <div key={spot.id} className="review-item approved">
                    <div className="review-item-info">
                      <h3>{spot.name}</h3>
                      <p>{spot.province} · {spot.city}</p>
                      <div className="meta">
                        <span>通过时间：{spot.reviewedAt}</span>
                        <span>审核人：{spot.reviewer.name}</span>
                      </div>
                    </div>
                    <Tag color="success">已通过</Tag>
                  </div>
                ))}
              </div>
            )
          },
          {
            key: 'rejected',
            label: (
              <span>
                <X size={16} /> 已拒绝
              </span>
            ),
            children: (
              <div className="review-list">
                {mockRejectedSpots.map((spot) => (
                  <div key={spot.id} className="review-item rejected">
                    <div className="review-item-info">
                      <h3>{spot.name}</h3>
                      <p>{spot.province} · {spot.city}</p>
                      <div className="reject-reason">
                        <AlertCircle size={14} />
                        拒绝原因：{spot.reason}
                      </div>
                    </div>
                    <Tag color="error">已拒绝</Tag>
                  </div>
                ))}
              </div>
            )
          }
        ]}
      />

      {selectedSpot && activeTab === 'pending' && !rejectReason && (
        <div className="detail-modal">
          <div className="detail-modal-content">
            <button className="close-btn" onClick={() => setSelectedSpot(null)}>
              <X size={24} />
            </button>
            <h2>{selectedSpot.name}</h2>
            <div className="detail-images">
              {selectedSpot.images.map((img: string, idx: number) => (
                <img key={idx} src={img} alt={`图片${idx + 1}`} />
              ))}
            </div>
            <div className="detail-info">
              <div className="info-row">
                <label>省份：</label>
                <span>{selectedSpot.province}</span>
              </div>
              <div className="info-row">
                <label>城市：</label>
                <span>{selectedSpot.city}</span>
              </div>
              <div className="info-row">
                <label>区县：</label>
                <span>{selectedSpot.district}</span>
              </div>
              <div className="info-row">
                <label>地址：</label>
                <span>{selectedSpot.address}</span>
              </div>
              <div className="info-row">
                <label>门票：</label>
                <span>{selectedSpot.ticket_price}</span>
              </div>
              <div className="info-row">
                <label>开放时间：</label>
                <span>{selectedSpot.opening_hours}</span>
              </div>
              <div className="info-row full">
                <label>简介：</label>
                <span>{selectedSpot.description}</span>
              </div>
              <div className="info-row">
                <label>经纬度：</label>
                <span>{selectedSpot.location.lat}, {selectedSpot.location.lng}</span>
              </div>
              <div className="info-row">
                <label>提交者：</label>
                <span>{selectedSpot.submitter.name}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedSpot && rejectReason === '' && activeTab === 'pending' && (
        <div className="detail-overlay" onClick={() => setSelectedSpot(null)}>
          <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="detail-modal-content">
              <button className="close-btn" onClick={() => setSelectedSpot(null)}>
                <X size={24} />
              </button>
              <h2>{selectedSpot.name}</h2>
              <div className="detail-images">
                {selectedSpot.images.map((img: string, idx: number) => (
                  <img key={idx} src={img} alt={`图片${idx + 1}`} />
                ))}
              </div>
              <div className="detail-actions">
                <Button
                  type="primary"
                  size="large"
                  icon={<Check size={18} />}
                  onClick={() => handleApprove(selectedSpot.id)}
                >
                  通过审核
                </Button>
                <Button
                  danger
                  size="large"
                  onClick={() => setRejectReason(' ')}
                >
                  拒绝
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedSpot && rejectReason === ' ' && (
        <div className="detail-overlay">
          <div className="reject-modal" onClick={(e) => e.stopPropagation()}>
            <div className="reject-modal-content">
              <h3>拒绝理由</h3>
              <p>景点：{selectedSpot.name}</p>
              <textarea
                placeholder="请选择或输入拒绝原因"
                rows={4}
              />
              <div className="reject-reasons">
                <Tag onClick={() => setRejectReason('信息不完整')}>信息不完整</Tag>
                <Tag onClick={() => setRejectReason('地址不正确')}>地址不正确</Tag>
                <Tag onClick={() => setRejectReason('非景点场所')}>非景点场所</Tag>
                <Tag onClick={() => setRejectReason('重复提交')}>重复提交</Tag>
                <Tag onClick={() => setRejectReason('内容违规')}>内容违规</Tag>
              </div>
              <div className="reject-modal-actions">
                <Button onClick={() => setRejectReason('')}>取消</Button>
                <Button
                  type="primary"
                  danger
                  onClick={() => {
                    handleReject(selectedSpot.id);
                    setRejectReason('');
                  }}
                >
                  确认拒绝
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
