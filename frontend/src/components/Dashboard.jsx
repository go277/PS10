import React, { useState, useEffect } from 'react';
import UploadZone from './UploadZone';
import CompareTool from './CompareTool';
import ProcessingScreen from './ProcessingScreen'; // <-- Imported the new loading screen
import { processTile, getHistory } from '../services/api';
import { AlertCircle, Clock, CheckCircle2, XCircle, Leaf, Droplets, Building2, Route } from 'lucide-react';

export default function Dashboard() {
  const [results, setResults] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeFile, setActiveFile] = useState(null); // <-- State to hold the real filename

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getHistory();
      
      // 1. THE BULLETPROOF VEST: Force it to be an array so React NEVER crashes
      let historyArray = [];
      if (Array.isArray(data)) historyArray = data;
      else if (data && Array.isArray(data.data)) historyArray = data.data;
      else if (data && Array.isArray(data.history)) historyArray = data.history;

      // 2. THE TRANSLATOR: Make sure the Python variables perfectly match your React table
      const formattedHistory = historyArray.map(log => ({
        ...log,
        vegetation_percent: log.vegetation_pct || log.vegetation_percent,
        water_percent: log.water_pct || log.water_percent,
        processing_time_sec: log.processing_time ? log.processing_time.replace('s', '') : log.processing_time_sec
      }));

      setHistory(formattedHistory);
    } catch (err) {
      console.error("Failed to load history:", err);
      setHistory([]); // If the API fails, default to an empty array so the page stays alive!
    }
  };

  const handleProcessFile = async (file) => {
    setIsLoading(true);
    setActiveFile(file.name); // <-- Save the actual file name here
    setError(null);
    setResults(null);
    setAnalytics(null);
    
    try {
      const data = await processTile(file);
      setResults(data.images);
      setAnalytics(data.analytics);
      loadHistory();
    } catch (err) {
      setError(err.message);
      loadHistory();
    } finally {
      setIsLoading(false);
      setActiveFile(null); // <-- Clear it when done
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8F3] pb-12 font-sans text-[#1F2E29]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#123D30] mb-2 font-serif">Infrared Image Colorization & Enhancement</h2>
          <p className="text-[#5B685F] max-w-2xl mx-auto">
            Upload low-resolution thermal satellite imagery to simultaneously enhance structural details and predict realistic visible-spectrum colorization.
          </p>
        </div>

        {/* THE FIX: Correctly swapping between the Processing Screen and Upload Zone */}
        {isLoading ? (
          <div className="mt-8 mb-12">
            <ProcessingScreen filename={activeFile} />
          </div>
        ) : (
          <UploadZone onProcessFile={handleProcessFile} />
        )}

        {error && (
          <div className="max-w-2xl mx-auto mt-6 bg-[#FCEBEB] border border-[#791F1F] rounded-lg p-4 flex items-start space-x-3 text-[#791F1F]">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {results && (
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-6 border-b border-[#E3E4DA] pb-2">
              <h3 className="text-xl font-bold text-[#123D30]">AI Processing Results</h3>
              
              <button 
                onClick={() => {
                  const element = document.getElementById('report-content');
                  const opt = {
                    margin:       0.3,
                    filename:     `ISRO_Analysis_${new Date().getTime()}.pdf`,
                    image:        { type: 'jpeg', quality: 1.0 },
                    pagebreak:    { mode: 'avoid-all' },
                    html2canvas:  { scale: 2, useCORS: true, scrollX: 0, scrollY: 0 },
                    jsPDF:        { unit: 'in', format: 'a3', orientation: 'landscape' }
                  };
                  window.html2pdf().set(opt).from(element).save();
                }}
                className="bg-[#0F4D3E] hover:bg-[#123D30] text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors shadow-sm"
              >
                Download PDF Report
              </button>
            </div>
            
            <div id="report-content" className="bg-white p-6 rounded-2xl shadow-sm border border-[#E3E4DA]">
              <div className="mb-6 flex justify-between items-center border-b border-[#E3E4DA] pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#0F4D3E]">Analysis Report</h2>
                  <p className="text-[#5B685F] text-sm">Mission: Thermal to Visible Translation Pipeline</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm text-[#1F2E29]">ID: {history.length > 0 ? history[0].id : 'N/A'}</p>
                  <p className="font-mono text-sm text-[#5B685F]">{new Date().toLocaleDateString()}</p>
                </div>
              </div>

              {/* 4-COLUMN GRID FOR IMAGES */}
              <div className="grid grid-cols-4 gap-4 min-w-[1000px]">
                <div className="bg-white rounded-xl border border-[#E3E4DA] overflow-hidden flex flex-col">
                  <div className="bg-[#F7F8F3] border-b border-[#E3E4DA] p-3 text-center">
                    <h4 className="font-semibold text-[#123D30]">Original B10 Input</h4>
                    <p className="text-xs text-[#5B685F]">200m Resolution • Thermal</p>
                  </div>
                  <div className="p-4 flex-grow flex items-center justify-center bg-black">
                    <img src={results.original_thermal} alt="Original Thermal" className="max-w-full h-auto pixelated-render" />
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-[#E3E4DA] overflow-hidden flex flex-col relative">
                  <div className="absolute top-0 right-0 bg-[#0F6E56] text-white text-xs font-bold px-2 py-1 rounded-bl-lg z-10">Output 1</div>
                  <div className="bg-[#F7F8F3] border-b border-[#E3E4DA] p-3 text-center">
                    <h4 className="font-semibold text-[#0F6E56]">Enhanced B10</h4>
                    <p className="text-xs text-[#5B685F]">100m Resolution • Super-Resolved</p>
                  </div>
                  <div className="p-4 flex-grow flex items-center justify-center bg-black">
                    <img src={results.enhanced_thermal} alt="Enhanced Thermal" className="max-w-full h-auto" />
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-[#E3E4DA] overflow-hidden flex flex-col relative">
                  <div className="absolute top-0 right-0 bg-[#D85A30] text-white text-xs font-bold px-2 py-1 rounded-bl-lg z-10">Output 2</div>
                  <div className="bg-[#F7F8F3] border-b border-[#E3E4DA] p-3 text-center">
                    <h4 className="font-semibold text-[#D85A30]">Colorized RGB</h4>
                    <p className="text-xs text-[#5B685F]">100m Resolution • Translated</p>
                  </div>
                  <div className="p-4 flex-grow flex items-center justify-center bg-black">
                    <img src={results.colorized_rgb} alt="Colorized RGB" className="max-w-full h-auto" />
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-[#E3E4DA] overflow-hidden flex flex-col relative">
                  <div className="absolute top-0 right-0 bg-[#7F77DD] text-white text-xs font-bold px-2 py-1 rounded-bl-lg z-10">Output 3</div>
                  <div className="bg-[#F7F8F3] border-b border-[#E3E4DA] p-3 text-center">
                    <h4 className="font-semibold text-[#7F77DD]">Segmentation Map</h4>
                    <p className="text-xs text-[#5B685F]">Classified Terrain</p>
                  </div>
                  <div className="p-4 flex-grow flex items-center justify-center bg-black">
                    <img src={results.segmentation_map} alt="Segmentation Map" className="max-w-full h-auto" />
                  </div>
                </div>
              </div>

              {/* ANALYTICS GRID */}
              {analytics && (
                <div className="mt-8 grid grid-cols-2 gap-6 min-w-[900px] border-t border-[#E3E4DA] pt-6">
                  <div className="bg-[#E1EFD9] border border-[#C9CFC3] rounded-xl p-5 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-white p-2 rounded-lg shadow-sm mr-4">
                        <Leaf className="w-6 h-6 text-[#2C5F3F]" />
                      </div>
                      <span className="font-bold text-[#123D30] text-lg">Vegetation Cover</span>
                    </div>
                    <span className="text-3xl font-black text-[#2C5F3F]">{analytics.vegetation_pct}%</span>
                  </div>
                  
                  <div className="bg-[#DCEEEA] border border-[#C9CFC3] rounded-xl p-5 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-white p-2 rounded-lg shadow-sm mr-4">
                        <Droplets className="w-6 h-6 text-[#0F6E56]" />
                      </div>
                      <span className="font-bold text-[#123D30] text-lg">Water Bodies</span>
                    </div>
                    <span className="text-3xl font-black text-[#0F6E56]">{analytics.water_pct}%</span>
                  </div>

                  <div className="bg-[#EEE7F3] border border-[#C9CFC3] rounded-xl p-5 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-white p-2 rounded-lg shadow-sm mr-4">
                        <Building2 className="w-6 h-6 text-[#5B3A8A]" />
                      </div>
                      <span className="font-bold text-[#123D30] text-lg">Total Buildings</span>
                    </div>
                    <span className="text-3xl font-black text-[#5B3A8A]">{analytics.total_buildings}</span>
                  </div>

                  <div className="bg-[#F3E7D8] border border-[#C9CFC3] rounded-xl p-5 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-white p-2 rounded-lg shadow-sm mr-4">
                        <Route className="w-6 h-6 text-[#8A5A22]" />
                      </div>
                      <span className="font-bold text-[#123D30] text-lg">Road Network</span>
                    </div>
                    <span className="text-3xl font-black text-[#8A5A22]">{analytics.road_length_km} km</span>
                  </div>
                </div>
              )}

              {/* THE NEW COMPARE TOOL */}
              <div className="mt-8 border-t border-[#E3E4DA] pt-8">
                <CompareTool 
                  originalImg={results.original_thermal} 
                  colorizedImg={results.colorized_rgb} 
                />
              </div>

            </div>
          </div>
        )}

        <div className="mt-16 mb-20">
          <h3 className="text-xl font-bold text-[#123D30] mb-6 border-b border-[#E3E4DA] pb-2 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-[#0F6E56]" />
            Previous Analyses Dashboard
          </h3>
          
          <div className="bg-white shadow-sm rounded-xl border border-[#E3E4DA] overflow-hidden">
            <table className="min-w-full divide-y divide-[#E3E4DA]">
              <thead className="bg-[#F7F8F3]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#5B685F] uppercase tracking-wider">File Name</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#5B685F] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#5B685F] uppercase tracking-wider">Vegetation</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#5B685F] uppercase tracking-wider">Water</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#5B685F] uppercase tracking-wider">Buildings</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#5B685F] uppercase tracking-wider">Roads (km)</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#5B685F] uppercase tracking-wider">Process Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#E3E4DA]">
                {history.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-[#5B685F]">
                      No analyses found. Upload a tile to begin.
                    </td>
                  </tr>
                ) : (
                  history.map((log) => (
                    <tr key={log.id} className="hover:bg-[#F7F8F3] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#123D30]">
                        {log.filename}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {log.status === 'Success' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E1EFD9] text-[#2C5F3F]">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Success
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FCEBEB] text-[#791F1F]">
                            <XCircle className="w-3 h-3 mr-1" /> Failed
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#2C5F3F]">
                        {log.vegetation_percent !== null ? `${log.vegetation_percent}%` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#0F6E56]">
                        {log.water_percent !== null ? `${log.water_percent}%` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#5B3A8A]">
                        {log.total_buildings !== null ? log.total_buildings : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#8A5A22]">
                        {log.road_length_km !== null ? log.road_length_km : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5B685F]">
                        {log.processing_time_sec ? `${log.processing_time_sec}s` : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}