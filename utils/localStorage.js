
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'data');
const COURRIERS_ARRIVE_FILE = path.join(DATA_DIR, 'courriers-arrive.json');
const COURRIERS_DEPART_FILE = path.join(DATA_DIR, 'courriers-depart.json');

// Créer le dossier data s'il n'existe pas
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialiser les fichiers s'ils n'existent pas
if (!fs.existsSync(COURRIERS_ARRIVE_FILE)) {
  fs.writeFileSync(COURRIERS_ARRIVE_FILE, JSON.stringify([]));
}

if (!fs.existsSync(COURRIERS_DEPART_FILE)) {
  fs.writeFileSync(COURRIERS_DEPART_FILE, JSON.stringify([]));
}

// Fonction pour obtenir le bon fichier selon le type
const getFileForType = (type) => {
  return type === 'ARRIVE' ? COURRIERS_ARRIVE_FILE : COURRIERS_DEPART_FILE;
};

export const localStorage = {
  // Récupérer les courriers par type
  getCourriers: (type = 'ARRIVE') => {
    try {
      const file = getFileForType(type);
      if (!fs.existsSync(file)) {
        fs.writeFileSync(file, JSON.stringify([], null, 2));
        return [];
      }
      const data = fs.readFileSync(file, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Erreur lecture courriers:', error);
      return [];
    }
  },

  // Ajouter un courrier
  addCourrier: (courrier) => {
    try {
      const type = courrier.type || 'ARRIVE';
      const courriers = localStorage.getCourriers(type);
      const newCourrier = {
        ...courrier,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      courriers.unshift(newCourrier);
      const file = getFileForType(type);
      fs.writeFileSync(file, JSON.stringify(courriers, null, 2));
      return newCourrier;
    } catch (error) {
      console.error('Erreur ajout courrier:', error);
      throw error;
    }
  },

  // Mettre à jour un courrier
  updateCourrier: (id, updates) => {
    try {
      // Chercher dans les deux types
      const types = ['ARRIVE', 'DEPART'];
      for (const type of types) {
        const courriers = localStorage.getCourriers(type);
        const index = courriers.findIndex(c => c.id == id);
        if (index !== -1) {
          courriers[index] = { 
            ...courriers[index], 
            ...updates, 
            updatedAt: new Date().toISOString() 
          };
          const file = getFileForType(type);
          fs.writeFileSync(file, JSON.stringify(courriers, null, 2));
          return courriers[index];
        }
      }
      throw new Error('Courrier non trouvé');
    } catch (error) {
      console.error('Erreur mise à jour courrier:', error);
      throw error;
    }
  },

  // Supprimer un courrier
  deleteCourrier: (id) => {
    try {
      // Chercher dans les deux types
      const types = ['ARRIVE', 'DEPART'];
      for (const type of types) {
        const courriers = localStorage.getCourriers(type);
        const filtered = courriers.filter(c => c.id != id);
        if (filtered.length !== courriers.length) {
          const file = getFileForType(type);
          fs.writeFileSync(file, JSON.stringify(filtered, null, 2));
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Erreur suppression courrier:', error);
      throw error;
    }
  }
};
