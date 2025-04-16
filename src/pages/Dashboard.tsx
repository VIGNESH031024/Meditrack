import React, { useEffect, useState } from 'react';
import {
  Package,
  ShoppingCart,
  AlertTriangle,
  Calendar
} from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import SalesChart from '../components/dashboard/SalesChart';
import StockAlertsList from '../components/dashboard/StockAlertsList';
import TopSellingProducts from '../components/dashboard/TopSellingProducts';
import RecentOrders from '../components/dashboard/RecentOrders';
import api from '../api/axiosInstance';
import { Order } from '../types';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    expiringItems: 0,
    pendingOrders: 0,
  });

  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Fetch dashboard stats
    api.get('dashboard-stats/')
      .then(response => {
        setStats(response.data);
      })
      .catch(error => {
        console.error('Error fetching dashboard stats:', error);
      });

    // Fetch and format recent orders
    api.get('dashboard-recent-orders/')
      .then(response => {
        const formattedOrders = response.data.map((order: {
          id: number;
          supplier: string;
          order_number: string;
          status: string;
          total_amount: string;
          payment_status: string;
          created_at: string;
          updated_at: string;
          expected_delivery: string;
          notes: string;
        }) => ({
          id: order.id,
          supplier: order.supplier, // just an ID for now
          orderNumber: order.order_number,
          status: order.status,
          totalAmount: parseFloat(order.total_amount),
          paymentStatus: order.payment_status,
          createdAt: order.created_at,
          updatedAt: order.updated_at,
          expectedDelivery: order.expected_delivery,
          notes: order.notes,
        }));
        setRecentOrders(formattedOrders);
      })
      .catch(error => {
        console.error('Error fetching recent orders:', error);
      });
  }, []);

  const [stockAlerts, setStockAlerts] = useState([]);

  useEffect(() => {
    api.get('dashboard-stock-alerts/')
      .then(response => {
        const normalizedAlerts = response.data.map((alert: { 
          id: number; 
          name: string; 
          quantity: number; 
          reorderLevel: number; 
          expiryDate: string; 
          daysToExpiry: number; 
          isLowStock: boolean; 
          isExpiringSoon: boolean; 
        }) => ({
          id: alert.id,
          name: alert.name,
          quantity: alert.quantity,
          reorderLevel: alert.reorderLevel,
          expiryDate: alert.expiryDate,
          daysToExpiry: alert.daysToExpiry,
          isLowStock: alert.isLowStock,
          isExpiringSoon: alert.isExpiringSoon,
        }));
        setStockAlerts(normalizedAlerts);
      })
      .catch(error => {
        console.error('Error fetching stock alerts:', error);
      });
  }, []);

  // data for dashboard sales chart
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
  api.get('sales/chart-data/')
    .then(response => {
      setSalesData(response.data);
    })
    .catch(error => {
      console.error('Error fetching sales data:', error);
    });
  }, []);


  const [topProducts, setTopProducts] = useState([]);

// Inside useEffect hooks
useEffect(() => {
  api.get('top-selling-products/')
    .then(response => {
      setTopProducts(response.data);
    })
    .catch(error => {
      console.error('Error fetching top selling products:', error);
    });
}, []);

  

  


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome to MediTrack+ Dashboard</p>
      </div>

      {/* Stats section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          icon={<Package size={24} className="text-white" />}
          color="bg-blue-600"
          change={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Low Stock Items"
          value={stats.lowStockItems}
          icon={<AlertTriangle size={24} className="text-white" />}
          color="bg-red-600"
          change={{ value: 2, isPositive: false }}
        />
        <StatsCard
          title="Expiring Soon"
          value={stats.expiringItems}
          icon={<Calendar size={24} className="text-white" />}
          color="bg-orange-600"
          change={{ value: 0, isPositive: true }}
        />
        <StatsCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={<ShoppingCart size={24} className="text-white" />}
          color="bg-purple-600"
          change={{ value: 10, isPositive: true }}
        />
      </div>

      {/* Charts and alerts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart salesData={salesData} />
        </div>
        <div className="flex flex-col h-full" >
          <StockAlertsList alerts={stockAlerts} />

        </div>
      </div>

      {/* Recent orders and top products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col h-[320px] overflow-hidden"> {/* Shared height */}
          <div className="overflow-y-auto pr-2">
            <RecentOrders orders={recentOrders} />
          </div>
        </div>
        <div className="flex flex-col h-full">
          <TopSellingProducts topProducts={topProducts} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
