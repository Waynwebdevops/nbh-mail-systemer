import { useState, useEffect, useCallback } from 'react';

// Hook pour gérer le stockage des courriers avec synchronisation
export function useCourrierStorage(type) {
  const [courriers, setCourriers] = useState([]);
  const [loading, setLoading] = useState(true);

  const storageKey = type === 'ARRIVE' ? 'nbh_courriers_arrive' : 'nbh_courriers_depart';

  // Charger les courriers depuis localStorage
  const loadCourriers = useCallback(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      const parsed = saved ? JSON.parse(saved) : [];
      setCourriers(parsed);
    } catch (error) {
      console.error('Erreur lors du chargement des courriers:', error);
      setCourriers([]);
    } finally {
      setLoading(false);
    }
  }, [storageKey]);

  // Sauvegarder dans localStorage avec synchronisation
  const saveCourriers = useCallback((newCourriers) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(newCourriers));
      setCourriers(newCourriers);
      
      // Déclencher l'événement de synchronisation globale
      window.dispatchEvent(new CustomEvent('courriersUpdated', {
        detail: { type, action: 'update', data: newCourriers }
      }));
      
      // Déclencher aussi l'événement storage pour la synchronisation entre onglets
      window.dispatchEvent(new StorageEvent('storage', {
        key: storageKey,
        newValue: JSON.stringify(newCourriers),
        oldValue: localStorage.getItem(storageKey)
      }));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      throw new Error('Impossible de sauvegarder les données');
    }
  }, [storageKey, type]);

  // Ajouter un courrier
  const addCourrier = useCallback((newCourrier) => {
    const courrierWithId = {
      ...newCourrier,
      id: Date.now() + Math.random(), // ID unique
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type
    };
    
    const updatedCourriers = [courrierWithId, ...courriers];
    saveCourriers(updatedCourriers);
    return courrierWithId;
  }, [courriers, saveCourriers, type]);

  // Mettre à jour un courrier
  const updateCourrier = useCallback((id, updates) => {
    const updatedCourriers = courriers.map(courrier =>
      courrier.id === id
        ? { ...courrier, ...updates, updatedAt: new Date().toISOString() }
        : courrier
    );
    saveCourriers(updatedCourriers);
    return updatedCourriers.find(c => c.id === id);
  }, [courriers, saveCourriers]);

  // Mettre à jour uniquement le statut
  const updateStatus = useCallback((id, newStatus) => {
    return updateCourrier(id, { statut: newStatus });
  }, [updateCourrier]);

  // Supprimer un courrier
  const deleteCourrier = useCallback((id) => {
    const updatedCourriers = courriers.filter(courrier => courrier.id !== id);
    saveCourriers(updatedCourriers);
    return true;
  }, [courriers, saveCourriers]);

  // Obtenir un courrier par ID
  const getCourrierById = useCallback((id) => {
    return courriers.find(courrier => courrier.id === id);
  }, [courriers]);

  // Écouter les événements de synchronisation
  useEffect(() => {
    const handleStorageUpdate = (event) => {
      // Synchronisation entre onglets
      if (event.key === storageKey) {
        try {
          const newData = event.newValue ? JSON.parse(event.newValue) : [];
          setCourriers(newData);
        } catch (error) {
          console.error('Erreur synchronisation storage:', error);
        }
      }
    };

    const handleCourrierUpdate = (event) => {
      // Synchronisation interne
      if (event.detail?.type === type || !event.detail?.type) {
        loadCourriers();
      }
    };

    window.addEventListener('storage', handleStorageUpdate);
    window.addEventListener('courriersUpdated', handleCourrierUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageUpdate);
      window.removeEventListener('courriersUpdated', handleCourrierUpdate);
    };
  }, [loadCourriers, type, storageKey]);

  // Charger au montage
  useEffect(() => {
    loadCourriers();
  }, [loadCourriers]);

  // Statistiques
  const stats = {
    total: courriers.length,
    enAttente: courriers.filter(c => c.statut === 'En attente').length,
    enCours: courriers.filter(c => c.statut === 'En cours').length,
    traites: courriers.filter(c => c.statut === 'Traité').length,
    archives: courriers.filter(c => c.statut === 'Archivé').length
  };

  return {
    courriers,
    loading,
    stats,
    addCourrier,
    updateCourrier,
    updateStatus,
    deleteCourrier,
    getCourrierById,
    refreshCourriers: loadCourriers
  };
}