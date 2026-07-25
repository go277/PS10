import React, { useState, useEffect, useRef } from 'react';

export default function InteractiveMap() {
  // --- STATE ---
  const [activeView, setActiveView] = useState('satellite'); // 'satellite' or 'detection'
  const [selectedLayer, setSelectedLayer] = useState('Segmentation layer');
  const [opacity, setOpacity] = useState(70);
  const [zoom, setZoom] = useState(1.0);
  const [coordinates, setCoordinates] = useState({ lat: 28.6139, lng: 77.2090 });
  const [hoverCoords, setHoverCoords] = useState(null);

  const canvasRef = useRef(null);

  // Handle Zoom Increments
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2.4));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.6));

  // Capture Mouse Tracking Coordinates
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Map pixel offsets to relative Lat/Lng around Delhi base coordinates
    const baseLat = 28.6139;
    const baseLng = 77.2090;
    
    const latOffset = ((canvas.height / 2 - y) * 0.0005) / zoom;
    const lngOffset = ((x - canvas.width / 2) * 0.0005) / zoom;

    setHoverCoords({
      lat: (baseLat + latOffset).toFixed(4),
      lng: (baseLng + lngOffset).toFixed(4)
    });
  };

  const handleMouseLeave = () => {
    setHoverCoords(null);
  };

  // --- GIS ENGINE (CANVAS RENDERING) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const width = canvas.width;
    const height = canvas.height;

    // Clear Screen
    ctx.clearRect(0, 0, width, height);

    // Save Context for Zoom Matrix Operations
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-width / 2, -height / 2);

    // 1. Draw Base Map (Satellite Map Mode vs Detection Overlay Base)
    if (activeView === 'satellite') {
      ctx.fillStyle = '#1A2922'; // Deep forest imagery base
      ctx.fillRect(0, 0, width, height);
      
      // Draw simulated natural terrain textures
      ctx.fillStyle = '#23382E';
      ctx.beginPath();
      ctx.arc(120, 100, 90, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = '#F0F3EA'; // Light analytical view base
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Draw Vector Overlays with Opacity Adjustments
    ctx.globalAlpha = opacity / 100;

    if (selectedLayer === 'Segmentation layer') {
      // Vegetation Features
      ctx.fillStyle = '#3B7A5A';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(180, 40);
      ctx.lineTo(220, 160);
      ctx.lineTo(50, 240);
      ctx.closePath();
      ctx.fill();

      // Water Body Features
      ctx.fillStyle = '#378ADD';
      ctx.beginPath();
      ctx.arc(420, 220, 65, 0, Math.PI * 2);
      ctx.fill();

      // Road Infrastructure Networks
      ctx.strokeStyle = '#D85A30';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(0, 300);
      ctx.quadraticCurveTo(250, 280, 600, 50);
      ctx.stroke();

      // Urban Built-Up Areas
      ctx.fillStyle = '#7F77DD';
      ctx.fillRect(280, 80, 80, 70);
      ctx.fillRect(380, 40, 50, 50);

    } else if (selectedLayer === 'Detection layer') {
      // Draw YOLOv8 target boxes and tracking metrics
      ctx.strokeStyle = '#7F77DD';
      ctx.lineWidth = 2;
      
      // Target 1
      ctx.strokeRect(280, 80, 80, 70);
      ctx.fillStyle = '#7F77DD';
      ctx.font = '10px Arial';
      ctx.fillText('Urban Block: 94%', 282, 75);

      // Target 2
      ctx.strokeRect(380, 40, 50, 50);
      ctx.fillText('Facility: 89%', 382, 35);

      // Infrastructure Route Detection
      ctx.strokeStyle = '#D85A30';
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(0, 300);
      ctx.quadraticCurveTo(250, 280, 600, 50);
      ctx.stroke();
      ctx.setLineDash([]); // Reset path dashes

    } else if (selectedLayer === 'Thermal layer') {
      // Generate radial gradient heat vectors for radiometric analysis
      const gradient1 = ctx.createRadialGradient(320, 120, 10, 320, 120, 120);
      gradient1.addColorStop(0, 'rgba(216, 90, 48, 0.9)');  // Hot Center
      gradient1.addColorStop(0.5, 'rgba(224, 169, 74, 0.5)'); // Ambient
      gradient1.addColorStop(1, 'rgba(55, 138, 221, 0)');     // Cool Bound

      ctx.fillStyle = gradient1;
      ctx.beginPath();
      ctx.arc(320, 120, 120, 0, Math.PI * 2);
      ctx.fill();
    }

    // Restore context transforms
    ctx.restore();
    ctx.globalAlpha = 1.0;

    // 3. Draw GIS Map Grid Lines
    ctx.strokeStyle = activeView === 'satellite' ? 'rgba(240,243,234,0.15)' : 'rgba(18,61,48,0.08)';
    ctx.lineWidth = 1;
    
    // Vertical grid alignment
    for (let i = 0; i < width; i += 60) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    // Horizontal grid alignment
    for (let j = 0; j < height; j += 60) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(width, j);
      ctx.stroke();
    }

  }, [activeView, selectedLayer, opacity, zoom]);

  return (
    <div style={{ background: '#F7F8F3', fontFamily: "Georgia, 'Times New Roman', serif", color: '#1F2E29', width: '100%', padding: '24px 32px', borderRadius: '16px', border: '1px solid #E3E4DA', boxSizing: 'border-box' }}>

      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#123D30' }}>Interactive map</h1>
        
        {/* Toggle Controls */}
        <div style={{ display: 'flex', gap: '8px', fontFamily: 'Arial, sans-serif', fontSize: '12px' }}>
          <button 
            onClick={() => setActiveView('satellite')}
            style={{ 
              padding: '8px 14px', borderRadius: '999px', border: 'none',
              background: activeView === 'satellite' ? '#0F4D3E' : '#E3E4DA', 
              color: activeView === 'satellite' ? '#F7F8F3' : '#3E4A44', 
              cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s'
            }}
          >
            Satellite
          </button>
          <button 
            onClick={() => setActiveView('detection')}
            style={{ 
              padding: '8px 14px', borderRadius: '999px', 
              border: activeView === 'detection' ? 'none' : '1px solid #C9CFC3',
              background: activeView === 'detection' ? '#0F4D3E' : 'transparent', 
              color: activeView === 'detection' ? '#F7F8F3' : '#3E4A44', 
              cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s'
            }}
          >
            Detection overlay
          </button>
        </div>
      </div>

      {/* MAP VIEWER PORTAL */}
      <div style={{ position: 'relative', height: '360px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E3E4DA', background: '#1A2922' }}>
        
        {/* Real-time HTML5 Raster & Vector Canvas */}
        <canvas 
          ref={canvasRef}
          width={680}
          height={360}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ display: 'block', width: '100%', height: '100%', cursor: 'crosshair' }}
        />

        {/* FLOATING LEGEND PANEL */}
        <div style={{ position: 'absolute', top: '14px', left: '14px', background: 'rgba(247,248,243,0.95)', borderRadius: '12px', padding: '12px 14px', fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#3E4A44', width: '130px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', pointerEvents: 'none' }}>
          <div style={{ fontWeight: 700, color: '#123D30', marginBottom: '8px' }}>Legend</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '2px', background: '#3B7A5A' }}></span>Vegetation
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '2px', background: '#378ADD' }}></span>Water
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '2px', background: '#D85A30' }}></span>Roads
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '2px', background: '#7F77DD' }}></span>Buildings
          </div>
        </div>

        {/* INTERACTIVE ZOOM TOGGLES */}
        <div style={{ position: 'absolute', top: '14px', right: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button 
            onClick={handleZoomIn}
            style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(247,248,243,0.95)', border: '1px solid #E3E4DA', fontFamily: 'Arial, sans-serif', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}
          >
            +
          </button>
          <button 
            onClick={handleZoomOut}
            style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(247,248,243,0.95)', border: '1px solid #E3E4DA', fontFamily: 'Arial, sans-serif', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}
          >
            −
          </button>
        </div>

        {/* METADATA COORDINATE DISPLAY */}
        <div style={{ position: 'absolute', bottom: '14px', left: '14px', background: 'rgba(18,61,48,0.85)', color: '#F0F3EA', padding: '6px 14px', borderRadius: '999px', fontFamily: 'Arial, sans-serif', fontSize: '11px', backdropFilter: 'blur(2px)' }}>
          {hoverCoords ? (
            <span>{hoverCoords.lat}° N, {hoverCoords.lng}° E</span>
          ) : (
            <span>{coordinates.lat.toFixed(4)}° N, {coordinates.lng.toFixed(4)}° E (Center)</span>
          )}
        </div>

        {/* ZOOM LAYER INDICATION LABEL */}
        <div style={{ position: 'absolute', bottom: '14px', right: '14px', background: 'rgba(247,248,243,0.95)', color: '#123D30', padding: '4px 10px', borderRadius: '6px', fontFamily: 'Arial, sans-serif', fontSize: '10px', fontWeight: 600 }}>
          Zoom: {zoom.toFixed(1)}x
        </div>
      </div>

      {/* PIPELINE OPACITY AND SWITCH CONTROLS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '16px' }}>
        <span style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#3E4A44', whiteSpace: 'nowrap' }}>Overlay opacity</span>
        <input 
          type="range" 
          min="0" max="100" 
          value={opacity} 
          onChange={(e) => setOpacity(parseInt(e.target.value))}
          style={{ flex: 1, cursor: 'ew-resize' }} 
        />
        <select 
          value={selectedLayer}
          onChange={(e) => setSelectedLayer(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #D7DCCB', background: '#FFFFFF', fontFamily: 'Arial, sans-serif', fontSize: '12px', outline: 'none', cursor: 'pointer' }}
        >
          <option value="Segmentation layer">Segmentation layer</option>
          <option value="Detection layer">Detection layer</option>
          <option value="Thermal layer">Thermal layer</option>
        </select>
      </div>

    </div>
  );
}