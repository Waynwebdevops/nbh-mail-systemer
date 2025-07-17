
// API pour la gestion des partenaires
let partenaires = [
  { id: 1, nom: "Ministère de l'Intérieur", type: 'Public', email: 'contact@interieur.gouv.fr', statut: 'Actif' },
  { id: 2, nom: 'Ville de Lyon', type: 'Public', email: 'mairie@lyon.fr', statut: 'Actif' },
  { id: 3, nom: 'Association X', type: 'Privé', email: 'asso.x@email.com', statut: 'Actif' },
  { id: 4, nom: 'Entreprise Y', type: 'Privé', email: 'contact@entreprisey.com', statut: 'Inactif' },
];

let nextId = 5;

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(partenaires);
  } else if (req.method === 'POST') {
    const newPartenaire = {
      id: nextId++,
      ...req.body,
      statut: req.body.statut || 'Actif'
    };
    partenaires.push(newPartenaire);
    res.status(201).json(newPartenaire);
  } else if (req.method === 'PUT') {
    const { id } = req.query;
    const index = partenaires.findIndex(p => p.id === parseInt(id));
    if (index !== -1) {
      partenaires[index] = { ...partenaires[index], ...req.body };
      res.status(200).json(partenaires[index]);
    } else {
      res.status(404).json({ error: 'Partenaire non trouvé' });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    partenaires = partenaires.filter(p => p.id !== parseInt(id));
    res.status(204).end();
  } else {
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
}
