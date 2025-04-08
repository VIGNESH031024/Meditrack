import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden">

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-2 ml-0">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>

        {/* Tabs List */}
        <div className="flex space-x-2 border-b pb-2 mb-4">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 border-b-2 border-transparent hover:border-blue-500 focus:outline-none">
            General
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 border-b-2 border-transparent hover:border-blue-500 focus:outline-none">
            Notifications
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 border-b-2 border-transparent hover:border-blue-500 focus:outline-none">
            API Settings
          </button>
        </div>

        {/* General Settings */}
        <div className="mb-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-2">General Settings</h2>
            <p className="text-sm text-gray-500 mb-4">Manage your general preferences</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Dark Mode</label>
                  <p className="text-sm text-gray-500">Enable dark mode for better visuals</p>
                </div>
                <input
                  type="checkbox"
                  id="dark-mode"
                  className="toggle-checkbox"
                  title="Enable or disable dark mode"
                />
                <label htmlFor="dark-mode" className="sr-only">
                  Dark Mode
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Compact Layout</label>
                  <p className="text-sm text-gray-500">Use compact layout</p>
                </div>
                <input
                  type="checkbox"
                  id="compact-layout"
                  className="toggle-checkbox"
                  title="Enable or disable compact layout"
                />
                <label htmlFor="compact-layout" className="sr-only">
                  Compact Layout
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="mb-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-2">Notification Preferences</h2>
            <p className="text-sm text-gray-500 mb-4">Choose what notifications you receive</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Notifications</label>
                  <p className="text-sm text-gray-500">Receive email updates</p>
                </div>
                <input
                  type="checkbox"
                  id="email-notifications"
                  className="toggle-checkbox"
                  title="Enable or disable email notifications"
                />
                <label htmlFor="email-notifications" className="sr-only">
                  Email Notifications
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">System Notifications</label>
                  <p className="text-sm text-gray-500">Show browser notifications</p>
                </div>
                <input
                  type="checkbox"
                  id="system-notifications"
                  className="toggle-checkbox"
                  title="Enable or disable system notifications"
                />
                <label htmlFor="system-notifications" className="sr-only">
                  System Notifications
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* API Settings */}
        <div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-2">API Settings</h2>
            <p className="text-sm text-gray-500 mb-4">Configure your API connections</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">API Key</label>
                <input
                  type="password"
                  value="************************"
                  readOnly
                  title="API Key"
                  placeholder="API Key"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">API Endpoint</label>
                <input
                  type="text"
                  defaultValue="https://api.meditrack.com/v1"
                  title="API Endpoint"
                  placeholder="Enter API Endpoint"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Save API Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
