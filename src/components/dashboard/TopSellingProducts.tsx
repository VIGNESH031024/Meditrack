import React from 'react';
import { Link } from 'react-router-dom';
import { DashboardStats } from '../../types';

interface TopSellingProductsProps {
  topProducts: DashboardStats['topSellingProducts'];
}

const TopSellingProducts: React.FC<TopSellingProductsProps> = ({ topProducts }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <h3 className="text-lg font-medium text-gray-700 mb-4">Top Selling Products</h3>
      
      <div className="space-y-4">
        {topProducts.map(({ product, soldUnits }) => (
          <div key={product.id} className="flex items-center">
            <div className="h-12 w-12 rounded-md overflow-hidden mr-4">
              <img
                src={product.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            
            <div className="flex-1">
              <Link
                to={`/inventory/${product.id}`}
                className="text-sm font-medium text-gray-800 hover:text-indigo-600"
              >
                {product.name}
              </Link>
              <p className="text-xs text-gray-500">{product.category}</p>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">{soldUnits} units</p>
              <p className="text-xs text-gray-500">${(product.price * soldUnits).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
      
      <Link
        to="/reports"
        className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-800 inline-block"
      >
        View Full Report
      </Link>
    </div>
  );
};

export default TopSellingProducts;