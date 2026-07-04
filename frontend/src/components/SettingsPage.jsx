import React from 'react';

export default function SettingsPage() {
  return (
    <div style={{ background: '#F7F8F3', fontFamily: "Georgia, 'Times New Roman', serif", color: '#1F2E29', width: '100%', display: 'grid', gridTemplateColumns: '190px 1fr', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E3E4DA', minHeight: '440px' }}>
      
      {/* Settings Navigation Sidebar */}
      <div style={{ background: '#EFF2E6', padding: '22px 14px', borderRight: '1px solid #E3E4DA' }}>
        <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '14px', color: '#123D30', padding: '0 8px' }}>Settings</div>
        <div style={{ background: '#0F4D3E', color: '#F7F8F3', borderRadius: '10px', padding: '9px 12px', fontFamily: 'Arial, sans-serif', fontSize: '13px', marginBottom: '2px', cursor: 'pointer' }}>General</div>
        <div style={{ color: '#3E4A44', padding: '9px 12px', fontFamily: 'Arial, sans-serif', fontSize: '13px', cursor: 'pointer' }}>Appearance</div>
        <div style={{ color: '#3E4A44', padding: '9px 12px', fontFamily: 'Arial, sans-serif', fontSize: '13px', cursor: 'pointer' }}>Notifications</div>
        <div style={{ color: '#3E4A44', padding: '9px 12px', fontFamily: 'Arial, sans-serif', fontSize: '13px', cursor: 'pointer' }}>AI models</div>
        <div style={{ color: '#3E4A44', padding: '9px 12px', fontFamily: 'Arial, sans-serif', fontSize: '13px', cursor: 'pointer' }}>Account</div>
      </div>

      {/* Settings Form Content */}
      <div style={{ padding: '28px 32px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 20px', color: '#123D30' }}>General</h1>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #EFF0E8' }}>
          <div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#123D30' }}>Theme</div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#5B685F' }}>Choose light or dark mode</div>
          </div>
          <div style={{ display: 'flex', background: '#E3E4DA', borderRadius: '999px', padding: '3px' }}>
            <span style={{ padding: '6px 14px', borderRadius: '999px', background: '#F7F8F3', fontFamily: 'Arial, sans-serif', fontSize: '12px', cursor: 'pointer' }}>Light</span>
            <span style={{ padding: '6px 14px', borderRadius: '999px', color: '#5B685F', fontFamily: 'Arial, sans-serif', fontSize: '12px', cursor: 'pointer' }}>Dark</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #EFF0E8' }}>
          <div><div style={{ fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#123D30' }}>Language</div></div>
          <select style={{ padding: '9px 14px', borderRadius: '10px', border: '1px solid #D7DCCB', background: '#FFFFFF', fontFamily: 'Arial, sans-serif', fontSize: '12px', cursor: 'pointer' }}>
            <option>English</option>
            <option>Hindi</option>
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #EFF0E8' }}>
          <div><div style={{ fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#123D30' }}>Model selection</div></div>
          <select style={{ padding: '9px 14px', borderRadius: '10px', border: '1px solid #D7DCCB', background: '#FFFFFF', fontFamily: 'Arial, sans-serif', fontSize: '12px', cursor: 'pointer' }}>
            <option>ThermalGAN v3.2</option>
            <option>ThermalGAN v2.8 (Legacy)</option>
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '22px' }}>
          <button style={{ padding: '11px 24px', borderRadius: '999px', border: 'none', background: '#0F4D3E', color: '#F7F8F3', fontFamily: 'Arial, sans-serif', fontSize: '13px', cursor: 'pointer' }}>Save changes</button>
        </div>
      </div>
    </div>
  );
}