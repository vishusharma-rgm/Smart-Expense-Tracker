import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { demoIncomes } from "../data/demoData";

const IncomeContext = createContext();

export const IncomeProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);

  const fetchIncome = async () => {
    if (localStorage.getItem("demo_mode") === "true") {
      setIncomes(demoIncomes);
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      setIncomes([]);
      return;
    }
    try {
      const res = await api.get("/income");
      setIncomes(res.data);
    } catch (err) {
      console.log("Fetch income error:", err);
    }
  };

  const addIncome = async (data) => {
    if (localStorage.getItem("demo_mode") === "true") {
      const demoItem = {
        ...data,
        _id: `demo-inc-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      setIncomes((prev) => [demoItem, ...prev]);
      return;
    }
    try {
      const res = await api.post("/income", data);
      setIncomes((prev) => [res.data, ...prev]);
    } catch (err) {
      console.log("Add income error:", err);
    }
  };

  const deleteIncome = async (id) => {
    if (localStorage.getItem("demo_mode") === "true") {
      setIncomes((prev) =>
        prev.filter((i) => i._id !== id)
      );
      return;
    }
    try {
      await api.delete(`/income/${id}`);
      setIncomes((prev) =>
        prev.filter((i) => i._id !== id)
      );
    } catch (err) {
      console.log("Delete income error:", err);
    }
  };

  const updateIncome = async (id, data) => {
    if (localStorage.getItem("demo_mode") === "true") {
      setIncomes((prev) =>
        prev.map((inc) =>
          inc._id === id ? { ...inc, ...data } : inc
        )
      );
      return;
    }
    try {
      const res = await api.put(`/income/${id}`, data);
      setIncomes((prev) =>
        prev.map((inc) =>
          inc._id === id ? res.data : inc
        )
      );
    } catch (err) {
      console.log("Update income error:", err);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  return (
    <IncomeContext.Provider
      value={{ incomes, addIncome, deleteIncome, updateIncome, fetchIncome }}
    >
      {children}
    </IncomeContext.Provider>
  );
};

export const useIncome = () => useContext(IncomeContext);
