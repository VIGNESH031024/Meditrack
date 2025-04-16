import React from 'react';
import { Link } from 'react-router-dom';
import { Order } from '../../types';
import { format, parseISO } from 'date-fns';

interface RecentOrdersProps {
  orders: Order[];
}

const RecentOrders: React.FC<RecentOrdersProps> = ({ orders }) => {
  const getStatusBadgeClass = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
        <Link
          to="/orders"
          className="text-sm text-blue-600 hover:underline"
        >
          View All
        </Link>
      </div>

      {/* Scrollable Table */}
      <div className="overflow-y-auto flex-1 pr-1 custom-scrollbar">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="sticky top-0 bg-white z-10">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order #
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supplier
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap">
                  <Link
                    to={`/orders/${order.id}`}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {order.supplier.name}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {format(parseISO(order.createdAt), 'MMM d, yyyy')}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  ₹{order.totalAmount.toFixed(2)}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                      order.status
                    )}`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
