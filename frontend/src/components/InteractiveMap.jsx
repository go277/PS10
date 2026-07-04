import React, { useState } from 'react';

export default function InteractiveMap() {
  const [opacity, setOpacity] = useState(70);

  return (
    <div style={{ background: '#F7F8F3', fontFamily: "Georgia, 'Times New Roman', serif", color: '#1F2E29', width: '100%', padding: '24px 32px', borderRadius: '16px', border: '1px solid #E3E4DA' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#123D30' }}>Interactive map</h1>
        <div style={{ display: 'flex', gap: '8px', fontFamily: 'Arial, sans-serif', fontSize: '12px' }}>
          <span style={{ padding: '8px 14px', borderRadius: '999px', background: '#0F4D3E', color: '#F7F8F3', cursor: 'pointer' }}>Satellite</span>
          <span style={{ padding: '8px 14px', borderRadius: '999px', border: '1px solid #C9CFC3', color: '#3E4A44', cursor: 'pointer' }}>Detection overlay</span>
        </div>
      </div>

      <div style={{ position: 'relative', height: '400px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E3E4DA' }}>
        
        {/* The Map Grid (Mocked as per design) */}
        <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(10,1fr)', gridTemplateRows: 'repeat(7,1fr)', opacity: opacity / 100 }}>
          <div style={{ background: '#3B7A5A' }}></div><div style={{ background: '#5DCAA5' }}></div><div style={{ background: '#8FBFA0' }}></div><div style={{ background: '#378ADD' }}></div><div style={{ background: '#8FBFA0' }}></div><div style={{ background: '#3B7A5A' }}></div><div style={{ background: '#D85A30' }}></div><div style={{ background: '#5DCAA5' }}></div><div style={{ background: '#3B7A5A' }}></div><div style={{ background: '#8FBFA0' }}></div>
          <div style={{ background: '#5DCAA5' }}></div><div style={{ background: '#7F77DD' }}></div><div style={{ background: '#3B7A5A' }}></div><div style={{ background: '#378ADD' }}></div><div style={{ background: '#378ADD' }}></div><div style={{ background: '#D85A30' }}></div><div style={{ background: '#7F77DD' }}></div><div style={{ background: '#3B7A5A' }}></div><div style={{ background: '#8FBFA0' }}></div><div style={{ background: '#5DCAA5' }}></div>
          <div style={{ background: '#8FBFA0' }}></div><div style={{ background: '#7F77DD' }}></div><div style={{ background: '#7F77DD' }}></div><div style={{ background: '#378ADD' }}></div><div style={{ background: '#5DCAA5' }}></div><div style={{ background: '#D85A30' }}></div><div style={{ background: '#7F77DD' }}></div><div style={{ background: '#7F77DD' }}></div><div style={{ background: '#3B7A5A' }}></div><div style={{ background: '#8FBFA0' }}></div>
          <div style={{ background: '#3B7A5A' }}></div><div style={{ background: '#7F77DD' }}></div><div style={{ background: '#D85A30' }}></div><div style={{ background: '#D85A30' }}></div><div style={{ background: '#D85A30' }}></div><div style={{ background: '#7F77DD' }}></div><div style={{ background: '#7F77DD' }}></div><div style={{ background: '#5DCAA5' }}></div><div style={{ background: '#8FBFA0' }}></div><div style={{ background: '#3B7A5A' }}></div>
          <div style={{ background: '#5DCAA5' }}></div><div style={{ background: '#8FBFA0' }}></div><div style={{ background: '#7F77DD' }}></div><div style={{ background: '#378ADD' }}></div><div style={{ background: '#7F77DD' }}></div><div style={{ background: '#7F77DD' }}></div><div style={{ background: '#3B7A5A' }}></div><div style={{ background: '#8FBFA0' }}></div><div style={{ background: '#5DCAA5' }}></div><div style={{ background: '#3B7A5A' }}></div>
          <div style={{ background: '#8FBFA0' }}></div><div style={{ background: '#3B7A5A' }}></div><div style={{ background: '#378ADD' }}></div><div style={{ background: '#378ADD' }}></div><div style={{ background: '#5DCAA5' }}></div><div style={{ background: '#3B7A5A' }}></div><div style={{ background: '#5DCAA5' }}></div><div style={{ background: '#8FBFA0' }}></div><div style={{ background: '#3B7A5A' }}></div><div style={{ background: '#5DCAA5' }}></div>
          <div style={{ background: '#3B7A5A' }}></div><div style={{ background: '#5DCAA5' }}></div><div style={{ background: '#8FBFA0' }}></div><div style={{ background: '#3B7A5A' }}></div><div style={{ background: '#8FBFA0' }}></div><div style={{ background: '#5DCAA5' }}></div><div style={{ background: '#3B7A5A' }}></div><div style={{ background: '#5DCAA5' }}></div><div style={{ background: '#8FBFA0' }}></div><div style={{ background: '#3B7A5A' }}></div>
        </div>

        {/* Floating Controls & Legend */}
        <div style={{ position: 'absolute', top: '14px', left: '14px', background: 'rgba(247,248,243,0.95)', borderRadius: '12px', padding: '12px 14px', fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#3E4A44', width: '130px' }}>
          <div style={{ fontWeight: 700, color: '#123D30', marginBottom: '8px' }}>Legend</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}><span style={{ width: '9px', height: '9px', borderRadius: '2px', background: '#3B7A5A' }}></span>Vegetation</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}><span style={{ width: '9px', height: '9px', borderRadius: '2px', background: '#378ADD' }}></span>Water</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}><span style={{ width: '9px', height: '9px', borderRadius: '2px', background: '#D85A30' }}></span>Roads</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '9px', height: '9px', borderRadius: '2px', background: '#7F77DD' }}></span>Buildings</div>
        </div>

        <div style={{ position: 'absolute', top: '14px', right: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(247,248,243,0.95)', border: 'none', fontFamily: 'Arial, sans-serif', fontSize: '15px', cursor: 'pointer' }}>+</button>
          <button style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(247,248,243,0.95)', border: 'none', fontFamily: 'Arial, sans-serif', fontSize: '15px', cursor: 'pointer' }}>−</button>
        </div>

        <div style={{ position: 'absolute', bottom: '14px', left: '14px', background: 'rgba(18,61,48,0.85)', color: '#F0F3EA', padding: '6px 14px', borderRadius: '999px', fontFamily: 'Arial, sans-serif', fontSize: '11px' }}>28.6139&deg; N, 77.2090&deg; E</div>
      </div>

      {/* Dynamic Opacity Slider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '16px' }}>
        <span style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#3E4A44' }}>Overlay opacity</span>
        <input 
          type="range" 
          min="0" max="100" 
          value={opacity} 
          onChange={(e) => setOpacity(e.target.value)}
          style={{ flex: 1, cursor: 'ew-resize' }} 
        />
        <select style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #D7DCCB', background: '#FFFFFF', fontFamily: 'Arial, sans-serif', fontSize: '12px' }}>
          <option>Segmentation layer</option>
          <option>Detection layer</option>
          <option>Thermal layer</option>
        </select>
      </div>
    </div>
  );
}