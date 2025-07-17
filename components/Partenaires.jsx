import { useState } from 'react';
import { PlusIcon, UserGroupIcon, TrashIcon, CheckCircleIcon, PencilIcon } from '@heroicons/react/24/solid';
import InviteMemberModal from '@/components/InviteMemberModal';

const PARTENAIRES_MOCK = [
  { id: 1, nom: 'Direction Générale', type: 'Partenaire', email: 'dg@entreprise.com', statut: 'Actif', secteur: 'Administration', contact: 'Mme Martin', tel: '+33 1 23 45 67 89', ville: 'Paris', pays: 'France', notes: '', courriers: 12, dernierContact: '2025-06-30' },
  { id: 2, nom: 'Fournisseur ABC Informatique', type: 'Fournisseur', email: 'contact@abc.com', statut: 'Actif', secteur: 'Informatique', contact: 'M. Dupont', tel: '+33 6 12 34 56 78', ville: 'Lyon', pays: 'France', notes: '', courriers: 5, dernierContact: '2025-06-28' },
  { id: 3, nom: 'Client Premium SARL', type: 'Client', email: 'premium@client.com', statut: 'Inactif', secteur: 'Services', contact: 'Mme Leroy', tel: '+33 7 98 76 54 32', ville: 'Marseille', pays: 'France', notes: '', courriers: 8, dernierContact: '2025-06-15' },
];

const TYPES = ['Client', 'Fournisseur', 'Consultant', 'Partenaire'];
const STATUTS = ['Actif', 'Inactif', 'Suspendu', 'En attente'];

