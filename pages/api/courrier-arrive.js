
import { localStorage } from '../../utils/localStorage';
import formidable from 'formidable';
import path from 'path';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const courriers = localStorage.getCourriers('ARRIVE');
      return res.status(200).json(courriers);
    } catch (error) {
      console.error('Erreur GET:', error);
      return res.status(500).json({ error: 'Erreur lors de la récupération' });
    }
  }

  if (req.method === 'POST') {
    try {
      // Si Content-Type: application/json, traiter comme JSON
      if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
        let body = '';
        await new Promise((resolve, reject) => {
          req.on('data', chunk => { body += chunk; });
          req.on('end', resolve);
          req.on('error', reject);
        });
        const courrierData = JSON.parse(body);
        const courrier = localStorage.addCourrier({
          ...courrierData,
          fichiers: courrierData.fichiers || '[]',
          type: 'ARRIVE'
        });
        return res.status(201).json(courrier);
      }

      // Sinon, fallback sur formidable (upload de fichiers)
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

      const courrier = localStorage.addCourrier({
        ...courrierData,
        fichiers: JSON.stringify(fichiers),
        type: 'ARRIVE'
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

      const updateData = {
        ...courrierData,
        ...(fichiers.length > 0 && { fichiers: JSON.stringify(fichiers) })
      };

      const courrier = localStorage.updateCourrier(id, updateData);
      return res.status(200).json(courrier);
    } catch (error) {
      console.error('Erreur PUT:', error);
      return res.status(500).json({ error: 'Erreur lors de la modification' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      localStorage.deleteCourrier(id);
      return res.status(200).json({ message: 'Courrier supprimé' });
    } catch (error) {
      console.error('Erreur DELETE:', error);
      return res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
  }

  return res.status(405).json({ error: 'Méthode non autorisée' });
}
