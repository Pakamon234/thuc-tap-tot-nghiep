import React, { useState, useEffect } from 'react';
import { X, Save, FileText, CheckSquare, Square } from 'lucide-react';
import { contractTemplateService, servicesService } from '../services/contractTemplateService';
import { Service } from '../services/servicesManagementService';

const ContractTemplateModal = ({ isOpen, onClose, onSave, template, mode }) => {
  const [formData, setFormData] = useState({
    tenMau: '',
    moTa: '',
    dieuKhoanChinh: '',
    trangThai: 'Hoạt động'
  });

  const [selectedServices, setSelectedServices] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (isOpen) {
      loadAvailableServices();
      
      if (mode === 'edit' && template) {
        setFormData({
          tenMau: template.tenMau,
          moTa: template.moTa || '',
          dieuKhoanChinh: template.dieuKhoanChinh || '',
          trangThai: template.trangThai || 'Hoạt động'
        });
        loadTemplateServices(template.id);
      } else {
        setFormData({
          tenMau: '',
          moTa: '',
          dieuKhoanChinh: '',
          trangThai: 'Hoạt động'
        });
        setSelectedServices([]);
      }
      setErrors({});
      setActiveTab('basic');
    }
  }, [isOpen, mode, template]);

  const loadAvailableServices = async () => {
    setIsLoadingServices(true);
    try {
      const response = await servicesService.getServices({ limit: 100 });
      setAvailableServices(response.data.filter(s => s.trangThai === 'Hoạt động'));
    } catch (error) {
      console.error('Failed to load services:', error);
    } finally {
      setIsLoadingServices(false);
    }
  };

  const loadTemplateServices = async (templateId) => {
    try {
      const templateServices = await contractTemplateService.getTemplateServices(templateId);
      setSelectedServices(templateServices.map(ts => ts.maDichVu));
    } catch (error) {
      console.error('Failed to load template services:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.tenMau.trim()) {
      newErrors.tenMau = 'Tên mẫu hợp đồng là bắt buộc';
    } else if (formData.tenMau.length < 5) {
      newErrors.tenMau = 'Tên mẫu hợp đồng phải có ít nhất 5 ký tự';
    }

    if (selectedServices.length === 0) {
      newErrors.services = 'Phải chọn ít nhất một dịch vụ';
    }

    if (formData.dieuKhoanChinh && formData.dieuKhoanChinh.length < 50) {
      newErrors.dieuKhoanChinh = 'Điều khoản chính phải có ít nhất 50 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Switch to the tab with errors
      if (errors.tenMau || errors.moTa) setActiveTab('basic');
      else if (errors.services) setActiveTab('services');
      else if (errors.dieuKhoanChinh) setActiveTab('terms');
      return;
    }

    setIsSubmitting(true);
    try {
      let savedTemplate;

      if (mode === 'create') {
        const createData = {
          ...formData,
          selectedServices
        };
        savedTemplate = await contractTemplateService.createTemplate(createData);
      } else {
        savedTemplate = await contractTemplateService.updateTemplate(template.id, formData);
        // Update services separately for edit mode
        await contractTemplateService.updateTemplateServices(template.id, selectedServices);
        savedTemplate.soLuongDichVu = selectedServices.length;
      }

      onSave(savedTemplate);
      onClose();
    } catch (error) {
      console.error('Error saving template:', error);
      setErrors({ submit: 'Có lỗi xảy ra khi lưu mẫu hợp đồng' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleServiceToggle = (serviceId) => {
    setSelectedServices(prev => {
      const newSelection = prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId];
      
      if (errors.services && newSelection.length > 0) {
        setErrors(prevErrors => ({ ...prevErrors, services: '' }));
      }
      
      return newSelection;
    });
  };

  const getServiceTypeBadge = (type) => {
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
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[type]}`}>
        {labels[type]}
      </span>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            {mode === 'create' ? 'Tạo mẫu hợp đồng mới' : 'Chỉnh sửa mẫu hợp đồng'}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              type="button"
              onClick={() => setActiveTab('basic')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'basic'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Thông tin cơ bản
              {(errors.tenMau || errors.moTa) && <span className="ml-1 text-red-500">•</span>}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('services')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'services'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Dịch vụ áp dụng ({selectedServices.length})
              {errors.services && <span className="ml-1 text-red-500">•</span>}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('terms')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'terms'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Điều khoản hợp đồng
              {errors.dieuKhoanChinh && <span className="ml-1 text-red-500">•</span>}
            </button>
          </nav>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên mẫu hợp đồng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.tenMau}
                  onChange={(e) => handleInputChange('tenMau', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.tenMau ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="VD: Hợp đồng dịch vụ cơ bản"
                  disabled={isSubmitting}
                />
                {errors.tenMau && <p className="text-red-500 text-xs mt-1">{errors.tenMau}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  rows={3}
                  value={formData.moTa}
                  onChange={(e) => handleInputChange('moTa', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Mô tả chi tiết về mẫu hợp đồng, phạm vi áp dụng..."
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select 
                  value={formData.trangThai}
                  onChange={(e) => handleInputChange('trangThai', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isSubmitting}
                >
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Ngừng sử dụng">Ngừng sử dụng</option>
                </select>
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Chọn dịch vụ áp dụng <span className="text-red-500">*</span>
                  </label>
                  <span className="text-sm text-gray-500">
                    Đã chọn: {selectedServices.length} dịch vụ
                  </span>
                </div>

                {errors.services && <p className="text-red-500 text-xs mb-3">{errors.services}</p>}

                {isLoadingServices ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2">Đang tải dịch vụ...</span>
                  </div>
                ) : (
                  <div className="border rounded-lg max-h-80 overflow-y-auto">
                    {availableServices.map((service) => (
                      <div
                        key={service.maDichVu}
                        className={`p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer ${
                          selectedServices.includes(service.maDichVu) ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => handleServiceToggle(service.maDichVu)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {selectedServices.includes(service.maDichVu) ? (
                              <CheckSquare className="h-5 w-5 text-primary" />
                            ) : (
                              <Square className="h-5 w-5 text-gray-400" />
                            )}
                            <div>
                              <p className="font-medium text-gray-900">{service.tenDichVu}</p>
                              <p className="text-sm text-gray-500">{service.maDichVu}</p>
                              {service.moTa && (
                                <p className="text-xs text-gray-400 mt-1">{service.moTa}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getServiceTypeBadge(service.loaiTinhPhi)}
                            {service.batBuoc && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Bắt buộc
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {availableServices.length === 0 && (
                      <div className="p-8 text-center text-gray-500">
                        Không có dịch vụ nào khả dụng
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Terms Tab */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Điều khoản chính của hợp đồng
                </label>
                <textarea
                  rows={12}
                  value={formData.dieuKhoanChinh}
                  onChange={(e) => handleInputChange('dieuKhoanChinh', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm ${
                    errors.dieuKhoanChinh ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={`1. ĐIỀU KHO��N THANH TOÁN
- Thanh toán hàng tháng trước ngày 15
- Chậm thanh toán sẽ bị tính phí phạt

2. ĐIỀU KHOẢN SỬ DỤNG DỊCH VỤ
- Sử dụng dịch vụ đúng mục đích
- Không được chuyển nhượng quyền sử dụng

3. TRÁCH NHIỆM CÁC BÊN
- Cư dân: Thanh toán đúng hạn
- Ban quản lý: Cung cấp dịch vụ ổn định`}
                  disabled={isSubmitting}
                />
                {errors.dieuKhoanChinh && <p className="text-red-500 text-xs mt-1">{errors.dieuKhoanChinh}</p>}
                <p className="text-xs text-gray-500 mt-1">
                  Nhập các điều khoản chính của hợp đồng. Tối thiểu 50 ký tự.
                </p>
              </div>
            </div>
          )}

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{errors.submit}</p>
            </div>
          )}

          <div className="flex space-x-3 pt-4 border-t">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {mode === 'create' ? 'Tạo mẫu hợp đồng' : 'Cập nhật'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContractTemplateModal;
