import { createContext, useContext, useState, useEffect } from 'react';
import Loader from './Loader';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { email, role }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger l'utilisateur depuis le localStorage (mock JWT)
    const data = typeof window !== 'undefined' ? localStorage.getItem('nbh_user') : null;
    if (data) {
      setUser(JSON.parse(data));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('nbh_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nbh_user');
  };

  // Affiche un loader uniquement pendant le chargement initial
  if (loading) return <Loader />;

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
