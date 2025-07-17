import { useState } from 'react';
import CourrierForm from './CourrierForm.jsx';
import MailTable from './MailTable';
import { useToast } from './ToastContext';
import AddCourierButton from './AddCourierButton';
import { useMailList } from '../hooks/useMailList';

export default function CourrierDepartForm() {
  const [showForm, setShowForm] = useState(false);
  const [editingCourrier, setEditingCourrier] = useState(null);
  const { addToast } = useToast();

  // Utiliser le hook useMailList pour la gestion complète
  const { mails, loading, addMail, updateMail, deleteMail } = useMailList('depart');

  const handleAddCourrier = (newCourrier) => {
    addMail(newCourrier);
    setShowForm(false);
    setEditingCourrier(null);
    addToast('Courrier ajouté avec succès', 'success');
  };

  const handleEditCourrier = (courrier) => {
    setEditingCourrier(courrier);
    setShowForm(true);
  };

  const handleUpdateCourrier = (updatedCourrier) => {
    updateMail(updatedCourrier.id, updatedCourrier);
    setShowForm(false);
    setEditingCourrier(null);
    addToast('Courrier modifié avec succès', 'success');
  };

  const handleDeleteCourrier = (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce courrier ?')) return;

    deleteMail(id);
    addToast('Courrier supprimé avec succès', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Courriers Départ</h1>
        <AddCourierButton 
          onClick={() => {
            setEditingCourrier(null);
            setShowForm(true);
          }} 
          open={showForm} 
        />
      </div>

      {showForm && (
        <CourrierForm
          type="DEPART"
          initialValues={editingCourrier}
          onAddMail={editingCourrier ? handleUpdateCourrier : handleAddCourrier}
          onClose={() => {
            setShowForm(false);
            setEditingCourrier(null);
          }}
        />
      )}

      <div className="bg-white rounded-lg shadow">
        <MailTable
          mails={mails}
          onEdit={handleEditCourrier}
          onDelete={handleDeleteCourrier}
          loading={loading}
        />
      </div>
    </div>
  );
}