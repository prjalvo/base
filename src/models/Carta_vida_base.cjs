'use strict';
module.exports = (sequelize, DataTypes) => {
  const carta_vida_base = sequelize.define('carta_vida_base', {   
    url: DataTypes.STRING,
    texto: DataTypes.STRING,
    relacao: DataTypes.STRING,
    remetente: DataTypes.STRING,
    imprimiu:DataTypes.STRING,
    id_participante:DataTypes.INTEGER,
    pdf: DataTypes.STRING
   }, 
   {
     tableName: 'carta_vida_base'    
   },   
  {});
  
  carta_vida_base.associate = function(models) {
    carta_vida_base.belongsTo(models.encontrista_base, { foreignKey: 'id_participante', as: 'encontrista' });
  };
  return carta_vida_base;
};
