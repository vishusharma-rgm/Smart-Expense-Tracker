import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";
import { demoExpenses } from "../data/demoData";

const ExpenseContext = createContext();

export function ExpenseProvider({ children }) {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = async () => {
    if (localStorage.getItem("demo_mode") === "true") {
      setExpenses(demoExpenses);
      return;
    }
    try {
      const res = await api.get("/expenses");
      setExpenses(res.data);
    } catch (err) {
      console.log("Fetch expenses error:", err);
    }
  };

  const addExpense = async (data) => {
    if (localStorage.getItem("demo_mode") === "true") {
      const demoItem = {
        ...data,
        _id: `demo-exp-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      setExpenses((prev) => [demoItem, ...prev]);
      return;
    }
    try {
      const res = await api.post("/expenses", data);
      setExpenses((prev) => [res.data, ...prev]);
    } catch (err) {
      console.log("Add expense error:", err);
    }
  };

  const deleteExpense = async (id) => {
    if (localStorage.getItem("demo_mode") === "true") {
      setExpenses((prev) => prev.filter((e) => e._id !== id));
      return;
    }
    try {
      await api.delete(`/expenses/${id}`);
      setExpenses((prev) =>
        prev.filter((e) => e._id !== id)
      );
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  const updateExpense = async (id, data) => {
    if (localStorage.getItem("demo_mode") === "true") {
      setExpenses((prev) =>
        prev.map((exp) =>
          exp._id === id ? { ...exp, ...data } : exp
        )
      );
      return;
    }
    try {
      const res = await api.put(`/expenses/${id}`, data);
      setExpenses((prev) =>
        prev.map((exp) =>
          exp._id === id ? res.data : exp
        )
      );
    } catch (err) {
      console.log("Update expense error:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user]);

  return (
    <ExpenseContext.Provider
      value={{ expenses, addExpense, deleteExpense, updateExpense, fetchExpenses }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export const useExpenses = () => useContext(ExpenseContext);
