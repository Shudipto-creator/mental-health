import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CustomCursor from './components/CustomCursor';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Resources from './pages/Resources';
import { useAuth } from './hooks/useAuth';

function App() {
  const { session } = useAuth();

  return (
    <Router>
      <CustomCursor />
      <Routes>
        <Route path="/" element={!session ? <Auth /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/chat" element={session ? <Chat /> : <Navigate to="/" />} />
        <Route path="/profile" element={session ? <Profile /> : <Navigate to="/" />} />
        <Route path="/resources" element={session ? <Resources /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;