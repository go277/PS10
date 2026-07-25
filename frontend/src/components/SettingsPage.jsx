import React, { useState, useEffect } from 'react';

export default function SettingsPage() {
  // --- STATE MANAGEMENT ---
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('English');
  const [modelVersion, setModelVersion] = useState('ThermalGAN v3.2');
  
  // UI States
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // --- INITIALIZE FROM LOCAL STORAGE ---
  useEffect(() => {
    const savedTheme = localStorage.getItem('ps10_theme') || 'light';
    const savedLang = localStorage.getItem('ps10_lang') || 'English';
    const savedModel = localStorage.getItem('ps10_model') || 'ThermalGAN v3.2';
    
    setTheme(savedTheme);
    setLanguage(savedLang);
    setModelVersion(savedModel);
  }, []);

  // --- SAVE HANDLER ---
  const handleSaveChanges = () => {
    setIsSaving(true);
    
    // Save to browser storage (In a real app, this would also be a PUT request to your FastAPI backend)
    localStorage.setItem('ps10_theme', theme);
    localStorage.setItem('ps10_lang', language);
    localStorage.setItem('ps10_model', modelVersion);
    
    // Simulate network delay for realistic UX
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    }, 600);
  };

  // Dynamic color palette based on active theme for this specific page
  const isDark = theme === 'dark';
  const colors = {
    bg: isDark ? '#1A1A1A' : '#F7F8F3',
    panelBg: isDark ? '#242424' : '#FFFFFF',
    textPrimary: isDark ? '#F0F3EA' : '#123D30',
    textSecondary: isDark ? '#A3A396' : '#5B685F',
    border: isDark ? '#333333' : '#EFF0E8',
    inputBg: isDark ? '#1A1A1A' : '#FFFFFF',
    inputBorder: isDark ? '#404040' : '#D7DCCB',
    sidebarBg: isDark ? '#2A2A2A' : '#EFF2E6',
  };

  return (
    <div style={{ background: colors.bg, fontFamily: "Georgia, 'Times New Roman', serif", color: '#1F2E29', width: '100%', display: 'flex', borderRadius: '16px', overflow: 'hidden', border: `1px solid ${isDark ? '#333' : '#E3E4DA'}`, minHeight: '500px', transition: 'all 0.3s ease' }}>
      
      {/* Settings Navigation Sidebar */}
      <div style={{ background: colors.sidebarBg, padding: '24px 16px', borderRight: `1px solid ${colors.border}`, width: '200px', flexShrink: 0, transition: 'all 0.3s ease' }}>
        <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '18px', color: colors.textPrimary, padding: '0 8px' }}>Settings</div>
        
        <div style={{ background: '#0F4D3E', color: '#F7F8F3', borderRadius: '10px', padding: '10px 14px', fontFamily: 'Arial, sans-serif', fontSize: '13px', marginBottom: '4px', cursor: 'pointer', fontWeight: 600 }}>
          <i className="ti ti-adjustments-horizontal" style={{ marginRight: '8px', fontSize: '15px' }}></i> General
        </div>
        <div style={{ color: colors.textSecondary, padding: '10px 14px', fontFamily: 'Arial, sans-serif', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <i className="ti ti-user" style={{ marginRight: '8px', fontSize: '15px' }}></i> Account
        </div>
        <div style={{ color: colors.textSecondary, padding: '10px 14px', fontFamily: 'Arial, sans-serif', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <i className="ti ti-bell" style={{ marginRight: '8px', fontSize: '15px' }}></i> Notifications
        </div>
        <div style={{ color: colors.textSecondary, padding: '10px 14px', fontFamily: 'Arial, sans-serif', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <i className="ti ti-shield-lock" style={{ marginRight: '8px', fontSize: '15px' }}></i> Security
        </div>
      </div>

      {/* Settings Form Content */}
      <div style={{ padding: '32px 40px', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: colors.textPrimary }}>General Preferences</h1>
          
          {/* Dynamic Success Toast */}
          {showSuccess && (
            <div style={{ background: '#E1EFD9', color: '#166534', padding: '8px 16px', borderRadius: '999px', fontSize: '12px', fontFamily: 'Arial, sans-serif', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', animation: 'fadeIn 0.3s ease' }}>
              <i className="ti ti-check"></i> Preferences saved
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: `1px solid ${colors.border}` }}>
          <div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px', fontWeight: 600, color: colors.textPrimary, marginBottom: '4px' }}>Interface Theme</div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: colors.textSecondary }}>Choose how PS10 looks to you.</div>
          </div>
          <div style={{ display: 'flex', background: isDark ? '#333' : '#E3E4DA', borderRadius: '999px', padding: '4px', transition: 'all 0.3s' }}>
            <span 
              onClick={() => setTheme('light')}
              style={{ padding: '8px 18px', borderRadius: '999px', background: theme === 'light' ? '#F7F8F3' : 'transparent', color: theme === 'light' ? '#123D30' : '#8B8B7E', fontFamily: 'Arial, sans-serif', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: theme === 'light' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}
            >
              <i className="ti ti-sun" style={{ marginRight: '4px' }}></i> Light
            </span>
            <span 
              onClick={() => setTheme('dark')}
              style={{ padding: '8px 18px', borderRadius: '999px', background: theme === 'dark' ? '#242424' : 'transparent', color: theme === 'dark' ? '#F0F3EA' : '#5B685F', fontFamily: 'Arial, sans-serif', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: theme === 'dark' ? '0 2px 4px rgba(0,0,0,0.2)' : 'none' }}
            >
              <i className="ti ti-moon" style={{ marginRight: '4px' }}></i> Dark
            </span>
          </div>
        </div>

        {/* Language Selection */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: `1px solid ${colors.border}` }}>
          <div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px', fontWeight: 600, color: colors.textPrimary, marginBottom: '4px' }}>Display Language</div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: colors.textSecondary }}>Change the default language for the dashboard.</div>
          </div>
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{ padding: '10px 16px', borderRadius: '10px', border: `1px solid ${colors.inputBorder}`, background: colors.inputBg, color: colors.textPrimary, fontFamily: 'Arial, sans-serif', fontSize: '13px', cursor: 'pointer', outline: 'none' }}
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi (हिंदी)</option>
          </select>
        </div>

        {/* Default Model Selection */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: `1px solid ${colors.border}` }}>
          <div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px', fontWeight: 600, color: colors.textPrimary, marginBottom: '4px' }}>Default AI Model</div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: colors.textSecondary }}>Set the default PyTorch architecture for new uploads.</div>
          </div>
          <select 
            value={modelVersion}
            onChange={(e) => setModelVersion(e.target.value)}
            style={{ padding: '10px 16px', borderRadius: '10px', border: `1px solid ${colors.inputBorder}`, background: colors.inputBg, color: colors.textPrimary, fontFamily: 'Arial, sans-serif', fontSize: '13px', cursor: 'pointer', outline: 'none' }}
          >
            <option value="ThermalGAN v3.2">ThermalGAN v3.2 (Recommended)</option>
            <option value="ThermalGAN v2.8">ThermalGAN v2.8 (Legacy)</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px', gap: '12px' }}>
          <button 
            onClick={handleSaveChanges}
            disabled={isSaving}
            style={{ padding: '12px 28px', borderRadius: '999px', border: 'none', background: isSaving ? '#5B685F' : '#0F4D3E', color: '#F7F8F3', fontFamily: 'Arial, sans-serif', fontSize: '13px', fontWeight: 600, cursor: isSaving ? 'wait' : 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {isSaving ? <i className="ti ti-loader-2" style={{ animation: 'spin 2s linear infinite' }}></i> : null}
            {isSaving ? 'Saving...' : 'Save changes'}
          </button>
        </div>

      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}