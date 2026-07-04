import React from 'react';

export default function ProfilePage() {
  return (
    <div style={{ background: '#F7F8F3', fontFamily: "Georgia, 'Times New Roman', serif", color: '#1F2E29', width: '100%', padding: '28px 36px', borderRadius: '16px', border: '1px solid #E3E4DA' }}>
      
      <h1 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 20px', color: '#123D30' }}>Profile</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* User Info Card */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E3E4DA', borderRadius: '14px', padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#5DCAA5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif', fontSize: '20px', color: '#123D30', fontWeight: 700 }}>MS</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '16px', color: '#123D30' }}>Manan Sharma</div>
              <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#5B685F' }}>Team Breach &middot; PS10</div>
            </div>
          </div>
          <table style={{ width: '100%', fontFamily: 'Arial, sans-serif', fontSize: '12px', borderCollapse: 'collapse' }}>
            <tbody>
              <tr><td style={{ padding: '8px 0', color: '#5B685F' }}>Email</td><td style={{ padding: '8px 0', textAlign: 'right' }}>manan@teambreach.in</td></tr>
              <tr style={{ borderTop: '1px solid #EFF0E8' }}><td style={{ padding: '8px 0', color: '#5B685F' }}>Role</td><td style={{ padding: '8px 0', textAlign: 'right' }}>Analyst</td></tr>
              <tr style={{ borderTop: '1px solid #EFF0E8' }}><td style={{ padding: '8px 0', color: '#5B685F' }}>Joined</td><td style={{ padding: '8px 0', textAlign: 'right' }}>March 2026</td></tr>
            </tbody>
          </table>
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button style={{ flex: 1, padding: '10px', borderRadius: '999px', border: '1px solid #0F4D3E', background: 'transparent', color: '#0F4D3E', fontFamily: 'Arial, sans-serif', fontSize: '12px', cursor: 'pointer' }}>Edit profile</button>
            <button style={{ flex: 1, padding: '10px', borderRadius: '999px', border: '1px solid #C9CFC3', background: 'transparent', color: '#1F2E29', fontFamily: 'Arial, sans-serif', fontSize: '12px', cursor: 'pointer' }}>Change password</button>
          </div>
        </div>

        {/* Statistics Card */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E3E4DA', borderRadius: '14px', padding: '22px' }}>
          <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '16px', color: '#123D30' }}>Statistics</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ background: '#F7F8F3', borderRadius: '12px', padding: '14px' }}>
              <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#5B685F', marginBottom: '4px' }}>Tiles processed</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#123D30' }}>1,940</div>
            </div>
            <div style={{ background: '#F7F8F3', borderRadius: '12px', padding: '14px' }}>
              <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#5B685F', marginBottom: '4px' }}>Avg. processing time</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#123D30' }}>37s</div>
            </div>
            <div style={{ background: '#F7F8F3', borderRadius: '12px', padding: '14px' }}>
              <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#5B685F', marginBottom: '4px' }}>Reports generated</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#123D30' }}>86</div>
            </div>
            <div style={{ background: '#F7F8F3', borderRadius: '12px', padding: '14px' }}>
              <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#5B685F', marginBottom: '4px' }}>Datasets owned</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#123D30' }}>3</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}