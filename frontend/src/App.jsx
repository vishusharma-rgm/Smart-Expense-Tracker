import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

import Landing from "./pages/Landing/Landing";
import About from "./pages/About/About";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import Dashboard from "./pages/Dashboard/Dashboard";
import Analytics from "./pages/Dashboard/Analytics";
import Budget from "./pages/Dashboard/Budget";
import Transactions from "./pages/Transactions/Transactions";
import Goals from "./pages/Goals/Goals";
import Planner from "./pages/Planner/Planner";
import Lab from "./pages/Lab/Lab";
import Settings from "./pages/Settings/Settings";
import Profile from "./pages/Profile/Profile";
import Leaderboard from "./pages/Leaderboard/Leaderboard";

import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { ExpenseProvider } from "./context/ExpenseContext";
import { IncomeProvider } from "./context/IncomeContext";
import { BudgetProvider } from "./context/BudgetContext";
import { ThemeProvider } from "./context/ThemeContext";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  const demo = localStorage.getItem("demo_mode") === "true";
  const token = localStorage.getItem("token");
  return user || demo || token ? children : <Navigate to="/login" replace />;
}

function Layout({ children }) {
  return (
    <div className="flex h-screen text-black dark:text-gray-100 transition-all duration-500">
      <Sidebar />
      <div className="flex-1 flex flex-col relative">
        <Navbar />
        <div className="p-8 overflow-y-auto relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("app_settings") || "null");
    const hide = stored?.privacyHideAmounts;
    const blur = stored?.privacyBlurMode;
    document.body.classList.toggle("privacy-hide", !!hide);
    document.body.classList.toggle("privacy-blur", !!blur);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <ExpenseProvider>
          <IncomeProvider>
            <BudgetProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />

                  <Route
                    path="/dashboard"
                    element={
                      <PrivateRoute>
                        <Layout>
                          <Dashboard />
                        </Layout>
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/analytics"
                    element={
                      <PrivateRoute>
                        <Layout>
                          <Analytics />
                        </Layout>
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/budget"
                    element={
                      <PrivateRoute>
                        <Layout>
                          <Budget />
                        </Layout>
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/transactions"
                    element={
                      <PrivateRoute>
                        <Layout>
                          <Transactions />
                        </Layout>
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/goals"
                    element={
                      <PrivateRoute>
                        <Layout>
                          <Goals />
                        </Layout>
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/planner"
                    element={
                      <PrivateRoute>
                        <Layout>
                          <Planner />
                        </Layout>
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/lab"
                    element={
                      <PrivateRoute>
                        <Layout>
                          <Lab />
                        </Layout>
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/leaderboard"
                    element={
                      <PrivateRoute>
                        <Layout>
                          <Leaderboard />
                        </Layout>
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/settings"
                    element={
                      <PrivateRoute>
                        <Layout>
                          <Settings />
                        </Layout>
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <Layout>
                          <Profile />
                        </Layout>
                      </PrivateRoute>
                    }
                  />
                </Routes>
              </BrowserRouter>
            </BudgetProvider>
          </IncomeProvider>
        </ExpenseProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
