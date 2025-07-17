import Link from 'next/link';
import { useAuth } from './AuthProvider';
import Button from './Button';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-surface border-b border-muted px-4 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-xl font-bold text-primary">NBH Mail System</Link>
        {user && (
          <>
            <Link href="/dashboard/mails" className="text-gray-200 hover:text-primary">Courriers</Link>
            <Link href="/contacts" className="text-gray-200 hover:text-primary">Contacts</Link>
            <Link href="/dashboard/stats" className="text-gray-200 hover:text-primary">Statistiques</Link>
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-gray-300">{user.email} ({user.role})</span>
            <Button variant="secondary" onClick={logout}>Déconnexion</Button>
          </>
        ) : (
          <>
            <Link href="/login"><Button variant="primary">Connexion</Button></Link>
            <Link href="/register"><Button variant="secondary">Inscription</Button></Link>
          </>
        )}
      </div>
    </nav>
  );
}
