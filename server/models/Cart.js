const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // تثبت من مسار ملف الاتصال بالـ BDD

const Cart = sequelize.define("Cart", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("active", "completed"),
    defaultValue: "active",
  },
});

module.exports = Cart;