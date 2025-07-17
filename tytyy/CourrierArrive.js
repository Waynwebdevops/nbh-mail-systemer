const CourrierArrive = require('../../models/CourrierArrive');

export default async function handler(req, res) {
  // Liste tous les courriers arrivés
  if (req.method === 'GET') {
    try {
      const courriers = await CourrierArrive.findAll({ order: [['createdAt', 'DESC']] });
      return res.status(200).json(courriers);
    } catch (err) {
      return res.status(500).json({ message: "Erreur lors de la récupération", error: err.toString() });
    }
  }

  // Crée un nouveau courrier arrivé
  if (req.method === 'POST') {
    try {
      const courrier = await CourrierArrive.create(req.body);
      return res.status(201).json(courrier);
    } catch (err) {
      return res.status(400).json({ message: "Erreur lors de la création", error: err.toString() });
    }
  }

  // Supprime un courrier arrivé
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      await CourrierArrive.destroy({ where: { id } });
      return res.status(204).end();
    } catch (err) {
      return res.status(400).json({ message: "Erreur lors de la suppression", error: err.toString() });
    }
  }

  // Méthode non autorisée
  return res.status(405).json({ message: "Méthode non autorisée" });
}
