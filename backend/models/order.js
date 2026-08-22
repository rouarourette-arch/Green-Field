

import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";
const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cartId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "paid", "processing", "shipped", "delivered", "cancelled"),
    defaultValue: "pending",
  },
  paymentStatus: {
    type: DataTypes.ENUM("pending", "paid", "failed", "cancelled"),
    defaultValue: "pending",
  },
  stripeSessionId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  stripePaymentIntentId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default Order;