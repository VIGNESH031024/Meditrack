import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Calendar } from 'lucide-react';

interface StockAlert {
  id: number;
  name: string;
  quantity: number;
  reorderLevel: number;
  expiryDate?: string;
  daysToExpiry?: number;
  isLowStock: boolean;
  isExpiringSoon: boolean;
}

interface StockAlertsListProps {
  alerts: StockAlert[]; 
}

const StockAlertsList: React.FC<StockAlertsListProps> = ({ alerts }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-5 h-80 flex flex-col">
      <h3 className="text-lg font-medium text-gray-700 mb-4">Stock Alerts</h3>

      {alerts.length === 0 ? (
        <div className="text-center py-4 text-gray-500 flex-grow">
          No alerts at the moment
        </div>
      ) : (
        <div className="space-y-3 overflow-y-auto flex-grow pr-1 custom-scrollbar">
          {alerts.map((alert) => {
            const alertType = alert.isLowStock ? 'low-stock' : 'expiring-soon';

            return (
              <div
                key={`alert-${alert.id}`}
                className={`p-3 rounded-md ${
                  alertType === 'low-stock'
                    ? 'bg-red-50 border-l-4 border-red-500'
                    : 'bg-orange-50 border-l-4 border-orange-500'
                }`}
              >
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    {alertType === 'low-stock' ? (
                      <AlertTriangle size={18} className="text-red-500" />
                    ) : (
                      <Calendar size={18} className="text-orange-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {alertType === 'low-stock'
                        ? `Low Stock: ${alert.name}`
                        : `Expiring Soon: ${alert.name}`}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {alertType === 'low-stock'
                        ? `Only ${alert.quantity} units remaining (Reorder level: ${alert.reorderLevel})`
                        : `Expires in ${alert.daysToExpiry} days (${alert.expiryDate})`}
                    </p>
                    <Link
                      to={`/inventory/${alert.id}`}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-800 mt-2 inline-block"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StockAlertsList;
