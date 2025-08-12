import React, { useState, useEffect } from 'react';
import { X, Save, DollarSign, TrendingUp } from 'lucide-react';
import { feeParametersService } from '../services/servicesManagementService';

const FeeParameterModal = ({
  isOpen,
  onClose,
  onSave,
  parameter,
  cauHinhId,
  tenCauHinh,
  existingParameters,
  mode
}) => {
  const [formData, setFormData] = useState({
    ten: '',
    giaTriTu: 0,
    giaTriDen: 0,
    donGia: 0
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && parameter) {
        setFormData({
          ten: parameter.ten,
          giaTriTu: parameter.giaTriTu,
          giaTriDen: parameter.giaTriDen,
          donGia: parameter.donGia
        });
      } else {
        const nextTierNumber = existingParameters.length + 1;
        const lastParameter = existingParameters
          .filter(p => p.id !== parameter?.id)
          .sort((a, b) => b.giaTriDen - a.giaTriDen)[0];
        
        const giaTriTu = lastParameter ? lastParameter.giaTriDen + 1 : 0;
        
        setFormData({
          ten: `Bậc ${nextTierNumber}`,
          giaTriTu,
          giaTriDen: giaTriTu + 100,
          donGia: 0
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, parameter, existingParameters]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.ten.trim()) {
      newErrors.ten = 'Tên bậc phí là bắt buộc';
    }

    if (formData.giaTriTu < 0) {
      newErrors.giaTriTu = 'Giá trị từ phải >= 0';
    }

    if (formData.giaTriDen <= formData.giaTriTu) {
      newErrors.giaTriDen = 'Giá trị đến phải > giá trị từ';
    }

    if (formData.donGia < 0) {
      newErrors.donGia = 'Đơn giá phải >= 0';
    }

    const otherParameters = existingParameters.filter(p => p.id !== parameter?.id);
    const hasOverlap = otherParameters.some(p => {
      return (
        (formData.giaTriTu >= p.giaTriTu && formData.giaTriTu <= p.giaTriDen) ||
        (formData.giaTriDen >= p.giaTriTu && formData.giaTriDen <= p.giaTriDen) ||
        (formData.giaTriTu <= p.giaTriTu && formData.giaTriDen >= p.giaTriDen)
      );
    });

    if (hasOverlap) {
      newErrors.giaTriTu = 'Khoảng giá trị bị trùng với bậc khác';
      newErrors.giaTriDen = 'Khoảng giá trị bị trùng với bậc khác';
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
      let savedParameter;

      if (mode === 'create') {
        savedParameter = await feeParametersService.createFeeParameter({
          ...formData,
          cauHinhId,
          tenCauHinh,
          maDichVu: ''
        });
      } else {
        savedParameter = await feeParametersService.updateFeeParameter(parameter.id, formData);
      }

      onSave(savedParameter);
      onClose();
    } catch (error) {
      console.error('Error saving parameter:', error);
      setErrors({ submit: 'Có lỗi xảy ra khi lưu tham số phí' });
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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">{mode === 'create' ? 'Thêm bậc phí mới' : 'Chỉnh sửa bậc phí'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" disabled={isSubmitting}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700">
            <strong>Cấu hình:</strong> {tenCauHinh}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên bậc phí <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.ten}
              onChange={(e) => handleInputChange('ten', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.ten ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="VD: Bậc 1, Bậc 2, Giá cố định"
              disabled={isSubmitting}
            />
            {errors.ten && <p className="text-red-500 text-xs mt-1">{errors.ten}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Từ giá trị <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.giaTriTu}
                  onChange={(e) => handleInputChange('giaTriTu', parseFloat(e.target.value) || 0)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.giaTriTu ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.giaTriTu && <p className="text-red-500 text-xs mt-1">{errors.giaTriTu}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đến giá trị <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.giaTriDen}
                  onChange={(e) => handleInputChange('giaTriDen', parseFloat(e.target.value) || 0)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.giaTriDen ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                  placeholder="999999 = Không giới hạn"
                />
              </div>
              {errors.giaTriDen && <p className="text-red-500 text-xs mt-1">{errors.giaTriDen}</p>}
              <p className="text-xs text-gray-500 mt-1">
                Nhập 999999 cho "không giới hạn"
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Đơn giá (VND) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.donGia}
                onChange={(e) => handleInputChange('donGia', parseFloat(e.target.value) || 0)}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.donGia ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
                disabled={isSubmitting}
              />
            </div>
            {errors.donGia && <p className="text-red-500 text-xs mt-1">{errors.donGia}</p>}
            {formData.donGia > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {formatCurrency(formData.donGia)} VND
              </p>
            )}
          </div>

          {formData.ten && formData.donGia > 0 && (
            <div className="bg-gray-50 rounded-lg p-3 border">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Xem trước:</h4>
              <div className="text-sm text-gray-600">
                <p><strong>{formData.ten}:</strong> Từ {formatCurrency(formData.giaTriTu)} đến {formData.giaTriDen === 999999 ? '∞' : formatCurrency(formData.giaTriDen)}</p>
                <p><strong>Đơn giá:</strong> {formatCurrency(formData.donGia)} VND</p>
              </div>
            </div>
          )}

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
                  {mode === 'create' ? 'Tạo bậc phí' : 'Cập nhật'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeeParameterModal;
