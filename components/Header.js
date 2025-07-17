import { MoonIcon, SunIcon, UserIcon } from '@heroicons/react/24/outline';
import { useAuth } from './AuthProvider';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useTranslation from '../hooks/useTranslation';

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  // Utilisation du thème global stocké dans localStorage
  const [theme, setTheme] = useState(() => typeof window !== 'undefined' ? (localStorage.getItem('theme') || 'auto') : 'auto');
  const router = useRouter();
  const { t } = useTranslation();
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (theme === 'auto') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      document.documentElement.classList.toggle('dark', mq.matches);
      document.documentElement.classList.toggle('light', !mq.matches);
      const handler = e => {
        document.documentElement.classList.toggle('dark', e.matches);
        document.documentElement.classList.toggle('light', !e.matches);
      };
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    } else {
      document.documentElement.classList.toggle('dark', theme === 'sombre');
      document.documentElement.classList.toggle('light', theme === 'clair');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  if (!mounted) return null;
  const handleLogout = () => {
    logout();
    router.push('/login');
  };
  // Bouton de changement de thème cyclique
  const handleThemeSwitch = () => {
    setTheme(t => t === 'auto' ? 'clair' : t === 'clair' ? 'sombre' : 'auto');
  };
  const themeIcon = theme === 'auto' ? <MoonIcon className="w-6 h-6 text-primary" /> : theme === 'clair' ? <SunIcon className="w-6 h-6 text-yellow-400" /> : <MoonIcon className="w-6 h-6 text-primary" />;
  return (
    <header className="flex justify-between items-center p-4 border-b border-main bg-surface/80 backdrop-blur sticky top-0 z-30" role="banner" aria-label={t('mainHeader')}>
      <div className="font-bold text-primary flex items-center gap-2">
        <UserIcon className="w-6 h-6 text-primary" />
        NBH Mail System
      </div>
      <div className="flex items-center gap-4">
        <button
          aria-label="Changer le thème"
          onClick={handleThemeSwitch}
          className="transition duration-300 ease-in-out p-2 rounded-full bg-light hover:bg-primary/20"
        >
          {themeIcon}
        </button>
        <button
          onClick={handleLogout}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          aria-label={t('logout')}
          tabIndex={0}
        >
          {t('logout')}
        </button>
      </div>
    </header>
  );
}
