require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const blindboxRoutes = require('./src/route/blindboxRoutes');
const sequelize= require('./src/config/db');

app.use(cors());
app.use(express.json());
app.use('/', blindboxRoutes);

const PORT = process.env.PORT || 3004;

sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Order Service running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to sync database:', err);
  });
