import React from 'react';

export default function AnalysisDetails() {
  return (
    <div style={{ background: '#F7F8F3', fontFamily: "Georgia, 'Times New Roman', serif", color: '#1F2E29', width: '100%', padding: '28px 36px', borderRadius: '16px', border: '1px solid #E3E4DA' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#123D30' }}>Analysis details</h1>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#5B685F', margin: '4px 0 0' }}>Delhi NCR urban belt &middot; ID PS10-2481</p>
        </div>
        <button style={{ padding: '10px 18px', borderRadius: '999px', border: '1px solid #0F4D3E', background: 'transparent', color: '#0F4D3E', fontFamily: 'Arial, sans-serif', fontSize: '12px', cursor: 'pointer' }}>
          <i className="ti ti-download" style={{ fontSize: '13px', verticalAlign: '-2px', marginRight: '4px' }}></i> Download metadata
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        
        {/* PIPELINE STEPS LOG */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E3E4DA', borderRadius: '14px', padding: '18px' }}>
          <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '14px', color: '#123D30' }}>Pipeline steps</div>
          <div style={{ display: 'flex', gap: '12px', padding: '9px 0', borderBottom: '1px solid #EFF0E8', fontFamily: 'Arial, sans-serif', fontSize: '12px' }}><i className="ti ti-check" style={{ color: '#0F6E56' }}></i><span style={{ flex: 1 }}>Super resolution</span><span style={{ color: '#5B685F' }}>8.2s</span></div>
          <div style={{ display: 'flex', gap: '12px', padding: '9px 0', borderBottom: '1px solid #EFF0E8', fontFamily: 'Arial, sans-serif', fontSize: '12px' }}><i className="ti ti-check" style={{ color: '#0F6E56' }}></i><span style={{ flex: 1 }}>Thermal translation</span><span style={{ color: '#5B685F' }}>6.7s</span></div>
          <div style={{ display: 'flex', gap: '12px', padding: '9px 0', borderBottom: '1px solid #EFF0E8', fontFamily: 'Arial, sans-serif', fontSize: '12px' }}><i className="ti ti-check" style={{ color: '#0F6E56' }}></i><span style={{ flex: 1 }}>Segmentation</span><span style={{ color: '#5B685F' }}>11.4s</span></div>
          <div style={{ display: 'flex', gap: '12px', padding: '9px 0', borderBottom: '1px solid #EFF0E8', fontFamily: 'Arial, sans-serif', fontSize: '12px' }}><i className="ti ti-check" style={{ color: '#0F6E56' }}></i><span style={{ flex: 1 }}>Object detection</span><span style={{ color: '#5B685F' }}>5.1s</span></div>
          <div style={{ display: 'flex', gap: '12px', padding: '9px 0', borderBottom: '1px solid #EFF0E8', fontFamily: 'Arial, sans-serif', fontSize: '12px' }}><i className="ti ti-check" style={{ color: '#0F6E56' }}></i><span style={{ flex: 1 }}>Geolocation</span><span style={{ color: '#5B685F' }}>2.0s</span></div>
          <div style={{ display: 'flex', gap: '12px', padding: '9px 0', fontFamily: 'Arial, sans-serif', fontSize: '12px' }}><i className="ti ti-check" style={{ color: '#0F6E56' }}></i><span style={{ flex: 1 }}>Report generation</span><span style={{ color: '#5B685F' }}>3.6s</span></div>

          <div style={{ fontWeight: 700, fontSize: '14px', margin: '18px 0 10px', color: '#123D30' }}>Processing log</div>
          <div style={{ background: '#F7F8F3', borderRadius: '10px', padding: '12px', fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#5B685F', lineHeight: 1.7 }}>
            [12:04:01] Tile received, validating GeoTIFF header<br/>
            [12:04:03] Super resolution model loaded, ThermalGAN v3.2<br/>
            [12:04:11] Segmentation confidence 96.2%<br/>
            [12:04:16] Detected 214 building footprints<br/>
            [12:04:19] Report compiled successfully
          </div>
        </div>

        {/* METADATA */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E3E4DA', borderRadius: '14px', padding: '18px' }}>
          <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '14px', color: '#123D30' }}>Metadata</div>
          <table style={{ width: '100%', fontFamily: 'Arial, sans-serif', fontSize: '12px', borderCollapse: 'collapse' }}>
            <tbody>
              <tr><td style={{ padding: '7px 0', color: '#5B685F' }}>Resolution</td><td style={{ padding: '7px 0', textAlign: 'right', color: '#1F2E29' }}>7.5m</td></tr>
              <tr style={{ borderTop: '1px solid #EFF0E8' }}><td style={{ padding: '7px 0', color: '#5B685F' }}>Model used</td><td style={{ padding: '7px 0', textAlign: 'right', color: '#1F2E29' }}>ThermalGAN v3.2</td></tr>
              <tr style={{ borderTop: '1px solid #EFF0E8' }}><td style={{ padding: '7px 0', color: '#5B685F' }}>Inference time</td><td style={{ padding: '7px 0', textAlign: 'right', color: '#1F2E29' }}>37s</td></tr>
              <tr style={{ borderTop: '1px solid #EFF0E8' }}><td style={{ padding: '7px 0', color: '#5B685F' }}>Source</td><td style={{ padding: '7px 0', textAlign: 'right', color: '#1F2E29' }}>Landsat 9, B10</td></tr>
              <tr style={{ borderTop: '1px solid #EFF0E8' }}><td style={{ padding: '7px 0', color: '#5B685F' }}>Tile size</td><td style={{ padding: '7px 0', textAlign: 'right', color: '#1F2E29' }}>2048&times;2048</td></tr>
              <tr style={{ borderTop: '1px solid #EFF0E8' }}><td style={{ padding: '7px 0', color: '#5B685F' }}>Status</td><td style={{ padding: '7px 0', textAlign: 'right' }}><span style={{ background: '#E1EFD9', color: '#2C5F3F', padding: '3px 10px', borderRadius: '999px', fontSize: '11px' }}>Complete</span></td></tr>
            </tbody>
          </table>
        </div>
        
      </div>
    </div>
  );
}