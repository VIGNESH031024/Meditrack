export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  sku: string;
  barcode: string;
  batchNumber: string;
  expiryDate: string;
  manufacturer: string;
  price: number;
  costPrice: number;
  quantity: number;
  reorderLevel: number;
  location: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  products: string[];
}

export interface Order {
  id: string;
  orderNumber: string;
  supplier: Supplier;
  products: OrderItem[];
  status: 'pending' | 'approved' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'partial';
  createdAt: string;
  updatedAt: string;
  expectedDelivery?: string;
  notes?: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Notification {
  id: string;
  type: 'low-stock' | 'expiry' | 'order' | 'delivery' | 'system';
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface StockAlert {
  product: Product;
  type: 'low-stock' | 'expiry';
  daysToExpiry?: number;
}

export interface SalesData {
  date: string;
  revenue: number;
  units: number;
}

export interface DashboardStats {
  totalProducts: number;
  lowStockItems: number;
  expiringItems: number;
  pendingOrders: number;
  monthlySales: SalesData[];
  topSellingProducts: {
    product: Product;
    soldUnits: number;
  }[];
}