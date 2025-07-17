import { useState } from 'react';

const STATUS_OPTIONS = [
  'En attente',
  'En cours',
  'Traité',
  'Archivé',
  'Rejeté',
  'Nouveau'
];

const STATUS_STYLES = {
  'en attente': 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200',
  'en cours': 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
  'traité': 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
  'archivé': 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
  'rejeté': 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
  'nouveau': 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200'
};

export default function StatusBadge({ 
  status, 
  onStatusChange, 
  disabled = false,
  size = 'sm' 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const currentStatus = status || 'En attente';
  const statusKey = currentStatus.toLowerCase();
  const statusClass = STATUS_STYLES[statusKey] || STATUS_STYLES['en attente'];

  const handleStatusSelect = async (newStatus) => {
    if (newStatus === currentStatus || disabled) return;

    setIsUpdating(true);
    try {
      await onStatusChange(newStatus);
      setIsOpen(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg'
  };

  if (disabled) {
    return (
      <span className={`inline-flex items-center rounded-full font-medium border ${statusClass} ${sizeClasses[size]}`}>
        {currentStatus}
      </span>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isUpdating}
        className={`inline-flex items-center rounded-full font-medium border transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${statusClass} ${sizeClasses[size]} ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
        title="Cliquer pour modifier le statut"
      >
        {isUpdating ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Mise à jour...
          </>
        ) : (
          <>
            {currentStatus}
            <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>

      {isOpen && !isUpdating && (
        <>
          {/* Overlay pour fermer le dropdown */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown menu */}
          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
            {STATUS_OPTIONS.map((option) => {
              const optionKey = option.toLowerCase();
              const optionClass = STATUS_STYLES[optionKey] || STATUS_STYLES['en attente'];
              const isSelected = option === currentStatus;
              
              return (
                <button
                  key={option}
                  onClick={() => handleStatusSelect(option)}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors duration-150 flex items-center justify-between ${isSelected ? 'bg-blue-50' : ''}`}
                >
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${optionClass.replace('hover:bg-', 'bg-').replace(' hover:bg-yellow-200', '').replace(' hover:bg-blue-200', '').replace(' hover:bg-green-200', '').replace(' hover:bg-gray-200', '').replace(' hover:bg-red-200', '').replace(' hover:bg-purple-200', '')}`}>
                    {option}
                  </span>
                  {isSelected && (
                    <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}