import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { demoBudget } from "../data/demoData";

const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const [budget, setBudget] = useState(0);
  const [baseLimit, setBaseLimit] = useState(0);
  const [carriedOver, setCarriedOver] = useState(0);
  const [categoryLimits, setCategoryLimits] = useState({});
  const [rolloverEnabled, setRolloverEnabled] = useState(true);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBudget = async () => {
    if (localStorage.getItem("demo_mode") === "true") {
      setBudget(Number(demoBudget.effectiveLimit || demoBudget.limit || 0));
      setBaseLimit(Number(demoBudget.limit || 0));
      setCarriedOver(Number(demoBudget.carriedOver || 0));
      setCategoryLimits(demoBudget.categoryLimits || {});
      setRolloverEnabled(
        typeof demoBudget.rolloverEnabled === "boolean"
          ? demoBudget.rolloverEnabled
          : true
      );
      setHistory(demoBudget.history || []);
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/budget");
      setBudget(Number(res.data?.effectiveLimit || res.data?.limit || 0));
      setBaseLimit(Number(res.data?.limit || 0));
      setCarriedOver(Number(res.data?.carriedOver || 0));
      setCategoryLimits(res.data?.categoryLimits || {});
      setRolloverEnabled(
        typeof res.data?.rolloverEnabled === "boolean"
          ? res.data.rolloverEnabled
          : true
      );
      setHistory(res.data?.history || []);
    } catch (err) {
      setBudget(0);
      setBaseLimit(0);
      setCarriedOver(0);
      setCategoryLimits({});
      setRolloverEnabled(true);
      setHistory([]);
      setError(err.response?.data?.message || "Unable to load budget.");
    } finally {
      setLoading(false);
    }
  };

  const saveBudget = async ({ limit, categoryLimits, rolloverEnabled }) => {
    if (localStorage.getItem("demo_mode") === "true") {
      const nextLimit = Number(limit || 0);
      setBudget(nextLimit);
      setBaseLimit(nextLimit);
      setCarriedOver(0);
      setCategoryLimits(categoryLimits || {});
      setRolloverEnabled(
        typeof rolloverEnabled === "boolean" ? rolloverEnabled : true
      );
      setHistory((prev) => prev);
      return { ok: true };
    }
    try {
      setError("");
      const res = await api.post("/budget", {
        limit,
        categoryLimits,
        rolloverEnabled
      });
      setBudget(Number(res.data?.effectiveLimit || res.data?.limit || 0));
      setBaseLimit(Number(res.data?.limit || 0));
      setCarriedOver(Number(res.data?.carriedOver || 0));
      setCategoryLimits(res.data?.categoryLimits || {});
      setRolloverEnabled(
        typeof res.data?.rolloverEnabled === "boolean"
          ? res.data.rolloverEnabled
          : true
      );
      setHistory(res.data?.history || []);
      return { ok: true };
    } catch (err) {
      const message = err.response?.data?.message || "Unable to save budget.";
      setError(message);
      return { ok: false, message };
    }
  };

  useEffect(() => {
    fetchBudget();
  }, []);

  return (
    <BudgetContext.Provider
      value={{
        budget,
        baseLimit,
        carriedOver,
        categoryLimits,
        rolloverEnabled,
        history,
        saveBudget,
        loading,
        error,
        fetchBudget
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => useContext(BudgetContext);
