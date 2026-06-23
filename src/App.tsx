import { Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import ProvinceList from './pages/ProvinceList';
import CityList from './pages/CityList';
import SpotList from './pages/SpotList';
import SpotDetail from './pages/SpotDetail';
import Profile from './pages/Profile';
import Footprints from './pages/Footprints';
import CheckinCenter from './pages/CheckinCenter';
import SearchPage from './pages/SearchPage';
import ToolsPage from './pages/ToolsPage';

function AppContent() {
  const handleSearch = (keyword: string) => {
    window.location.href = `/search?q=${encodeURIComponent(keyword)}`;
  };

  return (
    <div className="app">
      <Header onSearch={handleSearch} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/provinces" element={<ProvinceList />} />
          <Route path="/provinces/:provinceId/cities" element={<CityList />} />
          <Route path="/cities/:cityId/spots" element={<SpotList />} />
          <Route path="/spots/:spotId" element={<SpotDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/footprints" element={<Footprints />} />
          <Route path="/profile/checkin" element={<CheckinCenter />} />
          <Route path="/profile/tools" element={<ToolsPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
