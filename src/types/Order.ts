export interface Order {
    id: number; // Ensure this matches the correct type (number or string)
    customerName: string;
    items: Array<{
      productId: number;
      quantity: number;
    }>;
    totalAmount: number;
    status: 'pending' | 'completed' | 'cancelled';
    createdAt: string; // ISO date string
    updatedAt?: string; // Optional ISO date string
  }