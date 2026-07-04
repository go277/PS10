import React from 'react';

export default function DatasetsPage() {
  return (
    <div style={{ background: '#F7F8F3', fontFamily: "Georgia, 'Times New Roman', serif", color: '#1F2E29', width: '100%', padding: '28px 36px', borderRadius: '16px', border: '1px solid #E3E4DA' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#123D30' }}>Datasets</h1>
        <button style={{ padding: '10px 18px', borderRadius: '999px', border: 'none', background: '#0F4D3E', color: '#F7F8F3', fontFamily: 'Arial, sans-serif', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <i className="ti ti-upload" style={{ fontSize: '13px' }}></i> Upload dataset
        </button>
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid #E3E4DA', borderRadius: '14px', padding: '16px 18px', marginBottom: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#3E4A44', marginBottom: '8px' }}>
          <span>Storage used</span><span>6.2 GB of 20 GB</span>
        </div>
        <div style={{ height: '8px', borderRadius: '999px', background: '#E3E4DA' }}>
          <div style={{ width: '31%', height: '100%', background: '#0F4D3E', borderRadius: '999px' }}></div>
        </div>
      </div>

      <input type="text" placeholder="Search datasets" style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #D7DCCB', background: '#FFFFFF', fontFamily: 'Arial, sans-serif', fontSize: '13px', marginBottom: '16px', boxSizing: 'border-box' }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
        <div style={{ background: '#FFFFFF', border: '1px solid #E3E4DA', borderRadius: '14px', padding: '16px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: '#DCEEEA', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}><i className="ti ti-database" style={{ color: '#0F6E56', fontSize: '17px' }}></i></div>
          <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px', color: '#123D30' }}>Landsat 9 B10, India 2026</div>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#5B685F', marginBottom: '10px' }}>1,240 tiles &middot; 2.8 GB</div>
          <span style={{ background: '#E1EFD9', color: '#2C5F3F', padding: '3px 10px', borderRadius: '999px', fontFamily: 'Arial, sans-serif', fontSize: '11px' }}>Ready</span>
        </div>
        <div style={{ background: '#FFFFFF', border: '1px solid #E3E4DA', borderRadius: '14px', padding: '16px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: '#F3E7D8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}><i className="ti ti-database" style={{ color: '#8A5A22', fontSize: '17px' }}></i></div>
          <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px', color: '#123D30' }}>Landsat 8 B10, coastal belt</div>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#5B685F', marginBottom: '10px' }}>860 tiles &middot; 1.9 GB</div>
          <span style={{ background: '#F3E7D8', color: '#8A5A22', padding: '3px 10px', borderRadius: '999px', fontFamily: 'Arial, sans-serif', fontSize: '11px' }}>Indexing</span>
        </div>
        <div style={{ background: '#FFFFFF', border: '1px solid #E3E4DA', borderRadius: '14px', padding: '16px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: '#EEE7F3', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}><i className="ti ti-database" style={{ color: '#5B3A8A', fontSize: '17px' }}></i></div>
          <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px', color: '#123D30' }}>Training set v3, urban</div>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#5B685F', marginBottom: '10px' }}>3,050 tiles &middot; 1.5 GB</div>
          <span style={{ background: '#E1EFD9', color: '#2C5F3F', padding: '3px 10px', borderRadius: '999px', fontFamily: 'Arial, sans-serif', fontSize: '11px' }}>Ready</span>
        </div>
      </div>
    </div>
  );
}