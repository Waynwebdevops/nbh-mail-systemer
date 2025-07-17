
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Courrier = sequelize.define('Courrier', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    numero: {
      type: DataTypes.STRING,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    objet: {
      type: DataTypes.STRING,
      allowNull: false
    },
    canal: {
      type: DataTypes.STRING,
      allowNull: true
    },
    expediteur: {
      type: DataTypes.STRING,
      allowNull: true
    },
    destinataire: {
      type: DataTypes.STRING,
      allowNull: true
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dateReception: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    },
    dateSignature: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    },
    delai: {
      type: DataTypes.STRING,
      allowNull: true
    },
    statut: {
      type: DataTypes.STRING,
      allowNull: true
    },
    observations: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fichiers: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    files: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'Courriers',
    timestamps: true
  });

  return Courrier;
};
