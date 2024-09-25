'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    firstName: DataTypes.STRING,
    email: DataTypes.STRING, 
    role: DataTypes.STRING,
    verify: DataTypes.BOOLEAN,
    password: DataTypes.STRING
  }, {});

  user.associate = function(models) {   
    //models.user.hasMany(models.grupos, { foreignKey: 'id' });      
    //   models.user.hasMany(models.user_cargo, {
    //  foreignKey: 'id_cargo',
    //  sourceKey: 'id',
    //  as: 'user_cargo' });     
    //models.user.belongsToMany(models.user_cargo, { as: 'user_cargo',foreignKey: 'id',sourceKey: 'id'});
    //models.user.belongsTo(models.cargo, {foreignKey: 'id_cargo' }); 
  
  };

  return user;
};
