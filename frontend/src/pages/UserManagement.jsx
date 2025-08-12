import React, { useState } from 'react';
import { User, Users, Shield } from 'lucide-react';
import { cn } from '../lib/utils';
import AccountManagementTab from '../components/AccountManagementTab';
import ResidentManagementTab from '../components/ResidentManagementTab';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('accounts'); // 'accounts' | 'residents' | 'staff'

  const tabs = [
    { id: 'accounts',  label: 'Quản lý tài khoản',    icon: User,  description: 'Quản lý tài khoản đăng nhập và phân quyền' },
    { id: 'residents', label: 'Quản lý cư dân',       icon: Users, description: 'Quản lý thông tin cư dân chung cư' },
    
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'accounts':  return <AccountManagementTab />;
      case 'residents': return <ResidentManagementTab />;
      default:          return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
        <p className="text-gray-600 mt-1">Quản lý tài khoản, cư dân và nhân viên ban quản lý</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                    isActive
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Description */}
        <div className="px-6 py-3 bg-gray-50 border-b">
          <p className="text-sm text-gray-600">
            {tabs.find(tab => tab.id === activeTab)?.description}
          </p>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
