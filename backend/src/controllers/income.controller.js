import Income from "../models/Income.js";

export const getIncome = async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user.id }).sort({ date: -1 });
    res.json(incomes);
  } catch (error) {
    console.log(error); 
    res.status(500).json({ message: "Server error" });
  }
};

export const addIncome = async (req, res) => {
  try {
    const { amount, source } = req.body;

    const income = await Income.create({
      user: req.user.id,
      amount,
      source
    });

    res.status(201).json(income);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income || income.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Not found" });
    }

    await income.deleteOne();
    res.json({ message: "Income removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income || income.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Not found" });
    }

    income.amount = req.body.amount ?? income.amount;
    income.source = req.body.source ?? income.source;
    income.date = req.body.date ?? income.date;

    const updated = await income.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
