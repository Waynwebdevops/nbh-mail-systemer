import { useState } from 'react';

export const NAV = [
  { key: 'accueil', label: 'Accueil', icon: '🏠' },
  { key: 'arrive', label: 'Courrier Arrivé', icon: '📩' },
  { key: 'depart', label: 'Courrier Départ', icon: '➡️' },
  { key: 'partenaires', label: 'Partenaires', icon: '👥' },
  { key: 'parametres', label: 'Paramètres', icon: '⚙️' },
];

export default function SidebarMenu({ currentView, setCurrentView }) {
  return (
    <div className="fixed top-0 left-0 h-screen w-[100px] text-main flex flex-col items-center pt-6 space-y-6 z-50" style={{ backgroundColor: '#15514f' }}>
      {/* Sidebar minimaliste, sans navigation principale */}
      <div className="flex flex-col items-center gap-4 mt-8">
        <span className="text-3xl">📬</span>
        <span className="text-xs text-gray-400 font-bold tracking-widest">NBH</span>
      </div>
    </div>
  );
}
