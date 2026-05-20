import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import ProductsPage from "./pages/ProductsPage";
import ProvidersPage from "./pages/ProvidersPage";
import CustomerPage from "./pages/CustomersPage";
import ExpensesPage from "./pages/ExpensesPage";
import SalesPage from "./pages/SalesPage";
import SettingsPage from "./pages/SettingsPage";
import DashboardPage from "./pages/DashboardPage";
import ReportsPage from "./pages/ReportsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LandingPage from "./pages/LandingPage";

// Context
import { SettingsProvider } from "./contexts/SettingsProvider";
import { ConfirmationModalProvider } from "./contexts/ConfirmationModalProvider";
import { ThemeProvider } from "./contexts/ThemeProvider";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import type { JSX } from "react";
import { useSettings } from "./contexts/utils/UseSettings";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const PublicOnlyRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  const { defaultStartPage } = useSettings();
  if (isAuthenticated) return <Navigate to={defaultStartPage} replace />;
  return children;
};

const AppRedirect = () => {
  const { isAuthenticated } = useAuth();
  const { defaultStartPage } = useSettings();
  return <Navigate to={isAuthenticated ? defaultStartPage : "/"} replace />;
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
                    border: "1px solid #E2DAD4",
                    background: "#FFFCFA",
                    padding: "16px",
                    color: "#1E1E1E",
                    boxShadow: "0 18px 42px -30px rgba(30, 30, 30, 0.32)",
                  },
                  success: {
                    iconTheme: { primary: "#53B154", secondary: "#1E1E1E" },
                  },
                  error: {
                    iconTheme: { primary: "#dc2626", secondary: "#FFFCFA" },
                  },
                }}
              />
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route
                  path="/login"
                  element={
                    <PublicOnlyRoute>
                      <LoginPage />
                    </PublicOnlyRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicOnlyRoute>
                      <RegisterPage />
                    </PublicOnlyRoute>
                  }
                />

                <Route
                  element={
                    <ProtectedRoute>
                      <MainLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/sales" element={<SalesPage />} />
                  <Route path="/expenses" element={<ExpensesPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/providers" element={<ProvidersPage />} />
                  <Route path="/customers" element={<CustomerPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>

                <Route path="*" element={<AppRedirect />} />
              </Routes>
            </ConfirmationModalProvider>
          </SettingsProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;
