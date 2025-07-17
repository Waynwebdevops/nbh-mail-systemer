import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  name: z.string().min(2, { message: 'Nom requis' }),
  email: z.string().email({ message: 'Email invalide' }),
  phone: z.string().min(6, { message: 'Téléphone requis' }),
});

export default function ContactModal({ contact, onClose, onSave }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: contact || { name: '', email: '', phone: '' },
  });

  const submit = (data) => {
    onSave({ ...contact, ...data });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded shadow-lg w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-white">✕</button>
        <h2 className="text-xl font-bold mb-4">{contact ? 'Éditer' : 'Ajouter'} un contact</h2>
        <form onSubmit={handleSubmit(submit)}>
          <div className="mb-3">
            <label className="block mb-1">Nom</label>
            <input {...register('name')} className="w-full p-2 rounded bg-gray-700 text-white" />
            {errors.name && <p className="text-red-400 text-sm">{errors.name.message}</p>}
          </div>
          <div className="mb-3">
            <label className="block mb-1">Email</label>
            <input type="email" {...register('email')} className="w-full p-2 rounded bg-gray-700 text-white" />
            {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}
          </div>
          <div className="mb-3">
            <label className="block mb-1">Téléphone</label>
            <input {...register('phone')} className="w-full p-2 rounded bg-gray-700 text-white" />
            {errors.phone && <p className="text-red-400 text-sm">{errors.phone.message}</p>}
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded mt-2">{contact ? 'Enregistrer' : 'Ajouter'}</button>
        </form>
      </div>
    </div>
  );
}
