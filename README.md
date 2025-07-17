
# NBH Mail System

Système complet de gestion de courriers développé avec **Next.js 14**, **React 18**, **Tailwind CSS** et **SQLite**. Une solution moderne offrant une interface intuitive pour la gestion des courriers entrants et sortants avec stockage persistant.

## 🚀 Fonctionnalités principales

### 📧 Gestion des courriers
- **Courriers arrivés** : Enregistrement, suivi et traitement des courriers entrants
- **Courriers départs** : Création et suivi des courriers sortants  
- **Brouillons** : Sauvegarde et modification des courriers en cours
- **Archives** : Archivage et recherche dans l'historique

### 🎯 Interface utilisateur
- **Design responsive** : Adaptation mobile, tablette et desktop
- **Navigation adaptative** : Sidebar desktop, bottom navigation mobile
- **Dark mode** optimisé
- **Animations fluides** avec Framer Motion
- **Composants réutilisables** : Button, Modal, Card, Badge, etc.

### 📊 Tableau de bord
- **Dashboard interactif** avec statistiques temps réel
- **Gestion des partenaires** : Carnet d'adresses intégré
- **Paramètres utilisateur** : Configuration personnalisée
- **Système de rôles** : Admin, Employé, RH, Manager

### 🔍 Fonctionnalités avancées
- **Recherche intelligente** : Filtrage multi-critères
- **Tri dynamique** : Par date, expéditeur, destinataire, statut
- **Pagination** : Navigation par pages
- **Gestion de fichiers** : Upload et prévisualisation
- **Expansion de contenu** : Affichage tronqué avec extension

## 🏗️ Architecture technique

### Structure du projet
```
nbh-mail-system/
├── components/           # Composants React
│   ├── Layout.js        # Layout principal
│   ├── MailTable.js     # Tableau courriers avec tri/pagination
│   ├── Dashboard.jsx    # Tableau de bord
│   ├── CourrierArrive.jsx # Gestion courriers arrivés
│   ├── CourrierDepart.jsx # Gestion courriers départs
│   ├── FileUploader.jsx # Upload de fichiers
│   └── ...
├── pages/               # Pages Next.js
│   ├── api/            # API routes
│   │   ├── courrier-arrive.js
│   │   ├── courrier-depart.js
│   │   └── partenaires.js
│   ├── dashboard/       # Pages dashboard
│   └── ...
├── hooks/              # Hooks personnalisés
│   ├── useMailList.js  # Gestion données courriers
│   └── useTranslation.js # Internationalisation
├── models/             # Modèles Sequelize
│   └── Courrier.js     # Modèle courrier
├── config/             # Configuration base de données
├── data/               # Fichiers JSON de stockage
├── locales/            # Traductions FR/EN
└── utils/              # Utilitaires
```

### Technologies utilisées
- **Framework** : Next.js 14 (React 18)
- **Base de données** : SQLite avec Sequelize ORM
- **Styling** : Tailwind CSS
- **Animations** : Framer Motion
- **Icons** : React Icons (Feather)
- **Tests** : Jest avec React Testing Library
- **Accessibilité** : Tests axe-core intégrés

## 🗄️ Gestion des données

### Modèle de données
Le système utilise un modèle unifié pour les courriers :
```javascript
{
  id: Number,
  numero: String,
  date: Date,
  expediteur: String,
  destinataire: String,
  objet: String,
  canal: String,
  statut: String,
  type: 'ARRIVE' | 'DEPART',
  createdAt: Date,
  updatedAt: Date
}
```

### Stockage hybride
- **SQLite** : Base de données principale avec Sequelize
- **LocalStorage** : Cache côté client via `useMailList` hook
- **Synchronisation** : Sync automatique entre client et serveur

## 🚀 Installation et démarrage

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone [repository-url]

# Installer les dépendances
npm install

# Configurer la base de données
npx sequelize-cli db:migrate

# Lancer en développement
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

### Scripts disponibles
```bash
npm run dev      # Démarrage développement
npm run build    # Build production
npm run start    # Serveur production
npm run lint     # Vérification ESLint
npm run test     # Tests Jest
```

## 📱 Interface utilisateur

### Composants principaux
- **MailTable** : Tableau avec tri, pagination, recherche
- **CourrierForm** : Formulaires arrive/départ
- **Dashboard** : Statistiques et métriques
- **FileUploader** : Gestion des pièces jointes
- **Modal** : Fenêtres modales réutilisables

### Navigation
- **Desktop** : Sidebar avec navigation principale
- **Mobile** : Bottom navigation + header responsive
- **Accessibilité** : Navigation clavier, ARIA labels

