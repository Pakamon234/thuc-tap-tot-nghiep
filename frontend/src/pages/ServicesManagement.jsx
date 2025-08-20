import React, { useState } from 'react';
import { Settings, FileText, Edit3 } from 'react-feather'; // Make sure these icons are imported
import ContractManagementTab from '../components/ContractManagementTab';
import ChangeRequestTab from '../components/ChangeRequestTab';
import NewServicesManagementTab from '../components/NewServicesManagementTab';
import ContractTemplateManagementTab from '../components/ContractTemplateManagementTab';
const ServicesManagement = () => {
  const [activeTab, setActiveTab] = useState('services');

  const tabs = [
    { id: 'services', label: 'Dịch vụ', icon: Settings },
    { id: 'templates', label: 'Mẫu hợp đồng', icon: FileText },
    { id: 'contracts', label: 'Hợp đồng', icon: FileText },
    { id: 'change-requests', label: 'Yêu cầu thay đổi', icon: Edit3 }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'services':
        return <NewServicesManagementTab />;
      case 'templates':
        return <ContractTemplateManagementTab />;
      case 'contracts':
        return <ContractManagementTab />;
      case 'change-requests':
        return <ChangeRequestTab />;
      default:
        return <NewServicesManagementTab />;
    }
  };

  return (
    <div className="flex-1 bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dịch vụ & Hợp đồng</h1>
        <p className="text-gray-600 mt-1">Quản lý dịch vụ, mẫu hợp đồng và hợp đồng cư dân</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 py-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6 bg-gray-50 rounded-lg shadow-inner">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ServicesManagement;
