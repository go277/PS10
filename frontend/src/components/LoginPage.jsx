import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // For now, it just routes directly to the dashboard
    navigate('/dashboard');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F7F8F3', padding: '40px', boxSizing: 'border-box' }}>
      <div style={{ background: '#F7F8F3', fontFamily: "Georgia, 'Times New Roman', serif", color: '#1F2E29', width: '100%', maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.1fr 1fr', minHeight: '420px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E3E4DA', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>

        {/* LEFT ILLUSTRATION */}
        <div style={{ background: '#123D30', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#F0F3EA', fontWeight: 700, fontSize: '17px' }}>
            <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#F0F3EA', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="ti ti-satellite" style={{ color: '#123D30', fontSize: '15px' }}></i>
            </span>
            PS10 &middot; Antariksh AI
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gridTemplateRows: 'repeat(5,1fr)', gap: '2px', height: '220px', borderRadius: '14px', overflow: 'hidden' }}>
            <div style={{ background: '#3B7A5A', gridColumn: 'span 2' }}></div><div style={{ background: '#E0A94A' }}></div><div style={{ background: '#5DCAA5', gridRow: 'span 2' }}></div><div style={{ background: '#8FBFA0' }}></div>
            <div style={{ background: '#5DCAA5' }}></div><div style={{ background: '#D96B3A', gridRow: 'span 2' }}></div><div style={{ background: '#3B7A5A' }}></div><div style={{ background: '#E0A94A' }}></div>
            <div style={{ background: '#8FBFA0', gridColumn: 'span 2' }}></div><div style={{ background: '#3B7A5A' }}></div><div style={{ background: '#D96B3A' }}></div>
            <div style={{ background: '#E0A94A' }}></div><div style={{ background: '#8FBFA0' }}></div><div style={{ background: '#5DCAA5', gridColumn: 'span 2' }}></div><div style={{ background: '#3B7A5A' }}></div>
            <div style={{ background: '#5DCAA5', gridColumn: 'span 2' }}></div><div style={{ background: '#E0A94A' }}></div><div style={{ background: '#8FBFA0', gridColumn: 'span 2' }}></div>
          </div>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#B9C9BD', lineHeight: 1.6, margin: 0 }}>Thermal imagery, colorized and super-resolved &mdash; from raw satellite band to decision-ready insight.</p>
        </div>

        {/* RIGHT LOGIN CARD */}
        <div style={{ background: '#F7F8F3', padding: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 6px', color: '#123D30' }}>Welcome back</h1>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#5B685F', margin: '0 0 28px' }}>Log in to continue analyzing thermal imagery.</p>

          <form onSubmit={handleLogin}>
            <label style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#3E4A44', marginBottom: '6px', display: 'block' }}>Email</label>
            <input type="email" placeholder="name@organization.gov.in" style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #D7DCCB', background: '#FFFFFF', fontFamily: 'Arial, sans-serif', fontSize: '13px', marginBottom: '18px', boxSizing: 'border-box' }} />

            <label style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#3E4A44', marginBottom: '6px', display: 'block' }}>Password</label>
            <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #D7DCCB', background: '#FFFFFF', fontFamily: 'Arial, sans-serif', fontSize: '13px', marginBottom: '14px', boxSizing: 'border-box' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '26px', fontFamily: 'Arial, sans-serif', fontSize: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#3E4A44' }}><input type="checkbox" /> Remember me</label>
              <span style={{ color: '#0F6E56', cursor: 'pointer' }}>Forgot password?</span>
            </div>

            <button type="submit" style={{ width: '100%', padding: '13px', borderRadius: '999px', border: 'none', background: '#0F4D3E', color: '#F7F8F3', fontFamily: 'Arial, sans-serif', fontSize: '14px', cursor: 'pointer', marginBottom: '18px' }}>Log in</button>
          </form>

          <p style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#5B685F', margin: 0 }}>
            Don't have an account? <Link to="/register" style={{ color: '#0F6E56', textDecoration: 'none' }}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}