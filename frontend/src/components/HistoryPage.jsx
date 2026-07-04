import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  Download,
  FileX,
  Loader2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { getHistory } from '../services/api';

// ---------------------------------------------------------------------------
// Design tokens (kept local so this file stays drop-in portable)
// ---------------------------------------------------------------------------
const COLORS = {
  darkGreen: '#123D30',
  brandGreen: '#0F4D3E',
  lightBeige: '#F7F8F3',
  borderGray: '#E3E4DA',
  white: '#FFFFFF',
  textMuted: '#6B7280',
  successBg: '#dcfce7',
  successText: '#166534',
  failedBg: '#fee2e2',
  failedText: '#991b1b',
};

const COLUMN_WIDTHS = {
  id: '5%',
  filename: '25%',
  status: '10%',
  vegetation: '10%',
  water: '10%',
  buildings: '10%',
  roads: '10%',
  processTime: '12%',
  date: '8%',
};

const CSV_HEADERS = [
  'ID',
  'Filename',
  'Status',
  'Vegetation',
  'Water',
  'Buildings',
  'Roads (km)',
  'Process Time',
  'Date',
];

const STATUS_OPTIONS = ['All statuses', 'Success', 'Failed'];

// ---------------------------------------------------------------------------
// Small presentational helpers
// ---------------------------------------------------------------------------

