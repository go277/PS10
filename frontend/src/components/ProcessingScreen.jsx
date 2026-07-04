import React, { useState, useEffect } from 'react';

export default function ProcessingScreen({ filename }) {
  const [progress, setProgress] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);

  // This effect creates a realistic loading sequence while the backend API runs
  useEffect(() => {
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = now - startTime;
      setElapsedMs(diff);

      // Artificially increase progress up to 98% (it will hang here until the real API finishes)
      setProgress((oldProgress) => {
        if (oldProgress >= 98) return 98;
        // Slow down the progress bar as it gets closer to 100%
        const increment = Math.random() * (oldProgress > 80 ? 0.5 : 2);
        return Math.min(oldProgress + increment, 98);
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const elapsedSeconds = Math.floor(elapsedMs / 1000);

  // Helper to determine the status of a specific step based on overall progress
  const getStepStatus = (startThreshold, endThreshold) => {
    if (progress >= endThreshold) return 'done';
    if (progress >= startThreshold && progress < endThreshold) return 'progress';
    return 'queued';
  };

  // Define our 6 pipeline steps and their active thresholds
  const steps = [
    { title: 'Super resolution', desc: 'Upscaling thermal array to 7.5m pixel resolution', thresholds: [0, 20] },
    { title: 'Thermal translation', desc: 'Converting infrared band into colorized RGB', thresholds: [20, 40] },
    { title: 'Segmentation', desc: 'Classifying vegetation, water, roads and buildings', thresholds: [40, 60] },
    { title: 'Object detection', desc: 'Running YOLOv8 infrastructure detection', thresholds: [60, 80] },
    { title: 'Geolocation', desc: 'Extracting EPSG:4326 coordinate bounds', thresholds: [80, 90] },
    { title: 'Report generation', desc: 'Compiling findings and structuring base64 payloads', thresholds: [90, 100] }
  ];

  return (
    <div style={{ background: '#F7F8F3', fontFamily: "Georgia, 'Times New Roman', serif", color: '#1F2E29', width: '100%', padding: '36px 44px', borderRadius: '16px', border: '1px solid #E3E4DA', maxWidth: '800px', margin: '0 auto' }}>

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 6px', color: '#123D30' }}>Processing your tile</h1>
        <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#5B685F', margin: 0 }}>
          {filename || 'Uploaded Image'} &middot; Landsat B10 Pipeline
        </p>
      </div>

      {/* OVERALL PROGRESS BAR */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#3E4A44', marginBottom: '8px' }}>
          <span>Overall progress</span>
          <span>{Math.floor(progress)}% &middot; elapsed {elapsedSeconds}s</span>
        </div>
        <div style={{ height: '8px', borderRadius: '999px', background: '#E3E4DA', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: '#0F4D3E', borderRadius: '999px', transition: 'width 0.2s ease-out' }}></div>
        </div>
      </div>

      {/* PIPELINE STEPS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {steps.map((step, index) => {
          const status = getStepStatus(step.thresholds[0], step.thresholds[1]);
          const isLast = index === steps.length - 1;

          return (
            <div key={index} style={{ 
              display: 'flex', gap: '16px', padding: '14px 12px', 
              borderBottom: isLast ? 'none' : '1px solid #EFF0E8',
              background: status === 'progress' ? '#EFF9F2' : 'transparent',
              borderRadius: status === 'progress' ? '10px' : '0',
              margin: status === 'progress' ? '2px 0' : '0',
              transition: 'background 0.3s ease'
            }}>
              
              {/* Dynamic Icon */}
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: status === 'done' ? '#0F4D3E' : status === 'progress' ? '#5DCAA5' : '#E3E4DA'
              }}>
                {status === 'done' && <i className="ti ti-check" style={{ color: '#F7F8F3', fontSize: '16px' }}></i>}
                {status === 'progress' && <i className="ti ti-loader-2" style={{ color: '#123D30', fontSize: '16px', animation: 'spin 2s linear infinite' }}></i>}
                {status === 'queued' && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8B8B7E' }}></div>}
              </div>
              
              {/* Text */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '14px', color: status === 'queued' ? '#8B8B7E' : '#123D30' }}>
                  {step.title}
                </div>
                <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: status === 'queued' ? '#A3A396' : '#5B685F' }}>
                  {step.desc}
                </div>
              </div>
              
              {/* Status Label */}
              <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', 
                color: status === 'done' ? '#0F6E56' : status === 'progress' ? '#3E4A44' : '#A3A396',
                fontWeight: status === 'progress' ? 700 : 400
              }}>
                {status === 'done' ? 'Done' : status === 'progress' ? 'In progress' : 'Queued'}
              </div>

            </div>
          );
        })}
      </div>

      {/* Adding a quick inline style for the loader spin animation */}
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}