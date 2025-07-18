import { useState } from 'react';
import useTranslation from '../hooks/useTranslation';
import { useToast } from './ToastContext';

export default function PartenaireForm({ onAdd, editingPartenaire, onUpdate, onCancel }) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [form, setForm] = useState({ nom: '', type: 'Public', email: '' });
  const [message, setMessage] = useState('');

  // Mettre à jour le formulaire quand on édite un partenaire
  useEffect(() => {
    if (editingPartenaire) {
      setForm({
        nom: editingPartenaire.nom || '',
        type: editingPartenaire.type || 'Public',
        email: editingPartenaire.email || editingPartenaire.contact || ''
      });
    } else {
      setForm({ nom: '', type: 'Public', email: '' });
    }
  }, [editingPartenaire]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nom) {
      setMessage(t('fillRequiredFields'));
      showToast(t('fillRequiredFields'), 'error');
      return;
    }

    if (editingPartenaire) {
      // Mode édition
      if (onUpdate) onUpdate(form);
      setMessage(t('partnerUpdated'));
    } else {
      // Mode ajout
      if (onAdd) onAdd({ ...form, id: Date.now() });
      setMessage(t('successPartner'));
      showToast(t('successPartner'), 'success');
    }

    setForm({ nom: '', type: 'Public', email: '' });
  };

  return (
    <form className="bg-gray-900 dark:bg-surface rounded-xl shadow-lg p-6 space-y-4 mb-6" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-semibold mb-2">
        {editingPartenaire ? t('editPartner') : t('addPartner')}
      </h2>
      <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">{t('partnerName')}</label>
            <input type="text" className="w-full bg-muted/30 text-gray-300 rounded px-3 py-2" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} required aria-required="true" />
          </div>
          <div>
            <label className="block text-sm mb-1">{t('partnerType')}</label>
            <select className="w-full bg-muted/30 text-gray-300 rounded px-3 py-2" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option value="Public">Public</option>
              <option value="Privé">Privé</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm mb-1">Email</label>
            <input type="email" className="w-full bg-muted/30 text-gray-300 rounded px-3 py-2" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
        </div>
      <div className="flex gap-4 mt-4">
        <button type="button" className="flex-1 bg-[#e6e6e6] hover:bg-[#d0d0d0] text-gray-800 font-semibold py-3 px-6 rounded-lg transition shadow-md min-h-[48px]" onClick={editingPartenaire ? onCancel : () => setForm({ nom: '', type: 'Public', email: '' })}>
          {editingPartenaire ? t('cancel') : t('reset')}
        </button>
        <button type="submit" className="flex-1 bg-[#15514f] hover:bg-[#0f3e3c] text-white font-semibold py-3 px-6 rounded-lg transition shadow-md min-h-[48px]">
          {editingPartenaire ? t('update') : t('save')}
        </button>
      </div>
      {message && (
        <div className={`mt-2 text-center text-sm text-green-400 animate-fade-in`}>{message}</div>
      )}
    </form>
  );
}