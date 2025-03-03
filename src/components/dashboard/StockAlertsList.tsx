import React from 'react';
import { Link } from 'react-router-dom';
import { StockAlert } from '../../types';
import { AlertTriangle, Calendar } from 'lucide-react';

interface StockAlertsListProps {
  alerts: StockAlert[];
}

const StockAlertsList: React.FC<StockAlertsListProps> = ({ alerts }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <h3 className="text-lg font-medium text-gray-700 mb-4">Stock Alerts</h3>
      
      {alerts.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No alerts at the moment
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={`${alert.type}-${alert.product.id}`}
              className={`p-3 rounded-md ${
                alert.type === 'low-stock'
                  ? 'bg-red-50 border-l-4 border-red-500'
                  : 'bg-orange-50 border-l-4 border-orange-500'
              }`}
            >
              <div className="flex items-start">
                <div className="mr-3 mt-1">
                  {alert.type === 'low-stock' ? (
                    <AlertTriangle size={18} className="text-red-500" />
                  ) : (
                    <Calendar size={18} className="text-orange-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {alert.type === 'low-stock'
                      ? `Low Stock: ${alert.product.name}`
                      : `Expiring Soon: ${alert.product.name}`}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {alert.type === 'low-stock'
                      ? `Only ${alert.product.quantity} units remaining (Reorder level: ${alert.product.reorderLevel})`
                      : `Expires in ${alert.daysToExpiry} days`}
                  </p>
                  <Link
                    to={`/inventory/${alert.product.id}`}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-800 mt-2 inline-block"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StockAlertsList;