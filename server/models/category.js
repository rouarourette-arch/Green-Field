import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const Category = sequelize.define("Category", {
    name: { type: DataTypes.STRING(80), allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true },
}, { underscored: true });

export default Category;