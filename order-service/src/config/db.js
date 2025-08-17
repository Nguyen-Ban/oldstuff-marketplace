const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE || 'orders',
    process.env.MYSQL_USER || 'root',
    process.env.MYSQL_PASSWORD || 'Nguyenban2004@',
    {
        host: process.env.MYSQL_HOST || 'localhost',
        dialect: process.env.MYSQL_DIALECT || 'mysql',
    }
)

module.exports = sequelize;