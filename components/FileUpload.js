import { useState } from 'react';
import Image from 'next/image';

const ACCEPTED = {
  'image/png': true,
  'image/jpeg': true,
  'application/pdf': true,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': true, // docx
};

export default function FileUpload({ onFiles, id, 'aria-label': ariaLabel }) {
  const [previews, setPreviews] = useState([]);

  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    setPreviews(files.map(file => ({
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
    })));
    if (onFiles) onFiles(files);
  };

  return (
    <div>
      <input
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,.docx"
        multiple
        onChange={handleChange}
        className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
        id={id}
        aria-label={ariaLabel}
      />
      <div className="mt-4 space-y-2">
        {previews.map((file, idx) => (
          <div key={idx} className="bg-gray-700 p-2 rounded flex items-center gap-3">
            {/* Utilisation de next/image pour optimiser les images */}
            <Image src={file.url} alt={file.name} width={64} height={64} className="w-16 h-16 object-cover rounded" loading="lazy" />
            {file.type === 'application/pdf' ? (
              <embed src={file.url} type="application/pdf" width="60" height="60" className="rounded" />
            ) : file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? (
              <span className="text-blue-300">DOCX</span>
            ) : null}
            <span className="truncate">{file.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
