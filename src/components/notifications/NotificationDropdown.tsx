import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, Package, Calendar, ShoppingCart, Truck, AlertTriangle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const NotificationDropdown: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = (id: string, link?: string) => {
    markAsRead(id);
    if (link) {
      navigate(link);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'low-stock':
        return <Package size={16} className="text-red-500" />;
      case 'expiry':
        return <Calendar size={16} className="text-orange-500" />;
      case 'order':
        return <ShoppingCart size={16} className="text-blue-500" />;
      case 'delivery':
        return <Truck size={16} className="text-green-500" />;
      default:
        return <AlertTriangle size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
      <div className="py-2 px-3 bg-indigo-600 text-white flex justify-between items-center">
        <div className="flex items-center">
          <Bell size={16} className="mr-2" />
          <span className="font-medium">Notifications</span>
        </div>
        <button
          onClick={markAllAsRead}
          className="text-xs text-indigo-200 hover:text-white"
        >
          Mark all as read
        </button>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-4 px-3 text-center text-gray-500">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification.id, notification.link)}
              className={`py-3 px-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                !notification.read ? 'bg-indigo-50' : ''
              }`}
            >
              <div className="flex items-start">
                <div className="mr-3 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {format(parseISO(notification.createdAt), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
                {!notification.read && (
                  <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;