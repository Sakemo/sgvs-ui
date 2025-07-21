import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import ProductsPage from "./pages/ProductsPage";
import CustomersPage from "./pages/CustomersPage";
import ExpensesPage from "./pages/ExpensesPage";
import SalesPage from "./pages/SalesPage";
import { SettingsProvider } from "./contexts/SettingsProvider";
import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<div>Dashboard Page</div>} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </SettingsProvider>
    </BrowserRouter>
  );
}

export default App;
