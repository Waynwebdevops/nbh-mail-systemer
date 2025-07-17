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

  // Sauvegarder dans localStorage
  const saveCourriers = useCallback((newCourriers) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(newCourriers));
      setCourriers(newCourriers);
      
      // Déclencher l'événement de synchronisation
      window.dispatchEvent(new CustomEvent('courriersUpdated', {
        detail: { type, action: 'update', data: newCourriers }
      }));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  }, [storageKey, type]);

  // Ajouter un courrier
  const addCourrier = useCallback((newCourrier) => {
    const courrierWithId = {
      ...newCourrier,
      id: Date.now(),
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
  }, [courriers, saveCourriers]);

  // Mettre à jour uniquement le statut
  const updateStatus = useCallback((id, newStatus) => {
    updateCourrier(id, { statut: newStatus });
  }, [updateCourrier]);

  // Supprimer un courrier
  const deleteCourrier = useCallback((id) => {
    const updatedCourriers = courriers.filter(courrier => courrier.id !== id);
    saveCourriers(updatedCourriers);
  }, [courriers, saveCourriers]);

  // Écouter les événements de synchronisation
  useEffect(() => {
    const handleStorageUpdate = (event) => {
      if (event.detail?.type === type || !event.detail?.type) {
        loadCourriers();
      }
    };

    window.addEventListener('courriersUpdated', handleStorageUpdate);
    window.addEventListener('storage', loadCourriers);

    return () => {
      window.removeEventListener('courriersUpdated', handleStorageUpdate);
      window.removeEventListener('storage', loadCourriers);
    };
  }, [loadCourriers, type]);

  // Charger au montage
  useEffect(() => {
    loadCourriers();
  }, [loadCourriers]);

  return {
    courriers,
    loading,
    addCourrier,
    updateCourrier,
    updateStatus,
    deleteCourrier,
    refreshCourriers: loadCourriers
  };
}