import React, { useState } from 'react';

export default function CompareTool({ originalImg, colorizedImg }) {
  // State to track the slider's position (0 to 100)
  const [sliderPosition, setSliderPosition] = useState(50);

  // Fallbacks just in case the images haven't loaded yet
  const leftImage = originalImg || '';
  const rightImage = colorizedImg || '';

  return (
    <div style={{ background: '#F7F8F3', fontFamily: "Georgia, 'Times New Roman', serif", color: '#1F2E29', width: '100%', padding: '28px 36px', borderRadius: '16px', border: '1px solid #E3E4DA' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#123D30' }}>Compare thermal vs colorized</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ padding: '9px 16px', borderRadius: '999px', border: '1px solid #C9CFC3', background: 'transparent', color: '#1F2E29', fontFamily: 'Arial, sans-serif', fontSize: '12px', cursor: 'pointer' }}>
            <i className="ti ti-zoom-in" style={{ fontSize: '13px', verticalAlign: '-2px', marginRight: '4px' }}></i> Zoom
          </button>
          <button style={{ padding: '9px 18px', borderRadius: '999px', border: 'none', background: '#0F4D3E', color: '#F7F8F3', fontFamily: 'Arial, sans-serif', fontSize: '12px', cursor: 'pointer' }}>
            <i className="ti ti-download" style={{ fontSize: '13px', verticalAlign: '-2px', marginRight: '4px' }}></i> Download
          </button>
        </div>
      </div>

      {/* The Interactive Slider Container */}
      <div style={{ position: 'relative', height: '400px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E3E4DA' }}>
        
        {/* BOTTOM IMAGE (Colorized RGB - Full Width) */}
        <div style={{ 
          position: 'absolute', inset: 0, 
          backgroundImage: `url(${rightImage})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        }}></div>

        {/* TOP IMAGE (Original Thermal - Clipped by Slider Position) */}
        <div style={{ 
          position: 'absolute', top: 0, bottom: 0, left: 0, 
          width: `${sliderPosition}%`, 
          backgroundImage: `url(${leftImage})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          borderRight: '3px solid #F7F8F3' 
        }}></div>

        {/* The Drag Handle Icon */}
        <div style={{ 
          position: 'absolute', top: '50%', left: `${sliderPosition}%`, 
          transform: 'translate(-50%,-50%)', 
          width: '36px', height: '36px', borderRadius: '50%', 
          background: '#F7F8F3', display: 'flex', alignItems: 'center', justifyContent: 'center', 
          border: '1px solid #E3E4DA', pointerEvents: 'none' 
        }}>
          <i className="ti ti-arrows-horizontal" style={{ color: '#123D30', fontSize: '16px' }}></i>
        </div>

        {/* Floating Labels */}
        <div style={{ position: 'absolute', top: '14px', left: '14px', background: 'rgba(18,61,48,0.85)', color: '#F0F3EA', padding: '5px 12px', borderRadius: '999px', fontFamily: 'Arial, sans-serif', fontSize: '11px' }}>
          Original thermal
        </div>
        <div style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(18,61,48,0.85)', color: '#F0F3EA', padding: '5px 12px', borderRadius: '999px', fontFamily: 'Arial, sans-serif', fontSize: '11px' }}>
          Colorized RGB
        </div>
      </div>

      {/* The Actual Range Input (Hidden visually, but drives the logic) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '18px' }}>
        <span style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#3E4A44' }}>Compare</span>
        <input 
          type="range" 
          min="0" max="100" 
          value={sliderPosition} 
          onChange={(e) => setSliderPosition(e.target.value)}
          style={{ flex: 1, cursor: 'ew-resize' }} 
        />
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#3E4A44' }}>
          <input type="checkbox" defaultChecked /> Sync zoom
        </label>
      </div>
      
    </div>
  );
}