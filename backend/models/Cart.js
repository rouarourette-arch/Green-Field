import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

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

export default Cart;