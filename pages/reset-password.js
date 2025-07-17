import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/router';

const emailSchema = z.object({
  email: z.string().email({ message: 'Email invalide' }),
});
const passwordSchema = z.object({
  password: z.string().min(6, { message: 'Mot de passe trop court' }),
});

export default function ResetPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const emailForm = useForm({ resolver: zodResolver(emailSchema) });
  const passwordForm = useForm({ resolver: zodResolver(passwordSchema) });

  const handleEmail = (data) => {
    const users = JSON.parse(localStorage.getItem('nbh_users') || '[]');
    const found = users.find(u => u.email === data.email);
    if (!found) {
      setError('Aucun compte trouvé avec cet email');
      return;
    }
    setEmail(data.email);
    setStep(2);
    setError('');
  };

  const handlePassword = (data) => {
    const users = JSON.parse(localStorage.getItem('nbh_users') || '[]');
    const idx = users.findIndex(u => u.email === email);
    if (idx === -1) {
      setError('Erreur inattendue');
      return;
    }
    users[idx].password = data.password;
    localStorage.setItem('nbh_users', JSON.stringify(users));
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 dark:bg-surface">
      <div className="bg-gray-900 dark:bg-muted/80 p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-800">
        <h2 className="text-3xl font-bold mb-6 text-center text-primary" id="reset-title">Réinitialiser le mot de passe</h2>
        {step === 1 && (
          <form onSubmit={emailForm.handleSubmit(handleEmail)} role="form" aria-label="Réinitialiser le mot de passe - étape email" aria-labelledby="reset-title">
            <div className="mb-4">
              <label htmlFor="reset-email" className="block mb-1 text-gray-300">Email</label>
              <input id="reset-email" type="email" {...emailForm.register('email')} className="w-full p-2 rounded-lg bg-muted/30 text-gray-100 focus:ring-2 focus:ring-primary outline-none" aria-required="true" aria-invalid={!!emailForm.formState.errors.email} aria-describedby={emailForm.formState.errors.email ? 'reset-email-error' : undefined} />
              {emailForm.formState.errors.email && <p id="reset-email-error" className="text-red-400 text-xs mt-1" role="alert">{emailForm.formState.errors.email.message}</p>}
            </div>
            {error && <p className="text-red-400 text-center mb-2 text-sm animate-pulse" role="alert">{error}</p>}
            <button type="submit" className="w-full bg-primary hover:bg-primary/80 text-white font-semibold py-2 rounded-lg transition shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70" aria-label="Valider">Valider</button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={passwordForm.handleSubmit(handlePassword)} role="form" aria-label="Réinitialiser le mot de passe - étape nouveau mot de passe" aria-labelledby="reset-title">
            <div className="mb-4">
              <label htmlFor="reset-password" className="block mb-1 text-gray-300">Nouveau mot de passe</label>
              <input id="reset-password" type="password" {...passwordForm.register('password')} className="w-full p-2 rounded-lg bg-muted/30 text-gray-100 focus:ring-2 focus:ring-primary outline-none" aria-required="true" aria-invalid={!!passwordForm.formState.errors.password} aria-describedby={passwordForm.formState.errors.password ? 'reset-password-error' : undefined} />
              {passwordForm.formState.errors.password && <p id="reset-password-error" className="text-red-400 text-xs mt-1" role="alert">{passwordForm.formState.errors.password.message}</p>}
            </div>
            {error && <p className="text-red-400 text-center mb-2 text-sm animate-pulse" role="alert">{error}</p>}
            <button type="submit" className="w-full bg-primary hover:bg-primary/80 text-white font-semibold py-2 rounded-lg transition shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70" aria-label="Réinitialiser">Réinitialiser</button>
          </form>
        )}
      </div>
    </div>
  );
}
