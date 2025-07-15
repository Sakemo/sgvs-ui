import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import ProductsPage from './pages/ProductsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/products" element={<ProductsPage />} />
          
          <Route path="/" element={<div>Dashboard Page</div>} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;