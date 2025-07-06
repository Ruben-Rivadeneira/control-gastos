import cors from 'cors';
import express from 'express';
import { initDB } from './models/db';
import authRoutes from './routes/auth';
import categoryRoutes from './routes/categories';
import transactionRoutes from './routes/transactions';
import userRoutes from './routes/user';

initDB()
const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/transactions', transactionRoutes)
app.use('/api/users', userRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/auth', authRoutes)

app.listen (3001, ()=> console.log('Api listening on port 3001'))