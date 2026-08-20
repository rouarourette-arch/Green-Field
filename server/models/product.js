import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const Product = sequelize.define("Product", {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    images: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }}
    );

export default Product;