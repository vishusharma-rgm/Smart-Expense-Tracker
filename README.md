# Smart Expense Tracker

Smart Expense Tracker is a luxury‑styled personal finance app that combines clean visuals with real utility. It brings expenses, income, budgets, analytics, and goals into one calm, premium workspace. The UI is designed to feel human‑made and polished while still being fast and practical.

## Why This Project
Most finance apps feel noisy or purely functional. This project focuses on clarity and trust. The layout is intentional, the surfaces are soft and premium, and every page is built to help a user understand their money without feeling overwhelmed.

## What It Does
- Unified view of expenses and income
- Daily, monthly, and category insights
- Budgeting with remaining and forecast
- Savings goals with progress
- Planner for bills and cashflow
- Privacy mode to blur or hide amounts
- Export options for CSV and PDF
- Demo mode for instant exploration

## Core Pages

### Dashboard
The main control center. It shows today’s spend, monthly usage, budget status, cashflow cards, mini trends, alerts, and quick actions to add expense or income.

### Analytics
Category breakdown and monthly comparison with premium charts. It helps users quickly understand where money goes and how patterns change.

### Budget
Set monthly limits, track remaining, and view forecast. Includes trend feedback so users can see how spending affects savings.

### Transactions
One unified list for income and expenses. Includes filters, sorting, and export. It’s the operational view for real control.

### Goals
Track savings goals with progress and milestones to keep motivation high.

### Planner
Bill calendar and cashflow timeline, designed for due dates and upcoming expenses.

### Money Lab
Advanced finance tools like debt tracker, savings vault, merchant insights, and smart split for group expenses.

### Leaderboard
Streaks, challenges, weekly goals, and milestones. Makes finance feel engaging without gamification overload.

### Settings and Profile
Privacy controls, notifications, data tools, and profile sections like account info, activity, and security.

## Design Direction
- Luxury neutral palette with soft tints
- Glass surfaces and clean spacing
- Premium typography
- Subtle motion and hover depth
- Consistent layout across pages

## Tech Stack
- Frontend: React, Vite, Tailwind CSS v4, Recharts
- Backend: Node.js, Express, MongoDB
- Auth: JWT
- Email: Nodemailer (Gmail SMTP)
- Deploy: Vercel (frontend), Render (backend)

## Local Setup

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend
```
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=you@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=Smart Expense Tracker <you@gmail.com>
APP_URL=http://localhost:5173

CORS_ORIGINS=http://localhost:5173,https://your-vercel-domain
```

### Frontend
```
VITE_API_URL=http://localhost:3000
```

## Deployment

### Frontend on Vercel
- Root Directory: `frontend`
- Build command: `npm run build`
- Env: `VITE_API_URL=https://your-render-api`

### Backend on Render
- Root Directory: `backend`
- Start command: `npm start` or `node src/server.js`
- Add env vars from backend section

## Notes
- Voice input works best in Chrome.
- Demo mode uses local data to keep exploration fast.

## License
MIT
