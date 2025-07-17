import Link from 'next/link';
import { useRouter } from 'next/router';
import navLinks from './navLinks';
import clsx from 'clsx';
import useTranslation from '../hooks/useTranslation';

// Élément de navigation réutilisable pour le menu bas
function NavItem({ link, isActive, t }) {
  return (
    <Link
      href={link.href}
      aria-label={t(link.label)}
      tabIndex={0}
      className={clsx(
        'group flex flex-col items-center text-xs px-3 py-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 transition-all duration-200 ease-out select-none',
        isActive
          ? 'text-primary dark:text-primary shadow-[0_2px_12px_0_rgba(80,120,255,0.15)] bg-primary/10 dark:bg-primary/20 scale-[1.04]'
          : 'text-gray-300 dark:text-gray-400',
        'hover:text-primary dark:hover:text-accent hover:bg-primary/5 dark:hover:bg-primary/10 active:scale-95'
      )}
    >
      <span
        className={clsx(
          'transition-all duration-200 ease-out flex items-center justify-center',
          isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(80,120,255,0.25)]' : 'group-hover:scale-105'
        )}
      >
        {/* Cercle animé sous l'icône active */}
        <span
          aria-hidden="true"
          className={clsx(
            'absolute -z-10 w-10 h-10 rounded-full transition-all duration-300',
            isActive ? 'bg-primary/20 dark:bg-primary/30 scale-100 opacity-100' : 'scale-75 opacity-0'
          )}
        />
        {link.icon}
      </span>
      <span className={clsx('mt-0.5 font-medium', isActive && 'font-semibold')}>{t(link.label)}</span>
    </Link>
  );
}

// Barre de navigation inférieure principale
// Props : showOnDesktop (affiche aussi sur desktop si true)
export default function BottomNav({ showOnDesktop = true }) {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <footer
      className={clsx(
        'fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-800 flex justify-around py-2 shadow-lg',
        'dark:bg-surface dark:border-muted'
      )}
      role="navigation"
      aria-label={t('mainNav')}
    >
      {navLinks.map(link => (
        <NavItem key={link.href} link={link} isActive={router.pathname === link.href} t={t} />
      ))}
    </footer>
  );
}
