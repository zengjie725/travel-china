import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Image, Trash2, Edit3, Send } from 'lucide-react';
import { Button, Modal, Form, Input, Upload, message } from 'antd';
import { storage } from '../utils/storage';
import type { TravelRecord } from '../utils/storage';

export default function CheckinCenter() {
  const { user, isLoggedIn } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [records, setRecords] = useState<TravelRecord[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState<string>('');

  if (!isLoggedIn || !user) {
    navigate('/login');
    return null;
  }

  const loadRecords = () => {
    setRecords(storage.getRecords(user.userId));
  };

  useState(() => {
    loadRecords();
  });

  const handleAddRecord = () => {
    form.validateFields().then((values) => {
      const newRecord: TravelRecord = {
        recordId: `record_${Date.now()}`,
        userId: user.userId,
        spotId: '',
        spotName: values.spotName,
        city: values.city,
        photos: previewImage ? [previewImage] : [],
        post: values.post,
        createTime: new Date().toISOString(),
      };

      storage.addRecord(newRecord);
      loadRecords();
      setShowAddModal(false);
      form.resetFields();
      setPreviewImage('');
      message.success('打卡成功！');
    });
  };

  const handleDeleteRecord = (recordId: string) => {
    storage.deleteRecord(recordId);
    loadRecords();
    message.success('删除成功！');
  };

  const handleImageUpload = (e: any) => {
    const file = e.file;
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="checkin-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/profile')}>
          <ArrowLeft size={20} />
          返回
        </button>
        <div className="header-content">
          <h1>打卡中心</h1>
          <p>记录我的旅行故事</p>
        </div>
        <Button type="primary" onClick={() => setShowAddModal(true)} className="add-btn">
          <Camera size={18} />
          打卡
        </Button>
      </div>

      {records.length === 0 ? (
        <div className="empty-state">
          <Camera size={64} />
          <h2>还没有打卡记录</h2>
          <p>记录你的第一次旅行吧！</p>
          <Button type="primary" onClick={() => setShowAddModal(true)}>
            <Camera size={18} />
            立即打卡
          </Button>
        </div>
      ) : (
        <div className="records-list">
          {records.map((record) => (
            <div key={record.recordId} className="record-card">
              {record.photos.length > 0 && (
                <div className="record-image">
                  <img src={record.photos[0]} alt={record.spotName} />
                </div>
              )}
              <div className="record-content">
                <h3>{record.spotName}</h3>
                <p className="record-city">{record.city}</p>
                {record.post && <p className="record-post">{record.post}</p>}
                <div className="record-footer">
                  <span className="record-date">
                    {new Date(record.createTime).toLocaleDateString()}
                  </span>
                  <div className="record-actions">
                    <button className="action-btn edit-btn">
                      <Edit3 size={16} />
                    </button>
                    <button 
                      className="action-btn delete-btn" 
                      onClick={() => handleDeleteRecord(record.recordId)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        title="添加打卡记录"
        visible={showAddModal}
        onCancel={() => { setShowAddModal(false); form.resetFields(); setPreviewImage(''); }}
        footer={null}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="spotName"
            label="景点名称"
            rules={[{ required: true, message: '请输入景点名称' }]}
          >
            <Input placeholder="请输入景点名称" />
          </Form.Item>

          <Form.Item
            name="city"
            label="所在城市"
            rules={[{ required: true, message: '请输入城市名称' }]}
          >
            <Input placeholder="请输入城市名称" />
          </Form.Item>

          <Form.Item name="photos" label="上传照片">
            <Upload
              listType="picture-card"
              beforeUpload={() => false}
              onChange={handleImageUpload}
              fileList={previewImage ? [{ uid: '1', name: 'photo', url: previewImage }] : []}
            >
              {previewImage ? null : (
                <div>
                  <Image size={24} />
                  <p>上传照片</p>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item name="post" label="旅行感想">
            <Input.TextArea placeholder="分享你的旅行故事..." rows={4} />
          </Form.Item>

          <Button type="primary" onClick={handleAddRecord} className="submit-btn">
            <Send size={18} />
            发布打卡
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
