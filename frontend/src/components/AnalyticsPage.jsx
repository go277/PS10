import React from 'react';

export default function AnalyticsPage() {
  return (
    <div style={{ background: '#F7F8F3', fontFamily: "Georgia, 'Times New Roman', serif", color: '#1F2E29', width: '100%', padding: '28px 36px', borderRadius: '16px', border: '1px solid #E3E4DA' }}>

      <h1 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 20px', color: '#123D30' }}>Analytics</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        
        {/* PIE CHART */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E3E4DA', borderRadius: '14px', padding: '20px' }}>
          <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '16px', color: '#123D30' }}>Area distribution</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <svg width="130" height="130" viewBox="0 0 42 42">
              <circle cx="21" cy="21" r="15.9" fill="transparent" stroke="#8FBFA0" strokeWidth="6" strokeDasharray="34 66" strokeDashoffset="25"></circle>
              <circle cx="21" cy="21" r="15.9" fill="transparent" stroke="#378ADD" strokeWidth="6" strokeDasharray="6 94" strokeDashoffset="-9"></circle>
              <circle cx="21" cy="21" r="15.9" fill="transparent" stroke="#D85A30" strokeWidth="6" strokeDasharray="18 82" strokeDashoffset="-15"></circle>
              <circle cx="21" cy="21" r="15.9" fill="transparent" stroke="#7F77DD" strokeWidth="6" strokeDasharray="42 58" strokeDashoffset="-33"></circle>
            </svg>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#3E4A44', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div><span style={{ display: 'inline-block', width: '9px', height: '9px', borderRadius: '50%', background: '#8FBFA0', marginRight: '6px' }}></span>Vegetation 34%</div>
              <div><span style={{ display: 'inline-block', width: '9px', height: '9px', borderRadius: '50%', background: '#378ADD', marginRight: '6px' }}></span>Water 6%</div>
              <div><span style={{ display: 'inline-block', width: '9px', height: '9px', borderRadius: '50%', background: '#D85A30', marginRight: '6px' }}></span>Roads 18%</div>
              <div><span style={{ display: 'inline-block', width: '9px', height: '9px', borderRadius: '50%', background: '#7F77DD', marginRight: '6px' }}></span>Buildings 42%</div>
            </div>
          </div>
        </div>

        {/* CONFIDENCE / INFERENCE METRICS */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E3E4DA', borderRadius: '14px', padding: '20px' }}>
          <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '16px', color: '#123D30' }}>Model performance</div>
          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#3E4A44', marginBottom: '6px' }}><span>Detection confidence</span><span>96%</span></div>
            <div style={{ height: '7px', borderRadius: '999px', background: '#E3E4DA' }}><div style={{ width: '96%', height: '100%', background: '#0F4D3E', borderRadius: '999px' }}></div></div>
          </div>
          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#3E4A44', marginBottom: '6px' }}><span>Segmentation IoU</span><span>91%</span></div>
            <div style={{ height: '7px', borderRadius: '999px', background: '#E3E4DA' }}><div style={{ width: '91%', height: '100%', background: '#0F6E56', borderRadius: '999px' }}></div></div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#3E4A44', marginBottom: '6px' }}><span>Inference time</span><span>37s avg</span></div>
            <div style={{ height: '7px', borderRadius: '999px', background: '#E3E4DA' }}><div style={{ width: '70%', height: '100%', background: '#5DCAA5', borderRadius: '999px' }}></div></div>
          </div>
        </div>
      </div>

      {/* AREA CHART */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E3E4DA', borderRadius: '14px', padding: '20px' }}>
        <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '16px', color: '#123D30' }}>Vegetation trend, last 6 analyses</div>
        <svg width="100%" height="120" viewBox="0 0 600 120" preserveAspectRatio="none">
          <polyline points="0,90 100,70 200,75 300,50 400,55 500,30 600,35" fill="none" stroke="#3B7A5A" strokeWidth="3"></polyline>
          <polygon points="0,90 100,70 200,75 300,50 400,55 500,30 600,35 600,120 0,120" fill="#3B7A5A" opacity="0.12"></polygon>
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#5B685F', marginTop: '6px' }}>
          <span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jun</span><span>Jul</span>
        </div>
      </div>
    </div>
  );
}