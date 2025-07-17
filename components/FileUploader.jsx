import { useRef, useState } from 'react';
import { PaperClipIcon } from '@heroicons/react/24/outline';

export default function FileUploader({ onUpload }) {
  const inputRef = useRef();
  const [dragActive, setDragActive] = useState(false);

  const handleChange = (e) => {
    if (e.target.files?.length > 0) {
      onUpload(Array.from(e.target.files));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length > 0) {
      onUpload(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div
      className={`relative rounded-md border border-dashed p-3 text-sm transition-all 
        ${dragActive ? 'border-primary bg-primary/10' : 'border-gray-500 hover:border-gray-400'}`}
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDragActive(false);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleChange}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex items-center justify-center gap-2 bg-primary text-white text-sm px-3 py-1.5 rounded-md hover:bg-primary-dark transition w-full sm:w-auto"
      >
        <PaperClipIcon className="w-4 h-4" />
        Joindre des fichiers
      </button>

      <p className="text-xs text-gray-400 mt-2 text-center sm:text-left">
        Glissez-déposez ici ou cliquez sur le bouton. Formats supportés : PDF, DOC, XLS, JPG, PNG (max 10 Mo)
      </p>
    </div>
  );
}
