import { useMemo } from 'react';
import { useMailList } from '../../hooks/useMailList';
import { FiEdit2 } from 'react-icons/fi';

export default function BrouillonsPage() {
  const { mails: arrives } = useMailList('arrive');
  const { mails: departs } = useMailList('depart');
  const brouillons = useMemo(() => [
    ...arrives.filter(m => m.statut === 'Brouillon'),
    ...departs.filter(m => m.statut === 'Brouillon')
  ].sort((a, b) => new Date(b.date) - new Date(a.date)), [arrives, departs]);

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-2 md:px-0">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-6 flex items-center gap-2 bg-gradient-to-r from-primary to-yellow-400 bg-clip-text text-transparent drop-shadow-lg tracking-tight">
        <FiEdit2 className="text-yellow-400" /> Brouillons
      </h1>
      {brouillons.length === 0 ? (
        <div className="text-gray-400">Aucun brouillon pour le moment.</div>
      ) : (
        <table className="w-full text-sm text-left bg-[#181818] rounded-xl shadow-lg">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-3 py-2">N°</th>
              <th className="px-3 py-2">Objet</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Partenaire</th>
              <th className="px-3 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {brouillons.map(mail => (
              <tr key={mail.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                <td className="px-3 py-2">{mail.numero}</td>
                <td className="px-3 py-2">{mail.objet}</td>
                <td className="px-3 py-2">{mail.type || (mail.numero?.startsWith('ARR') ? 'ARRIVE' : 'DEPART')}</td>
                <td className="px-3 py-2">{mail.expediteur || mail.destinataire}</td>
                <td className="px-3 py-2">{mail.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import MailTable from '../../components/MailTable';
import useTranslation from '../../hooks/useTranslation';

function handleRemove(id) {
  if (window.confirm('Êtes-vous sûr de vouloir supprimer ce brouillon ?')) {
    // Supprimer des brouillons localStorage
    const brouillons = JSON.parse(localStorage.getItem('brouillons') || '[]');
    const updatedBrouillons = brouillons.filter(b => b.id !== id);
    localStorage.setItem('brouillons', JSON.stringify(updatedBrouillons));
    window.location.reload();
  }
}

function handleView(mail) {
  alert(`Détails du brouillon:\n\nObjet: ${mail.objet}\nType: ${mail.type}\nDate: ${mail.date}\nStatut: Brouillon`);
}

function handleEdit(mail) {
  // Rediriger vers la page d'édition appropriée selon le type
  const page = mail.type === 'arrive' ? 'courrier-arrive' : 'courrier-depart';
  window.location.href = `/${page}?edit=${mail.id}&draft=true`;
}

export default function Brouillons() {
  const { t } = useTranslation();
  const [brouillons, setBrouillons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger les brouillons depuis localStorage
    const savedBrouillons = JSON.parse(localStorage.getItem('brouillons') || '[]');
    setBrouillons(savedBrouillons);
    setLoading(false);
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Brouillons
          </h1>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {brouillons.length} brouillon(s)
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Chargement...</p>
          </div>
        ) : (
          <MailTable
            mails={brouillons}
            onRemove={handleRemove}
            onView={handleView}
            onEdit={handleEdit}
            emptyMessage="Aucun brouillon trouvé."
          />
        )}
      </div>
    </Layout>
  );
}
