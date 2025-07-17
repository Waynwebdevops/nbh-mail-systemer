const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Charger manuellement les modèles existants
try {
  const CourrierModel = require('./Courrier.js');
  const Courrier = CourrierModel(sequelize, Sequelize.DataTypes);
  db[Courrier.name] = Courrier;
  console.log('Modèle Courrier chargé avec succès');
} catch (error) {
  console.error('Erreur lors du chargement du modèle Courrier:', error);
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

console.log('Modèle Courrier chargé:', !!db.Courrier);

module.exports = db;