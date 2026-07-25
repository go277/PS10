import React, { useState, useEffect, useMemo } from 'react';
import { getHistory } from '../services/api';

export default function ReportsPage() {
  const [historyLogs, setHistoryLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // 1. Fetch Real Data (Only Successful Runs)
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const data = await getHistory();
        const logs = data?.history || (Array.isArray(data) ? data : []);
        
        // --- THE 1 AM FIX ---
        // We remove the strict timestamp requirement. If the backend forgets to send 
        // a timestamp, we dynamically generate one based on its position in the list 
        // so your charts NEVER crash!
        const successfulLogs = logs
          .filter(log => log?.status === 'Success')
          .map((log, index) => ({
            ...log,
            timestamp: log.timestamp || new Date(Date.now() - (logs.length - index) * 3600000).toISOString()
          }));
        
        // Sort chronologically (oldest first)
        successfulLogs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setHistoryLogs(successfulLogs);
      } catch (error) {
        console.error("Error fetching logs for reports:", error);
        setHistoryLogs([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // 2. Selection Handlers
  const toggleSelection = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === historyLogs.length) {
      setSelectedIds([]); // Deselect all
    } else {
      setSelectedIds(historyLogs.map(log => log.id)); // Select all
    }
  };

  // 3. Data prep for the Report Preview
  const selectedLogs = useMemo(() => {
    return historyLogs.filter(log => selectedIds.includes(log.id));
  }, [historyLogs, selectedIds]);

  // Generate SVG Points for the Trend Chart
  const generateChartPoints = (dataKey, height, width) => {
    if (selectedLogs.length < 2) return "";
    
    // Find min and max to scale the chart dynamically
    const values = selectedLogs.map(log => parseFloat(log[dataKey] || 0));
    const maxVal = Math.max(...values, 1);
    
    const xStep = width / (selectedLogs.length - 1);
    
    const points = values.map((val, index) => {
      const x = index * xStep;
      // Invert Y because SVG 0,0 is top-left
      const y = height - ((val / maxVal) * height * 0.8); // 0.8 keeps it from touching the absolute top
      return `${x},${y}`;
    });
    
    return points.join(" ");
  };

  // 4. PDF Generation Logic (Matches Dashboard.jsx)
  const handleGeneratePDF = () => {
    setIsGenerating(true);
    
    const element = document.getElementById('temporal-report-content');
    const opt = {
      margin:       0.3,
      filename:     `PS10_Temporal_Comparison_${new Date().getTime()}.pdf`,
      image:        { type: 'jpeg', quality: 1.0 },
      pagebreak:    { mode: 'avoid-all' },
      html2canvas:  { scale: 2, useCORS: true, scrollX: 0, scrollY: 0 },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    if (window.html2pdf) {
      window.html2pdf().set(opt).from(element).save().then(() => {
        setIsGenerating(false);
      });
    } else {
      alert("PDF Engine not found. Please ensure html2pdf.js is loaded in your index.html.");
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ background: '#F7F8F3', fontFamily: "Georgia, 'Times New Roman', serif", color: '#1F2E29', width: '100%', padding: '28px 36px', borderRadius: '16px', border: '1px solid #E3E4DA', boxSizing: 'border-box' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0, color: '#123D30' }}>Temporal Reports</h1>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#5B685F', margin: '4px 0 0' }}>Select multiple analyses to generate a comparative timeline.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedLogs.length > 1 ? '1fr 1.2fr' : '1fr', gap: '24px', transition: 'all 0.3s ease' }}>
        
        {/* SELECTION TABLE */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E3E4DA', borderRadius: '14px', overflow: 'hidden', height: 'fit-content' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #EFF0E8', background: '#F9FAFB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '13px', fontWeight: 600, color: '#123D30' }}>
              Available Analyses ({historyLogs.length})
            </div>
            <button 
              onClick={toggleSelectAll} 
              style={{ background: 'transparent', border: 'none', color: '#0F6E56', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
            >
              {selectedIds.length === historyLogs.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Arial, sans-serif', fontSize: '12px' }}>
              <tbody>
                {isLoading ? (
                  <tr><td style={{ padding: '30px', textAlign: 'center', color: '#5B685F' }}>Fetching secure records...</td></tr>
                ) : historyLogs.length === 0 ? (
                  <tr><td style={{ padding: '30px', textAlign: 'center', color: '#5B685F' }}>No successful records found.</td></tr>
                ) : (
                  historyLogs.map(log => (
                    <tr 
                      key={log.id} 
                      onClick={() => toggleSelection(log.id)}
                      style={{ borderBottom: '1px solid #EFF0E8', cursor: 'pointer', background: selectedIds.includes(log.id) ? '#EFF9F2' : 'transparent', transition: 'background 0.2s' }}
                    >
                      <td style={{ padding: '12px 16px', width: '40px' }}>
                        <input 
                          type="checkbox" 
                          checked={selectedIds.includes(log.id)}
                          onChange={() => {}} 
                          style={{ cursor: 'pointer', accentColor: '#0F4D3E' }}
                        />
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 600, color: '#123D30', marginBottom: '2px' }}>{log.filename}</div>
                        <div style={{ color: '#5B685F', fontSize: '11px' }}>{new Date(log.timestamp).toLocaleDateString()} &middot; ID: #{log.id}</div>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <div style={{ color: '#3B7A5A', fontWeight: 600 }}>{log.vegetation_percent}% Veg</div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* LIVE REPORT PREVIEW */}
        {selectedLogs.length > 1 ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px', fontWeight: 600, color: '#123D30' }}>Report Preview</div>
              <button 
                onClick={handleGeneratePDF}
                disabled={isGenerating}
                style={{ padding: '10px 18px', borderRadius: '999px', border: 'none', background: isGenerating ? '#5B685F' : '#0F4D3E', color: '#F7F8F3', fontFamily: 'Arial, sans-serif', fontSize: '12px', fontWeight: 600, cursor: isGenerating ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}
              >
                {isGenerating ? <i className="ti ti-loader-2" style={{ animation: 'spin 2s linear infinite' }}></i> : <i className="ti ti-download"></i>}
                {isGenerating ? 'Generating PDF...' : 'Download PDF Report'}
              </button>
            </div>

            {/* THIS IS THE PRINTABLE AREA */}
            <div id="temporal-report-content" style={{ background: '#FFFFFF', border: '1px solid #E3E4DA', borderRadius: '12px', padding: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              
              <div style={{ borderBottom: '2px solid #123D30', paddingBottom: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 4px', color: '#123D30' }}>Temporal Comparison Report</h2>
                  <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#5B685F' }}>Project PS10 &middot; {selectedLogs.length} Tiles Analyzed</div>
                </div>
                <div style={{ textAlign: 'right', fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#5B685F' }}>
                  <strong>Date Generated:</strong> {new Date().toLocaleDateString()}
                </div>
              </div>

              {/* Data Trend Chart */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#123D30', marginBottom: '16px' }}>Vegetation vs. Water Trends</h3>
                <div style={{ position: 'relative', height: '160px', background: '#F7F8F3', borderRadius: '8px', border: '1px solid #E3E4DA', padding: '16px' }}>
                  
                  <svg width="100%" height="100%" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                    <polyline 
                      points={generateChartPoints('vegetation_percent', 128, 500)} 
                      fill="none" stroke="#3B7A5A" strokeWidth="3" vectorEffect="non-scaling-stroke"
                    />
                    <polyline 
                      points={generateChartPoints('water_percent', 128, 500)} 
                      fill="none" stroke="#378ADD" strokeWidth="3" strokeDasharray="6 4" vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                  
                  <div style={{ position: 'absolute', top: '12px', right: '16px', fontFamily: 'Arial, sans-serif', fontSize: '10px', background: 'rgba(255,255,255,0.9)', padding: '6px', borderRadius: '4px', border: '1px solid #E3E4DA' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}><span style={{ width: '8px', height: '8px', background: '#3B7A5A', borderRadius: '2px' }}></span> Vegetation</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', background: '#378ADD', borderRadius: '2px' }}></span> Water</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Arial, sans-serif', fontSize: '10px', color: '#5B685F', marginTop: '8px' }}>
                  {selectedLogs.map(log => <span key={log.id}>{new Date(log.timestamp).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</span>)}
                </div>
              </div>

              {/* Data Table */}
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#123D30', marginBottom: '12px' }}>Dataset Breakdown</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Arial, sans-serif', fontSize: '11px', textAlign: 'left' }}>
                <thead style={{ background: '#EFF2E6', color: '#3E4A44' }}>
                  <tr>
                    <th style={{ padding: '8px 10px', borderBottom: '1px solid #C9CFC3' }}>Date</th>
                    <th style={{ padding: '8px 10px', borderBottom: '1px solid #C9CFC3' }}>Filename</th>
                    <th style={{ padding: '8px 10px', borderBottom: '1px solid #C9CFC3' }}>Veg %</th>
                    <th style={{ padding: '8px 10px', borderBottom: '1px solid #C9CFC3' }}>Water %</th>
                    <th style={{ padding: '8px 10px', borderBottom: '1px solid #C9CFC3' }}>Buildings</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedLogs.map(log => (
                    <tr key={log.id} style={{ borderBottom: '1px solid #EFF0E8' }}>
                      <td style={{ padding: '8px 10px', color: '#5B685F' }}>{new Date(log.timestamp).toLocaleDateString()}</td>
                      <td style={{ padding: '8px 10px', fontWeight: 600, color: '#123D30' }}>{log.filename}</td>
                      <td style={{ padding: '8px 10px' }}>{log.vegetation_percent || '-'}%</td>
                      <td style={{ padding: '8px 10px' }}>{log.water_percent || '-'}%</td>
                      <td style={{ padding: '8px 10px' }}>{log.total_buildings || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          </div>
        ) : (
          <div style={{ background: '#FFFFFF', border: '1px solid #E3E4DA', borderRadius: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 40px', textAlign: 'center', height: 'fit-content' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#F7F8F3', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <i className="ti ti-chart-arrows-vertical" style={{ color: '#0F6E56', fontSize: '28px' }}></i>
            </div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', fontWeight: 600, color: '#123D30', marginBottom: '8px' }}>Select multiple files to compare</div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#5B685F', maxWidth: '280px', lineHeight: 1.5 }}>
              Check two or more analyses from the table to unlock the temporal comparison engine and generate a trend report.
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}