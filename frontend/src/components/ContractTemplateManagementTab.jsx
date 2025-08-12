import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Eye,
  Trash2,
  FileText,
  Settings,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Copy
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  contractTemplateService, 
  ContractTemplate, 
  ContractTemplateStats, 
  ContractTemplateFilters,
  ContractTemplateService
} from '../services/contractTemplateService';
import Loading, { TableLoading, StatsLoading } from './Loading';
import { ErrorFallback } from './ErrorBoundary';
import { handleApiError } from '../services/api';
import ContractTemplateModal from './ContractTemplateModal';

const ContractTemplateManagementTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateServices, setTemplateServices] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  
  const [templates, setTemplates] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      loadTemplates();
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [currentPage, searchTerm, statusFilter]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadTemplates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const filters = {
        search: searchTerm || undefined,
        trangThai: statusFilter !== 'all' ? statusFilter : undefined,
        page: currentPage,
        limit: 10
      };

      const response = await contractTemplateService.getTemplates(filters);
      setTemplates(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await contractTemplateService.getTemplateStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const loadTemplateDetails = async (template) => {
    try {
      const services = await contractTemplateService.getTemplateServices(template.id);
      setTemplateServices(services);
      setSelectedTemplate(template);
      setShowDetails(true);
    } catch (err) {
      console.error('Failed to load template services:', err);
    }
  };

  const handleRetry = () => {
    loadTemplates();
    loadStats();
  };

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setModalMode('edit');
    setShowModal(true);
  };

