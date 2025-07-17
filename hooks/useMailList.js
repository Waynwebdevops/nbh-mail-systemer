
import { useState, useEffect } from 'react';

export function useMailList(type) {
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les données depuis l'API au montage
  useEffect(() => {
    const fetchMails = async () => {
      setLoading(true);
      try {
        let url = '';
        if (type === 'arrive') url = '/api/courrier-arrive';
        else if (type === 'depart') url = '/api/courrier-depart';
        else return setMails([]);
        const res = await fetch(url);
        if (!res.ok) throw new Error('Erreur API');
        const data = await res.json();
        setMails(data);
      } catch (error) {
        console.error('Erreur chargement API:', error);
        setMails([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMails();
  }, [type]);


  // Ajout d'un courrier via l'API
  const addMail = async (newMail) => {
    try {
      const res = await fetch(
        type === 'arrive' ? '/api/courrier-arrive' : '/api/courrier-depart',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMail)
        }
      );
      if (!res.ok) throw new Error('Erreur API');
      await fetchMails();
      return await res.json();
    } catch (error) {
      console.error('Erreur ajout API:', error);
      throw error;
    }
  };

  // Suppression d'un courrier via l'API
  const deleteMail = async (id) => {
    try {
      const res = await fetch(
        (type === 'arrive' ? '/api/courrier-arrive' : '/api/courrier-depart') + `?id=${id}`,
        { method: 'DELETE' }
      );
      if (!res.ok) throw new Error('Erreur API');
      await fetchMails();
    } catch (error) {
      console.error('Erreur suppression API:', error);
      throw error;
    }
  };

  // Pour recharger la liste après ajout/suppression
  const fetchMails = async () => {
    setLoading(true);
    try {
      let url = '';
      if (type === 'arrive') url = '/api/courrier-arrive';
      else if (type === 'depart') url = '/api/courrier-depart';
      else return setMails([]);
      const res = await fetch(url);
      if (!res.ok) throw new Error('Erreur API');
      const data = await res.json();
      setMails(data);
    } catch (error) {
      console.error('Erreur chargement API:', error);
      setMails([]);
    } finally {
      setLoading(false);
    }
  };

  // Mise à jour d'un courrier via l'API
  const updateMail = async (id, updates) => {
    try {
      const res = await fetch(
        (type === 'arrive' ? '/api/courrier-arrive' : '/api/courrier-depart') + `?id=${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        }
      );
      if (!res.ok) throw new Error('Erreur API');
      await fetchMails();
      return await res.json();
    } catch (error) {
      console.error('Erreur modification API:', error);
      throw error;
    }
  };

  return {
    mails,
    loading,
    addMail,
    deleteMail,
    updateMail,
    refreshMails: fetchMails
  };
}