import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function MainLayout({ children }) {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'ti-layout-dashboard' },
    { name: 'New analysis', path: '/upload', icon: 'ti-upload' },
    { name: 'Interactive map', path: '/map', icon: 'ti-map-2' },
    { name: 'Analytics', path: '/analytics', icon: 'ti-chart-bar' },
    { name: 'History', path: '/history', icon: 'ti-history' },
    { name: 'Reports', path: '/reports', icon: 'ti-file-report' },
    { name: 'Datasets', path: '/datasets', icon: 'ti-database' },
  ];

  return (
    <div style={{ 
      background: '#F7F8F3', 
      fontFamily: "Georgia, 'Times New Roman', serif", 
      color: '#1F2E29', 
      width: '100%', 
      display: 'flex', 
      minHeight: '100vh',
      overflow: 'hidden'
    }}>
      
      {/* SIDEBAR */}
      <div style={{ 
        background: '#123D30', 
        width: isCollapsed ? '80px' : '240px', 
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
        padding: '24px 12px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '4px',
        flexShrink: 0
      }}>
        
        {/* HEADER AREA (Logo + Toggle) */}
        <div style={{ 
          display: 'flex', 
          flexDirection: isCollapsed ? 'column' : 'row', 
          alignItems: 'center', 
          justifyContent: isCollapsed ? 'center' : 'space-between',
          padding: '0 8px 32px',
          gap: isCollapsed ? '16px' : '0'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#F0F3EA', fontWeight: 700, fontSize: '16px' }}>
            <span style={{ minWidth: '28px', height: '28px', borderRadius: '50%', background: '#F0F3EA', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="ti ti-satellite" style={{ color: '#123D30', fontSize: '15px' }}></i>
            </span>
            {!isCollapsed && <span style={{ whiteSpace: 'nowrap' }}>PS10 AI</span>}
          </div>

          {/* Toggle Button */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              background: '#0F4D3E',
              border: 'none',
              color: '#F0F3EA',
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s'
            }}
          >
            <i className={`ti ${isCollapsed ? 'ti-layout-sidebar-right-expand' : 'ti-layout-sidebar-left-collapse'}`} style={{ fontSize: '16px' }}></i>
          </button>
        </div>

        {/* Navigation Links */}
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              title={isCollapsed ? item.name : ""}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 12px', borderRadius: '10px', textDecoration: 'none',
                fontFamily: 'Arial, sans-serif', fontSize: '13px',
                background: isActive ? '#0F6E56' : 'transparent',
                color: isActive ? '#F0F3EA' : '#B9C9BD',
                transition: 'all 0.2s',
                justifyContent: isCollapsed ? 'center' : 'flex-start'
              }}
            >
              <i className={`ti ${item.icon}`} style={{ fontSize: '18px', minWidth: '18px' }}></i> 
              {!isCollapsed && <span style={{ whiteSpace: 'nowrap' }}>{item.name}</span>}
            </Link>
          );
        })}

        <div style={{ flex: 1 }}></div>

        {/* Settings & Profile */}
        <Link 
          to="/settings" 
          title={isCollapsed ? "Settings" : ""}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', 
            borderRadius: '10px', textDecoration: 'none', fontFamily: 'Arial, sans-serif', fontSize: '13px', 
            background: currentPath === '/settings' ? '#0F6E56' : 'transparent', 
            color: currentPath === '/settings' ? '#F0F3EA' : '#B9C9BD',
            justifyContent: isCollapsed ? 'center' : 'flex-start'
          }}
        >
          <i className="ti ti-settings" style={{ fontSize: '18px', minWidth: '18px' }}></i> 
          {!isCollapsed && <span style={{ whiteSpace: 'nowrap' }}>Settings</span>}
        </Link>

        <Link 
          to="/profile" 
          title={isCollapsed ? "Profile" : ""}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 8px', 
            borderTop: '1px solid #1E5747', marginTop: '12px', textDecoration: 'none',
            justifyContent: isCollapsed ? 'center' : 'flex-start'
          }}
        >
          <div style={{ minWidth: '32px', height: '32px', borderRadius: '50%', background: '#5DCAA5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial,sans-serif', fontSize: '12px', color: '#123D30', fontWeight: 700 }}>
            MS
          </div>
          {!isCollapsed && (
            <div style={{ display: 'flex', flexDirection: 'column', whiteSpace: 'nowrap' }}>
              <span style={{ fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#F0F3EA', fontWeight: 700 }}>Manan S.</span>
              <span style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#8FBFA0' }}>Analyst</span>
            </div>
          )}
        </Link>
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ 
        flex: 1, 
        maxHeight: '100vh', 
        overflowY: 'auto', 
        padding: '24px 32px',
        transition: 'padding 0.3s ease',
        '@media (maxWidth: 768px)': {
          padding: '16px'
        }
      }}>
        {children}
      </div>

    </div>
  );
}