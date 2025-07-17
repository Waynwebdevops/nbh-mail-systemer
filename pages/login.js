import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../components/AuthProvider';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Button from '../components/Button';
import Toast from '../components/Toast';
import Link from 'next/link';

const schema = z.object({
  email: z.string().email({ message: 'Email invalide' }),
  password: z.string().min(6, { message: 'Mot de passe trop court' }),
});

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    // Ici, on simule une authentification (aucune donnée par défaut)
    // L'utilisateur doit s'être inscrit avant
    const users = JSON.parse(localStorage.getItem('nbh_users') || '[]');
    const found = users.find(u => u.email === data.email && u.password === data.password);
    if (!found) {
      setError('Identifiants invalides');
      setShowToast(true);
      return;
    }
    login({ email: found.email, role: found.role });
    localStorage.setItem('nbh_user', JSON.stringify({ email: found.email, role: found.role }));
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 dark:bg-surface">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-900 dark:bg-muted/80 p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-800" role="form" aria-label="Connexion à l'espace utilisateur">
        <h2 className="text-3xl font-bold mb-6 text-center text-primary" id="login-title">Connexion</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 text-gray-300">Email</label>
          <input id="email" type="email" {...register('email')} className="w-full p-2 rounded-lg bg-muted/30 text-gray-100 focus:ring-2 focus:ring-primary outline-none" aria-required="true" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} />
          {errors.email && <p id="email-error" className="text-red-400 text-xs mt-1" role="alert">{errors.email.message}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-1 text-gray-300">Mot de passe</label>
          <input id="password" type="password" {...register('password')} className="w-full p-2 rounded-lg bg-muted/30 text-gray-100 focus:ring-2 focus:ring-primary outline-none" aria-required="true" aria-invalid={!!errors.password} aria-describedby={errors.password ? 'password-error' : undefined} />
          {errors.password && <p id="password-error" className="text-red-400 text-xs mt-1" role="alert">{errors.password.message}</p>}
        </div>
        {error && <p className="text-red-400 text-center mb-2 text-sm animate-pulse" role="alert">{error}</p>}
        <Button type="submit" className="w-full bg-primary hover:bg-primary/80 text-white font-semibold py-2 rounded-lg transition shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70" aria-label="Se connecter">Se connecter</Button>
        <p className="mt-4 text-center text-sm text-gray-400">
          Pas de compte ? <Link href="/register" className="text-blue-400 underline">Créer un compte</Link>
        </p>
        <p className="mt-2 text-center text-sm text-gray-400">
          <Link href="/reset-password" className="text-blue-400 underline">Mot de passe oublié ?</Link>
        </p>
      </form>
      {showToast && <Toast message={error} type="error" onClose={() => setShowToast(false)} />}
    </div>
  );
}
