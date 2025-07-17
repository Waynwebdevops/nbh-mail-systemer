// sync.js
const sequelize = require('./db');
const CourrierArrive = require('./tytyy/CourrierArrive');
const CourrierDepart = require('./tytyy/CourrierDepart');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la base OK !');

    await CourrierArrive.sync({ alter: true });
    await CourrierDepart.sync({ alter: true });

    console.log('Tables synchronisées.');
    process.exit();
  } catch (err) {
    console.error('Erreur de sync:', err);
    process.exit(1);
  }
})();
