import React, { useState, useEffect } from 'react';
import { X, Save, DollarSign, Calendar, Package } from 'lucide-react';
import { servicePackagesService } from '../services/servicesManagementService';

const ServicePackageModal = ({ isOpen, onClose, onSave, servicePackage, maDichVu, tenDichVu, mode }) => {
  const [formData, setFormData] = useState({
    tenGoi: '',
    donGia: 0,
    moTa: '',
    ngayHieuLuc: '',
    trangThai: 'Hoạt động',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && servicePackage) {
        setFormData({
          tenGoi: servicePackage.tenGoi,
          donGia: servicePackage.donGia,
          moTa: servicePackage.moTa || '',
          ngayHieuLuc: servicePackage.ngayHieuLuc,
          trangThai: servicePackage.trangThai,
        });
      } else {
        setFormData({
          tenGoi: '',
          donGia: 0,
          moTa: '',
          ngayHieuLuc: new Date().toISOString().split('T')[0],
          trangThai: 'Hoạt động',
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, servicePackage]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.tenGoi.trim()) {
      newErrors.tenGoi = 'Tên gói là bắt buộc';
    }

    if (formData.donGia <= 0) {
      newErrors.donGia = 'Đơn giá phải > 0';
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

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      let savedPackage;
      if (mode === 'create') {
        savedPackage = await servicePackagesService.createPackage({ ...formData, maDichVu, tenDichVu });
      } else {
        savedPackage = await servicePackagesService.updatePackage(servicePackage.id, formData);
      }
      onSave(savedPackage);
      onClose();
    } catch (error) {
      setErrors({ submit: 'Có lỗi xảy ra khi lưu gói cước' });
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
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">{mode === 'create' ? 'Thêm gói cước mới' : 'Chỉnh sửa gói cước'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên gói</label>
            <input
              type="text"
              value={formData.tenGoi}
              onChange={(e) => handleInputChange('tenGoi', e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Tên gói"
            />
            {errors.tenGoi && <p className="text-red-500 text-xs">{errors.tenGoi}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Đơn giá</label>
            <input
              type="number"
              value={formData.donGia}
              onChange={(e) => handleInputChange('donGia', parseFloat(e.target.value))}
              className="w-full p-2 border rounded"
              placeholder="Đơn giá"
            />
            {errors.donGia && <p className="text-red-500 text-xs">{errors.donGia}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hiệu lực</label>
            <input
              type="date"
              value={formData.ngayHieuLuc}
              onChange={(e) => handleInputChange('ngayHieuLuc', e.target.value)}
              className="w-full p-2 border rounded"
            />
            {errors.ngayHieuLuc && <p className="text-red-500 text-xs">{errors.ngayHieuLuc}</p>}
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

export default ServicePackageModal;
