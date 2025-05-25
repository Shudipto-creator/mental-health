import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import CustomCursor from './components/CustomCursor';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Resources from './pages/Resources';
import { useAuth } from './hooks/useAuth';

// Import Health Assessment Forms
import PhysicalForm from './components/forms/PhysicalForm';
import NutritionalForm from './components/forms/NutritionalForm';
import SleepForm from './components/forms/SleepForm';
import StressForm from './components/forms/StressForm';
import AssessmentSummary from './components/forms/AssessmentSummary';

// Note: To properly fix React Router warnings, we would need to update to the latest version
// and use createBrowserRouter with future flags. For now, we'll use the current implementation.

function AppRoutes() {
  const { session } = useAuth();
  
  return (
    <>
      <CustomCursor />
      <Routes>
        <Route path="/" element={!session ? <Auth /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/chat" element={session ? <Chat /> : <Navigate to="/" />} />
        <Route path="/profile" element={session ? <Profile /> : <Navigate to="/" />} />
        <Route path="/resources" element={session ? <Resources /> : <Navigate to="/" />} />
        
        {/* Health Assessment Form Routes */}
        <Route path="/physical-assessment" element={session ? <PhysicalForm /> : <Navigate to="/" />} />
        <Route path="/nutritional-assessment" element={session ? <NutritionalForm /> : <Navigate to="/" />} />
        <Route path="/sleep-assessment" element={session ? <SleepForm /> : <Navigate to="/" />} />
        <Route path="/stress-assessment" element={session ? <StressForm /> : <Navigate to="/" />} />
        <Route path="/assessment-summary" element={session ? <AssessmentSummary /> : <Navigate to="/" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppRoutes />
      </Router>
    </ErrorBoundary>
  );
}

export default App;