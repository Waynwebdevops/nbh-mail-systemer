import Link from 'next/link';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import useTranslation from '../hooks/useTranslation';

const navLinks = [
  { href: '/', label: 'Accueil', icon: '🏠' },
  { href: '/dashboard/mails', label: 'Courrier Arrivé', icon: '📩' },
  { href: '/dashboard/depart', label: 'Courrier Départ', icon: '➡️' },
  { href: '/dashboard/partenaires', label: 'Partenaires', icon: '👥' },
  { href: '/dashboard/parametres', label: 'Paramètres', icon: '⚙️' },
];

export default function MainNav() {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <nav
      className="fixed left-0 top-0 h-screen w-56 bg-gray-900 dark:bg-surface border-r border-gray-800 dark:border-muted flex flex-col py-8 z-50 shadow-xl"
      role="navigation"
      aria-label={t('mainNav')}
    >
      <div className="flex items-center justify-center mb-8">
        <span className="text-2xl font-bold text-primary">NBH Courriers</span>
      </div>
      <ul className="flex-1 flex flex-col gap-2">
        {navLinks.map(link => {
          const active = router.pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-label={t(link.label)}
                className={clsx(
                  'flex items-center gap-3 px-5 py-3 rounded-lg font-medium transition-all duration-200',
                  active
                    ? 'bg-primary/10 text-primary shadow-inner font-bold'
                    : 'text-gray-300 hover:bg-primary/5 hover:text-primary',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70'
                )}
              >
                <span className={clsx('text-xl', active && 'drop-shadow-[0_0_8px_rgba(80,120,255,0.25)]')}>{link.icon}</span>
                <span className={clsx('text-base', active && 'font-bold')}>{t(link.label)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
