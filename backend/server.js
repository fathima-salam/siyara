import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import stripeRoutes from './routes/stripeRoutes.js';
import adminRoutes from './routes/adminRoutes/index.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load .env from backend directory (works even when started from project root or via dotenvx)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.error('Fatal: JWT_SECRET environment variable is required in production.');
  process.exit(1);
}
if (!process.env.MONGO_URI) {
  console.error('Fatal: MONGO_URI is missing. Add it to backend/.env or set the env var.');
  process.exit(1);
}
connectDB();

const app = express();

// CORS — allow requests from Next.js frontend (any localhost port in dev, explicit in prod)
const corsOptions = {
    origin: (origin, callback) => {
        const allowed = [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://localhost:3001',
            'http://127.0.0.1:3001',
        ];
        // Allow requests with no origin (e.g. same-origin, Postman) or from allowed list
        if (!origin || allowed.includes(origin)) {
            callback(null, true);
            return;
        }
        // In development, allow any localhost / 127.0.0.1 on any port
        if (process.env.NODE_ENV !== 'production' && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded product images from public folder
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'API is running' }));

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));
