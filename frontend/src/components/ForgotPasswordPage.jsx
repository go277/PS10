import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleReset = (e) => {
    e.preventDefault();
    if (email) setIsSent(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#EFF2E6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', boxSizing: 'border-box' }}>
      <div style={{ background: '#FFFFFF', border: '1px solid #E3E4DA', borderRadius: '18px', padding: '38px', width: '100%', maxWidth: '380px', fontFamily: "Georgia, 'Times New Roman', serif", textAlign: 'center' }}>
        
        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#E1EFD9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
          <i className="ti ti-lock" style={{ color: '#0F4D3E', fontSize: '20px' }}></i>
        </div>
        
        <h1 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 6px', color: '#123D30' }}>Reset your password</h1>
        <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#5B685F', margin: '0 0 24px', lineHeight: 1.6 }}>
          Enter the email linked to your account and we'll send a reset link.
        </p>

        <form onSubmit={handleReset}>
          <input 
            type="email" 
            placeholder="name@organization.gov.in" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #D7DCCB', background: '#F7F8F3', fontFamily: 'Arial, sans-serif', fontSize: '13px', marginBottom: '18px', boxSizing: 'border-box', textAlign: 'left' }} 
          />

          <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '999px', border: 'none', background: '#0F4D3E', color: '#F7F8F3', fontFamily: 'Arial, sans-serif', fontSize: '14px', cursor: 'pointer', marginBottom: '16px' }}>
            Send reset link
          </button>
        </form>

        <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#0F6E56', textDecoration: 'none' }}>
          <i className="ti ti-arrow-left" style={{ fontSize: '13px' }}></i> Back to login
        </Link>

        {/* Dynamic Success Message */}
        {isSent && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300" style={{ marginTop: '22px', padding: '12px', background: '#E1EFD9', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left' }}>
            <i className="ti ti-check" style={{ color: '#0F4D3E', fontSize: '16px' }}></i>
            <span style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#123D30' }}>Reset link sent. Check your inbox.</span>
          </div>
        )}

      </div>
    </div>
  );
}