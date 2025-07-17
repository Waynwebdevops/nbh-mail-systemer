import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

/**
 * Barre de recherche intelligente avec icône et animation
 * @param {Object} props
 * @param {string} props.placeholder
 * @param {function} props.onSearch
 */
export default function SearchBar({ placeholder = 'Rechercher...', onSearch }) {
  const [value, setValue] = useState('');
  return (
    <div className="relative w-full max-w-xs">
      <input
        type="text"
        className="w-full pl-10 pr-4 py-2 rounded-xl bg-light text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary transition duration-300 ease-in-out shadow"
        placeholder={placeholder}
        value={value}
        onChange={e => {
          setValue(e.target.value);
          onSearch && onSearch(e.target.value);
        }}
      />
      <MagnifyingGlassIcon className="w-5 h-5 text-primary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}
