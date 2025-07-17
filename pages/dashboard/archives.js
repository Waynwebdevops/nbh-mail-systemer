import Layout from '../../components/Layout';
import MailToolbar from '../../components/MailToolbar';
import dynamic from 'next/dynamic';
import { useState, useMemo } from 'react';
import { FiArchive } from 'react-icons/fi';
import { useMailList } from '../../hooks/useMailList';

const MailTable = dynamic(() => import('../../components/MailTable'), { ssr: false, loading: () => <div className="text-center py-8 text-gray-400">Chargement du tableau...</div> });

export default function Archives() {
  const { mails: arrives } = useMailList('arrive');
  const { mails: departs } = useMailList('depart');
  const [search, setSearch] = useState('');
  const archives = useMemo(() => [
    ...arrives.filter(m => m.statut === 'Archivé'),
    ...departs.filter(m => m.statut === 'Archivé')
  ].filter(mail =>
    (!search || (mail.objet || '').toLowerCase().includes(search.toLowerCase()))
  ).sort((a, b) => new Date(b.date) - new Date(a.date)), [arrives, departs, search]);

  return (
    <Layout>
      <div className="w-full max-w-4xl mx-auto py-6 px-2 md:px-0">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-6 flex items-center gap-2 bg-gradient-to-r from-primary to-indigo-700 bg-clip-text text-transparent drop-shadow-lg tracking-tight">
          <FiArchive className="text-indigo-400" /> Archives
        </h1>
        <input
          type="text"
          className="w-full mb-4 px-4 py-2 rounded-lg bg-gray-800/80 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary shadow-inner backdrop-blur-md transition-all duration-200 text-sm"
          placeholder="Rechercher par objet..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Rechercher une archive"
        />
        {archives.length === 0 ? (
          <div className="text-gray-400">Aucune archive pour le moment.</div>
        ) : (
          <MailTable mails={archives} />
        )}
      </div>
    </Layout>
  );
}
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import MailTable from '../../components/MailTable';
import useTranslation from '../../hooks/useTranslation';

function handleRemove(id) {
  if (window.confirm('Êtes-vous sûr de vouloir supprimer définitivement cette archive ?')) {
    // Supprimer des archives localStorage
    const archives = JSON.parse(localStorage.getItem('archives') || '[]');
    const updatedArchives = archives.filter(a => a.id !== id);
    localStorage.setItem('archives', JSON.stringify(updatedArchives));
    window.location.reload();
  }
}

function handleView(mail) {
  alert(`Détails de l'archive:\n\nObjet: ${mail.objet}\nType: ${mail.type}\nDate: ${mail.date}\nStatut: Archivé`);
}

function handleEdit(mail) {
  // Les archives ne peuvent pas être éditées directement
  alert('Les courriers archivés ne peuvent pas être modifiés. Vous devez d\'abord les restaurer.');
}

function handleRestore(mail) {
  if (window.confirm('Voulez-vous restaurer ce courrier depuis les archives ?')) {
    // Supprimer des archives
    const archives = JSON.parse(localStorage.getItem('archives') || '[]');
    const updatedArchives = archives.filter(a => a.id !== mail.id);
    localStorage.setItem('archives', JSON.stringify(updatedArchives));

    // Restaurer dans la liste appropriée
    const key = mail.type === 'arrive' ? 'courriers-arrive' : 'courriers-depart';
    const courriers = JSON.parse(localStorage.getItem(key) || '[]');
    courriers.push({ ...mail, statut: 'Actif' });
    localStorage.setItem(key, JSON.stringify(courriers));

    window.location.reload();
  }
}

export default function Archives() {
  const { t } = useTranslation();
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger les archives depuis localStorage
    const savedArchives = JSON.parse(localStorage.getItem('archives') || '[]');
    setArchives(savedArchives);
    setLoading(false);
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Archives
          </h1>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {archives.length} archive(s)
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Chargement...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {archives.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">
                    Ces courriers sont archivés. Cliquez sur "Restaurer" pour les remettre en circulation.
                  </span>
                </div>
              </div>
            )}
            
            <MailTable
              mails={archives}
              onRemove={handleRemove}
              onView={handleView}
              onEdit={handleEdit}
              emptyMessage="Aucune archive trouvée."
              showRestoreButton={true}
              onRestore={handleRestore}
            />
          </div>
        )}
      </div>
    </Layout>
  );
}