function StatusBadge({ status }) {
  const isSuccess = status === 'Success';
  const isFailed = status === 'Failed';
  const bg = isSuccess ? COLORS.successBg : isFailed ? COLORS.failedBg : '#F3F4F6';
  const text = isSuccess ? COLORS.successText : isFailed ? COLORS.failedText : '#374151';

  return (
    <span
      style={{
        padding: '4px 10px',
        borderRadius: '999px',
        background: bg,
        color: text,
        fontSize: '11px',
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {status || 'Unknown'}
    </span>
  );
}

function EmptyState({ hasFilters, onClearFilters }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 24px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: COLORS.lightBeige,
          border: `1px solid ${COLORS.borderGray}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
        }}
      >
        <FileX size={24} color={COLORS.darkGreen} strokeWidth={1.75} />
      </div>
      <p style={{ fontSize: '14px', fontWeight: 600, color: COLORS.darkGreen, margin: 0 }}>
        {hasFilters ? 'No records match your filters' : 'No processing history yet'}
      </p>
      <p style={{ fontSize: '13px', color: COLORS.textMuted, margin: '6px 0 0', maxWidth: '320px' }}>
        {hasFilters
          ? 'Try a different filename or reset the status filter to see all records.'
          : 'Once you process an image, it will show up here with its analysis results.'}
      </p>
      {hasFilters && (
        <button
          onClick={onClearFilters}
          style={{
            marginTop: '16px',
            padding: '8px 16px',
            borderRadius: '999px',
            background: 'transparent',
            color: COLORS.brandGreen,
            border: `1px solid ${COLORS.brandGreen}`,
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 24px',
      }}
    >
      <Loader2 size={28} color={COLORS.brandGreen} style={{ animation: 'spin 1s linear infinite' }} />
      <p style={{ fontSize: '13px', color: COLORS.textMuted, marginTop: '12px' }}>
        Loading history...
      </p>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 24px',
        textAlign: 'center',
      }}
    >
      <AlertTriangle size={28} color="#B45309" strokeWidth={1.75} />
      <p style={{ fontSize: '14px', fontWeight: 600, color: COLORS.darkGreen, margin: '12px 0 4px' }}>
        Couldn't load history
      </p>
      <p style={{ fontSize: '13px', color: COLORS.textMuted, margin: 0, maxWidth: '320px' }}>
        {message || 'Something went wrong while fetching your processing history.'}
      </p>
      <button
        onClick={onRetry}
        style={{
          marginTop: '16px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 16px',
          borderRadius: '999px',
          background: COLORS.brandGreen,
          color: COLORS.white,
          border: 'none',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 600,
        }}
      >
        <RefreshCw size={14} />
        Try again
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * HistoryPage
 *
 * Displays processing history for satellite imagery jobs, with search,
 * status filtering, and CSV export. Data can be supplied via the
 * `historyLogs` prop (controlled usage) or fetched internally via
 * `getHistory()` when no prop is passed (standalone usage).
 */
export default function HistoryPage({ historyLogs, isLoading: isLoadingProp }) {
  const isControlled = historyLogs !== undefined;

  const [internalLogs, setInternalLogs] = useState([]);
  const [internalLoading, setInternalLoading] = useState(!isControlled);
  const [fetchError, setFetchError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All statuses');

  const fetchHistory = useCallback(async () => {
    setInternalLoading(true);
    setFetchError(null);
    try {
      const response = await getHistory();
      // API may return a raw array or an object shaped like { history: [...] }
      const rows = Array.isArray(response) ? response : response?.history;
      setInternalLogs(Array.isArray(rows) ? rows : []);
    } catch (err) {
      setFetchError(err?.message || 'Unable to reach the server.');
      setInternalLogs([]);
    } finally {
      setInternalLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isControlled) {
      fetchHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isControlled]);

  // Always coerce to an array so a bad prop/response can never crash the render.
  const safeLogs = useMemo(() => {
    const source = isControlled ? historyLogs : internalLogs;
    return Array.isArray(source) ? source : [];
  }, [isControlled, historyLogs, internalLogs]);

  const isLoading = isControlled ? Boolean(isLoadingProp) : internalLoading;

  const hasActiveFilters = searchTerm.trim().length > 0 || statusFilter !== 'All statuses';

  const filteredData = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return safeLogs.filter((log) => {
      const filename = log?.filename?.toLowerCase?.() || '';
      const matchesSearch = term === '' || filename.includes(term);
      const matchesStatus = statusFilter === 'All statuses' || log?.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [safeLogs, searchTerm, statusFilter]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('All statuses');
  }, []);

  const handleDownloadCSV = useCallback(() => {
    if (filteredData.length === 0) return;

    const escapeCsvField = (value) => {
      const str = String(value ?? '-');
      // Escape values that contain commas, quotes, or newlines per CSV spec.
      if (/[",\n]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvRows = filteredData.map((log) => [
      escapeCsvField(log?.id ?? '-'),
      escapeCsvField(log?.filename || 'Unknown'),
      escapeCsvField(log?.status || '-'),
      escapeCsvField(log?.vegetation_percent != null ? `${log.vegetation_percent}%` : '-'),
      escapeCsvField(log?.water_percent != null ? `${log.water_percent}%` : '-'),
      escapeCsvField(log?.total_buildings ?? '-'),
      escapeCsvField(log?.road_length_km ?? '-'),
      escapeCsvField(log?.processing_time_sec != null ? `${log.processing_time_sec}s` : '-'),
      escapeCsvField(log?.timestamp ? `="${new Date(log.timestamp).toLocaleDateString()}"` : '-'),
    ]);

    const csvContent = [CSV_HEADERS.join(','), ...csvRows.map((row) => row.join(','))].join('\n');

    try {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `History_Report_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // Exporting should never crash the page; surface it quietly instead.
      console.error('CSV export failed:', err);
    }
  }, [filteredData]);

  const thStyle = {
    padding: '12px',
    fontSize: '12px',
    fontWeight: 600,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
  };

  const tdStyle = { padding: '12px', fontSize: '13px', color: '#1F2937' };

  return (
    <div
      style={{
        background: COLORS.lightBeige,
        padding: '28px',
        borderRadius: '16px',
        border: `1px solid ${COLORS.borderGray}`,
        fontFamily: 'Arial, sans-serif',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: COLORS.darkGreen,
              fontFamily: 'Georgia, serif',
              margin: 0,
            }}
          >
            History
          </h1>
          <p style={{ fontSize: '13px', color: COLORS.textMuted, margin: '4px 0 0' }}>
            {safeLogs.length} {safeLogs.length === 1 ? 'record' : 'records'} processed
          </p>
        </div>
        <button
          onClick={handleDownloadCSV}
          disabled={filteredData.length === 0}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 18px',
            borderRadius: '999px',
            background: filteredData.length === 0 ? '#9CA3AF' : COLORS.brandGreen,
            color: COLORS.white,
            border: 'none',
            cursor: filteredData.length === 0 ? 'not-allowed' : 'pointer',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          <Download size={14} />
          Download CSV
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 220px' }}>
          <Search
            size={15}
            color={COLORS.textMuted}
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            value={searchTerm}
            placeholder="Search files..."
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 34px',
              borderRadius: '8px',
              border: `1px solid ${COLORS.borderGray}`,
              fontSize: '13px',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '10px 12px',
            borderRadius: '8px',
            border: `1px solid ${COLORS.borderGray}`,
            fontSize: '13px',
            background: COLORS.white,
          }}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Table / states */}
      <div
        style={{
          background: COLORS.white,
          borderRadius: '14px',
          border: `1px solid ${COLORS.borderGray}`,
          overflow: 'hidden',
        }}
      >
        {isLoading ? (
          <LoadingState />
        ) : fetchError && !isControlled ? (
          <ErrorState message={fetchError} onRetry={fetchHistory} />
        ) : filteredData.length === 0 ? (
          <EmptyState hasFilters={hasActiveFilters} onClearFilters={handleClearFilters} />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '760px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead style={{ background: '#F9FAFB' }}>
                <tr>
                  <th style={{ ...thStyle, width: COLUMN_WIDTHS.id }}>ID</th>
                  <th style={{ ...thStyle, width: COLUMN_WIDTHS.filename }}>Filename</th>
                  <th style={{ ...thStyle, width: COLUMN_WIDTHS.status }}>Status</th>
                  <th style={{ ...thStyle, width: COLUMN_WIDTHS.vegetation }}>Vegetation</th>
                  <th style={{ ...thStyle, width: COLUMN_WIDTHS.water }}>Water</th>
                  <th style={{ ...thStyle, width: COLUMN_WIDTHS.buildings }}>Buildings</th>
                  <th style={{ ...thStyle, width: COLUMN_WIDTHS.roads }}>Roads (km)</th>
                  <th style={{ ...thStyle, width: COLUMN_WIDTHS.processTime }}>Process Time</th>
                  <th style={{ ...thStyle, width: COLUMN_WIDTHS.date }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((log, index) => (
                  <tr key={log?.id ?? `row-${index}`} style={{ borderTop: `1px solid #EEEEEE` }}>
                    <td style={tdStyle}>#{log?.id ?? '-'}</td>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{log?.filename || 'Unknown'}</td>
                    <td style={tdStyle}>
                      <StatusBadge status={log?.status} />
                    </td>
                    <td style={tdStyle}>
                      {log?.vegetation_percent != null ? `${log.vegetation_percent}%` : '-'}
                    </td>
                    <td style={tdStyle}>{log?.water_percent != null ? `${log.water_percent}%` : '-'}</td>
                    <td style={tdStyle}>{log?.total_buildings ?? '-'}</td>
                    <td style={tdStyle}>{log?.road_length_km ?? '-'}</td>
                    <td style={tdStyle}>
                      {log?.processing_time_sec != null ? `${log.processing_time_sec}s` : '-'}
                    </td>
                    <td style={tdStyle}>
                      {log?.timestamp ? new Date(log.timestamp).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}