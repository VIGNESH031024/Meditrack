import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Filter, Search } from "lucide-react";
import OrderForm from "../components/orders/OrderForm";
import api from "../api/axiosInstance"; // Import API utility
import { format, parseISO } from "date-fns";

interface Supplier {
  id: number;
  name: string;
  contactPerson: string;
}

interface Order {
  id: number;
  order_number: string;
  supplier: Supplier;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  expected_delivery?: string;
}

const Orders: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch orders from Django API
  useEffect(() => {
    api.get("orders/")
      .then((response) => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders.");
        setLoading(false);
      });
  }, []);

  // Filter orders based on search and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Function to determine badge class for order status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to add a new order
  const handleAddOrder = (order: Partial<Order>) => {
    api.post("/orders/", order)
      .then((response) => {
        setOrders([...orders, response.data]); // Update the order list
        setShowAddForm(false);
      })
      .catch((error) => {
        console.error("Error adding order:", error);
        setError("Failed to add order.");
      });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500">Manage your purchase orders</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus size={20} className="mr-2" />
          New Order
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Show error if API fails */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Show loading state */}
      {loading ? (
        <p className="text-center text-gray-500">Loading orders...</p>
      ) : (
        <>
          {showAddForm ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-medium text-gray-900 mb-4">Create New Order</h2>
              <OrderForm onSubmit={handleAddOrder} onCancel={() => setShowAddForm(false)} />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3">Order #</th>
                      <th className="px-6 py-3">Supplier</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Total</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Payment</th>
                      <th className="px-6 py-3">Expected Delivery</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <Link to={`/orders/${order.id}`} className="text-indigo-600">
                              {order.order_number}
                            </Link>
                          </td>
                          <td className="px-6 py-4">{order.supplier.name}</td>
                          <td className="px-6 py-4">{format(parseISO(order.created_at), "MMM d, yyyy")}</td>
                          <td className="px-6 py-4">₹{order.total_amount}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">{order.payment_status.toUpperCase()}</td>
                          <td className="px-6 py-4">{order.expected_delivery ? format(parseISO(order.expected_delivery), "MMM d, yyyy") : "Not set"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center text-gray-500">No orders found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;
