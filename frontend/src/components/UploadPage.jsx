import React from 'react';

export default function UploadPage() {
  return (
    <div style={{ background: '#F7F8F3', fontFamily: "Georgia, 'Times New Roman', serif", color: '#1F2E29', width: '100%', padding: '32px 40px', borderRadius: '16px', border: '1px solid #E3E4DA' }}>

      <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 4px', color: '#123D30' }}>New analysis</h1>
      <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#5B685F', margin: '0 0 24px' }}>Upload a thermal tile to begin AI processing.</p>

      <div style={{ border: '2px dashed #C7D0BC', borderRadius: '16px', padding: '44px', textAlign: 'center', background: '#FFFFFF', marginBottom: '22px' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#E1EFD9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <i className="ti ti-cloud-upload" style={{ color: '#0F4D3E', fontSize: '24px' }}></i>
        </div>
        <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px', color: '#123D30', marginBottom: '6px' }}>Drag and drop your Landsat B10 tile here</div>
        <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#5B685F', marginBottom: '16px' }}>Supports .tif, .tiff, .geotiff up to 500 MB</div>
        <button style={{ padding: '11px 22px', borderRadius: '999px', border: 'none', background: '#0F4D3E', color: '#F7F8F3', fontFamily: 'Arial, sans-serif', fontSize: '13px', cursor: 'pointer' }}>Browse files</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '22px' }}>
        <div>
          <label style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#3E4A44', marginBottom: '6px', display: 'block' }}>Output resolution</label>
          <select style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #D7DCCB', background: '#FFFFFF', fontFamily: 'Arial, sans-serif', fontSize: '13px' }}>
            <option>7.5m (4x super resolution)</option>
            <option>15m (2x super resolution)</option>
            <option>30m (native)</option>
          </select>
        </div>
        <div>
          <label style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#3E4A44', marginBottom: '6px', display: 'block' }}>Output type</label>
          <select style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #D7DCCB', background: '#FFFFFF', fontFamily: 'Arial, sans-serif', fontSize: '13px' }}>
            <option>Colorized RGB + segmentation</option>
            <option>Colorized RGB only</option>
            <option>Segmentation only</option>
          </select>
        </div>
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid #E3E4DA', borderRadius: '14px', padding: '18px', marginBottom: '24px' }}>
        <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '14px', color: '#123D30' }}>Advanced settings</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div>
            <label style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#3E4A44', marginBottom: '6px', display: 'block' }}>Model version</label>
            <select style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #D7DCCB', background: '#F7F8F3', fontFamily: 'Arial, sans-serif', fontSize: '12px' }}>
              <option>ThermalGAN v3.2</option>
              <option>ThermalGAN v2.8</option>
            </select>
          </div>
          <div>
            <label style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#3E4A44', marginBottom: '6px', display: 'block' }}>Detection confidence</label>
            <input type="range" min="0" max="100" defaultValue="75" style={{ width: '100%' }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <button style={{ padding: '12px 22px', borderRadius: '999px', border: '1px solid #C9CFC3', background: 'transparent', color: '#1F2E29', fontFamily: 'Arial, sans-serif', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
        <button style={{ padding: '12px 26px', borderRadius: '999px', border: 'none', background: '#0F4D3E', color: '#F7F8F3', fontFamily: 'Arial, sans-serif', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          Start analysis <i className="ti ti-arrow-right" style={{ fontSize: '14px' }}></i>
        </button>
      </div>
    </div>
  );
}