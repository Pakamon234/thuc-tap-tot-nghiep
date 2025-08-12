import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { servicesService } from '../services/servicesManagementService';

const ServiceModal = ({ isOpen, onClose, onSave, service, mode }) => {
  const [formData, setFormData] = useState({
    maDichVu: '',
    tenDichVu: '',
    donViTinh: '',
    moTa: '',
    loaiTinhPhi: 'CoDinh',
    batBuoc: false,
    trangThai: 'Hoạt động',
    icon: 'settings',
    category: 'utilities',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && mode === 'edit' && service) {
      setFormData({
        maDichVu: service.maDichVu,
        tenDichVu: service.tenDichVu,
        donViTinh: service.donViTinh || '',
        moTa: service.moTa || '',
        loaiTinhPhi: service.loaiTinhPhi,
        batBuoc: service.batBuoc,
        trangThai: service.trangThai,
        icon: service.icon || 'settings',
        category: service.category || 'utilities',
      });
    } else {
      setFormData({
        maDichVu: '',
        tenDichVu: '',
        donViTinh: '',
        moTa: '',
        loaiTinhPhi: 'CoDinh',
        batBuoc: false,
        trangThai: 'Hoạt động',
        icon: 'settings',
        category: 'utilities',
      });
      setErrors({});
    }
  }, [isOpen, mode, service]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.maDichVu.trim()) {
      newErrors.maDichVu = 'Mã dịch vụ là bắt buộc';
    }

    if (!formData.tenDichVu.trim()) {
      newErrors.tenDichVu = 'Tên dịch vụ là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      let savedService;
      if (mode === 'create') {
        savedService = await servicesService.createService(formData);
      } else {
        savedService = await servicesService.updateService(formData.maDichVu, formData);
      }

      onSave(savedService);
      onClose();
    } catch (error) {
      setErrors({ submit: 'Có lỗi xảy ra khi lưu dịch vụ' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">{mode === 'create' ? 'Thêm dịch vụ mới' : 'Chỉnh sửa dịch vụ'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên dịch vụ</label>
            <input
              type="text"
              value={formData.tenDichVu}
              onChange={(e) => handleInputChange('tenDichVu', e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Tên dịch vụ"
            />
            {errors.tenDichVu && <p className="text-red-500 text-xs">{errors.tenDichVu}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mô tả</label>
            <textarea
              value={formData.moTa}
              onChange={(e) => handleInputChange('moTa', e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Mô tả"
            />
          </div>
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceModal;
