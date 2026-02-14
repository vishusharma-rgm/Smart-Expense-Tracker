
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

app.use(cors({
  origin: "http://localhost:5173",
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  skip: (req) => req.method === "OPTIONS" || req.path.startsWith("/api/auth"),
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
