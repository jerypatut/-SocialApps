import fs from 'fs';
import path from 'path';
import process from 'process';
import { fileURLToPath, pathToFileURL } from 'url';
import Sequelize from 'sequelize';
import configJson from '../config/config.js'; // config.js harus export default object

// Support __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = configJson[env];

const db = {};

// Inisialisasi Sequelize
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// Import semua model secara dinamis
const modelFiles = fs
  .readdirSync(__dirname)
  .filter(
    (file) =>
      file !== basename &&
      file.endsWith('.js') &&
      !file.startsWith('.')
  );

for (const file of modelFiles) {
  const filePath = path.join(__dirname, file);
  const fileUrl = pathToFileURL(filePath).href;
  const modelModule = await import(fileUrl);

  // Pastikan model diekspor default function
  if (typeof modelModule.default !== 'function') {
    console.error(`Model ${file} harus menggunakan "export default function(sequelize, DataTypes)"`);
    continue;
  }

  const model = modelModule.default(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

// Setup relasi antar model jika ada
for (const modelName of Object.keys(db)) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
