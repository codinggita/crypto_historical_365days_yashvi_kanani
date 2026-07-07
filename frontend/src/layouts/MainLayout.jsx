import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import '../styles/layout.css';

function MainLayout() {
  const { theme } = useSelector((state) => state.ui);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="app-shell">
      {/* Premium Layered Background Decorations */}
      <div className="bg-glowing-dots" aria-hidden="true">
        <div className="bg-glow-circle-1" />
        <div className="bg-glow-circle-2" />
      </div>

      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
