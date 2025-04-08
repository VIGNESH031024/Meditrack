import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Users, 
  Settings, 
  LogOut,
  Truck,
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar: React.FC = () => {
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Inventory', path: '/inventory', icon: <Package size={20} /> },
    { name: "Transaction", path: "/transaction", icon: <Activity size={20} /> },
    { name: 'Orders', path: '/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Suppliers', path: '/suppliers', icon: <Truck size={20} /> },
    { name: 'Reports', path: '/reports', icon: <BarChart3 size={20} /> },
    { name: 'Users', path: '/users', icon: <Users size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="h-screen w-64 bg-indigo-800 text-white flex flex-col">
      <div className="p-5 border-b border-indigo-700">
        <div className="flex items-center space-x-2">
          <Package size={24} className="text-white" />
          <h1 className="text-xl font-bold">MediTrack+</h1>
        </div>
      </div>
      
      <nav className="flex-1">
        <ul className="space">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-5 py-3 text-sm ${
                    isActive
                      ? 'bg-indigo-900 border-l-4 border-white'
                      : 'hover:bg-indigo-700'
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-5 border-t border-indigo-700">
        <button
          onClick={logout}
          className="flex items-center text-sm text-white hover:text-indigo-200"
        >
          <LogOut size={20} className="mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;