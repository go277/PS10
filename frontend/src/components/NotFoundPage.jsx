import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F7F8F3', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', boxSizing: 'border-box' }}>
      <div style={{ textAlign: 'center', fontFamily: "Georgia, 'Times New Roman', serif" }}>
        
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#E1EFD9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <i className="ti ti-satellite-off" style={{ color: '#0F4D3E', fontSize: '34px' }}></i>
        </div>
        
        <div style={{ fontSize: '44px', fontWeight: 700, color: '#123D30', marginBottom: '8px' }}>404</div>
        <div style={{ fontSize: '16px', fontWeight: 700, color: '#123D30', marginBottom: '8px' }}>Signal lost</div>
        <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#5B685F', margin: '0 auto 24px', maxWidth: '320px' }}>
          We couldn't find the page you were looking for. It may have moved or never existed.
        </p>
        
        <Link to="/dashboard" style={{ display: 'inline-block', padding: '12px 26px', borderRadius: '999px', border: 'none', background: '#0F4D3E', color: '#F7F8F3', fontFamily: 'Arial, sans-serif', fontSize: '13px', cursor: 'pointer', textDecoration: 'none' }}>
          Return to dashboard
        </Link>
        
      </div>
    </div>
  );
}