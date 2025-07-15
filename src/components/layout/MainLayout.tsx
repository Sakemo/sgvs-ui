import React from 'react';
import { Outlet } from 'react-router-dom';

const Sidebar: React.FC = () => (
  <aside className="w-64 flex-shrink-0 bg-card-light dark:bg-card-dark border-r border-border-light dark:border-border-dark p-4">
    <h1 className="text-xl font-bold">SGVS</h1>
    <nav className="mt-8 space-y-2">
      <a href="/products" className="block p-2 rounded-btn hover:bg-gray-100 dark:hover:bg-gray-800">Products</a>
    </nav>
  </aside>
);

const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-bg-light dark:bg-bg-dark">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;