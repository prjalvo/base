'use strict';
module.exports = (sequelize, DataTypes) => {
  const encontrista_base = sequelize.define('encontrista_base', {
    id: {type: DataTypes.INTEGER,primaryKey: true},
    nome: DataTypes.STRING,   
    data_inscricao: DataTypes.STRING,    
    nome_lider: DataTypes.STRING,    
    flg_envia: DataTypes.STRING,
    doc: DataTypes.STRING  
  }, 
    {
     tableName: 'encontrista_base'     
   },   
  {});
  
  encontrista_base.associate = function(models) { 
    encontrista_base.hasMany(models.carta_vida_base, { foreignKey: 'id_participante', as: 'cartas' });
  };
  return encontrista_base;
};
