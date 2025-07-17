import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import FileUpload from './FileUpload';
import { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const PARTENAIRES = [
  "Ministère de l'Intérieur",
  "Préfecture de Paris",
  "Ville de Lyon",
  "Association X",
];
const DESTINATAIRES = [
  "Service RH",
  "Direction Générale",
  "Service Technique",
  "M. Dupont",
];
const schema = z.object({
  numero: z.string(),
  date: z.string().min(1, { message: 'Date requise' }),
  time: z.string().min(1, { message: 'Heure requise' }),
  expediteur: z.string().min(1, { message: 'Expéditeur requis' }),
  objet: z.string().min(2, { message: 'Objet requis' }),
  canal: z.string().min(1),
  fichiers: z.any().optional(),
  destinataire: z.string().min(1, { message: 'Destinataire requis' }),
  statut: z.string().min(1),
  planif: z.string().optional(),
  delai: z.string().optional(),
});

export function MailModalForm({ mail, onClose, onSave }) {
  const [numero, setNumero] = useState(mail?.numero || 'ARR-' + Date.now().toString().slice(-6));
  const { register, handleSubmit, control, formState: { errors }, setValue, watch, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: mail || {
      numero,
      date: '',
      time: '',
      expediteur: '',
      objet: '',
      canal: 'Physique',
      fichiers: [],
      destinataire: '',
      statut: 'En attente',
      planif: '',
      delai: '',
    },
  });
  useEffect(() => { setValue('numero', numero); }, [numero, setValue]);
  const fichiers = watch('fichiers') || [];
  const submit = (data) => {
    onSave({ ...mail, ...data, fichiers });
    setNumero('ARR-' + (Date.now() + 1).toString().slice(-6));
    reset();
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-label="Formulaire courrier arrivé">
      <div className="bg-gray-900 dark:bg-surface p-6 rounded-2xl shadow-2xl w-full max-w-full sm:max-w-lg relative flex flex-col overflow-y-visible pb-32 border border-gray-700">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70" aria-label="Fermer le formulaire" tabIndex={0}>✕</button>
        <h2 className="text-2xl font-bold mb-4 text-primary" id="mail-modal-title">{mail ? 'Éditer' : 'Ajouter'} un courrier arrivé</h2>
        <form onSubmit={handleSubmit(submit)} className="space-y-4 flex-1 flex flex-col" aria-labelledby="mail-modal-title">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="numero" className="block mb-1 text-sm">N° d&apos;enregistrement</label>
              <input id="numero" {...register('numero')} value={numero} disabled className="w-full bg-muted/30 text-gray-100 rounded px-3 py-2" aria-readonly="true" />
            </div>
            <div>
              <label htmlFor="date" className="block mb-1 text-sm">Date de réception</label>
              <input id="date" type="date" {...register('date')} className="w-full bg-muted/30 text-gray-100 rounded px-3 py-2" aria-required="true" />
              {errors.date && <p className="text-red-400 text-xs mt-1" role="alert">{errors.date.message}</p>}
              }
            </div>
            <div>
              <label htmlFor="time" className="block mb-1 text-sm">Heure</label>
              <input id="time" type="time" {...register('time')} className="w-full bg-muted/30 text-gray-100 rounded px-3 py-2" aria-required="true" />
              {errors.time && <p className="text-red-400 text-xs mt-1" role="alert">{errors.time.message}</p>}
              }
            </div>
            <div>
              <label htmlFor="expediteur" className="block mb-1 text-sm">Expéditeur (Partenaire)</label>
              <select id="expediteur" {...register('expediteur')} className="w-full bg-muted/30 text-gray-100 rounded px-3 py-2" aria-required="true">
                <option value="">Sélectionner</option>
                {PARTENAIRES.map(p => <option key={p}>{p}</option>)}
                )
                }
              </select>
              {errors.expediteur && <p className="text-red-400 text-xs mt-1" role="alert">{errors.expediteur.message}</p>}
              }
            </div>
            <div className="md:col-span-2">
              <label htmlFor="objet" className="block mb-1 text-sm">Objet du courrier</label>
              <input id="objet" {...register('objet')} className="w-full bg-muted/30 text-gray-100 rounded px-3 py-2" aria-required="true" />
              {errors.objet && <p className="text-red-400 text-xs mt-1" role="alert">{errors.objet.message}</p>}
              }
            </div>
            <div>
              <label htmlFor="canal" className="block mb-1 text-sm">Canal de réception</label>
              <select id="canal" {...register('canal')} className="w-full bg-muted/30 text-gray-100 rounded px-3 py-2">
                <option>Physique</option>
                <option>E-mail</option>
                <option>En ligne</option>
              </select>
            </div>
            <div>
              <label htmlFor="fichiers" className="block mb-1 text-sm">Pièces jointes</label>
              <Controller
                control={control}
                name="fichiers"
                render={({ field: { onChange } }) => (
                  <FileUpload onFiles={onChange} files={fichiers} aria-label="Pièces jointes" id="fichiers" />
                )}
              />
            </div>
            <div>
              <label htmlFor="destinataire" className="block mb-1 text-sm">Service ou Personne destinataire</label>
              <select id="destinataire" {...register('destinataire')} className="w-full bg-muted/30 text-gray-100 rounded px-3 py-2" aria-required="true">
                <option value="">Sélectionner</option>
                {DESTINATAIRES.map(d => <option key={d}>{d}</option>)}
                )
                }
              </select>
              {errors.destinataire && <p className="text-red-400 text-xs mt-1" role="alert">{errors.destinataire.message}</p>}
              }
            </div>
            <div>
              <label htmlFor="statut" className="block mb-1 text-sm">Statut de traitement</label>
              <select id="statut" {...register('statut')} className="w-full bg-muted/30 text-gray-100 rounded px-3 py-2">
                <option>En attente</option>
                <option>En cours</option>
                <option>Terminé</option>
              </select>
            </div>
            <div>
              <label htmlFor="planif" className="block mb-1 text-sm">Planification d&apos;envoi</label>
              <input id="planif" type="datetime-local" {...register('planif')} className="w-full bg-muted/30 text-gray-100 rounded px-3 py-2" />
            </div>
            <div>
              <label htmlFor="delai" className="block mb-1 text-sm">Délai de réponse</label>
              <input id="delai" type="datetime-local" {...register('delai')} className="w-full bg-muted/30 text-gray-100 rounded px-3 py-2" />
            </div>
          </div>
          <button type="submit" className="mt-4 w-full bg-primary hover:bg-primary/80 text-white font-semibold py-2 rounded-lg transition shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70">{mail ? 'Enregistrer les modifications' : 'Enregistrer'}</button>
        </form>
      </div>
    </div>
  );
}

