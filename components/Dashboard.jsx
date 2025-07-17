import { useAuth } from './AuthProvider';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-2 md:px-0">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-6 bg-gradient-to-r from-primary to-indigo-700 bg-clip-text text-transparent drop-shadow-lg tracking-tight">
        🏠 Tableau de bord
      </h1>

      <div className="bg-white border border-gray-200 rounded-xl shadow-card p-6">
        <h2 className="text-xl font-semibold mb-4">Bienvenue</h2>
        <p className="text-gray-600">
          Bonjour <span className="font-semibold text-blue-600">{user?.email}</span>
          {user?.role && (
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              {user.role}
            </span>
          )}
        </p>
        <p className="text-gray-500 mt-4">
          Le tableau de bord sera configuré progressivement selon vos besoins.
        </p>
      </div>
    </div>
  );
}