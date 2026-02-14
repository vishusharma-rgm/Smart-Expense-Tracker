import Expense from '../models/Expense.js';

// 1️⃣ Monthly summary
export const monthlySummary = async (req, res) => {
  try {
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    const expenses = await Expense.find({
      user: req.user,
      date: { $gte: start }
    });

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    res.json({
      month: start.toLocaleString('default', { month: 'long' }),
      totalSpent: total,
      count: expenses.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get monthly summary' });
  }
};

// 2️⃣ Category breakdown
export const categoryBreakdown = async (req, res) => {
  try {
    const data = await Expense.aggregate([
      { $match: { user: req.user } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      }
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get category breakdown' });
  }
};

// 3️⃣ Last 6 months trend
export const monthlyTrend = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const data = await Expense.aggregate([
      {
        $match: {
          user: req.user,
          date: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get monthly trend' });
  }
};
