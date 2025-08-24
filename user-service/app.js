require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const userRoutes = require('./src/route/userRoutes');
const sequelize = require('./src/config/db');

app.use(cors());
app.use(express.json());
app.use('/', userRoutes);

const PORT = process.env.PORT || 3001;

sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`User Service running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to sync database:', err);
  });
