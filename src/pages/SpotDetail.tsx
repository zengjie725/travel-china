import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSpotById } from '../data/spots';
import { getFoodsByCityId } from '../data/foods';
import { getHotelsByCityId } from '../data/hotels';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { storage } from '../utils/storage';
import type { Comment } from '../utils/storage';
import { 
  ArrowLeft, Star, MapPin, Navigation, Hotel, Utensils, 
  AlertCircle, Sun, Droplets, Wind, Eye, EyeOff,
  Share2, Bookmark, Clock, Phone, Globe, Calendar, DollarSign,
  Heart, MessageCircle, Send, Camera, User, Info
} from 'lucide-react';
import { Button, Tabs, Carousel, Tag, Modal, Rate, Avatar, Input } from 'antd';

interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export default function SpotDetail() {
  const { spotId } = useParams<{ spotId: string }>();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState('info');
  const [show3DView, setShow3DView] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [commentRating, setCommentRating] = useState(5);
  const [commentPhotos, setCommentPhotos] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>([]);

  const spot = getSpotById(spotId || '');
  const foods = spot ? getFoodsByCityId(spot.cityId) : [];
  const hotels = spot ? getHotelsByCityId(spot.cityId) : [];

  // 加载评论
  const loadComments = () => {
    if (spot) {
      setComments(storage.getComments(spot.spotId));
    }
  };

  useState(() => {
    loadComments();
  });

  const handleAddComment = () => {
    if (!user || !spot) return;
    
    const newComment: Comment = {
      commentId: `comment_${Date.now()}`,
      spotId: spot.spotId,
      userId: user.userId,
      username: user.username,
      avatar: user.avatar,
      content: commentContent,
      rating: commentRating,
      images: commentPhotos ? [commentPhotos] : [],
      createTime: new Date().toISOString(),
      likes: 0,
    };

    storage.addComment(newComment);
    loadComments();
    setShowCommentModal(false);
    setCommentContent('');
    setCommentRating(5);
    setCommentPhotos('');
  };

  const handleLikeComment = (commentId: string) => {
    storage.likeComment(commentId);
    loadComments();
  };

  const handleDeleteComment = (commentId: string) => {
    storage.deleteComment(commentId);
    loadComments();
  };

  const mockWeather: WeatherData = {
    city: spot?.city || '',
    temperature: 26,
    description: '晴朗',
    humidity: 65,
    windSpeed: 12,
    icon: 'sunny',
  };

  if (!spot) {
    return <div className="page-not-found">景点未找到</div>;
  }

  const handleNavigation = () => {
    const url = `https://maps.google.com/maps?q=${spot.location.lat},${spot.location.lng}&z=17`;
    window.open(url, '_blank');
  };

  const handleHotelBooking = (hotelName: string) => {
    const url = `https://www.ctrip.com/hotel/search?city=${encodeURIComponent(spot.city)}&keyword=${encodeURIComponent(hotelName)}`;
    window.open(url, '_blank');
  };

  const handleFoodDelivery = (foodName: string) => {
    const url = `https://www.meituan.com/s/${encodeURIComponent(foodName)}`;
    window.open(url, '_blank');
  };

  const tabs = [
    { key: 'info', label: '景点介绍' },
    { key: 'food', label: '特色美食' },
    { key: 'guide', label: '游玩攻略' },
    { key: 'tips', label: '旅游贴士' },
    { key: 'hotel', label: '订酒店' },
    { key: 'reviews', label: `用户评价(${comments.length})` },
  ];

  return (
    <div className="spot-detail-page">
      <div className="spot-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <div className="header-actions">
          <button className={`bookmark-btn ${isBookmarked ? 'active' : ''}`} onClick={() => setIsBookmarked(!isBookmarked)}>
            <Bookmark size={20} fill={isBookmarked ? '#1890ff' : 'none'} />
          </button>
          <button className="share-btn">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      <div className="spot-hero">
        <Carousel autoplay className="spot-carousel">
          {spot.images.map((img, index) => (
            <div key={index}>
              <img src={img} alt={`${spot.name} ${index + 1}`} />
            </div>
          ))}
        </Carousel>
      </div>

      <div className="spot-info-section">
        <div className="spot-title-row">
          <div className="spot-title">
            <h1>{spot.name}</h1>
            <div className="spot-rating">
              <Star size={20} fill="#FFD700" color="#FFD700" />
              <span>{spot.rating}</span>
            </div>
          </div>
          <div className="spot-location">
            <MapPin size={18} />
            <span>{spot.province} {spot.city}</span>
          </div>
        </div>

        <div className="spot-tags">
          {spot.tags.map((tag, index) => (
            <Tag key={index}>{tag}</Tag>
          ))}
        </div>

        {/* 实用信息卡片 */}
        <div className="practical-info">
          <div className="info-grid">
            {spot.ticketPrice && (
              <div className="info-item">
                <div className="info-icon">
                  <DollarSign size={20} />
                </div>
                <div className="info-content">
                  <span className="info-label">门票价格</span>
                  <span className="info-value">{spot.ticketPrice}</span>
                </div>
              </div>
            )}
            {spot.openingHours && (
              <div className="info-item">
                <div className="info-icon">
                  <Clock size={20} />
                </div>
                <div className="info-content">
                  <span className="info-label">开放时间</span>
                  <span className="info-value">{spot.openingHours}</span>
                </div>
              </div>
            )}
            {spot.suggestedDuration && (
              <div className="info-item">
                <div className="info-icon">
                  <Calendar size={20} />
                </div>
                <div className="info-content">
                  <span className="info-label">建议游览</span>
                  <span className="info-value">{spot.suggestedDuration}</span>
                </div>
              </div>
            )}
            {spot.bestSeason && (
              <div className="info-item">
                <div className="info-icon">
                  <Sun size={20} />
                </div>
                <div className="info-content">
                  <span className="info-label">最佳季节</span>
                  <span className="info-value">{spot.bestSeason}</span>
                </div>
              </div>
            )}
            {spot.phone && (
              <div className="info-item">
                <div className="info-icon">
                  <Phone size={20} />
                </div>
                <div className="info-content">
                  <span className="info-label">联系电话</span>
                  <span className="info-value">{spot.phone}</span>
                </div>
              </div>
            )}
            {spot.website && (
              <div className="info-item">
                <div className="info-icon">
                  <Globe size={20} />
                </div>
                <div className="info-content">
                  <span className="info-label">官方网站</span>
                  <a href={spot.website} target="_blank" rel="noopener noreferrer" className="info-link">
                    访问官网
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="weather-card">
          <div className="weather-icon">
            <Sun size={32} />
          </div>
          <div className="weather-info">
            <span className="weather-temp">{mockWeather.temperature}°C</span>
            <span className="weather-desc">{mockWeather.description}</span>
          </div>
          <div className="weather-details">
            <span className="weather-item">
              <Droplets size={16} /> {mockWeather.humidity}%
            </span>
            <span className="weather-item">
              <Wind size={16} /> {mockWeather.windSpeed}km/h
            </span>
          </div>
        </div>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabs}>
        <Tabs.TabPane key="info">
          <div className="tab-content">
            <h2>景点介绍</h2>
            <p>{spot.description}</p>

            <div className="photo-spots-section">
              <h3>最佳打卡机位</h3>
              <div className="photo-spots-grid">
                {spot.bestPhotoSpots?.map((photoSpot) => (
                  <div key={photoSpot.id} className="photo-spot-card">
                    <img src={photoSpot.image} alt={photoSpot.name} />
                    <div className="photo-spot-info">
                      <h4>{photoSpot.name}</h4>
                      <p>{photoSpot.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              {!spot.bestPhotoSpots || spot.bestPhotoSpots.length === 0 && (
                <div className="empty-state">
                  <Camera size={64} />
                  <p>暂无最佳打卡机位信息</p>
                </div>
              )}
            </div>

            <div className="view-modes">
              <Button 
                type="primary" 
                onClick={() => setShow3DView(true)}
                className="mode-btn"
              >
                <Eye size={18} />
                3D视角体验
              </Button>
              <Button 
                type="default" 
                className="mode-btn"
              >
                <EyeOff size={18} />
                AR实景体验
              </Button>
            </div>
          </div>
        </Tabs.TabPane>

        <Tabs.TabPane key="food">
          <div className="tab-content">
            <h2>特色美食</h2>
            <div className="food-grid">
              {foods.map((food) => (
                <div key={food.id} className="food-card">
                  <img src={food.image} alt={food.name} />
                  <div className="food-info">
                    <h3>{food.name}</h3>
                    <p>{food.description}</p>
                    <div className="food-price">{food.price}</div>
                    <Button 
                      type="primary" 
                      onClick={() => handleFoodDelivery(food.name)}
                    >
                      <Utensils size={16} />
                      外卖点餐
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {foods.length === 0 && (
              <div className="empty-state">
                <Utensils size={64} />
                <p>暂无美食信息</p>
              </div>
            )}
          </div>
        </Tabs.TabPane>

        <Tabs.TabPane key="guide">
          <div className="tab-content">
            <h2>游玩攻略</h2>
            <div className="guide-content">
              <p>{spot.guide}</p>
            </div>
          </div>
        </Tabs.TabPane>

        <Tabs.TabPane key="tips">
          <div className="tab-content">
            <h2>旅游贴士</h2>
            <div className="tips-list">
              {spot.tips?.map((tip, index) => (
                <div key={index} className="tip-item">
                  <AlertCircle size={18} />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
            {!spot.tips || spot.tips.length === 0 && (
              <div className="empty-state">
                <Info size={64} />
                <p>暂无旅游贴士信息</p>
              </div>
            )}
          </div>
        </Tabs.TabPane>

        <Tabs.TabPane key="hotel">
          <div className="tab-content">
            <h2>推荐酒店</h2>
            <div className="hotel-grid">
              {hotels.map((hotel) => (
                <div key={hotel.id} className="hotel-card">
                  <img src={hotel.image} alt={hotel.name} />
                  <div className="hotel-info">
                    <h3>{hotel.name}</h3>
                    <p>{hotel.address}</p>
                    <div className="hotel-rating">
                      <Star size={16} fill="#FFD700" color="#FFD700" />
                      <span>{hotel.rating}</span>
                    </div>
                    <div className="hotel-price">{hotel.price}/晚</div>
                    <Button 
                      type="primary" 
                      onClick={() => handleHotelBooking(hotel.name)}
                    >
                      <Hotel size={16} />
                      立即预订
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {hotels.length === 0 && (
              <div className="empty-state">
                <Hotel size={64} />
                <p>暂无酒店信息</p>
              </div>
            )}
          </div>
        </Tabs.TabPane>

        <Tabs.TabPane key="reviews">
          <div className="tab-content">
            <div className="reviews-header">
              <h2>用户评价</h2>
              {isLoggedIn ? (
                <Button 
                  type="primary" 
                  icon={<MessageCircle size={16} />}
                  onClick={() => setShowCommentModal(true)}
                >
                  写评价
                </Button>
              ) : (
                <Button onClick={() => navigate('/login')}>
                  登录后写评价
                </Button>
              )}
            </div>

            {comments.length > 0 ? (
              <div className="comments-list">
                {comments.map((comment) => (
                  <div key={comment.commentId} className="comment-card">
                    <div className="comment-header">
                      <Avatar src={comment.avatar} size={40} icon={<User size={20} />} />
                      <div className="comment-user-info">
                        <span className="comment-username">{comment.username}</span>
                        <div className="comment-meta">
                          <Rate disabled value={comment.rating} className="comment-rating" />
                          <span className="comment-date">
                            {new Date(comment.createTime).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="comment-body">
                      <p>{comment.content}</p>
                      {comment.images.length > 0 && (
                        <div className="comment-images">
                          {comment.images.map((img, idx) => (
                            <img key={idx} src={img} alt="评论图片" />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="comment-actions">
                      <button 
                        className="action-btn"
                        onClick={() => handleLikeComment(comment.commentId)}
                      >
                        <Heart size={16} />
                        <span>{comment.likes}</span>
                      </button>
                      {user?.userId === comment.userId && (
                        <button 
                          className="action-btn delete-btn"
                          onClick={() => handleDeleteComment(comment.commentId)}
                        >
                          删除
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <MessageCircle size={48} />
                <p>还没有用户评价</p>
                <span>成为第一个评价的人吧！</span>
              </div>
            )}
          </div>
        </Tabs.TabPane>
      </Tabs>

      <Modal
        title="写评价"
        visible={showCommentModal}
        onCancel={() => setShowCommentModal(false)}
        footer={null}
      >
        <div className="comment-form">
          <div className="form-item">
            <label>评分</label>
            <Rate value={commentRating} onChange={setCommentRating} />
          </div>
          <div className="form-item">
            <label>评价内容</label>
            <Input.TextArea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="分享你的旅行体验..."
              rows={4}
            />
          </div>
          <div className="form-item">
            <label>图片链接（可选）</label>
            <Input
              value={commentPhotos}
              onChange={(e) => setCommentPhotos(e.target.value)}
              placeholder="粘贴图片URL"
              prefix={<Camera size={16} />}
            />
          </div>
          <Button 
            type="primary" 
            onClick={handleAddComment}
            disabled={!commentContent.trim()}
            block
          >
            <Send size={16} />
            发布评价
          </Button>
        </div>
      </Modal>

      <div className="bottom-actions">
        <Button type="primary" size="large" onClick={handleNavigation} className="nav-btn">
          <Navigation size={20} />
          导航前往
        </Button>
      </div>

      <Modal
        title="3D视角体验"
        visible={show3DView}
        onCancel={() => setShow3DView(false)}
        footer={null}
        width={800}
      >
        <div className="view-3d-container">
          <img
            src={spot.images[0]}
            alt="3D View"
            className="view-3d-image"
          />
          <div className="view-3d-overlay">
            <p>3D全景视角</p>
            <p>拖动鼠标可旋转查看全景</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