## 🔐 Authentification et sécurité

### Système d'authentification
- **Pages** : Login, Register, Reset Password
- **Composants** : AuthProvider, RoleGuard
- **Rôles** : Admin, Employé, RH, Manager

### Protection des routes
```javascript
// Exemple d'utilisation
<RoleGuard allowedRoles={['admin', 'employee']}>
  <ProtectedComponent />
</RoleGuard>
```

## 📊 Fonctionnalités du tableau

### MailTable.js
- **Tri dynamique** : Clic sur colonnes pour trier
- **Pagination** : Navigation par pages (10 items/page)
- **Recherche** : Filtrage temps réel
- **Expansion** : Boutons [...] pour contenu tronqué
- **Actions** : Voir, modifier, supprimer
- **Responsive** : Vue mobile optimisée

### Statuts et couleurs
```javascript
const STATUS_COLORS = {
  'nouveau': 'bg-blue-500/20 text-blue-400',
  'en cours': 'bg-yellow-500/20 text-yellow-400',
  'traité': 'bg-green-500/20 text-green-400',
  'rejeté': 'bg-red-500/20 text-red-400',
  'archivé': 'bg-gray-500/20 text-gray-300'
};
```

## 🌐 Internationalisation

Support multilingue avec `useTranslation` hook :
- **Français** (défaut)
- **Anglais**

Configuration dans `/locales/[langue]/common.json`

## 🧪 Tests et qualité

### Tests inclus
- **Composants** : React Testing Library
- **Accessibilité** : Tests axe-core automatisés
- **Navigation** : Tests clavier et ARIA

### Lancement des tests
```bash
npm test                    # Tests unitaires
npm run lint               # Vérification code
```

## 📱 PWA (Progressive Web App)

### Fonctionnalités PWA
- **Manifest** : `/public/manifest.json`
- **Service Worker** : Cache et offline
- **Installation** : Ajout écran d'accueil
- **Mode offline** : Fonctionnement sans connexion

## 🔄 API Routes

### Endpoints disponibles
- `GET/POST /api/courrier-arrive` : Courriers entrants
- `GET/POST /api/courrier-depart` : Courriers sortants  
- `GET/POST /api/partenaires` : Gestion partenaires
- `POST /api/send-email` : Envoi emails

## 🚀 Déploiement sur Replit

### Configuration automatique
Le projet est optimisé pour Replit :
- **Fichier .replit** : Configuration automatique
- **Base de données** : SQLite locale
- **Port** : 3000 (configuré pour Replit)

### Variables d'environnement
```env
# Optionnel
NEXT_PUBLIC_API_URL=your_api_url
```

## 📋 Fonctionnalités détaillées

### Dashboard
- **Statistiques** : Courriers traités, en attente, archivés
- **Graphiques** : Visualisation des données
- **Activité récente** : Dernières actions

### Gestion des partenaires
- **CRUD complet** : Ajout, modification, suppression
- **Recherche** : Filtrage par nom, email
- **Intégration** : Sélection dans formulaires courriers

### Upload de fichiers
- **MultiUpload** : Plusieurs fichiers simultanément
- **Prévisualisation** : Images et documents
- **Validation** : Types et tailles de fichiers

## 🎨 Personnalisation

### Thème Tailwind
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        danger: '#EF4444'
      }
    }
  }
}
```

### Composants réutilisables
- **Button** : Variantes et tailles
- **Modal** : Fenêtres modales
- **Card** : Conteneurs stylés
- **Badge** : Étiquettes de statut

## 🔄 Roadmap

### Prochaines versions
- [ ] Notifications temps réel
- [ ] Export PDF/Excel
- [ ] Workflow d'approbation
- [ ] Intégration email
- [ ] Signature électronique
- [ ] Rapports avancés

## 🤝 Contribution

### Standards de développement
- **ESLint** : Configuration Next.js
- **Tests** : Couverture minimum 80%
- **Accessibilité** : WCAG 2.1 AA
- **TypeScript** : Prêt pour migration

### Structure composants
```jsx
import { useState } from 'react';
import { FiIcon } from 'react-icons/fi';

export default function Component({ props }) {
  const [state, setState] = useState();
  
  return (
    <div className="component-styles">
      {/* Contenu */}
    </div>
  );
}
```

## 📞 Support

- **Documentation** : Commentaires dans le code
- **Tests** : Exemples d'utilisation
- **Issues** : Rapporter problèmes sur repository

## 📄 Licence

Projet sous licence MIT.

---

> **NBH Mail System** - Solution complète de gestion de courriers avec Next.js, SQLite et interface moderne.
# nbh-mail-system
