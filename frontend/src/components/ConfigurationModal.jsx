import React, { useState, useEffect } from 'react';
import { X, Save, Calendar } from 'lucide-react';
import { serviceConfigurationService } from '../services/servicesManagementService';

const ConfigurationModal = ({
  isOpen,
  onClose,
  onSave,
  configuration,
  maDichVu,
  tenDichVu,
  mode
}) => {
  const [formData, setFormData] = useState({
    tenCauHinh: '',
    ngayHieuLuc: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && configuration) {
        setFormData({
          tenCauHinh: configuration.tenCauHinh,
          ngayHieuLuc: configuration.ngayHieuLuc
        });
      } else {
        const currentYear = new Date().getFullYear();
        setFormData({
          tenCauHinh: `Cấu hình ${tenDichVu} ${currentYear}`,
          ngayHieuLuc: new Date().toISOString().split('T')[0]
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, configuration, tenDichVu]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.tenCauHinh.trim()) {
      newErrors.tenCauHinh = 'Tên cấu hình là bắt buộc';
    } else if (formData.tenCauHinh.length < 5) {
      newErrors.tenCauHinh = 'Tên cấu hình phải có ít nhất 5 ký tự';
    }

    if (!formData.ngayHieuLuc) {
      newErrors.ngayHieuLuc = 'Ngày hiệu lực là bắt buộc';
    } else {
      const selectedDate = new Date(formData.ngayHieuLuc);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today && mode === 'create') {
        newErrors.ngayHieuLuc = 'Ngày hiệu lực không thể là ngày quá khứ';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      let savedConfiguration;

      if (mode === 'create') {
        savedConfiguration = await serviceConfigurationService.createConfiguration({
          ...formData,
          maDichVu,
          tenDichVu,
          totalParameters: 0,
          isActive: true
        });
      } else {
        savedConfiguration = await serviceConfigurationService.updateConfiguration(
          configuration.id,
          formData
        );
      }

      onSave(savedConfiguration);
      onClose();
    } catch (error) {
      console.error('Error saving configuration:', error);
      setErrors({ submit: 'Có lỗi xảy ra khi lưu cấu hình' });
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">{mode === 'create' ? 'Thêm cấu hình mới' : 'Chỉnh sửa cấu hình'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" disabled={isSubmitting}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700">
            <strong>Dịch vụ:</strong> {tenDichVu}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên cấu hình <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.tenCauHinh}
              onChange={(e) => handleInputChange('tenCauHinh', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.tenCauHinh ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="VD: Biểu giá điện sinh hoạt 2024"
              disabled={isSubmitting}
            />
            {errors.tenCauHinh && <p className="text-red-500 text-xs mt-1">{errors.tenCauHinh}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày hiệu lực <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="date"
                value={formData.ngayHieuLuc}
                onChange={(e) => handleInputChange('ngayHieuLuc', e.target.value)}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.ngayHieuLuc ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              />
            </div>
            {errors.ngayHieuLuc && <p className="text-red-500 text-xs mt-1">{errors.ngayHieuLuc}</p>}
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{errors.submit}</p>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
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
                  {mode === 'create' ? 'Tạo cấu hình' : 'Cập nhật'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfigurationModal;
