import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Header from './components/Header';
import { Loading } from './components/Skeleton';
import './App.css';

// 路由懒加载
const ProvinceList = lazy(() => import('./pages/ProvinceList'));
const CityList = lazy(() => import('./pages/CityList'));
const SpotList = lazy(() => import('./pages/SpotList'));
const SpotDetail = lazy(() => import('./pages/SpotDetail'));
const Login = lazy(() => import('./pages/Login'));
const Profile = lazy(() => import('./pages/Profile'));
const Footprints = lazy(() => import('./pages/Footprints'));
const CheckinCenter = lazy(() => import('./pages/CheckinCenter'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const ToolsPage = lazy(() => import('./pages/ToolsPage'));
const SubmitSpot = lazy(() => import('./pages/SubmitSpot'));
const UserContributions = lazy(() => import('./pages/UserContributions'));

// 错误边界组件
class ErrorBoundary extends React.Component<{ children: React.ReactNode, fallback?: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode, fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('App Error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <h2>页面加载出错</h2>
          <p style={{ color: '#999' }}>请刷新页面重试</p>
          <button onClick={() => window.location.reload()} style={{
            padding: '8px 24px', marginTop: 16, cursor: 'pointer',
            background: '#1677ff', color: '#fff', border: 'none', borderRadius: 6
          }}>刷新页面</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const navigate = useNavigate();
  const handleSearch = (keyword: string) => {
    navigate(`/search?q=${encodeURIComponent(keyword)}`);
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <Header onSearch={handleSearch} />
        <main className="main-content">
          <Suspense fallback={<Loading text="页面加载中..." />}>
            <Routes>
              <Route path="/" element={<Navigate to="/provinces" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/provinces" element={<ProvinceList />} />
              <Route path="/provinces/:provinceId/cities" element={<CityList />} />
              <Route path="/cities/:provinceId/:cityId/spots" element={<SpotList />} />
              <Route path="/spots/:provinceId/:cityId/:spotId" element={<SpotDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/footprints" element={<Footprints />} />
              <Route path="/profile/checkin" element={<CheckinCenter />} />
              <Route path="/profile/tools" element={<ToolsPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/submit-spot" element={<SubmitSpot />} />
              <Route path="/profile/contributions" element={<UserContributions />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}