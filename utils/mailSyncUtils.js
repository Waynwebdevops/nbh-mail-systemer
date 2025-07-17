// Utilitaires pour la synchronisation des courriers entre les différentes pages
export const triggerGlobalMailSync = (type = null, action = 'update', data = null) => {
  // Déclencher l'événement de synchronisation
  const event = new CustomEvent('courriersUpdated', { 
    detail: { type, action, data } 
  });

  window.dispatchEvent(event);

  // Déclencher aussi après un court délai pour assurer la synchronisation
  setTimeout(() => {
    window.dispatchEvent(event);
  }, 100);
};

export const syncMailsAcrossPages = () => {
  triggerGlobalMailSync();
};

// Fonction pour vérifier et synchroniser les données au chargement de page
export const ensureMailSync = () => {
  console.log('Synchronisation forcée des courriers');
  triggerGlobalMailSync();
};