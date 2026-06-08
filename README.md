# 🎨 SGVS UI - Simplified Sales Management System

[![Status](https://img.shields.io/badge/Status-In%20Development-yellow?style=flat-square&logo=checkmark)](https://github.com)
[![React Version](https://img.shields.io/badge/React-19.1.0-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Latest-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-Latest-purple?style=flat-square&logo=vite)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

---

## 📋 Description

**SGVS UI** is a modern, responsive frontend application built with **React 19**, **TypeScript**, and **Vite** that provides a "CEO experience" for small and medium-sized business managers. With an intuitive interface, real-time analytics, and intelligent workflows, the platform transforms raw sales and inventory data into actionable business insights. Features dark/light theme support, full internationalization (English/Portuguese), and accessible components.

---

## 🎬 Visual Demonstration

### Dashboard & Product Management
Here's a screenshot of the main dashboard showing sales metrics and quick product access:

<img width="1870" height="954" alt="Screenshot 2026-05-14 at 14-34-53 Flick Business" src="https://github.com/user-attachments/assets/121b8ca7-cdc5-495a-a9b4-d3e28f6c5cec" />

```
Features visible:
✅ Real-time sales metrics (revenue, profit, orders)
✅ Visual charts with sales trends
✅ Quick-access inventory status
✅ Dark/Light theme toggle
```

### Sales & Inventory Management
Sales form with autocomplete and inventory control:

<img width="1870" height="954" alt="Screenshot 2026-05-14 at 14-35-42 Flick Business" src="https://github.com/user-attachments/assets/d928efe1-cdf1-4a27-833f-4ddb7a884588" />

```
Features visible:
✅ Intelligent product/customer autocomplete
✅ Real-time margin calculations
✅ Inventory updates on sale completion
✅ Discount management per item
```

> 💡 **Tip:** <img width="1280" height="720" alt="Screen-Recording(1) (online-video-cutter com) (online-video-cutter com)" src="https://github.com/user-attachments/assets/b1be2b7f-f60a-460b-9d58-1d3ecb50bbcd" />


---

## 🛠 Technologies Used

### **Frontend Framework**
- **React 19** — Modern UI library with hooks and concurrent features
- **TypeScript** — Static typing for safer code
- **Vite** — Lightning-fast build tool and dev server
- **React Router v7** — Client-side routing and navigation

### **Styling & UI Components**
- **TailwindCSS 3.4.17** — Utility-first CSS framework
- **Class Variance Authority (CVA)** — Type-safe component variants
- **Headless UI** — Unstyled, accessible components
- **Lucide React** — Modern icon library
- **React Icons** — Additional icon sets

### **State Management & Data**
- **React Context API** — Global state (Auth, Theme, Settings)
- **Axios** — HTTP client for API communication
- **JWT Decode** — Token parsing for authentication

### **Internationalization & UX**
- **i18next + react-i18next** — Multi-language support (EN/PT-BR)
- **react-hot-toast** — Toast notifications
- **date-fns** — Date formatting and manipulation

### **Data Visualization**
- **Recharts** — React charting library for analytics

### **Development & Quality**
- **ESLint** — Code linting
- **Prettier** — Code formatting
- **TypeScript Compiler** — Type checking
- **Vite HMR** — Hot module replacement

---

## ✨ Key Features

### 🎯 **Dashboard & Analytics**
- ✅ Real-time sales metrics and KPIs
- ✅ Visual charts (line, bar, pie) with sales trends
- ✅ Profit margin overview
- ✅ Low stock alerts
- ✅ Product ABC curve analysis

### 📦 **Product Management**
- ✅ Full CRUD with drag-to-copy functionality
- ✅ Real-time profit margin calculations
- ✅ Stock level tracking and alerts
- ✅ Category organization
- ✅ Advanced filtering and sorting
- ✅ Product details drawer

### 👥 **Customer Management**
- ✅ Complete customer database
- ✅ Contact details and purchase history
- ✅ Customer filtering and search
- ✅ Confirmation modals for critical actions
- ✅ Generic customer support

### 💰 **Sales Management**
- ✅ Fast sales creation with autocomplete
- ✅ Multi-item cart system
- ✅ Real-time subtotal and margin calculations
- ✅ Per-item discount control
- ✅ Automatic inventory updates
- ✅ Sales history and filtering

### 💸 **Expense Tracking**
- ✅ Operational expense recording
- ✅ Restocking expenses with inventory sync
- ✅ Expense categorization
- ✅ Historical reports and analytics

### 🌓 **User Experience**
- ✅ Light/Dark theme toggle with persistence
- ✅ Full English/Portuguese support
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Global toast notification system
- ✅ Confirmation dialogs for destructive actions
- ✅ Loading states and error handling
- ✅ Keyboard navigation & shortcuts

### 🔐 **Authentication**
- ✅ Secure login/register
- ✅ Google OAuth integration
- ✅ JWT token management
- ✅ Protected routes
- ✅ Session persistence

---

## 🎓 The Process and Learnings

### **The Process**

We started by creating a component library with **CVA (Class Variance Authority)** to ensure consistency across all UI elements. This was crucial because consistency directly impacts user trust.

Building the **Sales form** was the most complex task — it required:

1. **Real-time autocomplete** — Searching products and customers with debouncing to avoid excessive API calls.
2. **Reactive form state** — When you add/remove items, the totals must update instantly. Solution: managed state with proper dependency arrays.
3. **Theme management** — Toggling dark mode at the application level without flickering. Solution: Context API + localStorage for persistence.
4. **Internationalization complexity** — 50+ translation keys across different sections. Solution: structured i18n files + namespace organization.

### **What I Learned**

This project deeply expanded my understanding of:

- **React Performance**: Not every state update needs the entire app to re-render. I learned about React.memo, useCallback, and proper Context API segmentation.
- **Component Design Philosophy**: Building truly reusable components is HARD. CVA helped enforce constraints while maintaining flexibility.
- **Accessibility (a11y)**: Headless UI taught me that accessible components aren't an afterthought — they're fundamental to good UX.
- **Form State Management**: Managing form complexity in React without a library (like React Hook Form) revealed why those libraries exist.
- **Type Safety with TypeScript**: Strong typing caught bugs at compile-time that would've only surfaced in production. Especially critical for API response handling.
- **Global State Pitfalls**: Too much global state causes performance issues. I learned to segment state by domain (Auth, Theme, Settings).
- **Dark Mode Implementation**: It's not just CSS variables — it requires careful consideration of contrast, readability, and user preference persistence.

---

## 🚀 How to Run the Project
Just want to **use** the project? https://sgvs-ui.onrender.com/login

### Developers
### **Prerequisites**

You'll need to have installed:

- **Node.js 18+** ([Download](https://nodejs.org/))
- **npm 9+** or **yarn** (comes with Node.js)
- **Git** to clone the repository
- **SGVS API running** on `http://localhost:8081` (see [sgvs-api](https://github.com/your-username/sgvs-api))

### **Step 1: Clone the Repository**

```bash
git clone https://github.com/your-username/sgvs-ui.git
cd sgvs-ui
```

### **Step 2: Install Dependencies**

```bash
npm install
```

> This will install all packages from package.json.

### **Step 3: Configure Environment Variables**

1. Create a .env.local file in the project root:

```bash
touch .env.local
```

2. Add your configuration:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8081/api
VITE_API_TIMEOUT=30000

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# App Configuration
VITE_APP_NAME=SGVS
VITE_PORT=5173
```

> ⚠️ **IMPORTANT:** Never commit .env.local! Use `.env.local.example` for version control.

### **Step 4: Ensure Backend API is Running**

The frontend expects the SGVS API to be running on `http://localhost:8081`:

```bash
# In another terminal, start the backend
cd ../sgvs-api
./mvnw spring-boot:run
```

Or verify with:

```bash
curl http://localhost:8081/actuator/health
```

### **Step 5: Start the Development Server**

```bash
npm run dev
```

The application will open at: **`http://localhost:5173`**

You'll see HMR (Hot Module Replacement) enabled — changes are reflected instantly without page reload.

### **Step 6: Login to the Application**

1. Navigate to the login page
2. Use credentials from the backend or Google OAuth
3. Explore the dashboard!

### **Step 7: Build for Production**

```bash
npm run build
```

This creates an optimized build in the dist folder.

### **Step 8: Preview Production Build Locally**

```bash
npm run preview
```

Visit **`http://localhost:5173`** to test the production build.

---

## 🔌 Environment Variables (.env.local Example)

Create a .env.local file with these variables:

```env
# Backend API
VITE_API_BASE_URL=http://localhost:8081/api
VITE_API_TIMEOUT=30000

# Google OAuth (optional for Google login)
VITE_GOOGLE_CLIENT_ID=100517451932-6ig5ef7nssk34smisede47ogo9vsihuh.apps.googleusercontent.com

# Application
VITE_APP_NAME=SGVS
VITE_PORT=5173

# Logging (optional)
VITE_DEBUG=false
```

---

## 📁 Project Structure

```
src/
├── api/                    # API integration
│   ├── services/          # Service layer (ProductService, SaleService, etc.)
│   └── types/             # TypeScript interfaces & types
├── assets/                # Images, SVGs, static files
├── components/            # Reusable UI components
│   ├── common/           # Buttons, modals, inputs
│   ├── features/         # Feature-specific components (ProductTable, SalesForm)
│   ├── layout/           # Layout components (Navbar, Sidebar)
│   └── lib/              # Component utilities
├── contexts/             # React Context providers
│   ├── AuthContext.tsx
│   ├── ThemeContext.tsx
│   ├── SettingsContext.tsx
│   └── ConfirmationModalProvider.tsx
├── hooks/                # Custom React hooks
│   ├── useDebounce.ts
│   ├── usePagination.ts
│   └── useShortcutAction.ts
├── lib/                  # Utilities & helpers
│   ├── apiClient.ts      # Axios instance with interceptors
│   ├── auth-error-message.ts
│   └── keyboardShortcuts.ts
├── locales/              # i18n translations
│   ├── en/
│   └── pt/
├── pages/                # Route pages
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── ProductsPage.tsx
│   ├── SalesPage.tsx
│   └── ...
├── styles/               # Global styles
├── utils/                # Helper functions
├── App.tsx               # Main app component & routes
├── main.tsx              # Entry point
└── vite-env.d.ts         # Vite type definitions
```

---

## 🧪 Linting & Code Quality

### **Run ESLint**

```bash
npm run lint
```

### **Format Code with Prettier**

```bash
npm run format
```

### **Type Checking**

```bash
npm run type-check
```

---

## 📦 Build & Deployment

### **Production Build**

```bash
npm run build
```

Creates optimized, minified files in dist.

### **Deploy to Vercel (Recommended)**

```bash
npm install -g vercel
vercel
```

### **Deploy to Netlify**

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### **Deploy to AWS S3 + CloudFront**

```bash
# Build
npm run build

# Deploy (requires AWS credentials)
aws s3 sync dist/ s3://your-bucket-name --delete
```

---

## 📚 Documentation & Resources

- **React Docs:** https://react.dev
- **Vite Docs:** https://vite.dev
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/
- **TailwindCSS:** https://tailwindcss.com/docs
- **i18next:** https://www.i18next.com/
- **Recharts:** https://recharts.org/

---

## 🤝 Contributing

This is a personal project. If you find bugs or have UI/UX suggestions, please open an **issue** or **pull request**.

---

## 📄 License

This project is under the **MIT** license. See the LICENSE file for details.

---

## 👨‍💻 Author

Crafted with ❤️ and ☕ as a modern full-stack business management application.

**Backend (Spring Boot):** [sgvs-api](https://github.com/your-username/sgvs-api)

---

## 🔗 Useful Links

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
- [TailwindCSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Recharts Documentation](https://recharts.org/)
- [i18next Guide](https://www.i18next.com/)
- [Axios Documentation](https://axios-http.com/)
```
