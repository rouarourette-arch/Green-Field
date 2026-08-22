import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import sequelize from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/product.js';
import categoryRoutes from './routes/category.js';
import cartRoutes from './routes/cart.js';
import reviewRoutes from './routes/review.js';
import orderRoutes from './routes/Order.js';
import paymentRoutes from './routes/payment.js';
import adminRoutes from './routes/admin.js';
import sellerRoutes from './routes/seller.js';
import './models/index.js';
import { handleStripeWebhook } from './controllers/Order.js';


const app = express();

app.post('/api/orders/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);
app.post('/api/payment/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);


app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/product', productRoutes);
app.use('/api/reviews', reviewRoutes);app.use('/api/category', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/seller', sellerRoutes);


const PORT = process.env.PORT;

await sequelize.authenticate();
await sequelize.sync({alter:true});
console.log("db connected")

app.listen(PORT,()=>{
    console.log(`server is running on port${PORT}`)
})