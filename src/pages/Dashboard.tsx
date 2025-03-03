import React from 'react';
import { Package, ShoppingCart, AlertTriangle, Calendar } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import SalesChart from '../components/dashboard/SalesChart';
import StockAlertsList from '../components/dashboard/StockAlertsList';
import TopSellingProducts from '../components/dashboard/TopSellingProducts';
import RecentOrders from '../components/dashboard/RecentOrders';
import { dashboardStats, stockAlerts, orders } from '../data/mockData';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome to MediTrack+ Dashboard</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Products"
          value={dashboardStats.totalProducts}
          icon={<Package size={24} className="text-white" />}
          color="bg-blue-600"
          change={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Low Stock Items"
          value={dashboardStats.lowStockItems}
          icon={<AlertTriangle size={24} className="text-white" />}
          color="bg-red-600"
          change={{ value: 2, isPositive: false }}
        />
        <StatsCard
          title="Expiring Soon"
          value={dashboardStats.expiringItems}
          icon={<Calendar size={24} className="text-white" />}
          color="bg-orange-600"
          change={{ value: 0, isPositive: true }}
        />
        <StatsCard
          title="Pending Orders"
          value={dashboardStats.pendingOrders}
          icon={<ShoppingCart size={24} className="text-white" />}
          color="bg-purple-600"
          change={{ value: 10, isPositive: true }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart salesData={dashboardStats.monthlySales} />
        </div>
        <div>
          <StockAlertsList alerts={stockAlerts} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentOrders orders={orders} />
        </div>
        <div>
          <TopSellingProducts topProducts={dashboardStats.topSellingProducts} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;