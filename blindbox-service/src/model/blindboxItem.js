const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const BlindBox = require("./blindbox");

const BlindBoxItem = sequelize.define("BlindBoxItem", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  blindboxId: {
    type: DataTypes.INTEGER,
    references: { 
        model: BlindBox, 
        key: "id" 
    }
  },
  productId: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
}, {
  tableName: "blindbox_item",
  timestamps: false
});

BlindBox.hasMany(BlindBoxItem, { foreignKey: "blindboxId" });
BlindBoxItem.belongsTo(BlindBox, { foreignKey: "blindboxId" });

module.exports = BlindBoxItem;
