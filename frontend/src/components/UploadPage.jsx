import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// import { processTile } from '../services/api'; // Uncomment when ready to link to your real API

export default function UploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // --- FORM STATE ---
  const [file, setFile] = useState(null);
  const [resolution, setResolution] = useState('7.5m (4x super resolution)');
  const [outputType, setOutputType] = useState('Colorized RGB + segmentation');
  const [modelVersion, setModelVersion] = useState('ThermalGAN v3.2');
  const [confidence, setConfidence] = useState(75);
  
  // --- UI STATE ---
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // --- DRAG AND DROP HANDLERS ---
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  // --- VALIDATION ---
  const validateAndSetFile = (selectedFile) => {
    setError('');
    if (!selectedFile) return;

    // Validate extension
    const validExtensions = ['.tif', '.tiff', '.geotiff', '.npy'];
    const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      setError('Invalid file format. Please upload a .tif, .tiff, .geotiff, or .npy file.');
      return;
    }

    // Validate size (e.g., max 500MB)
    const maxSizeInBytes = 500 * 1024 * 1024; 
    if (selectedFile.size > maxSizeInBytes) {
      setError('File size exceeds the 500 MB limit.');
      return;
    }

    setFile(selectedFile);
  };

  // --- SUBMIT HANDLER ---
  const handleStartAnalysis = async () => {
    if (!file) {
      setError('Please select or drop a file before starting the analysis.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    // Package everything for FastAPI
    const formData = new FormData();
    formData.append('file', file);
    formData.append('resolution', resolution);
    formData.append('output_type', outputType);
    formData.append('model_version', modelVersion);
    formData.append('confidence_threshold', confidence);

    try {
      console.log('Sending payload to backend:', Object.fromEntries(formData));
      
      // THE REAL API CALL (Uncomment when backend is ready):
      // const response = await processTile(formData);
      
      // Simulate network delay for now
      await new Promise(resolve => setTimeout(resolve, 800)); 

      // Redirect to dashboard where the processing screen will take over
      navigate('/dashboard'); 
      
    } catch (err) {
      setError(err.message || 'An error occurred during upload.');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ background: '#F7F8F3', fontFamily: "Georgia, 'Times New Roman', serif", color: '#1F2E29', width: '100%', padding: '32px 40px', borderRadius: '16px', border: '1px solid #E3E4DA', boxSizing: 'border-box' }}>

      <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 4px', color: '#123D30' }}>New analysis</h1>
      <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#5B685F', margin: '0 0 24px' }}>Upload a thermal tile to begin AI processing.</p>

      {/* ERROR BANNER */}
      {error && (
        <div style={{ background: '#FCEBEB', border: '1px solid #791F1F', color: '#791F1F', padding: '12px 16px', borderRadius: '10px', fontFamily: 'Arial, sans-serif', fontSize: '13px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="ti ti-alert-circle" style={{ fontSize: '16px' }}></i>
          {error}
        </div>
      )}

      {/* DRAG AND DROP ZONE */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{ 
          border: `2px dashed ${isDragging ? '#0F6E56' : '#C7D0BC'}`, 
          borderRadius: '16px', 
          padding: '44px', 
          textAlign: 'center', 
          background: isDragging ? '#EFF9F2' : '#FFFFFF', 
          marginBottom: '22px',
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#E1EFD9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <i className="ti ti-cloud-upload" style={{ color: '#0F4D3E', fontSize: '24px' }}></i>
        </div>
        
        {file ? (
          <div style={{ fontFamily: 'Arial, sans-serif' }}>
            <div style={{ fontSize: '14px', color: '#123D30', fontWeight: 700, marginBottom: '4px' }}>{file.name}</div>
            <div style={{ fontSize: '12px', color: '#5B685F', marginBottom: '16px' }}>{(file.size / (1024 * 1024)).toFixed(2)} MB</div>
            <button onClick={() => setFile(null)} style={{ padding: '6px 14px', borderRadius: '999px', border: '1px solid #C9CFC3', background: 'transparent', color: '#791F1F', fontSize: '12px', cursor: 'pointer' }}>Remove file</button>
          </div>
        ) : (
          <div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px', color: '#123D30', marginBottom: '6px' }}>Drag and drop your Landsat B10 tile here</div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#5B685F', marginBottom: '16px' }}>Supports .tif, .tiff, .geotiff, .npy up to 500 MB</div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              accept=".tif,.tiff,.geotiff,.npy" 
              style={{ display: 'none' }} 
            />
            
            <button 
              onClick={() => fileInputRef.current.click()} 
              style={{ padding: '11px 22px', borderRadius: '999px', border: 'none', background: '#0F4D3E', color: '#F7F8F3', fontFamily: 'Arial, sans-serif', fontSize: '13px', cursor: 'pointer' }}
            >
              Browse files
            </button>
          </div>
        )}
      </div>

      {/* PARAMETERS FORM */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '22px' }}>
        <div>
          <label style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#3E4A44', marginBottom: '6px', display: 'block' }}>Output resolution</label>
          <select value={resolution} onChange={(e) => setResolution(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #D7DCCB', background: '#FFFFFF', fontFamily: 'Arial, sans-serif', fontSize: '13px', outline: 'none' }}>
            <option value="7.5m">7.5m (4x super resolution)</option>
            <option value="15m">15m (2x super resolution)</option>
            <option value="30m">30m (native)</option>
          </select>
        </div>
        <div>
          <label style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#3E4A44', marginBottom: '6px', display: 'block' }}>Output type</label>
          <select value={outputType} onChange={(e) => setOutputType(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #D7DCCB', background: '#FFFFFF', fontFamily: 'Arial, sans-serif', fontSize: '13px', outline: 'none' }}>
            <option value="full">Colorized RGB + segmentation</option>
            <option value="rgb_only">Colorized RGB only</option>
            <option value="seg_only">Segmentation only</option>
          </select>
        </div>
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid #E3E4DA', borderRadius: '14px', padding: '18px', marginBottom: '24px' }}>
        <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '14px', color: '#123D30' }}>Advanced settings</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div>
            <label style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#3E4A44', marginBottom: '6px', display: 'block' }}>Model version</label>
            <select value={modelVersion} onChange={(e) => setModelVersion(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #D7DCCB', background: '#F7F8F3', fontFamily: 'Arial, sans-serif', fontSize: '12px', outline: 'none' }}>
              <option value="v3.2">ThermalGAN v3.2</option>
              <option value="v2.8">ThermalGAN v2.8 (Legacy)</option>
            </select>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#3E4A44', marginBottom: '6px' }}>
              <label>Detection confidence</label>
              <span style={{ fontWeight: 700, color: '#123D30' }}>{confidence}%</span>
            </div>
            <input 
              type="range" 
              min="0" max="100" 
              value={confidence} 
              onChange={(e) => setConfidence(e.target.value)} 
              style={{ width: '100%', cursor: 'ew-resize' }} 
            />
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <button 
          onClick={() => navigate('/dashboard')}
          style={{ padding: '12px 22px', borderRadius: '999px', border: '1px solid #C9CFC3', background: 'transparent', color: '#1F2E29', fontFamily: 'Arial, sans-serif', fontSize: '13px', cursor: 'pointer' }}
        >
          Cancel
        </button>
        <button 
          onClick={handleStartAnalysis}
          disabled={isSubmitting}
          style={{ padding: '12px 26px', borderRadius: '999px', border: 'none', background: isSubmitting ? '#5B685F' : '#0F4D3E', color: '#F7F8F3', fontFamily: 'Arial, sans-serif', fontSize: '13px', cursor: isSubmitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          {isSubmitting ? 'Processing...' : 'Start analysis'} 
          {!isSubmitting && <i className="ti ti-arrow-right" style={{ fontSize: '14px' }}></i>}
        </button>
      </div>
      
    </div>
  );
}