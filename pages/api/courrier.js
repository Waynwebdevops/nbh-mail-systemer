
const db = require('../../models');
const { formidable } = require('formidable');
const fs = require('fs');
const path = require('path');

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { type, id } = req.query;
      
      if (id) {
        const courrier = await db.Courrier.findByPk(id);
        if (!courrier) {
          return res.status(404).json({ error: 'Courrier non trouvé' });
        }
        return res.status(200).json(courrier);
      }

      const whereClause = type ? { type } : {};
      const courriers = await db.Courrier.findAll({
        where: whereClause,
        order: [['createdAt', 'DESC']]
      });
      
      return res.status(200).json(courriers);
    } catch (error) {
      console.error('Erreur GET:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  if (req.method === 'POST') {
    try {
      const form = formidable({
        uploadDir: './public/courrier_uploads',
        keepExtensions: true,
        maxFileSize: 10 * 1024 * 1024, // 10MB
      });

      // Créer le dossier s'il n'existe pas
      if (!fs.existsSync('./public/courrier_uploads')) {
        fs.mkdirSync('./public/courrier_uploads', { recursive: true });
      }

      const [fields, files] = await form.parse(req);

      // Convertir les champs en valeurs simples
      const courrierData = {};
      Object.keys(fields).forEach(key => {
        courrierData[key] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
      });

      // Traiter les fichiers
      let fichiers = [];
      if (files.fichiers) {
        const fileArray = Array.isArray(files.fichiers) ? files.fichiers : [files.fichiers];
        fichiers = fileArray.map(file => ({
          name: file.originalFilename,
          path: file.filepath,
          size: file.size
        }));
      }

      const courrier = await db.Courrier.create({
        ...courrierData,
        fichiers: JSON.stringify(fichiers),
        type: courrierData.type || req.query.type || 'ARRIVE'
      });

      return res.status(201).json(courrier);
    } catch (error) {
      console.error('Erreur POST:', error);
      return res.status(500).json({ error: 'Erreur lors de la création' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { id } = req.query;
      
      const form = formidable({
        uploadDir: './public/courrier_uploads',
        keepExtensions: true,
        maxFileSize: 10 * 1024 * 1024,
      });

      const [fields, files] = await form.parse(req);

      const courrierData = {};
      Object.keys(fields).forEach(key => {
        courrierData[key] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
      });

      let fichiers = [];
      if (files.fichiers) {
        const fileArray = Array.isArray(files.fichiers) ? files.fichiers : [files.fichiers];
        fichiers = fileArray.map(file => ({
          name: file.originalFilename,
          path: file.filepath,
          size: file.size
        }));
      }

      const courrier = await db.Courrier.findByPk(id);
      if (!courrier) {
        return res.status(404).json({ error: 'Courrier non trouvé' });
      }

      await courrier.update({
        ...courrierData,
        fichiers: fichiers.length > 0 ? JSON.stringify(fichiers) : courrier.fichiers
      });

      return res.status(200).json(courrier);
    } catch (error) {
      console.error('Erreur PUT:', error);
      return res.status(500).json({ error: 'Erreur lors de la modification' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      
      const courrier = await db.Courrier.findByPk(id);
      if (!courrier) {
        return res.status(404).json({ error: 'Courrier non trouvé' });
      }

      // Supprimer les fichiers associés
      if (courrier.fichiers) {
        try {
          const files = JSON.parse(courrier.fichiers);
          files.forEach(file => {
            if (fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
            }
          });
        } catch (e) {
          console.log('Erreur suppression fichiers:', e);
        }
      }

      await courrier.destroy();
      return res.status(200).json({ message: 'Courrier supprimé' });
    } catch (error) {
      console.error('Erreur DELETE:', error);
      return res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
  }

  return res.status(405).json({ error: 'Méthode non autorisée' });
}
