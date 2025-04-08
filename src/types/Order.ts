export interface Order {
  id: number;
  supplier: number; // previously an object, now just the ID
  orderNumber: string;
  status: 'pending' | 'approved' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  expectedDelivery: string;
  notes: string;
}
