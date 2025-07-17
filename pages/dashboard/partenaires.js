import { useState } from 'react';
import Layout from '../../components/Layout';
import useTranslation from '../../hooks/useTranslation';
import { useToast } from '../../components/ToastContext';
import PartenaireForm from '../../components/PartenaireForm';

const MOCK_PARTENAIRES = [
  { id: 1, nom: "Ministère de l'Intérieur", type: 'Public', contact: 'contact@interieur.gouv.fr' },
  { id: 2, nom: 'Ville de Lyon', type: 'Public', contact: 'mairie@lyon.fr' },
  { id: 3, nom: 'Association X', type: 'Privé', contact: 'asso.x@email.com' },
  { id: 4, nom: 'Entreprise Y', type: 'Privé', contact: 'contact@entreprisey.com' },
];

export default function Partenaires() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [partenaires, setPartenaires] = useState(MOCK_PARTENAIRES);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [editingId, setEditingId] = useState(null);

  const handleDelete = (id) => {
    setPartenaires(partenaires.filter(p => p.id !== id));
    showToast(t('partnerDeleted'), 'success');
  };

  const handleEdit = (partenaire) => {
    setEditingId(partenaire.id);
  };

  const handleUpdate = (updatedPartenaire) => {
    setPartenaires(partenaires.map(p => 
      p.id === editingId ? { ...updatedPartenaire, id: editingId } : p
    ));
    setEditingId(null);
    showToast(t('partnerUpdated'), 'success');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const filtered = partenaires.filter(p =>
    (!type || p.type === type) &&
    (!search || p.nom.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Layout>
      <div className="max-w-3xl mx-auto bg-gray-900 dark:bg-surface rounded-xl shadow-lg p-6 space-y-6 animate-fade-in">
        <h2 className="text-2xl font-semibold mb-2">{t('partnersManagement')}</h2>
        <PartenaireForm 
          editingPartenaire={editingId ? partenaires.find(p => p.id === editingId) : null}
          onAdd={p => {
            setPartenaires([...partenaires, { ...p, id: Date.now() }]);
            showToast(t('partnerAdded'), 'success');
          }}
          onUpdate={handleUpdate}
          onCancel={handleCancelEdit}
        />
        <div className="flex flex-col md:flex-row gap-2 md:items-center mt-4">
          <input
            type="text"
            placeholder={t('search')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-muted/30 text-gray-300 rounded px-3 py-2 w-full md:w-1/2"
            aria-label={t('search')}
          />
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="bg-muted/30 text-gray-300 rounded px-3 py-2 w-full md:w-1/4"
            aria-label={t('partnerType')}
          >
            <option value="">{t('allTypes')}</option>
            <option value="Public">{t('public')}</option>
            <option value="Privé">{t('private')}</option>
          </select>
        </div>
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-800">
                <th className="px-3 py-2">{t('name')}</th>
                <th className="px-3 py-2">{t('partnerType')}</th>
                <th className="px-3 py-2">{t('contact')}</th>
                <th className="px-3 py-2">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-gray-400 py-4">{t('noPartnerFound')}</td>
                </tr>
              ) : filtered.map(p => (
                <tr key={p.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                  <td className="px-3 py-2">{p.nom}</td>
                  <td className="px-3 py-2">{t(p.type === 'Public' ? 'public' : 'private')}</td>
                  <td className="px-3 py-2">{p.contact}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="text-blue-400 hover:text-blue-600 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        aria-label={t('editPartner') + ' ' + p.nom}
                      >
                        {t('edit')}
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-400 hover:text-red-600 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                        aria-label={t('deletePartner') + ' ' + p.nom}
                      >
                        {t('delete')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
