import { useState, useRef, useEffect } from 'react';
import CourrierForm from './CourrierForm.jsx';
import MailTable from './MailTable';
import { useToast } from './ToastContext';
import AddCourierButton from './AddCourierButton';

export default function CourrierArriveForm() {
  const [courriers, setCourriers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCourrier, setEditingCourrier] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  // Charger les courriers depuis l'API
  useEffect(() => {
    loadCourriers();
    
    // Écouter les événements de mise à jour
    const handleStorageUpdate = () => {
      loadCourriers();
    };
    
    window.addEventListener('courriersUpdated', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);
    
    return () => {
      window.removeEventListener('courriersUpdated', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  const loadCourriers = async () => {
    try {
      const response = await fetch('/api/courrier-arrive');
      if (response.ok) {
        const data = await response.json();
        setCourriers(data || []);
        console.log('Courriers arrivés chargés:', data);
      }
    } catch (error) {
      console.error('Erreur chargement courriers:', error);
      addToast('Erreur lors du chargement des courriers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourrier = async (newCourrier) => {
    setCourriers(prev => [newCourrier, ...prev]);
    setShowForm(false);
    setEditingCourrier(null);
    addToast('Courrier ajouté avec succès', 'success');
    
    // Déclencher l'événement pour synchroniser avec les autres composants
    window.dispatchEvent(new CustomEvent('courriersUpdated', { detail: { type: 'arrive' } }));
  };

  const handleEditCourrier = (courrier) => {
    setEditingCourrier(courrier);
    setShowForm(true);
  };

  const handleUpdateCourrier = async (updatedCourrier) => {
    setCourriers(prev => prev.map(c => c.id === updatedCourrier.id ? updatedCourrier : c));
    setShowForm(false);
    setEditingCourrier(null);
    addToast('Courrier modifié avec succès', 'success');
    
    // Déclencher l'événement pour synchroniser
    window.dispatchEvent(new CustomEvent('courriersUpdated', { detail: { type: 'arrive' } }));
  };

  const handleDeleteCourrier = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce courrier ?')) return;

    try {
      const response = await fetch(`/api/courrier-arrive?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        setCourriers(prev => prev.filter(c => c.id !== id));
        addToast('Courrier supprimé avec succès', 'success');
        
        // Déclencher l'événement pour synchroniser
        window.dispatchEvent(new CustomEvent('courriersUpdated', { detail: { type: 'arrive' } }));
      }
    } catch (error) {
      addToast('Erreur lors de la suppression', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Courriers Arrivés</h1>
        <AddCourierButton 
          onClick={() => {
            setEditingCourrier(null);
            setShowForm(true);
          }} 
          open={showForm} 
        />
      </div>

      {showForm && (
        <CourrierForm
          type="ARRIVE"
          initialValues={editingCourrier}
          onAddMail={editingCourrier ? handleUpdateCourrier : handleAddCourrier}
          onClose={() => {
            setShowForm(false);
            setEditingCourrier(null);
          }}
        />
      )}

      <div className="bg-white rounded-lg shadow">
        <MailTable
          mails={courriers}
          onEdit={handleEditCourrier}
          onDelete={handleDeleteCourrier}
          loading={loading}
        />
      </div>
    </div>
  );
}

function MailDetailModal({ mail, onClose }) {
  if (!mail) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md mx-auto max-h-[90vh] bg-[#FCFCFC] rounded-xl shadow-lg p-5 overflow-y-auto border border-primary relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-primary text-xl">✕</button>
        <h2 className="text-lg font-bold mb-4 text-primary">Détail du courrier</h2>
        <div className="space-y-2 text-sm text-gray-800">
          <div><span className="font-semibold text-gray-900">Expéditeur :</span> {mail.expediteur}</div>
          <div><span className="font-semibold text-gray-900">Destinataire :</span> {mail.destinataire}</div>
          <div><span className="font-semibold text-gray-900">Date :</span> {mail.date}</div>
          <div><span className="font-semibold text-gray-900">Statut :</span> {mail.statut}</div>
          {mail.reference && <div><span className="font-semibold text-gray-900">Référence :</span> {mail.reference}</div>}
          {mail.observations && <div><span className="font-semibold text-gray-900">Observations :</span> {mail.observations}</div>}
          {mail.fichiers?.length > 0 && (
            <div>
              <span className="font-semibold text-gray-900">Fichiers :</span>
              <ul className="list-disc ml-5">
                {mail.fichiers.map((f, i) => <li key={i}>{f.name || f}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CourrierArrive() {
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef(null);
  const [search, setSearch] = useState('');
  const [mails, setMails] = useState([]);
  const { addToast } = useToast();
  const containerRef = useRef(null);
  const [selectedMail, setSelectedMail] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [lastAddedId, setLastAddedId] = useState(null);

  // Charger tous les courriers
  useEffect(() => {
    const storedMails = localStorage.getItem('courrierArriveMails');
    if (storedMails) {
      setMails(JSON.parse(storedMails));
    } else {
      fetchMails();
    }
  }, []);

  const fetchMails = async () => {
    try {
      const res = await fetch('/api/courrier-arrive');
      const data = await res.json();
      setMails(data);
      localStorage.setItem('courrierArriveMails', JSON.stringify(data));
    } catch (err) {
      addToast("Erreur lors du chargement", "error");
    }
  };

  useEffect(() => {
    localStorage.setItem('courrierArriveMails', JSON.stringify(mails));
  }, [mails]);

  // Ajouter un courrier
  const handleAddMail = async (mail) => {
    try {
      const res = await fetch('/api/courrier-arrive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mail)
      });
      const newMail = await res.json();

      setMails(mails => [newMail, ...mails]);
      setLastAddedId(newMail.id);
      setShowForm(false);
      addToast('Nouveau courrier ajouté !', 'success');
    } catch (err) {
      addToast("Erreur lors de l'ajout", 'error');
    }
  };

  // Supprimer un courrier
  const handleRemove = async (id) => {
    try {
      await fetch(`/api/courrier-arrive?id=${id}`, { method: 'DELETE' });
      setMails(mails => mails.filter(mail => mail.id !== id));
      addToast('Courrier supprimé.', 'success');
    } catch (err) {
      addToast("Erreur lors de la suppression", 'error');
    }
  };

  const handleView = (mail) => {
    setSelectedMail(mail);
    setModalType('view');
  };

  const handleEdit = (mail) => {
    setSelectedMail(mail);
    setModalType('edit');
  };

  const handleCloseModal = () => {
    setSelectedMail(null);
    setModalType(null);
  };

  const handleUpdateMail = (updatedMail) => {
    setMails(mails => mails.map(mail => mail.id === updatedMail.id ? updatedMail : mail));
    addToast('Courrier modifié.', 'success');
    handleCloseModal();
  };

  const filteredMails = mails.filter(mail => {
    const q = search.toLowerCase();
    return (
      (mail.objet || '').toLowerCase().includes(q) ||
      (mail.expediteur || '').toLowerCase().includes(q) ||
      (mail.destinataire || '').toLowerCase().includes(q)
    );
  });

  // Récupérer les partenaires actifs depuis la base de données
  const getActivePartners = async () => {
    try {
      const response = await fetch('/api/partenaires');
      const partenaires = await response.json();
      return partenaires.filter(p => p.statut === 'Actif').map(p => p.nom);
    } catch (error) {
      console.error('Erreur lors de la récupération des partenaires:', error);
      return [];
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-[100dvh] flex flex-col bg-main text-main">
      {/* Titre avec logo */}
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-2xl font-bold text-[#15514f] flex items-center gap-3">
          <span className="text-3xl">📥</span>
          Courrier Arrivée
        </h1>
      </div>

      {/* Barre d'outils */}
      <div className="flex items-center gap-4 mb-4 px-2">
        <input
          type="text"
          placeholder="Rechercher par objet, expéditeur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-3 bg-[#FCFCFC] border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#15514f] shadow-sm"
          style={{ marginLeft: '0' }}
        />
        <select className="px-4 py-3 bg-[#FCFCFC] border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#15514f] shadow-sm min-w-[140px]">
          <option value="">Trier par</option>
          <option value="date">Date</option>
          <option value="expediteur">Expéditeur</option>
          <option value="objet">Objet</option>
          <option value="statut">Statut</option>
        </select>
        <button
          onClick={() => setShowForm(f => !f)}
          className="px-6 py-3 bg-[#15514f] text-white rounded-lg hover:bg-[#0f3e3c] transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm"
        >
          <span>➕</span>
          Ajouter un nouveau courrier arrivé
        </button>
      </div>

      {/* Formulaire ajout */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2">
          <div className="w-full max-w-md bg-[#FCFCFC] rounded-xl shadow-lg overflow-y-auto border border-primary" style={{ minHeight: '250px', maxHeight: '80vh' }}>
            <div tabIndex={-1} ref={formRef} aria-label="Formulaire d'ajout de courrier" className="p-3">
              <CourrierForm
                type="ARRIVE"
                onClose={() => setShowForm(false)}
                onAddMail={handleAddMail}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal vue */}
      {modalType === 'view' && selectedMail && (
        <MailDetailModal mail={selectedMail} onClose={handleCloseModal} />
      )}

      {/* Modal édition */}
      {modalType === 'edit' && selectedMail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#FCFCFC] rounded-xl shadow-lg p-4 overflow-y-auto border border-primary relative" style={{ minHeight: '320px', maxHeight: '85vh' }}>
            <button onClick={handleCloseModal} className="absolute top-2 right-2 text-gray-600 hover:text-primary text-xl">✕</button>
            <h2 className="text-lg font-bold mb-4 text-primary">Éditer le courrier</h2>
            <CourrierForm
              type="ARRIVE"
              onClose={handleCloseModal}
              onAddMail={handleUpdateMail}
              initialValues={selectedMail}
            />
          </div>
        </div>
      )}
    </div>
  );
}
```

```jsx
import { useState, useEffect } from 'react';
import Input from './Input';
import FileInput from './FileInput';
import Textarea from './Textarea';
import Select from './Select';
import { useToast } from './ToastContext';

const today = new Date().toISOString().split('T')[0];

function formatDate(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error("Erreur lors de la conversion de la date :", error);
    return '';
  }
}

export default function CourrierForm({ type, initialValues, onClose, onAddMail }) {
  const [numero, setNumero] = useState('');
  const [date, setDate] = useState(formatDate(initialValues?.date) || today);
  const [expediteur, setExpediteur] = useState(initialValues?.expediteur || '');
  const [destinataire, setDestinataire] = useState(initialValues?.destinataire || '');
  const [objet, setObjet] = useState(initialValues?.objet || '');
  const [reference, setReference] = useState(initialValues?.reference || '');
  const [statut, setStatut] = useState(initialValues?.statut || 'En attente');
  const [observations, setObservations] = useState(initialValues?.observations || '');
  const [fichiers, setFichiers] = useState(initialValues?.fichiers || []);
  const [allPartners, setAllPartners] = useState([]);
  const [isUrgent, setIsUrgent] = useState(initialValues?.urgent || false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { addToast } = useToast();

  useEffect(() => {
    generateAutoNumber();
    fetchPartners();
  }, []);

  useEffect(() => {
    setDate(formatDate(initialValues?.date) || today);
    setExpediteur(initialValues?.expediteur || '');
    setDestinataire(initialValues?.destinataire || '');
    setObjet(initialValues?.objet || '');
    setReference(initialValues?.reference || '');
    setStatut(initialValues?.statut || 'En attente');
    setObservations(initialValues?.observations || '');
    setFichiers(initialValues?.fichiers || []);
    setIsUrgent(initialValues?.urgent || false);
  }, [initialValues]);

  const fetchPartners = async () => {
    try {
      const response = await fetch('/api/partenaires');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAllPartners(data);
    } catch (error) {
      console.error("Could not fetch partners:", error);
      addToast("Erreur lors du chargement des partenaires", 'error');
    }
  };
  
  const generateAutoNumber = async () => {
    try {
      const response = await fetch('/api/courrier?type=ARRIVE');
      if (response.ok) {
        const courriers = await response.json();
        const existingNumbers = courriers
          .map(c => c.numero)
          .filter(n => n && n.match(/^\d{5}$/))
          .map(n => parseInt(n))
          .filter(n => !isNaN(n));

        const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
        setNumero(String(nextNumber).padStart(5, '0'));
      }
    } catch (error) {
      console.error('Erreur génération numéro:', error);
      setNumero('00001');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'date') setDate(value);
    else if (name === 'expediteur') setExpediteur(value);
    else if (name === 'destinataire') setDestinataire(value);
    else if (name === 'objet') setObjet(value);
    else if (name === 'reference') setReference(value);
    else if (name === 'statut') setStatut(value);
    else if (name === 'observations') setObservations(value);
    else if (type === 'checkbox') setIsUrgent(checked);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('numero', numero);
    formData.append('date', date);
    formData.append('expediteur', expediteur);
    formData.append('destinataire', destinataire);
    formData.append('objet', objet);
    formData.append('reference', reference);
    formData.append('statut', statut);
    formData.append('observations', observations);
    formData.append('type', type);
    formData.append('urgent', isUrgent);

    selectedFiles.forEach(file => {
      formData.append('fichiers', file);
    });

    try {
      const apiUrl = initialValues?.id ? `/api/courrier?id=${initialValues.id}` : '/api/courrier';
      const method = initialValues?.id ? 'PUT' : 'POST';
      const response = await fetch(apiUrl, {
        method: method,
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newMail = await response.json();
      onAddMail(newMail);
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'envoi du courrier :", error);
      addToast("Erreur lors de l'ajout/modification du courrier", 'error');
    }
  };

  const statutOptions = ['En attente', 'Traité', 'Archivé'];

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <Input label="Numéro" type="text" name="numero" value={numero} readOnly />
      <Input label="Date" type="date" name="date" value={date} onChange={handleChange} max={today} />
      <Input label="Expéditeur" type="text" name="expediteur" value={expediteur} onChange={handleChange} />
      <Select
        label="Destinataire"
        name="destinataire"
        value={destinataire}
        onChange={handleChange}
        options={allPartners.map(p => p.nom)}
        isSearchable={true}
      />
      <Input label="Objet" type="text" name="objet" value={objet} onChange={handleChange} />
      <Input label="Référence" type="text" name="reference" value={reference} onChange={handleChange} />
      <Select label="Statut" name="statut" value={statut} onChange={handleChange} options={statutOptions} />
      <Textarea label="Observations" name="observations" value={observations} onChange={handleChange} />
      <FileInput label="Fichiers" name="fichiers" onChange={handleFileChange} multiple />
      <div className="flex items-center">
        <input type="checkbox" id="urgent" name="urgent" checked={isUrgent} onChange={handleChange} className="mr-2" />
        <label htmlFor="urgent" className="text-sm text-gray-700">Urgent</label>
      </div>
      <div className="flex justify-end space-x-2">
        <button type="button" className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300" onClick={onClose}>Annuler</button>
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark">
          {initialValues?.id ? 'Mettre à jour' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
}