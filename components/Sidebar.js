import Link from 'next/link';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import useTranslation from '../hooks/useTranslation';
import navLinks from './navLinks';

// Élément de navigation réutilisable pour la sidebar (icônes SVG harmonisées)
function SidebarNavItem({ link, isActive, onClick, t }) {
  return (
    <button
      className={clsx(
        'w-full flex items-center px-4 py-2 rounded-lg transition text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70',
        isActive ? 'bg-primary/10 text-primary' : 'text-gray-300 hover:bg-muted/30'
      )}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      aria-label={t(link.label)}
      tabIndex={0}
    >
      <span className="mr-2 flex items-center" aria-hidden="true">{link.icon}</span>
      <span className="sr-only">{t(link.label)}</span>
      <span aria-hidden="true">{t(link.label)}</span>
    </button>
  );
}

/**
 * Sidebar navigation partagée, stylée Tailwind, avec icônes SVG (navLinks)
 */
export default function Sidebar() {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <aside className="hidden md:flex flex-col w-64 bg-gray-900 border-r border-gray-800 dark:bg-surface dark:border-muted transition-all duration-300 min-h-screen" role="complementary" aria-label="Navigation latérale">
      <div className="flex items-center justify-center h-20 border-b border-gray-800 dark:border-muted">
        <span className="text-2xl font-bold text-primary">NBH Courriers</span>
      </div>
      <nav className="flex-1 py-6" aria-label="Menu principal">
        <ul className="space-y-2">
          {navLinks.map((l) => (
            <li key={l.href}>
              <SidebarNavItem
                link={l}
                isActive={router.pathname === l.href}
                onClick={() => router.push(l.href)}
                t={t}
              />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
