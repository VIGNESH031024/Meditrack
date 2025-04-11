import React from 'react';
import { Mail, User as UserIcon, Shield } from 'lucide-react';

// Define the User type
type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
};

const currentUser: User = {
  id: '1',
  name: 'MediTrack Admin',
  email: 'admin@meditrack.com',
  role: 'admin',
  avatar: 'https://www.shutterstock.com/image-vector/young-smiling-man-avatar-brown-600nw-2261401207.jpg'
};

const UserPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">User Profile</h1>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Avatar Section */}
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-center">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-32 w-32 rounded-full border-4 border-white shadow-lg"
              />
            </div>
          </div>

          {/* User Details */}
          <div className="px-4 py-5 sm:p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <UserIcon className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm font-medium text-gray-500">Name</div>
                <div className="text-lg font-semibold text-gray-900">{currentUser.name}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm font-medium text-gray-500">Email</div>
                <div className="text-lg font-semibold text-gray-900">{currentUser.email}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm font-medium text-gray-500">Role</div>
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {currentUser.role}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;