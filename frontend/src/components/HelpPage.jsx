import React, { useState } from 'react';

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    { q: "What tile formats are supported?", a: "We currently support .tif, .tiff, and .npy files containing Landsat 8/9 Band 10 thermal data. Maximum file size is 500MB." },
    { q: "How accurate is the segmentation model?", a: "Our U-Net segmentation model currently operates at 96.2% intersection-over-union (IoU) accuracy when tested against our verified ground-truth datasets." },
    { q: "Can I use my own Landsat scenes?", a: "Yes. Simply download your desired Level-1 or Level-2 scenes from USGS EarthExplorer, extract the B10 TIFF file, and drop it into the New Analysis pipeline." }
  ];

  return (
    <div style={{ background: '#F7F8F3', fontFamily: "Georgia, 'Times New Roman', serif", color: '#1F2E29', width: '100%', padding: '28px 36px', borderRadius: '16px', border: '1px solid #E3E4DA' }}>

      <h1 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 4px', color: '#123D30' }}>Help &amp; documentation</h1>
      <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#5B685F', margin: '0 0 22px' }}>Everything you need to get the most from PS10.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', marginBottom: '26px' }}>
        <div style={{ background: '#FFFFFF', border: '1px solid #E3E4DA', borderRadius: '14px', padding: '18px', cursor: 'pointer' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: '#E1EFD9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}><i className="ti ti-route" style={{ color: '#0F4D3E', fontSize: '16px' }}></i></div>
          <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '4px', color: '#123D30' }}>Pipeline overview</div>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#5B685F' }}>How a tile moves through the system.</div>
        </div>
        <div style={{ background: '#FFFFFF', border: '1px solid #E3E4DA', borderRadius: '14px', padding: '18px', cursor: 'pointer' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: '#DCEEEA', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}><i className="ti ti-brain" style={{ color: '#0F6E56', fontSize: '16px' }}></i></div>
          <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '4px', color: '#123D30' }}>Model information</div>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#5B685F' }}>Architecture and training details.</div>
        </div>
        <div style={{ background: '#FFFFFF', border: '1px solid #E3E4DA', borderRadius: '14px', padding: '18px', cursor: 'pointer' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: '#F3E7D8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}><i className="ti ti-headset" style={{ color: '#8A5A22', fontSize: '16px' }}></i></div>
          <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '4px', color: '#123D30' }}>Contact support</div>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#5B685F' }}>Reach the team behind PS10.</div>
        </div>
      </div>

      <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '12px', color: '#123D30' }}>Frequently asked questions</div>
      <div style={{ background: '#FFFFFF', border: '1px solid #E3E4DA', borderRadius: '14px', overflow: 'hidden' }}>
        
        {faqs.map((faq, index) => (
          <div key={index} style={{ borderBottom: index !== faqs.length - 1 ? '1px solid #EFF0E8' : 'none' }}>
            <div 
              onClick={() => toggleFaq(index)}
              style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#123D30', cursor: 'pointer', background: openFaq === index ? '#F7F8F3' : 'transparent' }}
            >
              <span style={{ fontWeight: openFaq === index ? 700 : 400 }}>{faq.q}</span>
              <i className={`ti ti-chevron-${openFaq === index ? 'up' : 'down'}`} style={{ color: '#5B685F' }}></i>
            </div>
            {openFaq === index && (
              <div style={{ padding: '0 18px 14px', fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#5B685F', lineHeight: 1.5, background: '#F7F8F3' }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}

      </div>
    </div>
  );
}