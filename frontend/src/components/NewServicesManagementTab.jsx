import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  Edit3,
  Eye,
  MoreHorizontal,
  Settings,
  Zap,
  Droplets,
  Shield,
  Car,
  Wrench,
  Home,
  Wifi,
  AlertCircle,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  TrendingUp,
  Package,
  Trash2,
  FileEdit
} from 'lucide-react';
import { cn } from '../lib/utils';
import {
  servicesService,
  serviceConfigurationService,
  feeParametersService,
  servicePackagesService,
} from '../services/servicesManagementService';
import Loading, { TableLoading, StatsLoading } from './Loading';
import { ErrorFallback } from './ErrorBoundary';
import { handleApiError } from '../services/api';
import ServiceModal from './ServiceModal';
import ConfigurationModal from './ConfigurationModal';
import FeeParameterModal from './FeeParameterModal';
import ServicePackageModal from './ServicePackageModal';

const NewServicesManagementTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [requiredFilter, setRequiredFilter] = useState('all');
  const [selectedService, setSelectedService] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showConfigurations, setShowConfigurations] = useState(false);
  const [showPackages, setShowPackages] = useState(false);
  const [configurations, setConfigurations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [feeParameters, setFeeParameters] = useState([]);
  const [selectedConfiguration, setSelectedConfiguration] = useState(null);

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showConfigurationModal, setShowConfigurationModal] = useState(false);
  const [showFeeParameterModal, setShowFeeParameterModal] = useState(false);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [editingConfiguration, setEditingConfiguration] = useState(null);
  const [editingFeeParameter, setEditingFeeParameter] = useState(null);
  const [editingPackage, setEditingPackage] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  
  const [services, setServices] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      loadServices();
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [currentPage, searchTerm, typeFilter, statusFilter, requiredFilter]);

  useEffect(() => {
    loadStats();
  }, []);