const handleDeleteTemplate = async (template) => {
  const isConfirmed = window.confirm(`Bạn có chắc chắn muốn xóa mẫu hợp đồng "${template.tenMau}"?\nViệc này sẽ không thể hoàn tác.`);
  
  if (!isConfirmed) {
    return;
  }

  setIsUpdating(true);
  try {
    await contractTemplateService.deleteTemplate(template.id);
    setTemplates(prev => prev.filter(t => t.id !== template.id));
    loadStats();
    
    if (selectedTemplate?.id === template.id) {
      setShowDetails(false);
    }
  } catch (err) {
    setError(handleApiError(err));
  } finally {
    setIsUpdating(false);
  }
};


  const handleDuplicateTemplate = async (template) => {
    setIsUpdating(true);
    try {
      const services = await contractTemplateService.getTemplateServices(template.id);
      
      const duplicateData = {
        tenMau: `${template.tenMau} (Bản sao)`,
        moTa: template.moTa,
        dieuKhoanChinh: template.dieuKhoanChinh,
        selectedServices: services.map(s => s.maDichVu)
      };

      const newTemplate = await contractTemplateService.createTemplate(duplicateData);
      setTemplates(prev => [newTemplate, ...prev]);
      loadStats();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTemplateSaved = (savedTemplate) => {
    if (modalMode === 'create') {
      setTemplates(prev => [savedTemplate, ...prev]);
    } else {
      setTemplates(prev => prev.map(template => 
        template.id === savedTemplate.id ? savedTemplate : template
      ));
      
      if (selectedTemplate?.id === savedTemplate.id) {
        setSelectedTemplate(savedTemplate);
      }
    }
    loadStats();
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Hoạt động': 'bg-green-100 text-green-800',
      'Ngừng sử dụng': 'bg-red-100 text-red-800'
    };

    const icons = {
      'Hoạt động': CheckCircle,
      'Ngừng sử dụng': XCircle
    };

    const Icon = icons[status];

    return (
      <span className={cn('px-2 py-1 rounded-full text-xs font-medium flex items-center', styles[status])}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </span>
    );
  };

  const statistics = [
    { label: 'Tổng mẫu hợp đồng', value: stats?.total || 0, color: 'text-blue-600', icon: FileText },
    { label: 'Đang hoạt động', value: stats?.hoatDong || 0, color: 'text-green-600', icon: CheckCircle },
    { label: 'Ngừng sử dụng', value: stats?.ngungSuDung || 0, color: 'text-red-600', icon: XCircle },
    { label: 'Nhiều dịch vụ', value: stats?.coNhieuDichVu || 0, color: 'text-purple-600', icon: Settings }
  ];

  if (error && !templates.length) {
    return (
      <ErrorFallback 
        error={error} 
        onRetry={handleRetry}
        message="Không thể tải danh sách mẫu hợp đồng"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Quản lý mẫu hợp đồng</h3>
          <p className="text-sm text-gray-600 mt-1">Tạo và quản lý các mẫu hợp đồng cho dịch vụ</p>
        </div>
        <button 
          onClick={handleCreateTemplate}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center"
          disabled={isUpdating}
        >
          <Plus className="h-4 w-4 mr-2" />
          Tạo mẫu hợp đồng
        </button>
      </div>

      {!stats ? (
        <StatsLoading count={4} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {statistics.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg p-4 border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className={cn('text-2xl font-bold', stat.color)}>{stat.value}</p>
                  </div>
                  <Icon className={cn('h-8 w-8', stat.color)} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-white rounded-lg p-4 border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên mẫu hợp đồng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Hoạt động">Hoạt động</option>
              <option value="Ngừng sử dụng">Ngừng sử dụng</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4 animate-pulse">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="w-16 h-6 bg-gray-200 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <div key={template.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="p-2 bg-primary-100 rounded-lg text-primary">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{template.tenMau}</h4>
                        <p className="text-sm text-gray-500 mt-1">{template.moTa}</p>
                      </div>
                    </div>
                    {getStatusBadge(template?.trangThai)}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Số dịch vụ:</span>
                      <span className="font-medium text-gray-900">{template.soLuongDichVu || 0}</span>
                    </div>
                    
                    {template.ngayTao && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Ngày tạo:</span>
                        <span className="text-gray-900">
                          {new Date(template.ngayTao).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    )}

                    {template.ngayCapNhat && template.ngayCapNhat !== template.ngayTao && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Cập nhật:</span>
                        <span className="text-gray-900">
                          {new Date(template.ngayCapNhat).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => loadTemplateDetails(template)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="Xem chi tiết"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditTemplate(template)}
                        className="text-gray-600 hover:text-gray-900 p-1 rounded"
                        title="Chỉnh sửa"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicateTemplate(template)}
                        className="text-green-600 hover:text-green-900 p-1 rounded"
                        title="Sao chép"
                        disabled={isUpdating}
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(template)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="Xóa"
                        disabled={isUpdating}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {templates.length === 0 && !isLoading && (
                <div className="col-span-2 text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Chưa có mẫu hợp đồng nào</p>
                  <button
                    onClick={handleCreateTemplate}
                    className="mt-2 text-primary hover:text-primary-600"
                  >
                    Tạo mẫu hợp đồng đầu tiên
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-700">
            Trang {currentPage} / {totalPages}
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || isLoading}
              className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Trước
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || isLoading}
              className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      )}

      {isUpdating && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-40">
          <Loading text="Đang xử lý..." />
        </div>
      )}

      {showDetails && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Chi tiết mẫu hợp đồng</h3>
              <button 
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-primary-100 rounded-lg flex items-center justify-center text-primary">
                  <FileText className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-medium text-gray-900">{selectedTemplate.tenMau}</h4>
                  <p className="text-gray-600">{selectedTemplate.moTa}</p>
                  <div className="flex space-x-2 mt-2">
                    {getStatusBadge(selectedTemplate?.trangThai)}
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {templateServices.length} dịch vụ
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-900 mb-3">Dịch vụ áp dụng</h5>
                {templateServices.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {templateServices.map((service, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{service.tenDichVu}</p>
                            <p className="text-xs text-gray-500">{service.maDichVu}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            {service.batBuoc && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Bắt buộc
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Chưa có dịch vụ nào được chọn</p>
                )}
              </div>

              {selectedTemplate.dieuKhoanChinh && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Điều khoản chính</h5>
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                      {selectedTemplate.dieuKhoanChinh}
                    </pre>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button 
                onClick={() => setShowDetails(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Đóng
              </button>
              <button 
                onClick={() => {
                  setShowDetails(false);
                  handleEditTemplate(selectedTemplate);
                }}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600"
              >
                Chỉnh sửa
              </button>
            </div>
          </div>
        </div>
      )}

      <ContractTemplateModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleTemplateSaved}
        template={editingTemplate}
        mode={modalMode}
      />
    </div>
  );
};

export default ContractTemplateManagementTab;
