import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { ArrowLeft, CheckCircle, Square, Plus, Trash2 } from 'lucide-react';
import { Button, Input, Card, Modal, message } from 'antd';

interface ChecklistItem {
  id: string;
  name: string;
  checked: boolean;
}

interface Checklist {
  id: string;
  name: string;
  items: ChecklistItem[];
  createdAt: string;
}

const DEFAULT_CHECKLIST: Checklist[] = [
  { id: '1', name: '证件类', items: [
    { id: '1-1', name: '身份证', checked: false },
    { id: '1-2', name: '护照（如需出境）', checked: false },
    { id: '1-3', name: '驾驶证', checked: false },
    { id: '1-4', name: '学生证/老年证（优惠门票）', checked: false },
  ], createdAt: new Date().toISOString() },
  { id: '2', name: '衣物类', items: [
    { id: '2-1', name: '换洗衣物', checked: false },
    { id: '2-2', name: '内衣袜子', checked: false },
    { id: '2-3', name: '舒适的步行鞋', checked: false },
    { id: '2-4', name: '外套/防晒衣', checked: false },
    { id: '2-5', name: '帽子/墨镜', checked: false },
  ], createdAt: new Date().toISOString() },
  { id: '3', name: '洗漱用品', items: [
    { id: '3-1', name: '牙刷、牙膏', checked: false },
    { id: '3-2', name: '毛巾', checked: false },
    { id: '3-3', name: '洗发水、沐浴露', checked: false },
    { id: '3-4', name: '防晒霜', checked: false },
  ], createdAt: new Date().toISOString() },
  { id: '4', name: '电子产品', items: [
    { id: '4-1', name: '手机、充电器', checked: false },
    { id: '4-2', name: '充电宝', checked: false },
    { id: '4-3', name: '相机（如有）', checked: false },
    { id: '4-4', name: '耳机', checked: false },
  ], createdAt: new Date().toISOString() },
  { id: '5', name: '药品类', items: [
    { id: '5-1', name: '创可贴', checked: false },
    { id: '5-2', name: '感冒药', checked: false },
    { id: '5-3', name: '止泻药', checked: false },
    { id: '5-4', name: '晕车药', checked: false },
    { id: '5-5', name: '个人常用药', checked: false },
  ], createdAt: new Date().toISOString() },
  { id: '6', name: '其他', items: [
    { id: '6-1', name: '水杯', checked: false },
    { id: '6-2', name: '纸巾/湿巾', checked: false },
    { id: '6-3', name: '雨伞/雨衣', checked: false },
    { id: '6-4', name: '现金', checked: false },
    { id: '6-5', name: '零食', checked: false },
  ], createdAt: new Date().toISOString() },
];

export default function ToolsPage() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [checklists, setChecklists] = useState<Checklist[]>(DEFAULT_CHECKLIST);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  if (!isLoggedIn || !user) {
    navigate('/login');
    return null;
  }

  const toggleItem = (categoryId: string, itemId: string) => {
    setChecklists(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          items: cat.items.map(item => {
            if (item.id === itemId) {
              return { ...item, checked: !item.checked };
            }
            return item;
          })
        };
      }
      return cat;
    }));
  };

  const addCategory = () => {
    if (!newCategory.trim()) return;
    
    const newCat: Checklist = {
      id: `custom_${Date.now()}`,
      name: newCategory,
      items: [],
      createdAt: new Date().toISOString(),
    };
    
    setChecklists(prev => [...prev, newCat]);
    setNewCategory('');
    setShowAddModal(false);
    message.success('分类添加成功');
  };

  const addItem = (categoryId: string) => {
    const itemName = prompt('请输入物品名称：');
    if (!itemName?.trim()) return;

    setChecklists(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          items: [...cat.items, {
            id: `${categoryId}-${Date.now()}`,
            name: itemName.trim(),
            checked: false
          }]
        };
      }
      return cat;
    }));
    message.success('物品添加成功');
  };

  const deleteCategory = (categoryId: string) => {
    setChecklists(prev => prev.filter(cat => cat.id !== categoryId));
    message.success('分类已删除');
  };

  const getProgress = (items: ChecklistItem[]) => {
    const checked = items.filter(item => item.checked).length;
    return `${checked}/${items.length}`;
  };

  const getTotalProgress = () => {
    const total = checklists.reduce((acc, cat) => acc + cat.items.length, 0);
    const checked = checklists.reduce((acc, cat) => 
      acc + cat.items.filter(item => item.checked).length, 0);
    return { checked, total };
  };

  const progress = getTotalProgress();

  return (
    <div className="tools-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/profile')}>
          <ArrowLeft size={20} />
          返回
        </button>
        <div className="header-content">
          <h1>行前准备工具箱</h1>
          <p>整理行李，不再遗漏</p>
        </div>
      </div>

      {/* 总体进度 */}
      <div className="progress-card">
        <div className="progress-info">
          <h3>准备进度</h3>
          <span className="progress-text">
            已准备 {progress.checked} / {progress.total} 件物品
          </span>
        </div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill"
            style={{ width: `${progress.total > 0 ? (progress.checked / progress.total) * 100 : 0}%` }}
          />
        </div>
        <span className="progress-percent">
          {progress.total > 0 ? Math.round((progress.checked / progress.total) * 100) : 0}%
        </span>
      </div>

      {/* 行李清单 */}
      <div className="checklists-container">
        {checklists.map((category) => (
          <Card 
            key={category.id} 
            className="checklist-card"
            title={
              <div className="checklist-header">
                <span>{category.name}</span>
                <span className="item-count">{getProgress(category.items)}</span>
              </div>
            }
            extra={
              <div className="checklist-actions">
                <Button 
                  type="text" 
                  size="small" 
                  icon={<Plus size={16} />}
                  onClick={() => addItem(category.id)}
                />
                {!category.id.startsWith('custom_') ? null : (
                  <Button 
                    type="text" 
                    size="small" 
                    danger
                    icon={<Trash2 size={16} />}
                    onClick={() => deleteCategory(category.id)}
                  />
                )}
              </div>
            }
          >
            <div className="checklist-items">
              {category.items.map((item) => (
                <div 
                  key={item.id} 
                  className={`checklist-item ${item.checked ? 'checked' : ''}`}
                  onClick={() => toggleItem(category.id, item.id)}
                >
                  <div className="item-checkbox">
                    {item.checked ? (
                      <CheckCircle size={20} className="checked-icon" />
                    ) : (
                      <Square size={20} />
                    )}
                  </div>
                  <span className="item-name">{item.name}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* 添加分类按钮 */}
      <div className="add-category">
        <Button 
          type="dashed" 
          icon={<Plus size={16} />}
          onClick={() => setShowAddModal(true)}
          block
        >
          添加新分类
        </Button>
      </div>

      {/* 添加分类弹窗 */}
      <Modal
        title="添加新分类"
        open={showAddModal}
        onCancel={() => setShowAddModal(false)}
        onOk={addCategory}
        okText="添加"
        cancelText="取消"
      >
        <div className="add-category-form">
          <label>分类名称</label>
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="例如：户外装备"
            onPressEnter={addCategory}
          />
        </div>
      </Modal>
    </div>
  );
}