const loadServices = async () => {
  setIsLoading(true);
  setError(null);
  try {
    const filters = {
      search: searchTerm || undefined,
      loaiTinhPhi: typeFilter !== 'all' ? typeFilter : undefined,
      trangThai: statusFilter !== 'all' ? statusFilter : undefined,
      batBuoc: requiredFilter !== 'all' ? requiredFilter === 'true' : undefined,
      page: currentPage,
      limit: 10
    };

    const response = await servicesService.getServices(filters);

    // Log phản hồi đầy đủ để kiểm tra cấu trúc
    console.log("Full API Response:", response);  // Log toàn bộ đối tượng response
    console.log("Response Data:", response); // API của bạn trả về danh sách, không phải 'response.data'

    if (response) {
      // Nếu API trả về mảng dịch vụ, set vào state
      setServices(response);
      setTotalPages(1); // Giả sử API không trả về phân trang, đặt mặc định là 1 trang
    } else {
      // Nếu không phải mảng hoặc không có dữ liệu hợp lệ
      setError("Không tìm thấy dữ liệu dịch vụ hoặc cấu trúc phản hồi không hợp lệ");
    }
  } catch (err) {
    console.error('Lỗi khi tải dịch vụ:', err);
    setError(handleApiError(err));  // Xử lý lỗi rõ ràng hơn
  } finally {
    setIsLoading(false);
  }
};




  const loadStats = async () => {
    try {
      const statsData = await servicesService.getServiceStats();

      // Check if the stats data is valid and complete
      console.log("Service Stats:", statsData);
      
      // Check if stats are available and handle missing data
      if (statsData) {
        setStats(statsData);
      } else {
        setError("No service statistics found");
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
      setError("Error loading service statistics");
    }
  };


  const loadServiceConfigurations = async (maDichVu) => {
    try {
      const response = await serviceConfigurationService.getConfigurations({ maDichVu });
      setConfigurations(response.data);
    } catch (err) {
      console.error('Failed to load configurations:', err);
    }
  };

  const loadServicePackages = async (maDichVu) => {
    try {
      const response = await servicePackagesService.getPackages({ maDichVu });
      setPackages(response.data);
    } catch (err) {
      console.error('Failed to load packages:', err);
    }
  };

  const loadFeeParameters = async (cauHinhId) => {
    try {
      const parameters = await feeParametersService.getFeeParameters(cauHinhId);
      setFeeParameters(parameters);
    } catch (err) {
      console.error('Failed to load fee parameters:', err);
    }
  };

  const handleRetry = () => {
    loadServices();
    loadStats();
  };

  const handleStatusChange = async (maDichVu, newStatus) => {
    setIsUpdating(true);
    try {
      await servicesService.updateServiceStatus(maDichVu, newStatus);

      setServices(prev => prev.map(service =>
        service.maDichVu === maDichVu
          ? { ...service, trangThai: newStatus }
          : service
      ));

      loadStats();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateService = () => {
    setEditingService(null);
    setModalMode('create');
    setShowServiceModal(true);
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setModalMode('edit');
    setShowServiceModal(true);
  };

  const handleDeleteService = async (service) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa dịch vụ "${service.tenDichVu}"?`)) {
      return;
    }

    setIsUpdating(true);
    try {
      await servicesService.deleteService(service.maDichVu);
      setServices(prev => prev.filter(s => s.maDichVu !== service.maDichVu));
      loadStats();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleServiceSaved = (savedService) => {
    if (modalMode === 'create') {
      setServices(prev => [...prev, savedService]);
    } else {
      setServices(prev => prev.map(service =>
        service.maDichVu === savedService.maDichVu ? savedService : service
      ));
    }
    loadStats();
  };

  const handleCreateConfiguration = (service) => {
    setSelectedService(service);
    setEditingConfiguration(null);
    setModalMode('create');
    setShowConfigurationModal(true);
  };

  const handleEditConfiguration = (config) => {
    setEditingConfiguration(config);
    setModalMode('edit');
    setShowConfigurationModal(true);
  };

  const handleDeleteConfiguration = async (config) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa cấu hình "${config.tenCauHinh}"?`)) {
      return;
    }

    setIsUpdating(true);
    try {
      await serviceConfigurationService.deleteConfiguration(config.id);
      setConfigurations(prev => prev.filter(c => c.id !== config.id));
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfigurationSaved = (savedConfig) => {
    if (modalMode === 'create') {
      setConfigurations(prev => [...prev, savedConfig]);
    } else {
      setConfigurations(prev => prev.map(config =>
        config.id === savedConfig.id ? savedConfig : config
      ));
    }
  };

  const handleCreateFeeParameter = (config) => {
    setSelectedConfiguration(config);
    setEditingFeeParameter(null);
    setModalMode('create');
    setShowFeeParameterModal(true);
  };

  const handleEditFeeParameter = (param) => {
    setEditingFeeParameter(param);
    setModalMode('edit');
    setShowFeeParameterModal(true);
  };

  const handleDeleteFeeParameter = async (param) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bậc phí "${param.ten}"?`)) {
      return;
    }

    setIsUpdating(true);
    try {
      await feeParametersService.deleteFeeParameter(param.id);
      setFeeParameters(prev => prev.filter(p => p.id !== param.id));
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFeeParameterSaved = (savedParam) => {
    if (modalMode === 'create') {
      setFeeParameters(prev => [...prev, savedParam]);
    } else {
      setFeeParameters(prev => prev.map(param =>
        param.id === savedParam.id ? savedParam : param
      ));
    }
  };

  const handleCreatePackage = (service) => {
    setSelectedService(service);
    setEditingPackage(null);
    setModalMode('create');
    setShowPackageModal(true);
  };

  const handleEditPackage = (pkg) => {
    setEditingPackage(pkg);
    setModalMode('edit');
    setShowPackageModal(true);
  };

  const handleDeletePackage = async (pkg) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa gói cước "${pkg.tenGoi}"?`)) {
      return;
    }

    setIsUpdating(true);
    try {
      await servicePackagesService.deletePackage(pkg.id);
      setPackages(prev => prev.filter(p => p.id !== pkg.id));
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePackageSaved = (savedPackage) => {
    if (modalMode === 'create') {
      setPackages(prev => [...prev, savedPackage]);
    } else {
      setPackages(prev => prev.map(pkg =>
        pkg.id === savedPackage.id ? savedPackage : pkg
      ));
    }
  };

  const openServiceDetails = async (service) => {
    setSelectedService(service);
    setShowDetails(true);
    if (service.loaiTinhPhi === 'TheoChiSo' || service.loaiTinhPhi === 'CoDinh') {
      await loadServiceConfigurations(service.maDichVu);
    } else if (service.loaiTinhPhi === 'GoiCuoc') {
      await loadServicePackages(service.maDichVu);
    }
  };

  const openConfigurationDetails = async (config) => {
    setSelectedConfiguration(config);
    await loadFeeParameters(config.id);
    setShowConfigurations(true);
  };

  const getServiceIcon = (iconName) => {
    const icons = {
      home: Home,
      zap: Zap,
      droplets: Droplets,
      shield: Shield,
      car: Car,
      wrench: Wrench,
      wifi: Wifi
    };
    const Icon = iconName ? icons[iconName] || Settings : Settings;
    return <Icon className="h-5 w-5" />;
  };

  const getTypeBadge = (type) => {
    const styles = {
      'TheoChiSo': 'bg-blue-100 text-blue-800',
      'CoDinh': 'bg-green-100 text-green-800',
      'GoiCuoc': 'bg-purple-100 text-purple-800'
    };

    const labels = {
      'TheoChiSo': 'Theo chỉ số',
      'CoDinh': 'Cố định',
      'GoiCuoc': 'Gói cước'
    };

    return (
      <span className={cn('px-2 py-1 rounded-full text-xs font-medium', styles[type])}>
        {labels[type]}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Hoạt động': 'bg-green-100 text-green-800',
      'Ngừng hoạt động': 'bg-red-100 text-red-800'
    };

    const icons = {
      'Hoạt động': CheckCircle,
      'Ngừng hoạt động': XCircle
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
    { label: 'Tổng dịch vụ', value: stats?.totalServices || 0, color: 'text-blue-600', icon: Settings },
    { label: 'Hoạt động', value: stats?.hoatDong || 0, color: 'text-green-600', icon: CheckCircle },
    { label: 'Bắt buộc', value: stats?.batBuoc || 0, color: 'text-red-600', icon: AlertCircle },
    { label: 'Theo chỉ số', value: stats?.theoChiSo || 0, color: 'text-purple-600', icon: TrendingUp }
  ];

  if (error && !services.length) {
    return (
      <ErrorFallback 
        error={error} 
        onRetry={handleRetry}
        message="Không thể tải danh sách dịch vụ"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Quản lý dịch vụ</h3>
          <p className="text-sm text-gray-600 mt-1">Quản lý các dịch vụ và cấu hình giá phí</p>
        </div>
        <button
          onClick={handleCreateService}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center"
          disabled={isUpdating}
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm dịch vụ
        </button>
      </div>

      {/* Statistics */}
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

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên dịch vụ, mã dịch vụ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">Tất cả loại</option>
              <option value="TheoChiSo">Theo chỉ số</option>
              <option value="CoDinh">Cố định</option>
              <option value="GoiCuoc">Gói cước</option>
            </select>
            
            <select
              value={requiredFilter}
              onChange={(e) => setRequiredFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">Tất cả</option>
              <option value="true">Bắt buộc</option>
              <option value="false">Tùy chọn</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Hoạt động">Hoạt động</option>
              <option value="Ngừng hoạt động">Ngừng hoạt động</option>
            </select>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4 animate-pulse">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                    <div className="w-16 h-6 bg-gray-200 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <div key={service.maDichVu} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary-100 rounded-lg text-primary">
                        {getServiceIcon(service.icon)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{service.tenDichVu}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          {getTypeBadge(service.loaiTinhPhi)}
                          {service.batBuoc && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Bắt buộc
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => openServiceDetails(service)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="Xem chi tiết"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditService(service)}
                        className="text-gray-500 hover:text-gray-700 p-1"
                        title="Chỉnh sửa"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(service)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Xóa dịch vụ"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleStatusChange(
                          service.maDichVu, 
                          service.trangThai === 'Hoạt động' ? 'Ngừng hoạt động' : 'Hoạt động'
                        )}
                        disabled={isUpdating}
                        className={cn(
                          'w-8 h-4 rounded-full transition-colors relative disabled:opacity-50',
                          service.trangThai === 'Hoạt động' ? 'bg-green-500' : 'bg-gray-300'
                        )}
                      >
                        <div className={cn(
                          'w-3 h-3 bg-white rounded-full transition-transform absolute top-0.5',
                          service.trangThai === 'Hoạt động' ? 'translate-x-4' : 'translate-x-0.5'
                        )} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Mã dịch vụ:</span>
                      <span className="font-medium text-gray-900">{service.maDichVu}</span>
                    </div>
                    
                    {service.donViTinh && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Đơn vị tính:</span>
                        <span className="font-medium text-gray-900">{service.donViTinh}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Trạng thái:</span>
                      {getStatusBadge(service.trangThai)}
                    </div>

                    {service.moTa && (
                      <p className="text-sm text-gray-600 mt-2">{service.moTa}</p>
                    )}

                    {/* Service specific info */}
                    {service.loaiTinhPhi === 'GoiCuoc' && (
                      <div className="flex items-center justify-between text-sm pt-2 border-t">
                        <span className="text-gray-600">Gói cước:</span>
                        <span className="font-medium text-blue-600">{service.totalPackages} gói</span>
                      </div>
                    )}

                    {(service.loaiTinhPhi === 'TheoChiSo' || service.loaiTinhPhi === 'CoDinh') && (
                      <div className="flex items-center justify-between text-sm pt-2 border-t">
                        <span className="text-gray-600">Cấu hình:</span>
                        <span className="font-medium text-blue-600">{service.totalConfigurations} cấu hình</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {services.length === 0 && !isLoading && (
                <div className="col-span-2 text-center py-8">
                  <p className="text-gray-500">Không tìm thấy dịch vụ nào phù hợp</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
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

      {/* Loading Overlay */}
      {isUpdating && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-40">
          <Loading text="Đang cập nhật..." />
        </div>
      )}

      {/* Service Details Modal */}
      {showDetails && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Chi tiết dịch vụ</h3>
              <button 
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Service Header */}
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-primary-100 rounded-lg flex items-center justify-center text-primary">
                  {getServiceIcon(selectedService.icon)}
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-medium text-gray-900">{selectedService.tenDichVu}</h4>
                  <p className="text-gray-600">{selectedService.moTa}</p>
                  <div className="flex space-x-2 mt-2">
                    {getTypeBadge(selectedService.loaiTinhPhi)}
                    {getStatusBadge(selectedService.trangThai)}
                    {selectedService.batBuoc && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Bắt buộc
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Service Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h5 className="font-medium text-gray-900">Thông tin dịch vụ</h5>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Mã dịch vụ</label>
                    <p className="text-gray-900">{selectedService.maDichVu}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Đơn vị tính</label>
                    <p className="text-gray-900">{selectedService.donViTinh || 'Không có'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Loại tính phí</label>
                    <div className="mt-1">{getTypeBadge(selectedService.loaiTinhPhi)}</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h5 className="font-medium text-gray-900">Cấu hình chi tiết</h5>
                  
                  {(selectedService.loaiTinhPhi === 'TheoChiSo' || selectedService.loaiTinhPhi === 'CoDinh') && (
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-600">Cấu hình giá ({configurations.length})</label>
                        <button
                          onClick={() => handleCreateConfiguration(selectedService)}
                          className="text-xs px-2 py-1 bg-primary text-white rounded hover:bg-primary-600"
                        >
                          <Plus className="h-3 w-3 mr-1 inline" />
                          Thêm cấu hình
                        </button>
                      </div>
                      <div className="mt-2 space-y-2">
                        {configurations.map((config) => (
                          <div key={config.id} className="border rounded-lg p-3 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-sm">{config.tenCauHinh}</p>
                                <p className="text-xs text-gray-500">
                                  Hiệu lực: {new Date(config.ngayHieuLuc).toLocaleDateString('vi-VN')}
                                </p>
                              </div>
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => openConfigurationDetails(config)}
                                  className="text-blue-600 hover:text-blue-900 text-xs px-2 py-1 rounded"
                                  title="Xem chi tiết"
                                >
                                  <Eye className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => handleEditConfiguration(config)}
                                  className="text-gray-600 hover:text-gray-900 text-xs px-2 py-1 rounded"
                                  title="Chỉnh sửa"
                                >
                                  <Edit3 className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteConfiguration(config)}
                                  className="text-red-600 hover:text-red-900 text-xs px-2 py-1 rounded"
                                  title="Xóa"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedService.loaiTinhPhi === 'GoiCuoc' && (
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-600">Gói cước ({packages.length})</label>
                        <button
                          onClick={() => handleCreatePackage(selectedService)}
                          className="text-xs px-2 py-1 bg-primary text-white rounded hover:bg-primary-600"
                        >
                          <Plus className="h-3 w-3 mr-1 inline" />
                          Thêm gói
                        </button>
                      </div>
                      <div className="mt-2 space-y-2">
                        {packages.map((pkg) => (
                          <div key={pkg.id} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-sm">{pkg.tenGoi}</p>
                                <p className="text-xs text-gray-500">{pkg.moTa}</p>
                                <p className="text-sm font-medium text-green-600">
                                  {pkg.donGia.toLocaleString('vi-VN')} VND
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                {getStatusBadge(pkg.trangThai)}
                                <div className="flex items-center space-x-1">
                                  <button
                                    onClick={() => handleEditPackage(pkg)}
                                    className="text-gray-600 hover:text-gray-900 text-xs px-2 py-1 rounded"
                                    title="Chỉnh sửa"
                                  >
                                    <Edit3 className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => handleDeletePackage(pkg)}
                                    className="text-red-600 hover:text-red-900 text-xs px-2 py-1 rounded"
                                    title="Xóa"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button 
                onClick={() => setShowDetails(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Đóng
              </button>
              <button className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600">
                Chỉnh sửa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Details Modal */}
      {showConfigurations && selectedConfiguration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Chi tiết cấu hình giá</h3>
              <button 
                onClick={() => setShowConfigurations(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">{selectedConfiguration.tenCauHinh}</h4>
                <p className="text-sm text-gray-600">
                  Hiệu lực từ: {new Date(selectedConfiguration.ngayHieuLuc).toLocaleDateString('vi-VN')}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900">Bậc giá chi tiết</h5>
                  <button
                    onClick={() => handleCreateFeeParameter(selectedConfiguration)}
                    className="text-xs px-2 py-1 bg-primary text-white rounded hover:bg-primary-600"
                  >
                    <Plus className="h-3 w-3 mr-1 inline" />
                    Thêm bậc
                  </button>
                </div>
                <div className="space-y-2">
                  {feeParameters.map((param) => (
                    <div key={param.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{param.ten}</p>
                          <p className="text-xs text-gray-500">
                            Từ {param.giaTriTu.toLocaleString('vi-VN')} - {param.giaTriDen === 999999 ? '∞' : param.giaTriDen.toLocaleString('vi-VN')}
                          </p>
                        </div>
                        <div className="text-right flex items-center space-x-2">
                          <div>
                            <p className="font-medium text-green-600">
                              {param.donGia.toLocaleString('vi-VN')} VND
                            </p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleEditFeeParameter(param)}
                              className="text-gray-600 hover:text-gray-900 text-xs px-2 py-1 rounded"
                              title="Chỉnh sửa"
                            >
                              <Edit3 className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteFeeParameter(param)}
                              className="text-red-600 hover:text-red-900 text-xs px-2 py-1 rounded"
                              title="Xóa"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button 
                onClick={() => setShowConfigurations(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      <ServiceModal
        isOpen={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        onSave={handleServiceSaved}
        service={editingService}
        mode={modalMode}
      />

      <ConfigurationModal
        isOpen={showConfigurationModal}
        onClose={() => setShowConfigurationModal(false)}
        onSave={handleConfigurationSaved}
        configuration={editingConfiguration}
        maDichVu={selectedService?.maDichVu || ''}
        tenDichVu={selectedService?.tenDichVu || ''}
        mode={modalMode}
      />

      <FeeParameterModal
        isOpen={showFeeParameterModal}
        onClose={() => setShowFeeParameterModal(false)}
        onSave={handleFeeParameterSaved}
        parameter={editingFeeParameter}
        cauHinhId={selectedConfiguration?.id || ''}
        tenCauHinh={selectedConfiguration?.tenCauHinh || ''}
        existingParameters={feeParameters}
        mode={modalMode}
      />

      <ServicePackageModal
        isOpen={showPackageModal}
        onClose={() => setShowPackageModal(false)}
        onSave={handlePackageSaved}
        servicePackage={editingPackage}
        maDichVu={selectedService?.maDichVu || ''}
        tenDichVu={selectedService?.tenDichVu || ''}
        mode={modalMode}
      />
    </div>
  );
};

export default NewServicesManagementTab;
