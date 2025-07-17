
import { useState, useRef, useEffect } from 'react';
import CourrierForm from '../components/CourrierForm.jsx';
import MailTable from '../components/MailTable';
import { useToast } from '../components/ToastContext';
import { useMailList } from '../hooks/useMailList';
import MailModal from '../components/MailModal';

function MailDetailModal({ mail, onClose, updateMail }) {
  if (!mail) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifiée';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'nouveau': 'bg-blue-100 text-blue-800 border-blue-200',
      'en cours': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'envoyé': 'bg-green-100 text-green-800 border-green-200',
      'traité': 'bg-green-100 text-green-800 border-green-200',
      'archivé': 'bg-gray-100 text-gray-800 border-gray-200',
      'brouillon': 'bg-orange-100 text-orange-800 border-orange-200'
    };

    const className = statusClasses[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${className}`}>
        {status || 'Non défini'}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn p-4">
      <div className="w-full max-w-lg mx-auto max-h-[85vh] bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200 relative">
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
            <span className="text-3xl">📤</span>
            <div>
              <h2 className="text-xl font-bold text-white">Détail du courrier départ</h2>
              <p className="text-white/80 text-sm">N° {mail.numero || 'Non attribué'}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Statut */}
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Statut du courrier</h3>
            {getStatusBadge(mail.statut)}
          </div>

          {/* Informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Destinataire */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📨 Destinataire
              </label>
              <p className="text-gray-900 font-medium">{mail.destinataire || 'Non spécifié'}</p>
            </div>

            {/* Date d'envoi */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📅 Date d'envoi
              </label>
              <p className="text-gray-900 font-medium">{formatDate(mail.dateEnvoi || mail.date)}</p>
            </div>

            {/* Canal */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📡 Canal d'envoi
              </label>
              <p className="text-gray-900 font-medium">{mail.canal || 'Non spécifié'}</p>
            </div>

            {/* Expéditeur */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📤 Expéditeur
              </label>
              <p className="text-gray-900 font-medium">{mail.expediteur || 'Non spécifié'}</p>
            </div>
          </div>

          {/* Objet */}
          {mail.objet && (
            <div className="mb-6">
              <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4">
                <label className="block text-sm font-medium text-blue-800 mb-2">
                  📝 Objet
                </label>
                <p className="text-blue-900 leading-relaxed">{mail.objet}</p>
              </div>
            </div>
          )}

          {/* Référence */}
          {mail.reference && (
            <div className="mb-6">
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <label className="block text-sm font-medium text-amber-800 mb-2">
                  🔖 Référence
                </label>
                <p className="text-amber-900 font-mono text-sm bg-white px-3 py-2 rounded border">
                  {mail.reference}
                </p>
              </div>
            </div>
          )}

          {/* Observations */}
          {mail.observations && (
            <div className="mb-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-purple-800 mb-2">
                  💭 Observations
                </label>
                <p className="text-purple-900 leading-relaxed whitespace-pre-wrap">
                  {mail.observations}
                </p>
              </div>
            </div>
          )}

          {/* Fichiers joints */}
          {mail.fichiers && Array.isArray(mail.fichiers) && mail.fichiers.length > 0 && (
            <div className="mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-green-800 mb-3">
                  📎 Fichiers joints ({mail.fichiers.length})
                </label>
                <div className="space-y-2">
                  {mail.fichiers.map((fichier, index) => (
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
          )}

          {/* Métadonnées */}
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="text-center">
                <span className="block font-medium">Date de création</span>
                <span>{new Date(mail.createdAt || Date.now()).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="text-center">
                <span className="block font-medium">Dernière modification</span>
                <span>{new Date(mail.updatedAt || Date.now()).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="text-center">
                <span className="block font-medium">ID</span>
                <span className="font-mono">{mail.id}</span>
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

export default function CourrierDepart() {
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef(null);
  const [search, setSearch] = useState('');
  const { addToast } = useToast();
  const containerRef = useRef(null);
  const [selectedMail, setSelectedMail] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [lastAddedId, setLastAddedId] = useState(null);

  // Utiliser le hook useMailList pour gérer les données localement
  const { mails, loading, addMail, deleteMail, updateMail, updateStatus } = useMailList('depart');

  // Ajouter un courrier
  const handleAddMail = async (mail) => {
    try {
      const newMail = await addMail(mail);
      setLastAddedId(newMail.id);
      setShowForm(false);
      addToast('Nouveau courrier ajouté avec succès !', 'success');
    } catch (error) {
      console.error('Erreur ajout courrier:', error);
      addToast("Erreur lors de l'enregistrement du courrier", 'error');
    }
  };

  // Supprimer un courrier
  const handleRemove = async (id) => {
    try {
      await deleteMail(id);
      addToast('Courrier supprimé.', 'success');
    } catch (error) {
      console.error('Erreur suppression courrier:', error);
      addToast("Erreur lors de la suppression", 'error');
    }
  };

  const handleView = (mail) => {
    setSelectedMail(mail);
    setModalType('view');
  };

  const handleEdit = (mail) => {
    setSelectedMail(mail);
    setModalType('edit');
  };

  const handleCloseModal = () => {
    setSelectedMail(null);
    setModalType(null);
  };

  const handleUpdateMail = async (updatedMail) => {
    try {
      await updateMail(updatedMail.id, updatedMail);
      addToast('Courrier modifié.', 'success');
      handleCloseModal();
    } catch (error) {
      console.error('Erreur modification courrier:', error);
      addToast('Erreur lors de la modification', 'error');
    }
  };

  const filteredMails = mails.filter(mail => {
    const q = search.toLowerCase();
    return (
      (mail.objet || '').toLowerCase().includes(q) ||
      (mail.destinataire || '').toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Chargement des courriers...</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-[100dvh] flex flex-col bg-main text-main">
      {/* Titre avec logo */}
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-2xl font-bold text-[#15514f] flex items-center gap-3">
          <span className="text-3xl">📤</span>
          Courrier Départ
        </h1>
      </div>

      {/* Barre d'outils */}
      <div className="flex items-center gap-4 mb-4 px-4">
        <input
          type="text"
          placeholder="Rechercher par objet, destinataire..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-3 bg-[#FCFCFC] border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#15514f] shadow-sm"
        />
        <select className="px-4 py-3 bg-[#FCFCFC] border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#15514f] shadow-sm min-w-[140px]">
          <option value="">Trier par</option>
          <option value="date">Date</option>
          <option value="destinataire">Destinataire</option>
          <option value="objet">Objet</option>
          <option value="statut">Statut</option>
        </select>
        <button
          onClick={() => setShowForm(f => !f)}
          className="px-6 py-3 bg-[#15514f] text-white rounded-lg hover:bg-[#0f3e3c] transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm"
        >
          <span>➕</span>
          Ajouter un nouveau courrier départ
        </button>
      </div>

      {/* Formulaire ajout */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2">
          <div className="w-full max-w-md bg-[#FCFCFC] rounded-xl shadow-lg overflow-y-auto border border-primary" style={{ minHeight: '250px', maxHeight: '80vh' }}>
            <div tabIndex={-1} ref={formRef} aria-label="Formulaire d'ajout de courrier" className="p-3">
              <CourrierForm
                type="DEPART"
                onClose={() => setShowForm(false)}
                onAddMail={handleAddMail}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modales */}
      {modalType === 'view' && selectedMail && (
        <MailModal 
          mail={selectedMail} 
          onClose={handleCloseModal} 
          updateMail={updateMail}
          updateStatus={updateStatus}
        />
      )}

      {modalType === 'edit' && selectedMail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md mx-auto max-h-[90vh] bg-[#FCFCFC] rounded-xl shadow-lg p-4 overflow-y-auto border border-primary relative" style={{ minHeight: '320px' }}>
            <button onClick={handleCloseModal} className="absolute top-2 right-2 text-gray-600 hover:text-primary text-xl">✕</button>
            <h2 className="text-lg font-bold mb-4 text-primary">Éditer le courrier</h2>
            <CourrierForm
              type="DEPART"
              onClose={handleCloseModal}
              onAddMail={handleUpdateMail}
              initialValues={selectedMail}
            />
          </div>
        </div>
      )}

      {/* Tableau */}
      <div className="flex-1 min-h-0 overflow-y-auto px-2 pb-4">
        <MailTable
          mails={filteredMails}
          onRemove={handleRemove}
          search={search}
          setSearch={setSearch}
          onView={handleView}
          onEdit={handleEdit}
          lastAddedId={lastAddedId}
          updateStatus={updateStatus}
        />
      </div>
    </div>
  );
}
