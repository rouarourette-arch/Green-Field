import "dotenv/config";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.DB_NAME || "bytestore", process.env.DB_USER || "root", process.env.DB_PASSWORD || "", {
	host: process.env.HOST || "localhost",
	dialect: "mysql",
	logging: false,
});

export default sequelize