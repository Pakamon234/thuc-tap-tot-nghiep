import React, { useState, useEffect } from 'react';
import { X, Plus, HelpCircle, Search, DollarSign, Tag } from 'lucide-react';
import  contractsService from '../services/contractsService';
// import ServiceDetailsModal from './ServiceDetailsModal';
import Loading from './Loading';
import { ErrorFallback } from './ErrorBoundary';
import { cn } from '../lib/utils';

/**
 * @typedef {Object} Service
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} category
 * @property {number} price
 * @property {string} unit
 * @property {string} type
 * @property {boolean} isActive
 */

/**
 * @typedef {Object} AddServicesModalProps
 * @property {boolean} isOpen
 * @property {() => void} onClose
 * @property {(serviceIds: string[]) => void} onServicesSelected
 * @property {string[]} [excludeServiceIds] - Services already in contract
 */

/**
 * @param {AddServicesModalProps} props
 */
const AddServicesModal = ({
  isOpen,
  onClose,
  onServicesSelected,
  excludeServiceIds = []
}) => {
  /** @type {[Service[], Function]} */
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  /** @type {[string|null, Function]} */
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  /** @type {[Set<string>, Function]} */
  const [selectedServices, setSelectedServices] = useState(new Set());
  /** @type {[Service|null, Function]} */
  const [selectedServiceForDetails, setSelectedServiceForDetails] = useState(null);
  const [isServiceDetailsOpen, setIsServiceDetailsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadServices();
      setSelectedServices(new Set());
      setSearchTerm('');
    }
  }, [isOpen]);

    // Hàm xử lý lỗi API trực tiếp trong file
  const handleApiError = (error) => {
    if (error.response) {
      return error.response.data?.message || `Lỗi API: ${error.response.status}`;
    } else if (error.request) {
      return 'Không thể kết nối tới máy chủ';
    } else {
      return error.message || 'Lỗi không xác định';
    }
  };

  const loadServices = async () => {
    setIsLoading(true);
    setError(null);
    try {
        const servicesData = await contractsService.getAllServices();

        // Map JSON từ API sang format của AddServicesModal
        const mappedServices = servicesData
        .filter(s => s.trangThai === 'HoatDong') // chỉ lấy dịch vụ hoạt động
        .map(s => ({
            id: s.maDichVu,
            name: s.tenDichVu,
            description: s.moTa,
            unit: s.donViTinh,
            price: 0, // nếu API chưa trả giá thì để tạm 0
            loaiTinhPhi: s.loaiTinhPhi,
            type: s.batBuoc ? 'required' : 'optional',
            isActive: s.trangThai === 'HoatDong'
        }))
        .filter(s => 
            s.type === 'optional' &&
            s.isActive &&
            !excludeServiceIds.includes(s.id)
        );

        setServices(mappedServices);
        console.log("Loaded services:", mappedServices);
    } catch (err) {
        setError(handleApiError(err));
    } finally {
        setIsLoading(false);
    }
};


  const handleRetry = () => {
    loadServices();
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
    // service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleServiceToggle = (serviceId) => {
    const newSelected = new Set(selectedServices);
    console.log("Toggle service ID:", serviceId);
    console.log("Current selected:", Array.from(selectedServices));

    if (newSelected.has(serviceId)) {
      newSelected.delete(serviceId);
    } else {
      newSelected.add(serviceId);
    }
    setSelectedServices(newSelected);
  };

  const handleViewServiceDetails = (service) => {
    setSelectedServiceForDetails(service);
    setIsServiceDetailsOpen(true);
  };

  const handleSave = () => {
    onServicesSelected(Array.from(selectedServices));
    onClose();
  };

//   const getCategoryColor = (category) => {
//     const colors = {
//       security: 'bg-red-100 text-red-800',
//       parking: 'bg-purple-100 text-purple-800',
//       internet: 'bg-blue-100 text-blue-800',
//       cleaning: 'bg-green-100 text-green-800',
//       maintenance: 'bg-orange-100 text-orange-800'
//     };
//     return colors[category] || 'bg-gray-100 text-gray-800';
//   };

