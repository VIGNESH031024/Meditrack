import { User, Product, Supplier, Order, Notification, StockAlert, DashboardStats } from '../types';
import { addDays, format, subDays } from 'date-fns';

// Mock Users
export const currentUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@meditrack.com',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

export const users: User[] = [
  currentUser,
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@meditrack.com',
    role: 'staff',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '3',
    name: 'Robert Johnson',
    email: 'robert@meditrack.com',
    role: 'staff',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

// Mock Products
export const products: Product[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    description: 'Pain reliever and fever reducer',
    category: 'Pain Relief',
    sku: 'PR-001',
    barcode: '8901234567890',
    batchNumber: 'BT2023-001',
    expiryDate: format(addDays(new Date(), 365), 'yyyy-MM-dd'),
    manufacturer: 'MediPharma',
    price: 5.99,
    costPrice: 3.50,
    quantity: 120,
    reorderLevel: 30,
    location: 'Shelf A-1',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    createdAt: format(subDays(new Date(), 60), 'yyyy-MM-dd'),
    updatedAt: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
  },
  {
    id: '2',
    name: 'Amoxicillin 250mg',
    description: 'Antibiotic medication',
    category: 'Antibiotics',
    sku: 'AB-002',
    barcode: '8901234567891',
    batchNumber: 'BT2023-002',
    expiryDate: format(addDays(new Date(), 180), 'yyyy-MM-dd'),
    manufacturer: 'PharmaCorp',
    price: 12.99,
    costPrice: 7.25,
    quantity: 45,
    reorderLevel: 20,
    location: 'Shelf B-3',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    createdAt: format(subDays(new Date(), 90), 'yyyy-MM-dd'),
    updatedAt: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
  },
  {
    id: '3',
    name: 'Insulin Glargine',
    description: 'Long-acting insulin',
    category: 'Diabetes',
    sku: 'DB-003',
    barcode: '8901234567892',
    batchNumber: 'BT2023-003',
    expiryDate: format(addDays(new Date(), 90), 'yyyy-MM-dd'),
    manufacturer: 'DiabeCare',
    price: 45.99,
    costPrice: 32.00,
    quantity: 15,
    reorderLevel: 10,
    location: 'Refrigerator 1',
    image: 'https://images.unsplash.com/photo-1631549916768-4119b4123a21?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    createdAt: format(subDays(new Date(), 120), 'yyyy-MM-dd'),
    updatedAt: format(subDays(new Date(), 15), 'yyyy-MM-dd'),
  },
  {
    id: '4',
    name: 'Lisinopril 10mg',
    description: 'ACE inhibitor for high blood pressure',
    category: 'Cardiovascular',
    sku: 'CV-004',
    barcode: '8901234567893',
    batchNumber: 'BT2023-004',
    expiryDate: format(addDays(new Date(), 730), 'yyyy-MM-dd'),
    manufacturer: 'HeartHealth',
    price: 8.99,
    costPrice: 4.50,
    quantity: 8,
    reorderLevel: 25,
    location: 'Shelf C-2',
    image: 'https://images.unsplash.com/photo-1585435557343-3b348031e799?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    createdAt: format(subDays(new Date(), 150), 'yyyy-MM-dd'),
    updatedAt: format(subDays(new Date(), 20), 'yyyy-MM-dd'),
  },
  {
    id: '5',
    name: 'Vitamin D3 1000IU',
    description: 'Vitamin D supplement',
    category: 'Vitamins',
    sku: 'VT-005',
    barcode: '8901234567894',
    batchNumber: 'BT2023-005',
    expiryDate: format(addDays(new Date(), 545), 'yyyy-MM-dd'),
    manufacturer: 'VitaWell',
    price: 14.99,
    costPrice: 8.75,
    quantity: 60,
    reorderLevel: 15,
    location: 'Shelf D-4',
    image: 'https://images.unsplash.com/photo-1577460551100-d3f84b6e4bf7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    createdAt: format(subDays(new Date(), 180), 'yyyy-MM-dd'),
    updatedAt: format(subDays(new Date(), 25), 'yyyy-MM-dd'),
  },
];

// Mock Suppliers
export const suppliers: Supplier[] = [
  {
    id: '1',
    name: 'MediPharma Distributors',
    contactPerson: 'Michael Chen',
    email: 'michael@medipharma.com',
    phone: '+1-555-123-4567',
    address: '123 Pharma St, Medical District, MD 12345',
    products: ['1', '5'],
  },
  {
    id: '2',
    name: 'PharmaCorp Supplies',
    contactPerson: 'Sarah Johnson',
    email: 'sarah@pharmacorp.com',
    phone: '+1-555-987-6543',
    address: '456 Health Ave, Wellness City, WC 67890',
    products: ['2'],
  },
  {
    id: '3',
    name: 'DiabeCare Medical',
    contactPerson: 'David Williams',
    email: 'david@diabecare.com',
    phone: '+1-555-456-7890',
    address: '789 Diabetes Rd, Care Town, CT 34567',
    products: ['3'],
  },
  {
    id: '4',
    name: 'HeartHealth Supplies',
    contactPerson: 'Lisa Brown',
    email: 'lisa@hearthealth.com',
    phone: '+1-555-789-0123',
    address: '321 Cardio Blvd, Pulse City, PC 89012',
    products: ['4'],
  },
];

