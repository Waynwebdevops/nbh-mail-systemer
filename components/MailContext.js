
import { createContext, useContext, useState, useEffect } from 'react';
import Loader from './Loader';

const MailContext = createContext();

export function MailProvider({ children }) {
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Plus de localStorage - les données viendront des API
    setLoading(false);
  }, []);

  // Fonction pour rafraîchir les mails depuis les APIs
  const refreshMails = async () => {
    try {
      setLoading(true);
      const [arrivesResponse, departsResponse] = await Promise.all([
        fetch('/api/courrier-arrive'),
        fetch('/api/courrier-depart')
      ]);

      const arrives = arrivesResponse.ok ? await arrivesResponse.json() : [];
      const departs = departsResponse.ok ? await departsResponse.json() : [];

      setMails([...arrives, ...departs]);
    } catch (error) {
      console.error('Erreur lors du chargement des mails:', error);
      setMails([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshMails();

    // Écouter les événements de synchronisation
    const handleMailsUpdated = () => {
      refreshMails();
    };

    window.addEventListener('courriersUpdated', handleMailsUpdated);
    return () => window.removeEventListener('courriersUpdated', handleMailsUpdated);
  }, []);

  if (loading) return <Loader />;

  return (
    <MailContext.Provider value={{ mails, setMails, refreshMails }}>
      {children}
    </MailContext.Provider>
  );
}

export function useMails() {
  return useContext(MailContext);
}
