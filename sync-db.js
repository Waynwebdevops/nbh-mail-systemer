const db = require('./models');

async function syncDatabase() {
  try {
    console.log('Tentative de connexion à la base de données...');
    await db.sequelize.authenticate();
    console.log('Connexion à la base de données établie avec succès.');

    console.log('Modèles disponibles:', Object.keys(db));

    console.log('Synchronisation de la base de données...');
    // Utiliser alter: true pour mettre à jour la structure sans perdre les données
    await db.sequelize.sync({ alter: true });
    console.log('Base de données synchronisée avec succès.');

    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de la synchronisation de la base de données:', error);
    process.exit(1);
  }
}

syncDatabase();