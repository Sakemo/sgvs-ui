import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import ProductsPage from "./pages/ProductsPage";
import CustomerPage from "./pages/CustomersPage";
import ExpensesPage from "./pages/ExpensesPage";
import SalesPage from "./pages/SalesPage";
import SettingsPage from "./pages/SettingsPage";
import DashboardPage from "./pages/DashboardPage";
import ReportsPage from "./pages/ReportsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Context
import { SettingsProvider } from "./contexts/SettingsProvider";
import { ConfirmationModalProvider } from "./contexts/ConfirmationModalProvider";
import { ThemeProvider } from "./contexts/ThemeProvider";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import type { JSX } from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <SettingsProvider>
            <ConfirmationModalProvider>
              <Toaster
                position="bottom-right"
                toastOptions={{
                  className: "",
                  style: {
                    border: "1px solid #E5E7EB",
                    padding: "16px",
                    color: "#1f2937",
                    boxShadow: "0 4px 16px -2px rgba(0, 0, 0, 0.08)",
                  },
                  success: {
                    iconTheme: { primary: "#16a34a", secondary: "white" },
                  },
                  error: {
                    iconTheme: { primary: "#dc2626", secondary: "white" },
                  },
                }}
              />
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route
                  element={
                    <ProtectedRoute>
                      <MainLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/sales" element={<SalesPage />} />
                  <Route path="/expenses" element={<ExpensesPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/customers" element={<CustomerPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ConfirmationModalProvider>
          </SettingsProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;
