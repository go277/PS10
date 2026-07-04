import React from 'react';

export default function ResultsDashboard() {
  return (
    <div style={{ background: '#F7F8F3', fontFamily: "Georgia, 'Times New Roman', serif", color: '#1F2E29', width: '100%', padding: '28px 36px', borderRadius: '16px', border: '1px solid #E3E4DA' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '21px', fontWeight: 700, margin: 0, color: '#123D30' }}>Delhi NCR urban belt</h1>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#5B685F', margin: '4px 0 0' }}>Processed 2 hours ago &middot; Landsat B10 &middot; 7.5m resolution</p>
        </div>
        <button style={{ padding: '11px 20px', borderRadius: '999px', border: 'none', background: '#0F4D3E', color: '#F7F8F3', fontFamily: 'Arial, sans-serif', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <i className="ti ti-download" style={{ fontSize: '14px' }}></i> Download report
        </button>
      </div>

      {/* IMAGE TRIO */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', marginBottom: '22px' }}>
        <div>
          <div style={{ height: '150px', borderRadius: '12px', background: 'repeating-linear-gradient(45deg,#6B6B60,#6B6B60 8px,#8A8A7C 8px,#8A8A7C 16px)' }}></div>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#5B685F', textAlign: 'center', marginTop: '8px' }}>Original thermal</div>
        </div>
        <div>
          <div style={{ height: '150px', borderRadius: '12px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gridTemplateRows: 'repeat(3,1fr)', overflow: 'hidden' }}>
            <div style={{ background: '#3B7A5A' }}></div><div style={{ background: '#5DCAA5' }}></div><div style={{ background: '#E0A94A' }}></div><div style={{ background: '#8FBFA0' }}></div>
            <div style={{ background: '#5DCAA5' }}></div><div style={{ background: '#D96B3A' }}></div><div style={{ background: '#3B7A5A' }}></div><div style={{ background: '#E0A94A' }}></div>
            <div style={{ background: '#8FBFA0' }}></div><div style={{ background: '#3B7A5A' }}></div><div style={{ background: '#5DCAA5' }}></div><div style={{ background: '#D96B3A' }}></div>
          </div>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#5B685F', textAlign: 'center', marginTop: '8px' }}>Enhanced RGB</div>
        </div>
        <div>
          <div style={{ height: '150px', borderRadius: '12px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gridTemplateRows: 'repeat(3,1fr)', overflow: 'hidden' }}>
            <div style={{ background: '#639922' }}></div><div style={{ background: '#378ADD' }}></div><div style={{ background: '#D85A30' }}></div><div style={{ background: '#7F77DD' }}></div>
            <div style={{ background: '#378ADD' }}></div><div style={{ background: '#639922' }}></div><div style={{ background: '#7F77DD' }}></div><div style={{ background: '#D85A30' }}></div>
            <div style={{ background: '#639922' }}></div><div style={{ background: '#7F77DD' }}></div><div style={{ background: '#378ADD' }}></div><div style={{ background: '#639922' }}></div>
          </div>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#5B685F', textAlign: 'center', marginTop: '8px' }}>Segmentation map</div>
        </div>
      </div>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '14px', marginBottom: '22px' }}>
        <div style={{ background: '#FFFFFF', border: '1px solid #E3E4DA', borderRadius: '12px', padding: '14px' }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#5B685F', marginBottom: '4px' }}>Vegetation</div>
          <div style={{ fontSize: '19px', fontWeight: 700, color: '#3B7A5A' }}>34%</div>
        </div>
        <div style={{ background: '#FFFFFF', border: '1px solid #E3E4DA', borderRadius: '12px', padding: '14px' }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#5B685F', marginBottom: '4px' }}>Water</div>
          <div style={{ fontSize: '19px', fontWeight: 700, color: '#378ADD' }}>6%</div>
        </div>
        <div style={{ background: '#FFFFFF', border: '1px solid #E3E4DA', borderRadius: '12px', padding: '14px' }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#5B685F', marginBottom: '4px' }}>Roads</div>
          <div style={{ fontSize: '19px', fontWeight: 700, color: '#D85A30' }}>18%</div>
        </div>
        <div style={{ background: '#FFFFFF', border: '1px solid #E3E4DA', borderRadius: '12px', padding: '14px' }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#5B685F', marginBottom: '4px' }}>Buildings</div>
          <div style={{ fontSize: '19px', fontWeight: 700, color: '#7F77DD' }}>42%</div>
        </div>
        <div style={{ background: '#FFFFFF', border: '1px solid #E3E4DA', borderRadius: '12px', padding: '14px' }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#5B685F', marginBottom: '4px' }}>Confidence</div>
          <div style={{ fontSize: '19px', fontWeight: 700, color: '#123D30' }}>96%</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <span style={{ padding: '6px 14px', borderRadius: '999px', background: '#E1EFD9', color: '#2C5F3F', fontFamily: 'Arial, sans-serif', fontSize: '12px' }}>Inference 37s</span>
        <span style={{ padding: '6px 14px', borderRadius: '999px', background: '#DCEEEA', color: '#0F6E56', fontFamily: 'Arial, sans-serif', fontSize: '12px' }}>Model ThermalGAN v3.2</span>
        <span style={{ padding: '6px 14px', borderRadius: '999px', background: '#F3E7D8', color: '#8A5A22', fontFamily: 'Arial, sans-serif', fontSize: '12px' }}>4x super resolution</span>
      </div>
    </div>
  );
}