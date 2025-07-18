import { useState } from 'react';
import StatusBadge from './StatusBadge';
import { useToast } from './ToastContainer';

export default function CourrierDetailModal({ 
  courrier, 
  onClose, 
  onStatusUpdate,
  type = 'ARRIVE' 
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { addToast } = useToast();

  if (!courrier) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifiée';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    try {
      await onStatusUpdate(courrier.id, newStatus);
      addToast(`✅ Statut mis à jour : ${newStatus}`, 'success');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      addToast('❌ Erreur lors de la mise à jour du statut', 'error');
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const renderFiles = (files) => {
    if (!files || files.length === 0) return null;
    
    try {
      const fileList = typeof files === 'string' ? JSON.parse(files) : files;
      if (!Array.isArray(fileList) || fileList.length === 0) return null;

      return (
        <div className="mb-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-green-800 mb-3">
              📎 Fichiers joints ({fileList.length})
            </label>
            <div className="space-y-2">
              {fileList.map((fichier, index) => (
                <div key={index} className="flex items-center gap-3 bg-white rounded-lg p-3 border border-green-200">
                  <span className="text-green-600">📄</span>
                  <span className="text-green-900 font-medium flex-1">
                    {fichier.name || fichier}
                  </span>
                  {fichier.size && (
                    <span className="text-green-600 text-sm">
                      ({Math.round(fichier.size / 1024)} KB)
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    } catch (error) {
      console.error('Erreur lors du parsing des fichiers:', error);
      return null;
    }
  };

  const icon = type === 'ARRIVE' ? '📥' : '📤';
  const title = type === 'ARRIVE' ? 'Détail du courrier arrivé' : 'Détail du courrier départ';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn p-4">
      <div className="w-full max-w-2xl mx-auto max-h-[90vh] bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200 relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#15514f] to-[#0f3e3c] px-6 py-4 relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors text-2xl font-light"
            aria-label="Fermer"
          >
            ✕
          </button>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{icon}</span>
            <div>
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <p className="text-white/80 text-sm">N° {courrier.numero || 'Non attribué'}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Statut modifiable */}
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Statut du courrier</h3>
            <StatusBadge
              status={courrier.statut}
              onStatusChange={handleStatusChange}
              disabled={isUpdating}
              size="md"
            />
          </div>

          {/* Informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Expéditeur */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📤 Expéditeur
              </label>
              <p className="text-gray-900 font-medium">{courrier.expediteur || 'Non spécifié'}</p>
            </div>

            {/* Destinataire */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📨 Destinataire
              </label>
              <p className="text-gray-900 font-medium">{courrier.destinataire || 'Non spécifié'}</p>
            </div>

            {/* Date */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📅 Date de {type === 'ARRIVE' ? 'réception' : 'envoi'}
              </label>
              <p className="text-gray-900 font-medium">
                {formatDate(courrier.dateReception || courrier.date)}
              </p>
            </div>

            {/* Canal */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📡 Canal de {type === 'ARRIVE' ? 'réception' : 'envoi'}
              </label>
              <p className="text-gray-900 font-medium">{courrier.canal || 'Non spécifié'}</p>
            </div>
          </div>

          {/* Objet */}
          {courrier.objet && (
            <div className="mb-4">
              <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4">
                <label className="block text-sm font-medium text-blue-800 mb-2">
                  📝 Objet
                </label>
                <p className="text-blue-900 leading-relaxed">{courrier.objet}</p>
              </div>
            </div>
          )}

          {/* Référence */}
          {courrier.reference && (
            <div className="mb-4">
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <label className="block text-sm font-medium text-amber-800 mb-2">
                  🔖 Référence
                </label>
                <p className="text-amber-900 font-mono text-sm bg-white px-3 py-2 rounded border">
                  {courrier.reference}
                </p>
              </div>
            </div>
          )}

          {/* Délai */}
          {courrier.delai && (
            <div className="mb-4">
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <label className="block text-sm font-medium text-orange-800 mb-2">
                  ⏰ Délai de réponse
                </label>
                <p className="text-orange-900 font-medium">
                  {courrier.delai}
                </p>
              </div>
            </div>
          )}

          {/* Observations */}
          {courrier.observations && (
            <div className="mb-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-purple-800 mb-2">
                  💭 Observations
                </label>
                <p className="text-purple-900 leading-relaxed whitespace-pre-wrap">
                  {courrier.observations}
                </p>
              </div>
            </div>
          )}

          {/* Fichiers joints */}
          {renderFiles(courrier.fichiers || courrier.files)}

          {/* Métadonnées */}
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="text-center">
                <span className="block font-medium">Date de création</span>
                <span>{formatDate(courrier.createdAt)}</span>
              </div>
              <div className="text-center">
                <span className="block font-medium">Dernière modification</span>
                <span>{formatDate(courrier.updatedAt)}</span>
              </div>
              <div className="text-center">
                <span className="block font-medium">ID</span>
                <span className="font-mono">{courrier.id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#15514f] text-white rounded-lg hover:bg-[#0f3e3c] transition-colors font-medium"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}