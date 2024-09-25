import { readdirSync } from 'fs';
import { basename as _basename, join } from 'path';
import Sequelize from 'sequelize';
import config from '../config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const basename = _basename(__filename);
const db = {};

let sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: config.connection,
    logging: false,
    underscored: true,
    pool: {
        max: 20,
        min: 1,
        idle: 20000,
        acquire: 1000000
    },
    timestamps:true
});

readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-4) === '.cjs');
    })
    .forEach(file => {
        const model = sequelize['import'](join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export { db };
