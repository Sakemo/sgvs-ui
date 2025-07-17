import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import ProductsPage from './pages/ProductsPage';
import CustomersPage from './pages/CustomersPage';
import ExpensesPage from './pages/ExpensesPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<div>Dashboard Page</div>} /> 
          <Route path="/sales" element={<div>Sales Page</div>} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/settings" element={<div>Settings Page</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;