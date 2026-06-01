
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { UserSession } from './types';

const App: React.FC = () => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("er_theme");
    return saved ? saved === "dark" : true;
  });

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("er_logged_in") === "true";
    const savedEmail = sessionStorage.getItem("er_user_email");
    
    if (loggedIn && savedEmail) {
      setSession({ email: savedEmail, isLoggedIn: true });
    }
    
    // Apply theme to body
    document.body.className = isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]';
    localStorage.setItem("er_theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const handleLogin = (email: string) => {
    sessionStorage.setItem("er_logged_in", "true");
    sessionStorage.setItem("er_user_email", email);
    setSession({ email, isLoggedIn: true });
  };

  const handleLogout = () => {
    sessionStorage.removeItem("er_logged_in");
    sessionStorage.removeItem("er_user_email");
    setSession(null);
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'dark text-slate-100 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'text-slate-900 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100'}`}>
      {session?.isLoggedIn ? (
        <Dashboard 
          user={session} 
          onLogout={handleLogout} 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme} 
        />
      ) : (
        <Login onLogin={handleLogin} isDarkMode={isDarkMode} />
      )}
    </div>
  );
};

export default App;
