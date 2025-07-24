import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import ProductsPage from "./pages/ProductsPage";
import CustomersPage from "./pages/CustomersPage";
import ExpensesPage from "./pages/ExpensesPage";
import SalesPage from "./pages/SalesPage";
import { SettingsProvider } from "./contexts/SettingsProvider";
import SettingsPage from "./pages/SettingsPage";
import { ConfirmationModalProvider } from "./contexts/ConfirmationModalProvider";
import { ThemeProvider } from "./contexts/ThemeProvider";
import { Toaster } from "react-hot-toast";
import DashboardPage from "./pages/DashboardPage";
import ReportsPage from "./pages/ReportsPage";

function App() {
  return (
    <BrowserRouter>
    <ThemeProvider>
      <SettingsProvider>
        <ConfirmationModalProvider>
            <Toaster
              position="bottom-right"
              toastOptions={{
                className: '',
                style: {
                  border: '1px solid #E5E7EB', // border-border-light
                  padding: '16px',
                  color: '#1F2937', // text-text-primary
                  boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.08)',
                },
                success: {
                  iconTheme: {
                    primary: '#16A34A', // green-600
                    secondary: 'white',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#DC2626', // red-600
                    secondary: 'white',
                  },
                },
              }}
            />          
            <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/sales" element={<SalesPage />} />
              <Route path="/expenses" element={<ExpensesPage />} />
              <Route path="/reports" element={<ReportsPage/>} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </ConfirmationModalProvider>
      </SettingsProvider>
    </ThemeProvider>

    </BrowserRouter>
  );
}

export default App;
