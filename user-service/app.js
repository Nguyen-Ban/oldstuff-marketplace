require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const userRoutes = require('./src/route/userRoutes');
const User = require('./src/model/user');
const bcrypt = require('bcrypt');
const sequelize = require('./src/config/db');

app.use(cors());
app.use(express.json());
app.use('/', userRoutes);

const PORT = process.env.PORT || 3001;

async function initializeAdmin() {
  const adminEmail = "admin@gmail.com";
  const adminPassword = "123";

  try {
    const existing = await User.findOne({ where: { email: adminEmail } });
    if (!existing) {
      const hashed = await bcrypt.hash(adminPassword, 10);
      await User.create({
        email: adminEmail,
        password: hashed,
        role: 'admin'
      });
      console.log("Admin account created:", adminEmail, " / password:", adminPassword);
    }
  } catch (error) {
    console.error("Failed to create admin account:", error);
  }
}

sequelize.sync()
  .then(() => initializeAdmin())
  .then(() => {
    app.listen(PORT, () => {
      console.log(`User Service running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to sync database:', err);
  });
