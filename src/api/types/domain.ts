// =================================================================
// ENUMS
// =================================================================

export const StockControlType = { NONE: "NONE", PER_ITEM: "PER_ITEM", GLOBAL: "GLOBAL" } as const;
export type StockControlType = typeof StockControlType[keyof typeof StockControlType];

export const UnitOfSale = { UNIT: "UNIT", WEIGHT: "WEIGHT", VOLUME: "VOLUME" } as const;
export type UnitOfSale = typeof UnitOfSale[keyof typeof UnitOfSale];

export const PaymentMethod = { CASH: "CASH", DEBIT: "DEBIT", CREDIT: "CREDIT", ON_CREDIT: "ON_CREDIT", BANK_TRANSFER: "BANK_TRANSFER" } as const;
export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];

export const ExpenseType = { RESTOCKING: "RESTOCKING", PERSONAL: "PERSONAL", BUSINESS: "BUSINESS", INVESTMENT: "INVESTMENT", OTHERS: "OTHERS" } as const;
export type ExpenseType = typeof ExpenseType[keyof typeof ExpenseType];

// =================================================================
// GENERIC & SHARED INTERFACES
// =================================================================

/** Represents a paginated API response */
export interface Page<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface EntitySummary {
  id: number;
  name: string;
}

// =================================================================
// DOMAIN-SPECIFIC TYPES
// =================================================================

// --- Dashboard Domain ---
export interface MetricCardData {
  value: number;
  percentageChange: number;
  sparklineData: number[];
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface TimeSeriesDataPoint {
  date: string;
  revenue: number;
  profit: number;
  receivables: number;
}

export interface DashboardResponse {
  grossRevenue: MetricCardData;
  netProfit: MetricCardData;
  totalExpense: MetricCardData;
  totalReceivables: MetricCardData;
  averageTicket: MetricCardData;
  salesByPaymentMethod: ChartDataPoint[];
  topSellingProducts: ChartDataPoint[];
  revenueAndProfitTrend: TimeSeriesDataPoint[];
}

// --- Settings Domain ---
export interface GeneralSettingsResponse {
  id: number;
  stockControlType: StockControlType;
  businessName: string | null;
  businessField: string | null;
}

export interface GeneralSettingsRequest {
  stockControlType: StockControlType;
  businessName?: string | null;
  businessField?: string | null;
}

// --- Product Domain ---
export interface ProductResponse {
  id: number;
  name: string;
  description: string | null;
  barcode: string | null;
  stockQuantity: number;
  salePrice: number;
  costPrice: number | null;
  unitOfSale: UnitOfSale;
  active: boolean;
  managesStock: boolean;
  category: EntitySummary;
  provider: EntitySummary | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRequest {
  name: string;
  description?: string | null;
  barcode?: string | null;
  stockQuantity: number;
  salePrice: number | undefined;
  costPrice?: number | null;
  unitOfSale: UnitOfSale;
  active: boolean;
  managesStock: boolean;
  categoryId: number;
  providerId?: number | null;
}

// --- Customer Domain ---
export interface CustomerResponse {
  id: number;
  name: string;
  taxId: string | null;
  phone: string | null;
  address: string | null;
  creditEnabled: boolean;
  creditLimit: number | null;
  debtBalance: number;
  lastCreditPurchaseAt: string | null;
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

export interface CustomerRequest {
  name: string;
  taxId?: string | null;
  phone?: string | null;
  address?: string | null;
  creditEnabled: boolean;
  creditLimit?: number | null;
  active: boolean;
}

// --- Sale Domain ---
export interface SaleItemRequest {
  productId: number;
  quantity: number;
}

export interface SaleRequest {
  customerId?: number | null;
  paymentMethod: PaymentMethod;
  description?: string | null;
  items: SaleItemRequest[];
}

export interface SaleItemResponse {
  id: number;
  product: EntitySummary; // Reutilizando o tipo genérico
  quantity: number;
  unitPrice: number;
  totalValue: number;
}

export interface SaleResponse {
  id: number;
  totalValue: number;
  customer: EntitySummary | null;
  paymentMethod: PaymentMethod;
  description: string | null;
  saleDate: string;
  items: SaleItemResponse[];
}

// --- Expense Domain ---
export interface ExpenseResponse {
  id: number;
  name: string;
  value: number;
  expenseDate: string;
  expenseType: ExpenseType;
  paymentMethod: PaymentMethod;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RestockItemRequest {
  productId: number;
  quantity: number;
  unitCostPrice: number;
}

export interface ExpenseRequest {
  name: string;
  value?: number | undefined;
  expenseDate: string;
  expenseType: ExpenseType;
  paymentMethod: PaymentMethod;
  description?: string | null;
  restockItems: RestockItemRequest[];
}

// --- Reports Domain ---
export interface AbcAnalysisRow {
  productId: number;
  productName: string;
  totalRevenue: number;
  percentageOfTotalRevenue: number;
  cumulativePercentage: number;
  abcClass: 'A' | 'B' | 'C';
}

// --- Category ---
export type CategoryResponse = EntitySummary;
export type CategoryRequest = Omit<EntitySummary, 'id'>;

// --- Provider ---
export type ProviderResponse = EntitySummary;
export type ProviderRequest = Omit<EntitySummary, 'id'>;