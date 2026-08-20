import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import sequelize from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT;

await sequelize.authenticate
await sequelize.sync({alter:true});
console.log("db connected")

app.listen(PORT,()=>{
    console.log(`server is running on port${PORT}`)
})