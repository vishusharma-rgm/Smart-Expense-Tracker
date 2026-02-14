
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.routes.js';
import expenseRoutes from './routes/expense.routes.js';
import budgetRoutes from './routes/budget.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import incomeRoutes from "./routes/income.routes.js";
import resetRoutes from "./routes/reset.routes.js";


const app = express();


// Security middleware
app.use(helmet());

const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
}));

const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  max: Number(process.env.RATE_LIMIT_MAX || 2000),
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) =>
    req.method === "OPTIONS" ||
    req.path.startsWith("/api/auth") ||
    req.path.startsWith("/api/reset"),
});

app.use(limiter);

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/reset", resetRoutes);

// Health route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    message: err.message || 'Server Error'
  });
});

export default app;
