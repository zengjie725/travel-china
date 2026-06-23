import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, MapPin, Search, Menu, X, LogOut } from 'lucide-react';
import { Button, Dropdown, Avatar } from 'antd';
import { logout } from '../features/auth/slice';
import type { RootState } from '../store';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onSearch?: (keyword: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);
  const [searchValue, setSearchValue] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleSearch = () => {
    if (onSearch && searchValue.trim()) {
      onSearch(searchValue.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="logo" onClick={() => navigate('/')}>
            <MapPin className="logo-icon" />
            <span className="logo-text">全国旅游</span>
          </div>
        </div>

        <div className="header-center">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="搜索景点、城市..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="search-btn" onClick={handleSearch}>搜索</button>
          </div>
        </div>

        <div className="header-right">
          {isLoggedIn && user ? (
            <Dropdown
              menu={{
                items: [
                  { label: '个人中心', key: 'profile', onClick: () => navigate('/profile') },
                  { label: '我的足迹', key: 'footprints', onClick: () => navigate('/profile/footprints') },
                  { label: '打卡中心', key: 'checkin', onClick: () => navigate('/profile/checkin') },
                  { type: 'divider' as const },
                  { label: '退出登录', key: 'logout', onClick: handleLogout, icon: <LogOut size={16} /> },
                ],
              }}
            >
              <div className="user-info">
                <Avatar src={user.avatar} alt={user.username} size={32} />
                <span className="username">{user.username}</span>
              </div>
            </Dropdown>
          ) : (
            <Button type="primary" onClick={() => navigate('/login')}>
              <User size={16} style={{ marginRight: 4 }} />
              登录
            </Button>
          )}
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-menu">
          <button className="mobile-menu-item" onClick={() => { navigate('/provinces'); setMobileMenuOpen(false); }}>
            探索景点
          </button>
          <button className="mobile-menu-item" onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }}>
            个人中心
          </button>
          {!isLoggedIn && (
            <button className="mobile-menu-item" onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>
              登录
            </button>
          )}
          {isLoggedIn && (
            <button className="mobile-menu-item" onClick={handleLogout}>
              退出登录
            </button>
          )}
        </div>
      )}
    </header>
  );
}
