import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  FileEdit, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Building,
  Calendar,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  contractChangeRequestService, 
  ContractChangeRequest, 
  ChangeRequestStats, 
  ContractChangeRequestFilters 
} from '../services/contractManagementService';
import Loading, { TableLoading, StatsLoading } from './Loading';
import { ErrorFallback } from './ErrorBoundary';
import { handleApiError } from '../services/api';

const ChangeRequestTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [processingNote, setProcessingNote] = useState('');
  
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      loadRequests();
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [currentPage, searchTerm, statusFilter, typeFilter]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadRequests = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const filters = {
        search: searchTerm || undefined,
        trangThai: statusFilter !== 'all' ? statusFilter : undefined,
        loaiThayDoi: typeFilter !== 'all' ? typeFilter : undefined,
        page: currentPage,
        limit: 10
      };

      const response = await contractChangeRequestService.getChangeRequests(filters);
      setRequests(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await contractChangeRequestService.getChangeRequestStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleRetry = () => {
    loadRequests();
    loadStats();
  };

  const handleStatusChange = async (id, newStatus, note) => {
    setIsUpdating(true);
    try {
      await contractChangeRequestService.updateChangeRequestStatus(id, newStatus, note);
      
      setRequests(prev => prev.map(request => 
        request.id === id 
          ? { 
              ...request, 
              trangThai: newStatus,
              ghiChuXuLy: note,
              ngayXuLy: new Date().toISOString(),
              nguoiXuLy: 'Ban Quản Lý'
            }
          : request
      ));
      
      loadStats();
      setShowProcessModal(false);
      setProcessingNote('');
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsUpdating(false);
    }
  };

  const openProcessModal = (request) => {
    setSelectedRequest(request);
    setProcessingNote('');
    setShowProcessModal(true);
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Chờ duyệt': 'bg-yellow-100 text-yellow-800',
      'Đã duyệt': 'bg-green-100 text-green-800',
      'Từ chối': 'bg-red-100 text-red-800'
    };

    const icons = {
      'Chờ duyệt': Clock,
      'Đã duyệt': CheckCircle,
      'Từ chối': XCircle
    };

    const Icon = icons[status];

    return (
      <span className={cn('px-2 py-1 rounded-full text-xs font-medium flex items-center', styles[status])}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const styles = {
      'Nâng cấp gói cước': 'bg-blue-100 text-blue-800',
      'Hủy dịch vụ': 'bg-red-100 text-red-800',
      'Đăng ký mới': 'bg-green-100 text-green-800',
      'Thay đổi dịch vụ': 'bg-purple-100 text-purple-800',
      'Gia hạn hợp đồng': 'bg-orange-100 text-orange-800'
    };

    return (
      <span className={cn('px-2 py-1 rounded-full text-xs font-medium', styles[type])}>
        {type}
      </span>
    );
  };

  const statistics = [
    { label: 'Tổng yêu cầu', value: stats?.total || 0, color: 'text-blue-600', icon: FileEdit },
    { label: 'Chờ duyệt', value: stats?.choDuyet || 0, color: 'text-yellow-600', icon: Clock },
    { label: 'Đã duyệt', value: stats?.daDuyet || 0, color: 'text-green-600', icon: CheckCircle },
    { label: 'Trong tuần', value: stats?.trongTuan || 0, color: 'text-purple-600', icon: AlertTriangle }
  ];

  if (error && !requests.length) {
    return (
      <ErrorFallback 
        error={error} 
        onRetry={handleRetry}
        message="Không thể tải danh sách yêu cầu thay đổi"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Yêu cầu thay đổi hợp đồng</h3>
          <p className="text-sm text-gray-600 mt-1">Xử lý các yêu cầu thay đổi từ cư dân</p>
        </div>
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
                placeholder="Tìm kiếm theo mã yêu cầu, tên người gửi, hợp đồng..."
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
              <option value="Nâng cấp gói cước">Nâng cấp gói cước</option>
              <option value="Hủy dịch vụ">Hủy dịch vụ</option>
              <option value="Đăng ký mới">Đăng ký mới</option>
              <option value="Thay đổi dịch vụ">Thay đổi dịch vụ</option>
              <option value="Gia hạn hợp đồng">Gia hạn hợp đồng</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Chờ duyệt">Chờ duyệt</option>
              <option value="Đã duyệt">Đã duyệt</option>
              <option value="Từ chối">Từ chối</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <TableLoading rows={5} columns={7} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Yêu cầu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người gửi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hợp đồng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại thay đổi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileEdit className="h-5 w-5 text-primary mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{request.id}</div>
                          <div className="text-sm text-gray-500">{request.noiDungChiTiet?.substring(0, 50)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {request.tenNguoiGui?.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{request.tenNguoiGui}</div>
                          <div className="text-sm text-gray-500">{request.maCanHo}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{request.maHopDong}</div>
                      <div className="text-sm text-gray-500">{request.tenCuDan}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(request.loaiThayDoi)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {new Date(request.ngayTao).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(request.trangThai)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {setSelectedRequest(request); setShowDetails(true);}}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Xem chi tiết"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        {request.trangThai === 'Chờ duyệt' && (
                          <>
                            <button
                              onClick={() => openProcessModal(request)}
                              className="text-green-600 hover:text-green-900 p-1 rounded"
                              title="Xử lý yêu cầu"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan={7} className="text-center py-8">
                      <p className="text-gray-500">Không tìm thấy yêu cầu nào phù hợp</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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

      {showDetails && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Chi tiết yêu cầu thay đổi</h3>
              <button 
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-primary rounded-lg flex items-center justify-center text-white">
                  <FileEdit className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-medium text-gray-900">{selectedRequest.id}</h4>
                  <div className="flex space-x-2 mt-2">
                    {getTypeBadge(selectedRequest.loaiThayDoi)}
                    {getStatusBadge(selectedRequest.trangThai)}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h5 className="font-medium text-gray-900">Thông tin yêu cầu</h5>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Hợp đồng</label>
                    <p className="text-gray-900">{selectedRequest.maHopDong}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      Người gửi
                    </label>
                    <p className="text-gray-900">{selectedRequest.tenNguoiGui}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center">
                      <Building className="h-4 w-4 mr-1" />
                      Căn hộ
                    </label>
                    <p className="text-gray-900">{selectedRequest.maCanHo}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Ngày tạo
                    </label>
                    <p className="text-gray-900">{new Date(selectedRequest.ngayTao).toLocaleString('vi-VN')}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h5 className="font-medium text-gray-900 mb-3">Chi tiết yêu cầu</h5>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Loại thay đổi</label>
                    <div className="mt-1">{getTypeBadge(selectedRequest.loaiThayDoi)}</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Nội dung chi tiết
                    </label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-900 text-sm">{selectedRequest.noiDungChiTiet}</p>
                    </div>
                  </div>

                  {selectedRequest.ngayXuLy && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Ngày xử lý</label>
                        <p className="text-gray-900">{new Date(selectedRequest.ngayXuLy).toLocaleString('vi-VN')}</p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-600">Người xử lý</label>
                        <p className="text-gray-900">{selectedRequest.nguoiXuLy}</p>
                      </div>

                      {selectedRequest.ghiChuXuLy && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Ghi chú xử lý</label>
                          <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                            <p className="text-gray-900 text-sm">{selectedRequest.ghiChuXuLy}</p>
                          </div>
                        </div>
                      )}
                    </>
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
              <button 
                onClick={() => {
                  setShowDetails(false);
                  openProcessModal(selectedRequest);
                }}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600"
              >
                Xử lý yêu cầu
              </button>
            </div>
          </div>
        </div>
      )}

      {showProcessModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Xử lý yêu cầu</h3>
              <button 
                onClick={() => setShowProcessModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Yêu cầu: <span className="font-medium">{selectedRequest.id}</span></p>
                <p className="text-sm text-gray-600">Loại: {selectedRequest.loaiThayDoi}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú xử lý
                </label>
                <textarea
                  value={processingNote}
                  onChange={(e) => setProcessingNote(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Nhập ghi chú xử lý..."
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button 
                onClick={() => setShowProcessModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button 
                onClick={() => handleStatusChange(selectedRequest.id, 'Từ chối', processingNote)}
                disabled={isUpdating}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                Từ chối
              </button>
              <button 
                onClick={() => handleStatusChange(selectedRequest.id, 'Đã duyệt', processingNote)}
                disabled={isUpdating}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Duyệt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangeRequestTab;
