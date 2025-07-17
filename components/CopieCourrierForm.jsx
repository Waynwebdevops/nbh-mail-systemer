import { useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import FileUploader from './FileUploader';

const EXPEDITEURS = [
  "Ministère de l'Intérieur",
  "Préfecture de Paris",
  "Ville de Lyon",
  "Association X",
  "Conseil Régional",
  "Mairie de Bordeaux"
];

const DESTINATAIRES = [
  "Service RH",
  "Direction Générale",
  "Service Technique",
  "Service Juridique",
  "Service Communication",
  "M. Dupont",
  "Mme Martin"
];

const SERVICES = [
  "Service RH",
  "Direction Générale", 
  "Service Technique",
  "Service Juridique",
  "Service Communication"
];

const STATUTS = ['En attente', 'En cours', 'Traité', 'Archivé'];

export default function CourrierForm({ type = 'ARRIVE', onClose, onAddMail, initialValues }) {
  const { addToast } = useToast();

  // États du formulaire
  const [step, setStep] = useState(1);
  const [numero, setNumero] = useState('');
  const [dateReception, setDateReception] = useState('');
  const [dateSignature, setDateSignature] = useState('');
  const [objet, setObjet] = useState('');
  const [canal, setCanal] = useState('Physique');
  const [expediteur, setExpediteur] = useState('');
  const [destinataire, setDestinataire] = useState('');
  const [statut, setStatut] = useState('En attente');
  const [delai, setDelai] = useState('');
  const [reference, setReference] = useState('');
  const [observations, setObservations] = useState('');
  const [files, setFiles] = useState([]);

  // Génération automatique du numéro
  useEffect(() => {
    if (!initialValues?.numero) {
      const prefix = type === 'ARRIVE' ? 'ARR' : 'DEP';
      const timestamp = Date.now().toString().slice(-6);
      setNumero(`${prefix}-${timestamp}`);
    }
  }, [type, initialValues]);

  // Initialisation avec les valeurs existantes
  useEffect(() => {
    if (initialValues) {
      setNumero(initialValues.numero || '');
      setDateReception(initialValues.dateReception || initialValues.date || '');
      setDateSignature(initialValues.dateSignature || '');
      setObjet(initialValues.objet || '');
      setCanal(initialValues.canal || 'Physique');
      setExpediteur(initialValues.expediteur || '');
      setDestinataire(initialValues.destinataire || '');
      setStatut(initialValues.statut || 'En attente');
      setDelai(initialValues.delai || '');
      setReference(initialValues.reference || '');
      setObservations(initialValues.observations || '');
      setFiles(initialValues.files || []);
    }
  }, [initialValues]);

  const handleRemoveFile = idx => setFiles(files => files.filter((_, i) => i !== idx));
  const handleUpload = (newFiles) => setFiles(prev => [...prev, ...newFiles]);

  const handleNextStep = () => {
    if (!objet || !dateReception) {
      addToast('Merci de remplir tous les champs obligatoires de la première étape.', 'error');
      return;
    }
    setStep(2);
  };

  const handleSubmit = () => {
    if (!expediteur || !destinataire) {
      addToast('Merci de remplir tous les champs obligatoires de la deuxième étape.', 'error');
      return;
    }

    const mailData = {
      id: initialValues?.id,
      numero: initialValues?.numero || numero,
      dateReception,
      dateSignature: dateSignature || null,
      objet,
      canal,
      expediteur,
      destinataire,
      reference,
      delai,
      statut,
      observations,
      files, // Les fichiers sont déjà dans le bon format
      type,
      date: dateReception // Pour compatibilité
    };

    if (onAddMail) onAddMail(mailData);
    addToast(initialValues ? 'Courrier en cours de modification...' : 'Courrier en cours de création...', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-gray-50 rounded-xl shadow-lg w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-3 space-y-3">
          <h2 className="text-lg font-bold mb-2 text-black">
            {initialValues ? 'Modifier le courrier' : `Ajouter un nouveau courrier ${type === 'ARRIVE' ? 'arrivé' : 'départ'}`}
          </h2>

          {step === 1 && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro d&apos;enregistrement
                  </label>
                  <input
                    type="text"
                    value={numero}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de réception *
                  </label>
                  <input
                    type="datetime-local"
                    value={dateReception}
                    onChange={(e) => setDateReception(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#15514f] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de signature
                  </label>
                  <input
                    type="datetime-local"
                    value={dateSignature}
                    onChange={(e) => setDateSignature(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#15514f] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Canal de réception
                  </label>
                  <select
                    value={canal}
                    onChange={(e) => setCanal(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#15514f] focus:border-transparent"
                  >
                    <option value="Physique">Physique</option>
                    <option value="E-mail">E-mail</option>
                    <option value="En ligne">En ligne</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Objet du courrier *
                  </label>
                  <input
                    type="text"
                    value={objet}
                    onChange={(e) => setObjet(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#15514f] focus:border-transparent"
                    placeholder="Objet du courrier"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Statut
                  </label>
                  <select
                    value={statut}
                    onChange={(e) => setStatut(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#15514f] focus:border-transparent"
                  >
                    {STATUTS.map(stat => (
                      <option key={stat} value={stat}>{stat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              {/* Première ligne - 2 colonnes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expéditeur *
                  </label>
                  <select
                    value={expediteur}
                    onChange={(e) => setExpediteur(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#15514f] focus:border-transparent"
                    required
                  >
                    <option value="">Sélectionner un expéditeur</option>
                    {EXPEDITEURS.map(exp => (
                      <option key={exp} value={exp}>{exp}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destinataire *
                  </label>
                  <select
                    value={destinataire}
                    onChange={(e) => setDestinataire(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#15514f] focus:border-transparent"
                    required
                  >
                    <option value="">Sélectionner un destinataire</option>
                    {DESTINATAIRES.map(dest => (
                      <option key={dest} value={dest}>{dest}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Deuxième ligne - 2 colonnes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Référence courrier
                  </label>
                  <input
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#15514f] focus:border-transparent"
                    placeholder="Référence interne"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Délai de réponse
                  </label>
                  <input
                    type="text"
                    value={delai}
                    onChange={(e) => setDelai(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#15514f] focus:border-transparent"
                    placeholder="Ex: 30 jours, 2 semaines..."
                  />
                </div>
              </div>

              {/* Observation - ligne complète */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observation
                </label>
                <textarea
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#15514f] focus:border-transparent resize-none"
                  placeholder="Commentaires ou observations..."
                />
              </div>

              {/* Pièces jointes - à la fin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pièces jointes
                </label>
                <FileUploader onFiles={handleUpload} />
                {files.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {files.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-gray-100 rounded text-sm">
                        <span className="text-gray-700">{file.name || file}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(idx)}
                          className="text-red-500 hover:text-red-700 text-lg"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Boutons de navigation - toujours visibles en bas */}
        <div className="flex justify-between px-4 sm:px-5 py-3 border-t bg-gray-50">
          {step === 1 ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="px-4 py-2 bg-[#15514f] text-white rounded-md hover:bg-[#0f3e3c] transition-colors"
              >
                Suivant
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Précédent
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 bg-[#15514f] text-white rounded-md hover:bg-[#0f3e3c] transition-colors"
              >
                {initialValues ? 'Modifier' : 'Enregistrer'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}, useEffect, useStateuseToast, import FileUploader from './FileUploader';
