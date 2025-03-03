import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { AlertTriangle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const isLowStock = product.quantity <= product.reorderLevel;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-48 overflow-hidden relative">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {isLowStock && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <AlertTriangle size={12} className="mr-1" />
            Low Stock
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-800">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.category}</p>
          </div>
          <span className="text-lg font-bold text-indigo-600">${product.price.toFixed(2)}</span>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">
              <span className="font-medium">SKU:</span> {product.sku}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Batch:</span> {product.batchNumber}
            </p>
          </div>
          <div className="text-right">
            <p className={`text-sm ${isLowStock ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
              {product.quantity} in stock
            </p>
            <p className="text-xs text-gray-500">
              Reorder at {product.reorderLevel}
            </p>
          </div>
        </div>
        
        <Link
          to={`/inventory/${product.id}`}
          className="mt-4 block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;