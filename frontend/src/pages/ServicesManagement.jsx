import React, { useState } from 'react';
import { Plus, Settings, Edit3, Trash2, FileText, FileEdit } from 'lucide-react';
import { cn } from '../lib/utils';
import ContractManagementTab from '../components/ContractManagementTab';
import ChangeRequestTab from '../components/ChangeRequestTab';
import NewServicesManagementTab from '../components/NewServicesManagementTab';
import ContractTemplateManagementTab from '../components/ContractTemplateManagementTab';

const ServicesManagement = () => {
  const [activeTab, setActiveTab] = useState('services');
  const [showAddService, setShowAddService] = useState(false);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dịch vụ & Hợp đồng</h1>
          <p className="text-gray-600 mt-1">Quản lý các dịch vụ và điều khoản hợp đồng</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('services')}
              className={cn(
                'flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'services'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              <Settings className="h-4 w-4" />
              <span>Danh sách dịch vụ</span>
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={cn(
                'flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'templates'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              <FileText className="h-4 w-4" />
              <span>Mẫu hợp đồng</span>
            </button>
            <button
              onClick={() => setActiveTab('contracts')}
              className={cn(
                'flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'contracts'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              <FileEdit className="h-4 w-4" />
              <span>Quản lý hợp đồng</span>
            </button>
            <button
              onClick={() => setActiveTab('change-requests')}
              className={cn(
                'flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'change-requests'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              <Edit3 className="h-4 w-4" />
              <span>Yêu cầu thay đổi</span>
            </button>
          </nav>
        </div>

        {/* Active Tab Content */}
        {activeTab === 'services' && (
          <div className="p-6">
            <NewServicesManagementTab />
          </div>
        )}
        {activeTab === 'templates' && (
          <div className="p-6">
            <ContractTemplateManagementTab />
          </div>
        )}
        {activeTab === 'contracts' && (
          <div className="p-6">
            <ContractManagementTab />
          </div>
        )}
        {activeTab === 'change-requests' && (
          <div className="p-6">
            <ChangeRequestTab />
          </div>
        )}
      </div>

      {/* Add Service Modal */}
      {showAddService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold">Thêm dịch vụ mới</h3>
            {/* Add service form goes here */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManagement;
