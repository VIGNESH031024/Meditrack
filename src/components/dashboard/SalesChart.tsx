import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { SalesData } from '../../types';
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

interface SalesChartProps {
  salesData: SalesData[];
}

const SalesChart: React.FC<SalesChartProps> = ({ salesData }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const data = {
    labels: salesData.map((data) => format(parseISO(data.date), 'MMM d')),
    datasets: [
      {
        label: 'Revenue ($)',
        data: salesData.map((data) => data.revenue),
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Units Sold',
        data: salesData.map((data) => data.units),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 h-80">
      <h3 className="text-lg font-medium text-gray-700 mb-4">Sales Overview</h3>
      <div className="h-64">
        <Line options={options} data={data} />
      </div>
    </div>
  );
};

export default SalesChart;