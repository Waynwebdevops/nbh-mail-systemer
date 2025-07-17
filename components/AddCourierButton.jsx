import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';

export default function AddCourierButton({ onClick, open }) {
  return (
    <button
      className={`fixed top-20 right-4 z-50 flex items-center gap-2 bg-gradient-to-br from-primary to-indigo-700 text-white px-4 py-2 rounded-full font-bold shadow-2xl transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/30 ${open ? 'scale-95 bg-gray-700' : 'scale-100'}`}
      onClick={onClick}
      aria-label={open ? 'Fermer le formulaire' : 'Ajouter un courrier'}
    >
      {open ? <XMarkIcon className="w-5 h-5" /> : <PlusIcon className="w-5 h-5" />}
      <span className="font-semibold tracking-wide hidden sm:inline">
        {open ? 'Fermer' : 'Ajouter un courrier'}
      </span>
    </button>
  );
}