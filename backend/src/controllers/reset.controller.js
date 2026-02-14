import Expense from "../models/Expense.js";
import Income from "../models/Income.js";
import Budget from "../models/Budget.js";

export const resetUserData = async (req, res) => {
  try {
    const userId = req.user.id;

    const [expensesResult, incomeResult, budgetResult] = await Promise.all([
      Expense.deleteMany({ user: userId }),
      Income.deleteMany({ user: userId }),
      Budget.deleteMany({ user: userId }),
    ]);

    res.json({
      message: "User data reset successfully",
      deleted: {
        expenses: expensesResult.deletedCount || 0,
        income: incomeResult.deletedCount || 0,
        budgets: budgetResult.deletedCount || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to reset data" });
  }
};
