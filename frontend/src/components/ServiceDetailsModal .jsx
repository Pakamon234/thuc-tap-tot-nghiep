import React from 'react';
import { X, DollarSign, Tag, Info } from 'lucide-react';

const ServiceDetailsModal = ({ isOpen, onClose, service }) => {
  if (!isOpen || !service) return null;

  const getServiceTypeColor = (type) => {
    return type === 'required'
      ? 'bg-red-100 text-red-800 border-red-200'
      : 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const getServiceTypeLabel = (type) => {
    return type === 'required' ? 'Bắt buộc' : 'Tùy chọn';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Info className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">Chi tiết dịch vụ</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Service Info */}
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getServiceTypeColor(service.type)}`}
              >
                {getServiceTypeLabel(service.type)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Giá dịch vụ</p>
                  <p className="font-semibold text-gray-900">
                    {service.price.toLocaleString('vi-VN')} {service.unit}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Danh mục</p>
                  <p className="font-semibold text-gray-900 capitalize">{service.category}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Info className="h-4 w-4 mr-2" />
              Điều khoản và điều kiện
            </h4>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {service.terms}
              </p>
            </div>
          </div>

          {/* Important Notes */}
          {service.type === 'required' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h5 className="font-medium text-red-800 mb-2">Lưu ý quan trọng</h5>
              <p className="text-red-700 text-sm">
                Đây là dịch vụ bắt buộc và không thể loại bỏ khỏi hợp đồng. Dịch vụ này được áp dụng tự động cho tất cả cư dân.
              </p>
            </div>
          )}

          {service.type === 'optional' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h5 className="font-medium text-green-800 mb-2">Dịch vụ tùy chọn</h5>
              <p className="text-green-700 text-sm">
                Bạn có thể thêm hoặc loại bỏ dịch vụ này khỏi hợp đồng của mình. Thay đổi sẽ có hiệu lực từ kỳ thanh toán tiếp theo.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-6 border-t mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsModal;
