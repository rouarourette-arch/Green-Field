
import express from "express";
import cors from "cors";
import sequelize from "./config/db.js";
import "./models/index.js";
import cartRoutes from "./routes/cartRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";




const app = express();
app.use(cors())
app.use(express.json());
app.use("/api/product", productRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/cart", cartRoutes);

await sequelize.authenticate()
await sequelize.sync({ alter: true })
app.listen(process.env.PORT || 5000, () => console.log(`ByteStore API running on port ${process.env.PORT || 5000}`))


export default app;