export default function Partenaires() {
  const [partenaires, setPartenaires] = useState(PARTENAIRES_MOCK);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [form, setForm] = useState({
    nom: '', type: TYPES[0], email: '', tel: '', statut: STATUTS[0]
  });

  const filtered = partenaires.filter(p =>
    (p.nom.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase())) &&
    (!filter || p.statut === filter)
  );

  const handleEdit = (p) => {
    setEditId(p.id);
    setForm({ ...p });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if(window.confirm('Confirmer la suppression de ce partenaire ?'))
      setPartenaires(ps => ps.filter(p => p.id !== id));
  };

  // Fonction d'invitation réelle (avec appel API)
  const handleInvite = async (email) => {
    // Message d'invitation
    const subject = "Invitation à devenir partenaire de NBH LePremier";
    const text = `
Bonjour,

Vous êtes invité à rejoindre notre réseau de partenaires sur NBH LePremier !
Rejoignez-nous et profitez de nombreux avantages pour développer votre activité.

Pour accepter l’invitation, cliquez simplement sur le lien suivant :
https://lepremier.net/partenaires/invitation

Au plaisir de collaborer ensemble,
L’équipe NBH LePremier
`;
    const html = `
      <div style="font-family: Arial, sans-serif; font-size: 16px;">
        <p>Bonjour,</p>
        <p>
          Vous êtes invité à rejoindre notre réseau de <b>partenaires NBH LePremier</b> !<br/>
          Rejoignez-nous et profitez de nombreux avantages pour développer votre activité.
        </p>
        <p>
          <a href="https://lepremier.net" style="background:#124D4B;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold;">
            Accepter l’invitation
          </a>
        </p>
        <p>Au plaisir de collaborer ensemble,<br/>L’équipe NBH LePremier</p>
      </div>
    `;

    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: email, subject, text, html }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Erreur lors de l’envoi de l’invitation");
    }

    // Facultatif : ajoute le partenaire "invité"
    const newInvitation = {
      id: Date.now(),
      nom: email.split('@')[0],
      type: 'Invité',
      email,
      statut: 'En attente',
      secteur: '',
      contact: email,
      tel: '',
      ville: '',
      pays: '',
      notes: 'Invitation envoyée',
      courriers: 0,
      dernierContact: new Date().toISOString().split('T')[0]
    };
    setPartenaires(ps => [...ps, newInvitation]);
    // Le message de confirmation est géré dans le modal
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nom || !form.email || !form.type) return;
    if (editId) {
      setPartenaires(ps => ps.map(p => p.id === editId ? { ...form, id: editId } : p));
    } else {
      setPartenaires(ps => [...ps, { ...form, id: Date.now() }]);
    }
    setShowForm(false); 
    setEditId(null); 
    setForm({ nom: '', type: TYPES[0], secteur: '', contact: '', email: '', tel: '', adresse: '', ville: '', codePostal: '', pays: '', statut: STATUTS[0], notes: '', courriers: 0, dernierContact: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Carte principale */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header avec titre et bouton */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-[#15514f] flex items-center gap-3">
              <UserGroupIcon className="w-8 h-8" />
              Partenaires
            </h1>
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-2 bg-[#15514f] hover:bg-[#0f3e3c] text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-md"
            >
              <PlusIcon className="w-5 h-5" />
              Nouveau Partenaire
            </button>
          </div>
          <hr className="border-gray-200 mb-6" />
          {/* Recherche et filtre */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#15514f] focus:border-transparent"
                placeholder="Rechercher par nom ou email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="md:w-48">
              <select
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#15514f] focus:border-transparent"
                value={filter}
                onChange={e => setFilter(e.target.value)}
              >
                <option value="">Tous les statuts</option>
                {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          {/* Modal d'invitation */}
          <InviteMemberModal
            isOpen={showInviteModal}
            onClose={() => setShowInviteModal(false)}
            onInvite={handleInvite}
          />
          
          {/* Formulaire d'édition */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-[#15514f] mb-6">
                  {editId ? 'Modifier le partenaire' : 'Nouveau partenaire'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                      <input
                        type="text"
                        value={form.nom}
                        onChange={(e) => setForm({ ...form, nom: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15514f]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15514f]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                      <select
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15514f]"
                      >
                        {TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                      <select
                        value={form.statut}
                        onChange={(e) => setForm({ ...form, statut: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15514f]"
                      >
                        {STATUTS.map(statut => (
                          <option key={statut} value={statut}>{statut}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                      <input
                        type="text"
                        value={form.tel}
                        onChange={(e) => setForm({ ...form, tel: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15514f]"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditId(null);
                        setForm({
                          nom: '', type: TYPES[0], email: '', tel: '', statut: STATUTS[0]
                        });
                      }}
                      className="flex-1 bg-[#e6e6e6] hover:bg-[#d0d0d0] text-gray-800 py-3 px-6 rounded-lg font-semibold transition-colors min-h-[48px]"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-[#15514f] hover:bg-[#0f3e3c] text-white py-3 px-6 rounded-lg font-semibold transition-colors min-h-[48px]"
                    >
                      {editId ? 'Modifier' : 'Ajouter'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* Tableau */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Nom</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Statut</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-[#E7FAEB] transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-semibold text-gray-900">{p.nom}</div>
                        <div className="text-sm text-gray-500">{p.type}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-700">{p.email}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                        p.statut === 'Actif' 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : p.statut === 'Inactif'
                          ? 'bg-gray-100 text-gray-700 border border-gray-200'
                          : p.statut === 'En attente'
                          ? 'bg-orange-100 text-orange-800 border border-orange-200'
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${
                          p.statut === 'Actif' 
                            ? 'bg-green-600' 
                            : p.statut === 'Inactif'
                            ? 'bg-gray-500'
                            : p.statut === 'En attente'
                            ? 'bg-orange-500'
                            : 'bg-red-600'
                        }`}></span>
                        {p.statut}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEdit(p)}
                          className="p-2 text-gray-500 hover:text-[#15514f] hover:bg-gray-100 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Message si aucun résultat */}
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <UserGroupIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucun partenaire trouvé</p>
              <p className="text-gray-400 text-sm">Essayez de modifier vos critères de recherche</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