// Mock Orders
export const orders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2023-001',
    supplier: suppliers[0],
    products: [
      {
        product: products[0],
        quantity: 100,
        unitPrice: 3.50,
        totalPrice: 350,
      },
      {
        product: products[4],
        quantity: 50,
        unitPrice: 8.75,
        totalPrice: 437.5,
      },
    ],
    status: 'delivered',
    totalAmount: 787.5,
    paymentStatus: 'paid',
    createdAt: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    updatedAt: format(subDays(new Date(), 25), 'yyyy-MM-dd'),
    expectedDelivery: format(subDays(new Date(), 23), 'yyyy-MM-dd'),
  },
  {
    id: '2',
    orderNumber: 'ORD-2023-002',
    supplier: suppliers[1],
    products: [
      {
        product: products[1],
        quantity: 50,
        unitPrice: 7.25,
        totalPrice: 362.5,
      },
    ],
    status: 'shipped',
    totalAmount: 362.5,
    paymentStatus: 'paid',
    createdAt: format(subDays(new Date(), 15), 'yyyy-MM-dd'),
    updatedAt: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
    expectedDelivery: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
  },
  {
    id: '3',
    orderNumber: 'ORD-2023-003',
    supplier: suppliers[2],
    products: [
      {
        product: products[2],
        quantity: 20,
        unitPrice: 32.00,
        totalPrice: 640,
      },
    ],
    status: 'pending',
    totalAmount: 640,
    paymentStatus: 'pending',
    createdAt: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    updatedAt: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    expectedDelivery: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
  },
  {
    id: '4',
    orderNumber: 'ORD-2023-004',
    supplier: suppliers[3],
    products: [
      {
        product: products[3],
        quantity: 30,
        unitPrice: 4.50,
        totalPrice: 135,
      },
    ],
    status: 'approved',
    totalAmount: 135,
    paymentStatus: 'pending',
    createdAt: format(subDays(new Date(), 3), 'yyyy-MM-dd'),
    updatedAt: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
    expectedDelivery: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
  },
];

// Mock Notifications
export const notifications: Notification[] = [
  {
    id: '1',
    type: 'low-stock',
    message: 'Lisinopril 10mg is running low on stock (8 units remaining)',
    read: false,
    createdAt: format(subDays(new Date(), 1), 'yyyy-MM-dd HH:mm:ss'),
    link: '/inventory/4',
  },
  {
    id: '2',
    type: 'expiry',
    message: 'Insulin Glargine will expire in 90 days',
    read: false,
    createdAt: format(subDays(new Date(), 2), 'yyyy-MM-dd HH:mm:ss'),
    link: '/inventory/3',
  },
  {
    id: '3',
    type: 'order',
    message: 'Order #ORD-2023-002 has been shipped',
    read: true,
    createdAt: format(subDays(new Date(), 10), 'yyyy-MM-dd HH:mm:ss'),
    link: '/orders/2',
  },
  {
    id: '4',
    type: 'delivery',
    message: 'Order #ORD-2023-001 has been delivered',
    read: true,
    createdAt: format(subDays(new Date(), 25), 'yyyy-MM-dd HH:mm:ss'),
    link: '/orders/1',
  },
  {
    id: '5',
    type: 'system',
    message: 'System maintenance scheduled for tonight at 2:00 AM',
    read: false,
    createdAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
  },
];

// Mock Stock Alerts
export const stockAlerts: StockAlert[] = [
  {
    product: products[3],
    type: 'low-stock',
  },
  {
    product: products[2],
    type: 'expiry',
    daysToExpiry: 90,
  },
];

// Mock Dashboard Stats
export const dashboardStats: DashboardStats = {
  totalProducts: products.length,
  lowStockItems: 1,
  expiringItems: 1,
  pendingOrders: 2,
  monthlySales: [
    { date: format(subDays(new Date(), 30), 'yyyy-MM-dd'), revenue: 1250, units: 45 },
    { date: format(subDays(new Date(), 25), 'yyyy-MM-dd'), revenue: 980, units: 32 },
    { date: format(subDays(new Date(), 20), 'yyyy-MM-dd'), revenue: 1420, units: 51 },
    { date: format(subDays(new Date(), 15), 'yyyy-MM-dd'), revenue: 1680, units: 60 },
    { date: format(subDays(new Date(), 10), 'yyyy-MM-dd'), revenue: 1250, units: 42 },
    { date: format(subDays(new Date(), 5), 'yyyy-MM-dd'), revenue: 1800, units: 65 },
    { date: format(new Date(), 'yyyy-MM-dd'), revenue: 2100, units: 72 },
  ],
  topSellingProducts: [
    { product: products[0], soldUnits: 120 },
    { product: products[4], soldUnits: 85 },
    { product: products[1], soldUnits: 65 },
  ],
};

// Helper function to get product by ID
export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

// Helper function to get supplier by ID
export const getSupplierById = (id: string): Supplier | undefined => {
  return suppliers.find(supplier => supplier.id === id);
};

// Helper function to get order by ID
export const getOrderById = (id: string): Order | undefined => {
  return orders.find(order => order.id === id);
};