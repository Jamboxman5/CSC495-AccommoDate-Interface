import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';

export default function App() {
  const token = localStorage.getItem('jwt');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={token ? '/home' : '/login'} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  );
}