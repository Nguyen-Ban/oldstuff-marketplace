require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const productRoutes = require('./src/route/productRoutes');
const sequelize= require('./src/config/db');

app.use(cors());
app.use(express.json());
app.use('/', productRoutes);

const PORT = process.env.PORT || 3002;

sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Product Service running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to sync database:', err);
  });
