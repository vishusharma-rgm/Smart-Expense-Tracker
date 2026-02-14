import Budget from "../models/Budget.js";
import Expense from "../models/Expense.js";

const getMonthRange = (year, month) => {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0, 23, 59, 59, 999);
  return { start, end };
};

const computeRemainingForMonth = async (userId, budgetDoc) => {
  if (!budgetDoc) return 0;
  const { start, end } = getMonthRange(budgetDoc.year, budgetDoc.month);
  const expenses = await Expense.find({
    user: userId,
    $or: [
      { date: { $gte: start, $lte: end } },
      { createdAt: { $gte: start, $lte: end } }
    ]
  }).select("amount");
  const spent = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const totalLimit = Number(budgetDoc.limit || 0) + Number(budgetDoc.carriedOver || 0);
  return Math.max(totalLimit - spent, 0);
};

export const setBudget = async (req, res) => {
  try {
    const { limit, categoryLimits, rolloverEnabled } = req.body;

    const month = new Date().getMonth();
    const year = new Date().getFullYear();

    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;

    let budget = await Budget.findOne({
      user: req.user.id,
      month,
      year
    });

    let carriedOver = 0;
    const prevBudget = await Budget.findOne({
      user: req.user.id,
      month: prevMonth,
      year: prevYear
    });
    const rolloverFlag =
      typeof rolloverEnabled === "boolean"
        ? rolloverEnabled
        : prevBudget?.rolloverEnabled ?? true;

    if (rolloverFlag && prevBudget) {
      carriedOver = await computeRemainingForMonth(req.user.id, prevBudget);
    }

    if (budget) {
      if (typeof limit === "number") budget.limit = limit;
      if (categoryLimits && typeof categoryLimits === "object") {
        budget.categoryLimits = categoryLimits;
      }
      budget.rolloverEnabled = rolloverFlag;
      budget.carriedOver = carriedOver;
      await budget.save();
    } else {
      budget = await Budget.create({
        user: req.user.id,
        month,
        year,
        limit: typeof limit === "number" ? limit : 0,
        categoryLimits: categoryLimits || {},
        rolloverEnabled: rolloverFlag,
        carriedOver
      });
    }

    budget.history = [
      ...(budget.history || []),
      {
        date: new Date(),
        limit: budget.limit,
        carriedOver: budget.carriedOver,
        rolloverEnabled: budget.rolloverEnabled,
        categoryLimits: budget.categoryLimits
      }
    ];
    await budget.save();

    const plain = budget.toObject();
    const effectiveLimit = Number(plain.limit || 0) + Number(plain.carriedOver || 0);
    res.json({ ...plain, effectiveLimit });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getBudget = async (req, res) => {
  try {
    const month = new Date().getMonth();
    const year = new Date().getFullYear();

    const budget = await Budget.findOne({
      user: req.user.id,
      month,
      year
    });

    if (!budget) return res.json(null);
    const plain = budget.toObject();
    const effectiveLimit = Number(plain.limit || 0) + Number(plain.carriedOver || 0);
    res.json({ ...plain, effectiveLimit });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
