import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Camera, Star, Clock, DollarSign, Phone, 
  Globe, Calendar, Upload, X, Check, AlertCircle 
} from 'lucide-react';
import { Button } from 'antd';
import './SubmitSpot.css';

interface SpotFormData {
  name: string;
  province: string;
  city: string;
  district: string;
  address: string;
  location_lat: string;
  location_lng: string;
  description: string;
  ticket_price: string;
  opening_hours: string;
  images: File[];
}

export default function SubmitSpot() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SpotFormData>({
    name: '',
    province: '',
    city: '',
    district: '',
    address: '',
    location_lat: '',
    location_lng: '',
    description: '',
    ticket_price: '',
    opening_hours: '',
    images: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (formData.images.length + files.length > 9) {
      alert('最多上传9张图片');
      return;
    }
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.province || !formData.city) {
      alert('请填写必填项');
      return;
    }

    setIsSubmitting(true);

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 保存到localStorage模拟提交
      const submissions = JSON.parse(localStorage.getItem('userSubmissions') || '[]');
      submissions.push({
        id: Date.now().toString(),
        ...formData,
        status: 'pending',
        submittedAt: new Date().toISOString()
      });
      localStorage.setItem('userSubmissions', JSON.stringify(submissions));
      
      setSubmitSuccess(true);
      
      // 3秒后跳转
      setTimeout(() => {
        navigate('/profile');
      }, 3000);
    } catch (error) {
      alert('提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="submit-success-container">
        <div className="success-content">
          <div className="success-icon">
            <Check size={64} />
          </div>
          <h2>提交成功！</h2>
          <p>感谢您的贡献，景点审核结果将在1-3个工作日内通知您</p>
          <div className="success-tips">
            <h4>温馨提示：</h4>
            <ul>
              <li>审核通过后可获得 <strong>+50 积分</strong></li>
              <li>热门景点被多人打卡可获得额外奖励</li>
              <li>优质贡献者可获得"景点达人"徽章</li>
            </ul>
          </div>
          <Button type="primary" onClick={() => navigate('/profile')}>
            查看我的贡献
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="submit-spot-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <X size={20} />
        </button>
        <h1>贡献新景点</h1>
      </div>

      <form className="submit-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3><MapPin size={18} /> 基本信息</h3>
          
          <div className="form-group">
            <label>景点名称 <span className="required">*</span></label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="请输入景点名称"
              maxLength={100}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>省份 <span className="required">*</span></label>
              <select
                name="province"
                value={formData.province}
                onChange={handleInputChange}
              >
                <option value="">请选择省份</option>
                <option value="北京市">北京市</option>
                <option value="上海市">上海市</option>
                <option value="广东省">广东省</option>
                {/* 其他省份... */}
              </select>
            </div>
            <div className="form-group">
              <label>城市 <span className="required">*</span></label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="请输入城市"
              />
            </div>
          </div>

          <div className="form-group">
            <label>区县</label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              placeholder="如：东城区"
            />
          </div>

          <div className="form-group">
            <label>详细地址</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="请输入详细地址"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>纬度</label>
              <input
                type="text"
                name="location_lat"
                value={formData.location_lat}
                onChange={handleInputChange}
                placeholder="如：39.9163"
              />
            </div>
            <div className="form-group">
              <label>经度</label>
              <input
                type="text"
                name="location_lng"
                value={formData.location_lng}
                onChange={handleInputChange}
                placeholder="如：116.3972"
              />
            </div>
          </div>
          <p className="tip">
            <AlertCircle size={14} />
            经纬度可在高德地图或百度地图获取
          </p>
        </div>

        <div className="form-section">
          <h3><Clock size={18} /> 详细信息</h3>
          
          <div className="form-group">
            <label>景点简介</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="请描述景点的特色、历史文化、游览建议等..."
              rows={4}
              maxLength={2000}
            />
            <span className="char-count">{formData.description.length}/2000</span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label><DollarSign size={14} /> 门票价格</label>
              <input
                type="text"
                name="ticket_price"
                value={formData.ticket_price}
                onChange={handleInputChange}
                placeholder="如：60元 或 免费"
              />
            </div>
            <div className="form-group">
              <label><Clock size={14} /> 开放时间</label>
              <input
                type="text"
                name="opening_hours"
                value={formData.opening_hours}
                onChange={handleInputChange}
                placeholder="如：08:30-17:00"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3><Camera size={18} /> 景点图片</h3>
          
          <div className="image-upload-area">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            <label htmlFor="image-upload" className="upload-btn">
              <Upload size={24} />
              <span>上传图片</span>
              <span className="upload-tip">最多9张，建议横屏拍摄</span>
            </label>
          </div>

          {formData.images.length > 0 && (
            <div className="image-preview-grid">
              {formData.images.map((file, index) => (
                <div key={index} className="image-preview-item">
                  <img src={URL.createObjectURL(file)} alt={`预览 ${index + 1}`} />
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeImage(index)}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-section rewards-info">
          <h3><Star size={18} /> 贡献奖励</h3>
          <div className="rewards-grid">
            <div className="reward-item">
              <div className="reward-icon">🎯</div>
              <div className="reward-text">
                <strong>提交审核</strong>
                <span>+50 积分</span>
              </div>
            </div>
            <div className="reward-item">
              <div className="reward-icon">✅</div>
              <div className="reward-text">
                <strong>审核通过</strong>
                <span>+100 积分</span>
              </div>
            </div>
            <div className="reward-item">
              <div className="reward-icon">🔥</div>
              <div className="reward-text">
                <strong>热门景点</strong>
                <span>额外奖励</span>
              </div>
            </div>
            <div className="reward-item">
              <div className="reward-icon">🏆</div>
              <div className="reward-text">
                <strong>景点达人</strong>
                <span>专属徽章</span>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
            size="large"
            block
          >
            {isSubmitting ? '提交中...' : '提交景点'}
          </Button>
          <p className="submit-agreement">
            提交即表示同意我们的
            <a href="/terms">用户协议</a>和
            <a href="/privacy">隐私政策</a>
          </p>
        </div>
      </form>
    </div>
  );
}
