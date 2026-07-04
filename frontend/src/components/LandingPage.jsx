import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div style={{ background: '#F7F8F3', fontFamily: "Georgia, 'Times New Roman', serif", color: '#1F2E29', width: '100%', minHeight: '100vh' }}>

      {/* NAV */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 32px', background: '#F7F8F3', borderBottom: '1px solid #E3E4DA' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '19px', color: '#0F4D3E' }}>
          <span style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#0F4D3E', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="ti ti-satellite" style={{ color: '#DCE8C8', fontSize: '16px' }}></i>
          </span>
          PS10 &middot; Antariksh AI
        </div>
        <div style={{ display: 'flex', gap: '28px', fontFamily: 'Arial, sans-serif', fontSize: '14px', color: '#3E4A44' }}>
          <span style={{ cursor: 'pointer' }}>Platform</span>
          <span style={{ cursor: 'pointer' }}>Technology</span>
          <span style={{ cursor: 'pointer' }}>How it works</span>
          <span style={{ cursor: 'pointer' }}>Team</span>
        </div>
        <div style={{ display: 'flex', gap: '10px', fontFamily: 'Arial, sans-serif' }}>
          <Link to="/login" style={{ padding: '9px 20px', borderRadius: '999px', border: '1px solid #0F4D3E', background: 'transparent', color: '#0F4D3E', fontSize: '13px', cursor: 'pointer', textDecoration: 'none' }}>Log in</Link>
          <Link to="/register" style={{ padding: '9px 20px', borderRadius: '999px', border: 'none', background: '#0F4D3E', color: '#F7F8F3', fontSize: '13px', cursor: 'pointer', textDecoration: 'none' }}>Get started</Link>
        </div>
      </div>

      {/* HERO */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '40px', padding: '64px 48px 56px', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#E1EFD9', color: '#2C5F3F', fontFamily: 'Arial, sans-serif', fontSize: '12px', padding: '6px 14px', borderRadius: '999px', marginBottom: '18px' }}>
            <i className="ti ti-rocket" style={{ fontSize: '13px' }}></i> Bharatiya Antariksh Hackathon 2026
          </div>
          <h1 style={{ fontSize: '40px', lineHeight: 1.2, fontWeight: 700, margin: '0 0 18px', color: '#123D30' }}>
            Seeing heat as clearly<br/>as we see light
          </h1>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '15px', lineHeight: 1.7, color: '#4B5A54', maxWidth: '460px', margin: '0 0 28px' }}>
            An AI pipeline that colorizes and super-resolves Landsat thermal (B10) imagery into vivid, high-resolution scenes &mdash; turning raw infrared into insight for climate, agriculture, and urban planning.
          </p>
          <div style={{ display: 'flex', gap: '14px' }}>
            <Link to="/register" style={{ padding: '13px 26px', borderRadius: '999px', border: 'none', background: '#0F4D3E', color: '#F7F8F3', fontFamily: 'Arial, sans-serif', fontSize: '14px', cursor: 'pointer', textDecoration: 'none' }}>
              Try the platform <i className="ti ti-arrow-right" style={{ fontSize: '14px', verticalAlign: '-2px' }}></i>
            </Link>
            <button style={{ padding: '13px 26px', borderRadius: '999px', border: '1px solid #C9CFC3', background: 'transparent', color: '#1F2E29', fontFamily: 'Arial, sans-serif', fontSize: '14px', cursor: 'pointer' }}>Watch demo</button>
          </div>
        </div>
        <div style={{ background: '#123D30', borderRadius: '20px', padding: '18px', position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gridTemplateRows: 'repeat(6,1fr)', gap: '2px', height: '280px', borderRadius: '14px', overflow: 'hidden' }}>
            <div style={{ background: '#3B7A5A', gridColumn: 'span 2', gridRow: 'span 2' }}></div><div style={{ background: '#E0A94A' }}></div><div style={{ background: '#5DCAA5' }}></div><div style={{ background: '#8FBFA0', gridColumn: 'span 2' }}></div>
            <div style={{ background: '#E0A94A' }}></div><div style={{ background: '#D96B3A', gridRow: 'span 2' }}></div><div style={{ background: '#5DCAA5', gridColumn: 'span 2' }}></div><div style={{ background: '#3B7A5A' }}></div>
            <div style={{ background: '#8FBFA0' }}></div><div style={{ background: '#5DCAA5', gridColumn: 'span 2' }}></div><div style={{ background: '#D96B3A' }}></div><div style={{ background: '#3B7A5A', gridRow: 'span 2' }}></div>
            <div style={{ background: '#E0A94A', gridColumn: 'span 2' }}></div><div style={{ background: '#8FBFA0' }}></div><div style={{ background: '#5DCAA5' }}></div>
            <div style={{ background: '#3B7A5A' }}></div><div style={{ background: '#8FBFA0' }}></div><div style={{ background: '#D96B3A' }}></div><div style={{ background: '#E0A94A', gridColumn: 'span 2' }}></div>
            <div style={{ background: '#5DCAA5', gridColumn: 'span 3' }}></div><div style={{ background: '#3B7A5A', gridColumn: 'span 3' }}></div>
          </div>
          <div style={{ position: 'absolute', bottom: '30px', left: '30px', background: 'rgba(247,248,243,0.95)', borderRadius: '999px', padding: '8px 16px', fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#123D30', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <i className="ti ti-flame" style={{ fontSize: '13px', color: '#D96B3A' }}></i> Thermal &rarr; RGB, live
          </div>
        </div>
      </div>

      {/* MISSION STRIP */}
      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '22px 48px', background: '#EFF2E6', borderTop: '1px solid #E3E4DA', borderBottom: '1px solid #E3E4DA', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ textAlign: 'center' }}><div style={{ fontSize: '22px', fontWeight: 700, color: '#0F4D3E' }}>4x</div><div style={{ fontSize: '12px', color: '#5B685F' }}>super-resolution factor</div></div>
        <div style={{ textAlign: 'center' }}><div style={{ fontSize: '22px', fontWeight: 700, color: '#0F4D3E' }}>30m &rarr; 7.5m</div><div style={{ fontSize: '12px', color: '#5B685F' }}>pixel resolution</div></div>
        <div style={{ textAlign: 'center' }}><div style={{ fontSize: '22px', fontWeight: 700, color: '#0F4D3E' }}>96%</div><div style={{ fontSize: '12px', color: '#5B685F' }}>segmentation accuracy</div></div>
        <div style={{ textAlign: 'center' }}><div style={{ fontSize: '22px', fontWeight: 700, color: '#0F4D3E' }}>&lt;40s</div><div style={{ fontSize: '12px', color: '#5B685F' }}>avg. inference time</div></div>
      </div>

      {/* FEATURES GRID */}
      <div style={{ padding: '56px 48px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: 700, textAlign: 'center', margin: '0 0 8px', color: '#123D30' }}>One pipeline, five capabilities</h2>
        <p style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', color: '#5B685F', fontSize: '14px', margin: '0 0 36px' }}>From raw thermal band to a decision-ready report.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
          
          <div style={{ background: '#FFFFFF', border: '1px solid #E3E4DA', borderRadius: '16px', padding: '22px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#E1EFD9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <i className="ti ti-color-swatch" style={{ color: '#2C5F3F', fontSize: '18px' }}></i>
            </div>
            <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>Thermal colorization</div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#5B685F', lineHeight: 1.5 }}>Translates single-band infrared into realistic visible-spectrum color.</div>
          </div>
          
          <div style={{ background: '#FFFFFF', border: '1px solid #E3E4DA', borderRadius: '16px', padding: '22px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#DCEEEA', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <i className="ti ti-focus-2" style={{ color: '#0F6E56', fontSize: '18px' }}></i>
            </div>
            <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>Super resolution</div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#5B685F', lineHeight: 1.5 }}>Sharpens coarse thermal pixels into fine, usable spatial detail.</div>
          </div>
          
          <div style={{ background: '#FFFFFF', border: '1px solid #E3E4DA', borderRadius: '16px', padding: '22px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#F3E7D8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <i className="ti ti-map-2" style={{ color: '#8A5A22', fontSize: '18px' }}></i>
            </div>
            <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>Land segmentation</div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#5B685F', lineHeight: 1.5 }}>Classifies vegetation, water, roads and buildings automatically.</div>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid #E3E4DA', borderRadius: '16px', padding: '22px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#EEE7F3', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <i className="ti ti-scan" style={{ color: '#5B3A8A', fontSize: '18px' }}></i>
            </div>
            <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>Object detection</div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#5B685F', lineHeight: 1.5 }}>Locates built structures and infrastructure within a scene.</div>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid #E3E4DA', borderRadius: '16px', padding: '22px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#E1EFD9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <i className="ti ti-map-pin" style={{ color: '#2C5F3F', fontSize: '18px' }}></i>
            </div>
            <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>Geospatial analysis</div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#5B685F', lineHeight: 1.5 }}>Anchors every output to precise coordinates on an interactive map.</div>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid #E3E4DA', borderRadius: '16px', padding: '22px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#DCEEEA', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <i className="ti ti-file-report" style={{ color: '#0F6E56', fontSize: '18px' }}></i>
            </div>
            <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>Report generation</div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#5B685F', lineHeight: 1.5 }}>Compiles findings into a shareable, presentation-ready PDF.</div>
          </div>

        </div>
      </div>

      {/* TECH STACK */}
      <div style={{ background: '#123D30', padding: '48px 48px', color: '#F0F3EA' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, textAlign: 'center', margin: '0 0 28px', color: '#F0F3EA' }}>Built on</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', fontFamily: 'Arial, sans-serif', fontSize: '13px' }}>
          <span style={{ padding: '9px 18px', borderRadius: '999px', border: '1px solid #3A6858', background: '#16473A' }}>Landsat 8/9 B10</span>
          <span style={{ padding: '9px 18px', borderRadius: '999px', border: '1px solid #3A6858', background: '#16473A' }}>PyTorch</span>
          <span style={{ padding: '9px 18px', borderRadius: '999px', border: '1px solid #3A6858', background: '#16473A' }}>GAN super-resolution</span>
          <span style={{ padding: '9px 18px', borderRadius: '999px', border: '1px solid #3A6858', background: '#16473A' }}>U-Net segmentation</span>
          <span style={{ padding: '9px 18px', borderRadius: '999px', border: '1px solid #3A6858', background: '#16473A' }}>FastAPI</span>
          <span style={{ padding: '9px 18px', borderRadius: '999px', border: '1px solid #3A6858', background: '#16473A' }}>Mapbox GIS</span>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: '#E1EFD9', padding: '48px', textAlign: 'center', borderRadius: 0 }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 10px', color: '#123D30' }}>See your first scene transformed</h2>
        <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px', color: '#3E4A44', margin: '0 0 22px' }}>No setup required. Upload a Landsat B10 tile and get results in under a minute.</p>
        <Link to="/register" style={{ padding: '13px 30px', borderRadius: '999px', border: 'none', background: '#0F4D3E', color: '#F7F8F3', fontFamily: 'Arial, sans-serif', fontSize: '14px', cursor: 'pointer', textDecoration: 'none' }}>
          Launch platform
        </Link>
      </div>

      {/* FOOTER */}
      <div style={{ background: '#123D30', color: '#C7D3C9', padding: '32px 48px', display: 'flex', justifyContent: 'space-between', fontFamily: 'Arial, sans-serif', fontSize: '12px' }}>
        <div>&copy; 2026 Team Breach &middot; PS10 &middot; Bharatiya Antariksh Hackathon</div>
        <div style={{ display: 'flex', gap: '18px' }}>
          <span style={{ cursor: 'pointer' }}>Docs</span>
          <span style={{ cursor: 'pointer' }}>GitHub</span>
          <span style={{ cursor: 'pointer' }}>Contact</span>
        </div>
      </div>

    </div>
  );
}