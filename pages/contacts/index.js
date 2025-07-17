import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import dynamic from 'next/dynamic';

const ContactModal = dynamic(() => import('../../components/ContactModal'), { 
  ssr: false, 
  loading: () => <div className="text-center py-8 text-gray-400">Chargement du formulaire...</div> 
});

function contactsToCSV(contacts) {
  const header = 'Nom,Email,Téléphone';
  const rows = contacts.map(c =>
    [c.name, c.email, c.phone].map(v => '"' + (v || '').replace(/"/g, '""') + '"').join(',')
  );
  return [header, ...rows].join('\n');
}

function csvToContacts(csv) {
  const lines = csv.trim().split(/\r?\n/);
  return lines.slice(1).map(line => {
    const [name, email, phone] = line.split(',').map(s => s.replace(/^"|"$/g, ''));
    return { name, email, phone, id: Date.now() + Math.random() };
  });
}

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('nbh_contacts') || '[]');
    setContacts(data);
  }, []);

  const saveContacts = (list) => {
    setContacts(list);
    localStorage.setItem('nbh_contacts', JSON.stringify(list));
  };

  const handleAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (contact) => {
    setEditing(contact);
    setModalOpen(true);
  };

  const handleSave = (contact) => {
    let updated;
    if (editing) {
      updated = contacts.map(c => c.id === contact.id ? contact : c);
    } else {
      updated = [...contacts, { ...contact, id: Date.now() }];
    }
    saveContacts(updated);
    setModalOpen(false);
  };

  const handleExport = () => {
    const csv = contactsToCSV(contacts);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contacts.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const imported = csvToContacts(evt.target.result);
      saveContacts([...contacts, ...imported]);
    };
    reader.readAsText(file);
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4 gap-2 flex-wrap">
        <h1 className="text-2xl font-bold">Contacts</h1>
        <div className="flex gap-2">
          <Button onClick={handleAdd}>Ajouter</Button>
          <Button variant="green" onClick={handleExport}>Exporter CSV</Button>
          <label className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded cursor-pointer">
            Importer CSV
            <input type="file" accept=".csv" onChange={handleImport} className="hidden" />
          </label>
        </div>
      </div>
      <table className="w-full bg-gray-800 rounded">
        <thead>
          <tr>
            <th className="p-2 text-left">Nom</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Téléphone</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map(contact => (
            <tr key={contact.id} className="border-t border-gray-700">
              <td className="p-2">{contact.name}</td>
              <td className="p-2">{contact.email}</td>
              <td className="p-2">{contact.phone}</td>
              <td className="p-2">
                <Button variant="secondary" onClick={() => handleEdit(contact)}>Éditer</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <ContactModal
          contact={editing}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      </Modal>
    </Layout>
  );
}
