import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getMe, logout } from './api';
import { AuthPage } from './pages/AuthPage';
import { ContractorsPage } from './pages/ContractorsPage';
import { JobsPage } from './pages/JobsPage';
import { JobDetailPage } from './pages/JobDetailPage';
import './App.css';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = () => {
    getMe()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  };

  useEffect(checkAuth, []);

  const handleLogout = async () => {
    await logout().catch(() => {});
    setUser(null);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <BrowserRouter>
      <nav className="navbar">
        <div className="nav-links">
          <NavLink to="/contractors">Contractors</NavLink>
          <NavLink to="/jobs">Jobs</NavLink>
        </div>
        <div className="nav-user">
          {user ? (
            <>
              <span>{user.name}</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <NavLink to="/auth">Login</NavLink>
          )}
        </div>
      </nav>
      <main className="container">
        <Routes>
          <Route path="/auth" element={user ? <Navigate to="/jobs" /> : <AuthPage onAuth={checkAuth} />} />
          <Route path="/contractors" element={<ContractorsPage />} />
          <Route path="/jobs" element={user ? <JobsPage /> : <Navigate to="/auth" />} />
          <Route path="/jobs/:id" element={user ? <JobDetailPage /> : <Navigate to="/auth" />} />
          <Route path="*" element={<Navigate to="/jobs" />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
