// server.js
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import db from '../models/index.js';

const PORT = process.env.PORT || 3001;

db.sequelize.sync() // atau { force: true } untuk bikin ulang total
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Failed to connect to database:', error);
  });
