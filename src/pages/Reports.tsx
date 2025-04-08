import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import ReportGenerator from '../components/reports/ReportGenerator';
import { SalesData } from '../types';
import { dashboardStats } from '../data/mockData';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { format, parseISO } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Reports: React.FC = () => {
  const [reportUrl, setReportUrl] = useState<string | null>(null);
  
  const handleGenerateReport = (url: string) => {
    setReportUrl(url);
  };
  
  const salesData = dashboardStats.monthlySales;
  
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Sales Analysis',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  
  const barChartData = {
    labels: salesData.map((data) => format(parseISO(data.date), 'MMM d')),
    datasets: [
      {
        label: 'Revenue (₹)',
        data: salesData.map((data) => data.revenue),
        backgroundColor: 'rgba(79, 70, 229, 0.6)',
      },
      {
        label: 'Units Sold',
        data: salesData.map((data) => data.units),
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
      },
    ],
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-500">Generate and view reports for your business</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <ReportGenerator onGenerate={handleGenerateReport} />
        </div>
        
        <div className="lg:col-span-2">
          {reportUrl ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Generated Report</h2>
                <a
                  href={reportUrl}
                  download="report.pdf"
                  className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FileText size={16} className="mr-2" />
                  Download PDF
                </a>
              </div>
              
              <div className="h-[600px] border border-gray-200 rounded-md overflow-hidden">
                <iframe
                  src={reportUrl}
                  className="w-full h-full"
                  title="Report Preview"
                />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Sales Analytics</h2>
              <div className="h-80">
                <Bar options={barChartOptions} data={barChartData} />
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-4">AI-Powered Insights</h3>
                <div className="bg-indigo-50 p-4 rounded-md">
                  <p className="text-sm text-indigo-800">
                    <strong>Demand Forecast:</strong> Based on current trends, we predict a 15% increase in sales for Pain Relief products in the next month. Consider increasing your stock levels.
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-md mt-3">
                  <p className="text-sm text-green-800">
                    <strong>Inventory Optimization:</strong> You could reduce holding costs by 12% by adjusting reorder levels for Vitamins category products.
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-md mt-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Seasonal Trend:</strong> Historical data shows increased demand for Antibiotics in the upcoming season. Prepare your inventory accordingly.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Inventory Health</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Stock Efficiency</span>
                <span className="text-sm font-medium text-gray-900">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Low Stock Items</span>
                <span className="text-sm font-medium text-gray-900">1 of {dashboardStats.totalProducts}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(1 / dashboardStats.totalProducts) * 100}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Expiring Soon</span>
                <span className="text-sm font-medium text-gray-900">1 of {dashboardStats.totalProducts}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${(1 / dashboardStats.totalProducts) * 100}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Inventory Turnover</span>
                <span className="text-sm font-medium text-gray-900">4.2x</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Order Analytics</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Order Fulfillment Rate</span>
                <span className="text-sm font-medium text-gray-900">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">On-Time Delivery</span>
                <span className="text-sm font-medium text-gray-900">88%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Order Accuracy</span>
                <span className="text-sm font-medium text-gray-900">95%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Supplier Performance</span>
                <span className="text-sm font-medium text-gray-900">90%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;