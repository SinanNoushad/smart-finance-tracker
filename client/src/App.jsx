import React, { useContext, useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme, darkTheme } from './styles/theme';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Goals from './pages/Goals';
import ReportPage from './pages/ReportPage';
import { AuthContext } from './context/AuthContext';
import './styles/global.css';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
};

// This component handles page transitions and scroll to top on route change
const AppContent = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return (
    <>
      <NavBar />
      <main style={{ flex: 1, padding: '2rem 0' }}>
        <div className="container">
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <Transactions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/budgets"
              element={
                <ProtectedRoute>
                  <Budgets />
                </ProtectedRoute>
              }
            />
            <Route
              path="/goals"
              element={
                <ProtectedRoute>
                  <Goals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <ReportPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </main>
      <Footer />
    </>
  );
};

const Footer = () => (
  <footer style={{
    backgroundColor: '#fff',
    padding: '2rem 0',
    borderTop: '1px solid #eaeaea',
    marginTop: 'auto'
  }}>
    <div className="container" style={{ textAlign: 'center' }}>
      <p style={{ color: '#666', margin: 0 }}>
        © {new Date().getFullYear()} Smart Finance Tracker. All rights reserved.
      </p>
    </div>
  </footer>
);

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Check for saved theme preference or use system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
    }
    
    // Add class to body for dark mode
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };
  
  return (
    <ThemeProvider theme={isDarkMode ? { ...darkTheme, isDarkMode } : { ...theme, isDarkMode }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: isDarkMode ? darkTheme.colors.dark : theme.colors.light,
        color: isDarkMode ? darkTheme.colors.light : theme.colors.dark,
        transition: 'background-color 0.2s ease, color 0.2s ease'
      }}>
        <AppContent />
      </div>
    </ThemeProvider>
  );
};

export default App;
