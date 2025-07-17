// pages/api/courrier-depart.js
const CourrierDepart = require('../../models/CourrierDepart');

export default async function handler(req, res) {
  // GET : liste tous les courriers départ
  if (req.method === 'GET') {
    try {
      const courriers = await CourrierDepart.findAll({ order: [['createdAt', 'DESC']] });
      return res.status(200).json(courriers);
    } catch (err) {
      return res.status(500).json({ message: "Erreur lors de la récupération", error: err.toString() });
    }
  }

  // POST : crée un nouveau courrier départ
  if (req.method === 'POST') {
    try {
      const courrier = await CourrierDepart.create(req.body);
      return res.status(201).json(courrier);
    } catch (err) {
      return res.status(400).json({ message: "Erreur lors de la création", error: err.toString() });
    }
  }

  
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      await CourrierDepart.destroy({ where: { id } });
      return res.status(204).end();
    } catch (err) {
      return res.status(400).json({ message: "Erreur lors de la suppression", error: err.toString() });
    }
  }

  // Méthode non autorisée
  return res.status(405).json({ message: "Méthode non autorisée" });
}
