import { useState, useRef } from 'react';
import { UploadCloud, FileType, Loader2 } from 'lucide-react';

export default function UploadZone({ onProcessFile, isLoading }) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onProcessFile(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`relative w-full max-w-2xl mx-auto p-8 mt-8 border-2 border-dashed rounded-xl transition-all duration-200 flex flex-col items-center justify-center bg-white ${
        dragActive ? 'border-isroBlue bg-blue-50' : 'border-gray-300 hover:border-gray-400'
      } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".npy,.tif,.tiff"
        onChange={handleChange}
      />
      
      {isLoading ? (
        <div className="flex flex-col items-center text-isroBlue">
          <Loader2 className="w-12 h-12 mb-4 animate-spin" />
          <p className="text-lg font-semibold">Processing via RTX 4070 Engine...</p>
          <p className="text-sm text-gray-500 mt-2">Running dual-branch AI architecture</p>
        </div>
      ) : (
        <div className="flex flex-col items-center text-gray-600">
          <UploadCloud className="w-12 h-12 mb-4 text-gray-400" />
          <p className="text-lg font-semibold mb-1">Drag and drop your satellite tile</p>
          <p className="text-sm text-gray-500 mb-6">Supports .npy and .tif files (200m TIR)</p>
          <button 
            onClick={() => inputRef.current?.click()}
            className="px-6 py-2 bg-isroBlue text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Browse Files
          </button>
        </div>
      )}
    </div>
  );
}