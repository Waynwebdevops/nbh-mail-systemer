import { useEffect, useState } from 'react';
import FileUploader from './FileUploader.jsx';
import FilePreviewList from './FilePreviewList.jsx';
import { useToast } from './ToastContext';

const STATUTS = ['Traité', 'En attente', 'En cours', 'Archivé'];

export default function ModalCourrierComplet({ type = 'ARRIVE', onClose, onAddMail }) {
  const [objet, setObjet] = useState('');
  const [date, setDate] = useState('');
  const [canal, setCanal] = useState('Physique');
  const [expediteur, setExpediteur] = useState('');
  const [destinataire, setDestinataire] = useState('');
  const [statut, setStatut] = useState(STATUTS[0]);
  const [planif, setPlanif] = useState('');
  const [delai, setDelai] = useState('');
  const [reference, setReference] = useState('');
  const [service, setService] = useState('');
  const [observations, setObservations] = useState('');
  const [files, setFiles] = useState([]);
  const [step, setStep] = useState(1);
  const { addToast } = useToast();

  const numero = type === 'ARRIVE'
    ? 'ARR-' + Math.floor(100000 + Math.random() * 900000)
    : 'DEP-' + Math.floor(100000 + Math.random() * 900000);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleRemoveFile = idx => {
    setFiles(files => files.filter((_, i) => i !== idx));
  };

  const handleUpload = (newFiles) => {
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleNextStep = () => {
    if (!objet || !date || !destinataire || (type === 'ARRIVE' && !expediteur)) {
      addToast('Merci de remplir tous les champs obligatoires.', 'error');
      return;
    }
    setStep(2);
  };

  const handleSubmit = () => {
    const newMail = {
      id: Date.now(),
      objet,
      date,
      canal,
      expediteur,
      destinataire,
      statut,
      planif,
      delai,
      reference,
      service,
      observations,
      files,
      numero,
      type,
    };

    if (onAddMail) onAddMail(newMail);
    addToast('Courrier enregistré avec succès !', 'success');
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl h-[80vh] overflow-hidden">
        <div className="h-full overflow-y-auto px-4 sm:px-6 py-6">

          <h2 className="text-xl font-bold mb-4">Ajouter un nouveau courrier</h2>

          {/* Étapes */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 1 ? 'bg-emerald-800 text-white' : 'bg-gray-200 text-gray-600'} text-sm`}>1</div>
              <div className={`w-12 h-1 ${step === 1 ? 'bg-gray-300' : 'bg-emerald-800'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 2 ? 'bg-emerald-800 text-white' : 'bg-gray-200 text-gray-600'} text-sm`}>2</div>
            </div>
          </div>

          {step === 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <label className="block font-semibold mb-1 text-sm">Expéditeur</label>
                <input
                  type="text"
                  value={expediteur}
                  onChange={(e) => setExpediteur(e.target.value)}
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 placeholder-gray-400 text-sm"
                  placeholder="Saisir l'expéditeur"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-sm">Destinataire</label>
                <input
                  type="text"
                  value={destinataire}
                  onChange={(e) => setDestinataire(e.target.value)}
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 placeholder-gray-400 text-sm"
                  placeholder="Saisir le destinataire"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-sm">Objet</label>
                <input
                  type="text"
                  value={objet}
                  onChange={(e) => setObjet(e.target.value)}
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 placeholder-gray-400 text-sm"
                  placeholder="Saisir l'objet du courrier"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-sm">Date</label>
                <input
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-sm">Canal</label>
                <select
                  value={canal}
                  onChange={(e) => setCanal(e.target.value)}
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="Physique">Physique</option>
                  <option value="Email">Email</option>
                  <option value="Téléphone">Téléphone</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-sm">Statut</label>
                <select
                  value={statut}
                  onChange={(e) => setStatut(e.target.value)}
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  {STATUTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <label className="block font-semibold mb-1 text-sm">Planification</label>
                <input
                  type="datetime-local"
                  value={planif}
                  onChange={(e) => setPlanif(e.target.value)}
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-sm">Délai</label>
                <input
                  type="datetime-local"
                  value={delai}
                  onChange={(e) => setDelai(e.target.value)}
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-sm">Référence</label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="Saisir la référence"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-sm">Service</label>
                <input
                  type="text"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="Saisir le service concerné"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold mb-1 text-sm">Observations</label>
                <textarea
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  rows="2"
                  placeholder="Ajouter des observations (optionnel)"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold mb-2">Pièces jointes</label>
                <div className="flex flex-col gap-2">
                  <FileUploader onUpload={handleUpload} />
                  <FilePreviewList files={files} onRemove={handleRemoveFile} />
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <div>
              {step === 2 && (
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 text-sm"
                  onClick={() => setStep(1)}
                >
                  Retour
                </button>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 text-sm"
                onClick={onClose}
              >
                Annuler
              </button>

              {step === 1 ? (
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-semibold hover:bg-emerald-900 text-sm"
                  onClick={handleNextStep}
                >
                  Suivant
                </button>
              ) : (
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-semibold hover:bg-emerald-900 text-sm"
                  onClick={handleSubmit}
                >
                  Enregistrer
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}