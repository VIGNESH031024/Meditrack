import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface OrderItem {
  id: number;
  product: string;
  quantity: number;
  price: string;
  total_price: string;
}

interface Order {
  id: number;
  supplier: string;
  created_at: string;
  order_items: OrderItem[];
  total_price: string;
}

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/api/orders/${id}/`);
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

  if (loading) return <div className="p-4 text-gray-700">Loading order details...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!order) return <div className="p-4 text-gray-500">No order data available.</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Order #{order.id}</h2>
      <p className="mb-2"><strong>Supplier:</strong> {order.supplier}</p>
      <p className="mb-2"><strong>Created At:</strong> {new Date(order.created_at).toLocaleString()}</p>
      <p className="mb-4"><strong>Total Price:</strong> ₹{order.total_price}</p>

      <h3 className="text-xl font-semibold mt-6 mb-2">Order Items</h3>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">#</th>
              <th className="p-2 border">Product</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.order_items?.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{item.product}</td>
                <td className="p-2 border">{item.quantity}</td>
                <td className="p-2 border">₹{item.price}</td>
                <td className="p-2 border">₹{item.total_price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderDetail;
