import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/landing-page';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout'; // Import Layout Baru
import Dashboard from './pages/dashboard';
import Dataset from './pages/dataset';
import Prediction from './pages/prediction';
import History from './pages/history';

import Profile from './pages/profile';


function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
    
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dataset" element={<Dataset />} />
            <Route path="/prediction" element={<Prediction />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        <Route path="*" element={<div className="p-8 text-center text-red-500 font-bold">404 - Halaman Tidak Ditemukan</div>} />
      </Routes>
    </Router>
  );
}

export default App;