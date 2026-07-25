import React, { useState, useMemo } from 'react';

// Mock data to simulate a populated database
const initialDatasets = [
  { id: 'DS-001', name: 'Delhi NCR Urban Sprawl', type: 'Training', source: 'Landsat-8', size: '4.2 GB', files: 124, date: '2026-06-12', color: '#7F77DD' },
  { id: 'DS-002', name: 'Sundarbans Mangrove Multi-spectral', type: 'Raw Imagery', source: 'Sentinel-2', size: '12.8 GB', files: 310, date: '2026-06-28', color: '#3B7A5A' },
  { id: 'DS-003', name: 'Thermal Signatures - Industrial', type: 'Evaluation', source: 'Custom (Drone)', size: '850 MB', files: 45, date: '2026-07-01', color: '#D85A30' },
  { id: 'DS-004', name: 'Mumbai Coastline Water Bodies', type: 'Training', source: 'Landsat-8', size: '3.1 GB', files: 98, date: '2026-07-02', color: '#378ADD' },
  { id: 'DS-005', name: 'Global Cloud Cover Masking', type: 'Public', source: 'Google Earth Engine', size: 'Cloud (API)', files: '-', date: '2026-07-03', color: '#8FBFA0' },
];

export default function DatasetsPage() {
  const [datasets] = useState(initialDatasets);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All types');

  // Filter logic
  const filteredDatasets = useMemo(() => {
    return datasets.filter(ds => {
      const matchesSearch = ds.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'All types' || ds.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [datasets, searchQuery, filterType]);

  // Storage calculation (Mock)
  const storageUsed = 20.95; 
  const storageTotal = 100;
  const storagePercent = (storageUsed / storageTotal) * 100;

  return (
    <div style={{ background: '#F7F8F3', fontFamily: "Georgia, 'Times New Roman', serif", color: '#1F2E29', width: '100%', padding: '28px 36px', borderRadius: '16px', border: '1px solid #E3E4DA', boxSizing: 'border-box' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 4px', color: '#123D30' }}>Datasets Library</h1>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#5B685F', margin: 0 }}>Manage your training, evaluation, and raw satellite data.</p>
        </div>
        <button style={{ padding: '10px 18px', borderRadius: '999px', border: 'none', background: '#0F4D3E', color: '#F7F8F3', fontFamily: 'Arial, sans-serif', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <i className="ti ti-plus" style={{ fontSize: '14px' }}></i> Import Dataset
        </button>
      </div>

      {/* STORAGE METRICS */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E3E4DA', borderRadius: '14px', padding: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#EFF9F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className="ti ti-database" style={{ color: '#0F6E56', fontSize: '24px' }}></i>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Arial, sans-serif', fontSize: '13px', fontWeight: 600, color: '#123D30', marginBottom: '8px' }}>
            <span>Workspace Storage</span>
            <span>{storageUsed} GB / {storageTotal} GB</span>
          </div>
          <div style={{ height: '8px', borderRadius: '999px', background: '#EFF0E8', overflow: 'hidden' }}>
            <div style={{ width: `${storagePercent}%`, height: '100%', background: storagePercent > 80 ? '#D85A30' : '#0F6E56', borderRadius: '999px' }}></div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px', paddingLeft: '24px', borderLeft: '1px solid #E3E4DA', fontFamily: 'Arial, sans-serif' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#123D30' }}>{datasets.length}</div>
            <div style={{ fontSize: '11px', color: '#5B685F' }}>Total Datasets</div>
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#123D30' }}>577</div>
            <div style={{ fontSize: '11px', color: '#5B685F' }}>Total Files</div>
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '10px', flex: 1, maxWidth: '500px' }}>
          <input 
            placeholder="Search datasets..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid #D7DCCB', fontFamily: 'Arial, sans-serif', fontSize: '13px', outline: 'none', flex: 1 }} 
          />
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid #D7DCCB', fontFamily: 'Arial, sans-serif', fontSize: '13px', outline: 'none', background: '#FFFFFF' }}
          >
            <option>All types</option>
            <option>Training</option>
            <option>Evaluation</option>
            <option>Raw Imagery</option>
            <option>Public</option>
          </select>
        </div>
        
        {/* VIEW TOGGLE */}
        <div style={{ display: 'flex', background: '#FFFFFF', border: '1px solid #E3E4DA', borderRadius: '8px', overflow: 'hidden' }}>
          <button 
            onClick={() => setViewMode('grid')}
            style={{ padding: '8px 12px', background: viewMode === 'grid' ? '#EFF2E6' : 'transparent', border: 'none', color: viewMode === 'grid' ? '#123D30' : '#8B8B7E', cursor: 'pointer' }}
          >
            <i className="ti ti-layout-grid" style={{ fontSize: '16px' }}></i>
          </button>
          <div style={{ width: '1px', background: '#E3E4DA' }}></div>
          <button 
            onClick={() => setViewMode('list')}
            style={{ padding: '8px 12px', background: viewMode === 'list' ? '#EFF2E6' : 'transparent', border: 'none', color: viewMode === 'list' ? '#123D30' : '#8B8B7E', cursor: 'pointer' }}
          >
            <i className="ti ti-list" style={{ fontSize: '16px' }}></i>
          </button>
        </div>
      </div>

      {/* CONTENT AREA */}
      {filteredDatasets.length === 0 ? (
        <div style={{ padding: '60px', textAlign: 'center', background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E3E4DA', fontFamily: 'Arial, sans-serif' }}>
          <div style={{ color: '#5B685F', marginBottom: '8px' }}>No datasets found matching your criteria.</div>
          <button onClick={() => {setSearchQuery(''); setFilterType('All types');}} style={{ background: 'transparent', border: 'none', color: '#0F6E56', cursor: 'pointer', fontWeight: 600 }}>Clear Filters</button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {filteredDatasets.map(ds => (
            <div key={ds.id} style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E3E4DA', padding: '20px', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s, boxShadow 0.2s' }} onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'} onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: `${ds.color}20`, color: ds.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="ti ti-folder" style={{ fontSize: '20px' }}></i>
                </div>
                <button style={{ background: 'transparent', border: 'none', color: '#8B8B7E', cursor: 'pointer' }}><i className="ti ti-dots-vertical"></i></button>
              </div>
              <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '15px', fontWeight: 700, color: '#123D30', marginBottom: '6px' }}>{ds.name}</div>
              <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#5B685F', marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ padding: '2px 8px', borderRadius: '4px', background: '#EFF0E8', color: '#3E4A44', fontWeight: 600 }}>{ds.type}</span>
                <span>{ds.source}</span>
              </div>
              <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #EFF0E8', display: 'flex', justifyContent: 'space-between', fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#8B8B7E' }}>
                <span>{ds.size} &middot; {ds.files} files</span>
                <span>{new Date(ds.date).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E3E4DA', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Arial, sans-serif', fontSize: '13px', textAlign: 'left' }}>
            <thead style={{ background: '#F9FAFB' }}>
              <tr>
                <th style={{ padding: '12px 20px', color: '#5B685F', fontWeight: 600 }}>Name</th>
                <th style={{ padding: '12px 20px', color: '#5B685F', fontWeight: 600 }}>Type</th>
                <th style={{ padding: '12px 20px', color: '#5B685F', fontWeight: 600 }}>Source</th>
                <th style={{ padding: '12px 20px', color: '#5B685F', fontWeight: 600 }}>Size</th>
                <th style={{ padding: '12px 20px', color: '#5B685F', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '12px 20px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredDatasets.map(ds => (
                <tr key={ds.id} style={{ borderTop: '1px solid #EFF0E8' }}>
                  <td style={{ padding: '16px 20px', fontWeight: 600, color: '#123D30', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: ds.color }}></div>
                    {ds.name}
                  </td>
                  <td style={{ padding: '16px 20px' }}><span style={{ padding: '4px 8px', borderRadius: '4px', background: '#EFF0E8', color: '#3E4A44', fontSize: '11px', fontWeight: 600 }}>{ds.type}</span></td>
                  <td style={{ padding: '16px 20px', color: '#5B685F' }}>{ds.source}</td>
                  <td style={{ padding: '16px 20px', color: '#5B685F' }}>{ds.size}</td>
                  <td style={{ padding: '16px 20px', color: '#5B685F' }}>{new Date(ds.date).toLocaleDateString()}</td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <button style={{ background: 'transparent', border: 'none', color: '#8B8B7E', cursor: 'pointer' }}><i className="ti ti-dots"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}