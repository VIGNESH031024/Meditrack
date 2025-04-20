import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from "../api/axiosInstance";

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price: string;
  total_price: string;
}

interface Order {
  id: number;
  supplier_name: string;
  order_number: string;
  status: string;
  total_amount: string;
  payment_status: string;
  created_at: string;
  expected_delivery: string;
  notes: string;
  order_items: OrderItem[];
}

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/order-details/${id}/`);
        setOrder(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch order details.');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <div className="p-6 text-gray-700">Loading order details...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!order) return <div className="p-6 text-gray-500">No order data available.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-3xl font-bold mb-6">Order Details</h1>

      {/* Order Summary */}
      <div className="space-y-2 mb-8">
        <div><span className="font-semibold">Order ID:</span> #{order.id}</div>
        <div><span className="font-semibold">Order Number:</span> {order.order_number}</div>
        <div><span className="font-semibold">Supplier:</span> {order.supplier_name}</div>
        <div><span className="font-semibold">Status:</span> 
          <span className={`ml-2 px-2 py-1 rounded-md text-white text-sm ${order.status === 'Completed' ? 'bg-green-500' : 'bg-yellow-500'}`}>
            {order.status}
          </span>
        </div>
        <div><span className="font-semibold">Payment Status:</span> 
          <span className={`ml-2 px-2 py-1 rounded-md text-white text-sm ${order.payment_status === 'Paid' ? 'bg-green-600' : 'bg-red-500'}`}>
            {order.payment_status}
          </span>
        </div>
        <div><span className="font-semibold">Total Amount:</span> ₹{order.total_amount}</div>
        <div><span className="font-semibold">Expected Delivery:</span> {new Date(order.expected_delivery).toLocaleDateString()}</div>
        <div><span className="font-semibold">Created At:</span> {new Date(order.created_at).toLocaleDateString()}</div>
        {order.notes && (
          <div><span className="font-semibold">Notes:</span> {order.notes}</div>
        )}
      </div>

      <hr className="my-6" />

      {/* Order Items */}
      <h2 className="text-2xl font-semibold mb-4">Order Items</h2>

      {order.order_items.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b">#</th>
                <th className="py-2 px-4 border-b text-left">Product</th>
                <th className="py-2 px-4 border-b">Quantity</th>
                <th className="py-2 px-4 border-b">Price (₹)</th>
                <th className="py-2 px-4 border-b">Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {order.order_items.map((item, index) => (
                <tr key={item.id} className="text-center">
                  <td className="py-2 px-4 border-b">{index + 1}</td>
                  <td className="py-2 px-4 border-b text-left">{item.product_name}</td>
                  <td className="py-2 px-4 border-b">{item.quantity}</td>
                  <td className="py-2 px-4 border-b">{item.price}</td>
                  <td className="py-2 px-4 border-b">{item.total_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-4 p-4 bg-yellow-100 text-yellow-700 rounded-md">
          No order items available.
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
