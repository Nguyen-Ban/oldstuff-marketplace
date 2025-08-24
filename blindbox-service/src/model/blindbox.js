const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const BlindBox = sequelize.define("BlindBox", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  topic: { 
    type: DataTypes.STRING, allowNull: false 
  },
  minPrice: { 
    type: DataTypes.FLOAT, allowNull: false 
  },
  maxPrice: { 
    type: DataTypes.FLOAT, allowNull: false 
  },
  createdBy: { 
    type: DataTypes.INTEGER, allowNull: false 
  } // userId tạo box
}, {
  tableName: "blindbox",
  timestamps: false
});

module.exports = BlindBox;
