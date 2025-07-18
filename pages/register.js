import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Button from '../components/Button';
import Toast from '../components/Toast';
import Link from 'next/link';

const roles = [
  { value: 'admin', label: 'Admin' },
  { value: 'employe', label: 'Employé' },
  { value: 'rh', label: 'RH' },
  { value: 'manager', label: 'Manager' },
];

const schema = z.object({
  email: z.string().email({ message: 'Email invalide' }),
  password: z.string().min(6, { message: 'Mot de passe trop court' }),
  role: z.enum(['admin', 'employe', 'rh', 'manager'], { message: 'Rôle requis' }),
});

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    // Vérifier si l'utilisateur existe déjà
    const users = JSON.parse(localStorage.getItem('nbh_users') || '[]');
    if (users.find(u => u.email === data.email)) {
      setError('Cet email est déjà utilisé');
      setShowToast(true);
      return;
    }
    users.push({ email: data.email, password: data.password, role: data.role });
    localStorage.setItem('nbh_users', JSON.stringify(users));
    // Connexion automatique après inscription
    localStorage.setItem('nbh_user', JSON.stringify({ email: data.email, role: data.role }));
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 dark:bg-surface">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-900 dark:bg-muted/80 p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-800" role="form" aria-label="Créer un compte utilisateur">
        <h2 className="text-3xl font-bold mb-6 text-center text-primary" id="register-title">Créer un compte</h2>
        <div className="mb-4">
          <label htmlFor="register-email" className="block mb-1 text-gray-300">Email</label>
          <input id="register-email" type="email" {...register('email')} className="w-full p-2 rounded-lg bg-muted/30 text-gray-100 focus:ring-2 focus:ring-primary outline-none" aria-required="true" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'register-email-error' : undefined} />
          {errors.email && <p id="register-email-error" className="text-red-400 text-xs mt-1" role="alert">{errors.email.message}</p>}
          }
        </div>
        <div className="mb-4">
          <label htmlFor="register-password" className="block mb-1 text-gray-300">Mot de passe</label>
          <input id="register-password" type="password" {...register('password')} className="w-full p-2 rounded-lg bg-muted/30 text-gray-100 focus:ring-2 focus:ring-primary outline-none" aria-required="true" aria-invalid={!!errors.password} aria-describedby={errors.password ? 'register-password-error' : undefined} />
          {errors.password && <p id="register-password-error" className="text-red-400 text-xs mt-1" role="alert">{errors.password.message}</p>}
          }
        </div>
        <div className="mb-4">
          <label htmlFor="register-role" className="block mb-1 text-gray-300">Rôle</label>
          <select id="register-role" {...register('role')} className="w-full p-2 rounded-lg bg-muted/30 text-gray-100" aria-required="true" aria-invalid={!!errors.role} aria-describedby={errors.role ? 'register-role-error' : undefined}>
            <option value="">Sélectionner un rôle</option>
            {roles.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
          {errors.role && <p id="register-role-error" className="text-red-400 text-xs mt-1" role="alert">{errors.role.message}</p>}
          }
        </div>
        {error && <p className="text-red-400 text-center mb-2 text-sm animate-pulse" role="alert">{error}</p>}
        }
        <Button type="submit" className="w-full bg-primary hover:bg-primary/80 text-white font-semibold py-2 rounded-lg transition shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">{t('register')}</Button>
        <button type="submit" className="w-full bg-primary hover:bg-primary/80 text-white font-semibold py-2 rounded-lg transition shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">Créer un compte</button>
        <p className="mt-4 text-center text-sm text-gray-400">
          Déjà inscrit ? <Link href="/login" className="text-blue-400 underline">Se connecter</Link>
        </p>
      </form>
      {showToast && <Toast message={error} type="error" onClose={() => setShowToast(false)} />}
    </div>
  );
}