//   const getCategoryLabel = (category) => {
//     const labels = {
//       security: 'An ninh',
//       parking: 'Gửi xe',
//       internet: 'Internet',
//       cleaning: 'Vệ sinh',
//       maintenance: 'Bảo trì'
//     };
//     return labels[category] || category;
//   };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Thêm dịch vụ</h2>
              <p className="text-gray-600 mt-1">Chọn các dịch vụ bổ sung cho hợp đồng của bạn</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1 rounded"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Tìm kiếm dịch vụ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="py-8">
              <Loading text="Đang tải danh sách dịch vụ..." />
            </div>
          ) : error ? (
            <ErrorFallback 
              error={error} 
              onRetry={handleRetry}
              message="Không thể tải danh sách dịch vụ"
            />
          ) : (
            <>
              {/* Services List */}
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {filteredServices.map((service) => (
                    console.log("Rendering service:", service),
                  <div
                    key={service.id}
                    className={cn(
                      'border rounded-lg p-4 transition-all cursor-pointer',
                      selectedServices.has(service.id) 
                        ? 'border-primary bg-primary-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start space-x-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-medium text-gray-900">{service.name}</h3>
                              {/* <span className={cn(
                                'px-2 py-1 rounded-full text-xs font-medium',
                                getCategoryColor(service.category)
                              )}>
                                {getCategoryLabel(service.category)}
                              </span> */}
                            </div>
                            <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                            <p className="text-sm font-medium text-gray-900 mt-1">
                            Tính phí theo: {
                                service.loaiTinhPhi === 'GoiCuoc' ? 'Gói Cước' :
                                service.loaiTinhPhi === 'TheoChiSo' ? 'Theo chỉ số' :
                                service.loaiTinhPhi === 'CoDinh' ? 'Cố định' :
                                service.loaiTinhPhi
                            }
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleViewServiceDetails(service)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded"
                          title="Xem chi tiết điều khoản"
                        >
                          <HelpCircle className="h-4 w-4" />
                        </button>
                        
                        <button
                        onClick={() => {
                            console.log("Clicked button for", service.id);
                            handleServiceToggle(service.id);
                        }}
                        className={cn(
                        'px-3 py-1 rounded-lg text-sm font-medium transition-colors inline-flex items-center select-none cursor-pointer',
                        selectedServices.has(service.id)
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-blue-600 text-white hover:bg-blue-700',
                        )}
                        style={{ zIndex: 10 }}
                        >
                        {selectedServices.has(service.id) ? (
                            <>
                            <X className="h-3 w-3 mr-1 inline" />
                            Bỏ chọn
                            </>
                        ) : (
                            <>
                            <Plus className="h-3 w-3 mr-1 inline" />
                            Thêm
                            </>
                        )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredServices.length === 0 && !isLoading && (
                  <div className="text-center py-8">
                    <Tag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {searchTerm ? 'Không tìm thấy dịch vụ phù hợp' : 'Không có dịch vụ nào khả dụng'}
                    </p>
                  </div>
                )}
              </div>

              {/* Selected Services Summary */}
              {selectedServices.size > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Đã chọn {selectedServices.size} dịch vụ
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(selectedServices).map(serviceId => {
                      const service = services.find(s => s.id === serviceId);
                      return service ? (
                        <span
                          key={serviceId}
                          className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {service.name}
                          <button
                            onClick={() => handleServiceToggle(serviceId)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Footer */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
            onClick={handleSave}
            disabled={selectedServices.size === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
            Lưu ({selectedServices.size} dịch vụ)
            </button>
          </div>
        </div>
      </div>

      {/* Service Details Modal */}
      {/* <ServiceDetailsModal
        isOpen={isServiceDetailsOpen}
        onClose={() => setIsServiceDetailsOpen(false)}
        service={selectedServiceForDetails}
      /> */}
    </>
  );
};

export default AddServicesModal;