/**
 * Modale de visualisation d'un courrier (détail)
 * @param {Object} props
 * @param {Object} props.mail - Données du courrier à afficher
 * @param {Function} props.onClose - Fonction de fermeture
 * @param {Function} props.updateMail - Fonction de mise à jour complète du courrier
 * @param {Function} props.updateStatus - Fonction de mise à jour du statut uniquement
 */
export function MailModalDetail({ mail, onClose, updateMail, updateStatus }) {
  const [currentStatus, setCurrentStatus] = useState(mail?.statut || mail?.status || '');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!mail) return null;

  const statusOptions = [
    'En attente',
    'En cours',
    'Traité',
    'Rejeté',
    'Archivé',
    'nouveau'
  ];

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === currentStatus) return;
    
    setIsUpdating(true);
    try {
      if (updateStatus) await updateStatus(mail.id, newStatus);
      else if (updateMail) await updateMail(mail.id, { ...mail, statut: newStatus });
      setCurrentStatus(newStatus);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition px-4 pb-20">
      <div className="bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto relative animate-fade-in border border-gray-700">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-700/50 transition"
          aria-label="Fermer"
        >
          <XMarkIcon className="w-5 h-5 text-gray-400 hover:text-white" />
        </button>
        
        <h2 className="text-xl font-bold text-primary mb-6 pr-10">Détail du courrier</h2>
        
        <div className="space-y-4 text-gray-100">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <span className="font-semibold text-gray-300 block mb-1">N° d'enregistrement :</span>
              <span className="text-white">{mail.numero}</span>
            </div>
            
            <div>
              <span className="font-semibold text-gray-300 block mb-1">Date de réception :</span>
              <span className="text-white">{formatDate(mail.dateReception || mail.date)}</span>
            </div>
            
            <div>
              <span className="font-semibold text-gray-300 block mb-1">Expéditeur :</span>
              <span className="text-white">{mail.expediteur || mail.sender}</span>
            </div>
            
            <div>
              <span className="font-semibold text-gray-300 block mb-1">Destinataire :</span>
              <span className="text-white">{mail.destinataire || mail.recipient}</span>
            </div>
            
            <div>
              <span className="font-semibold text-gray-300 block mb-1">Objet :</span>
              <span className="text-white break-words">{mail.objet || mail.subject}</span>
            </div>
            
            <div>
              <span className="font-semibold text-gray-300 block mb-1">Canal :</span>
              <span className="text-white">{mail.canal || mail.channel}</span>
            </div>
            
            <div>
              <span className="font-semibold text-gray-300 block mb-2">Statut :</span>
              <select
                value={currentStatus}
                onChange={handleStatusChange}
                disabled={isUpdating}
                className="w-full bg-gray-800 text-gray-100 rounded-lg px-3 py-2 border border-gray-600 focus:border-primary focus:ring-1 focus:ring-primary transition disabled:opacity-50 cursor-pointer hover:bg-gray-700"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {isUpdating && (
                <div className="text-xs text-gray-400 mt-1">Mise à jour en cours...</div>
              )}
            </div>
            
            {(mail.planif || mail.delai) && (
              <>
                {mail.planif && (
                  <div>
                    <span className="font-semibold text-gray-300 block mb-1">Planification :</span>
                    <span className="text-white">{formatDate(mail.planif)}</span>
                  </div>
                )}
                
                {mail.delai && (
                  <div>
                    <span className="font-semibold text-gray-300 block mb-1">Délai de réponse :</span>
                    <span className="text-white">{formatDate(mail.delai)}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MailModalForm;
