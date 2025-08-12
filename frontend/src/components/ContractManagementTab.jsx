import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  FileText, 
  Eye,
  Edit3,
  MoreHorizontal,
  User,
  Building,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle 
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  contractService, 
  Contract, 
  ContractStats, 
  ContractFilters 
} from '../services/contractManagementService';
import Loading, { TableLoading, StatsLoading } from './Loading';
import { ErrorFallback } from './ErrorBoundary';
import { handleApiError } from '../services/api';

const ContractManagementTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [apartmentFilter, setApartmentFilter] = useState('');
  const [selectedContract, setSelectedContract] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // API data states
  const [contracts, setContracts] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      loadContracts();
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [currentPage, searchTerm, statusFilter, apartmentFilter]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadContracts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const filters = {
        search: searchTerm || undefined,
        trangThai: statusFilter !== 'all' ? statusFilter : undefined,
        maCanHo: apartmentFilter || undefined,
        page: currentPage,
        limit: 10
      };

      const response = await contractService.getContracts(filters);
      setContracts(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await contractService.getContractStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleRetry = () => {
    loadContracts();
    loadStats();
  };

  const handleStatusChange = async (maHopDong, newStatus) => {
    setIsUpdating(true);
    try {
      await contractService.updateContractStatus(maHopDong, newStatus);
      setContracts(prev => prev.map(contract => 
        contract.maHopDong === maHopDong 
          ? { ...contract, trangThai: newStatus }
          : contract
      ));
      loadStats();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Hiệu lực': 'bg-green-100 text-green-800',
      'Đã hủy': 'bg-red-100 text-red-800'
    };

    const icons = {
      'Hiệu lực': CheckCircle,
      'Đã hủy': XCircle
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
    { label: 'Tổng hợp đồng', value: stats?.total || 0, color: 'text-blue-600', icon: FileText },
    { label: 'Hiệu lực', value: stats?.hieuLuc || 0, color: 'text-green-600', icon: CheckCircle },
    { label: 'Đã hủy', value: stats?.daHuy || 0, color: 'text-red-600', icon: XCircle },
    { label: 'Hết hạn trong tháng', value: stats?.hetHanTrongThang || 0, color: 'text-yellow-600', icon: AlertCircle }
  ];

  if (error && !contracts.length) {
    return (
      <ErrorFallback 
        error={error} 
        onRetry={handleRetry}
        message="Không thể tải danh sách hợp đồng"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Danh sách hợp đồng</h3>
          <p className="text-sm text-gray-600 mt-1">Quản lý hợp đồng dịch vụ của cư dân</p>
        </div>
        <button 
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center"
          disabled={isUpdating}
        >
          <FileText className="h-4 w-4 mr-2" />
          Tạo hợp đồng mới
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
                placeholder="Tìm kiếm theo mã hợp đồng, tên cư dân, căn hộ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Căn hộ"
              value={apartmentFilter}
              onChange={(e) => setApartmentFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Hiệu lực">Hiệu lực</option>
              <option value="Đã hủy">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contracts Table */}
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
                    Mã hợp đồng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cư dân
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Căn hộ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người ký BQL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày ký
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
                {contracts.map((contract) => (
                  <tr key={contract.maHopDong} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-primary mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{contract.maHopDong}</div>
                          <div className="text-sm text-gray-500">{contract.tenMauHopDong}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {contract.tenCuDan?.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{contract.tenCuDan}</div>
                          <div className="text-sm text-gray-500">{contract.emailCuDan}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{contract.maCanHo}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{contract.tenNguoiKyBQL}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {new Date(contract.ngayKy).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(contract.trangThai)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {setSelectedContract(contract); setShowDetails(true);}}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Xem chi tiết"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        {contract.trangThai === 'Hiệu lực' && (
                          <button
                            onClick={() => handleStatusChange(contract.maHopDong, 'Đã hủy')}
                            disabled={isUpdating}
                            className="text-red-600 hover:text-red-900 p-1 rounded disabled:opacity-50"
                            title="Hủy hợp đồng"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}
                        
                        <button className="text-gray-600 hover:text-gray-900 p-1 rounded" title="Chỉnh sửa">
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 p-1 rounded">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {contracts.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan={7} className="text-center py-8">
                      <p className="text-gray-500">Không tìm thấy hợp đồng nào phù hợp</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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

      {/* Contract Details Modal */}
      {showDetails && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Chi tiết hợp đồng</h3>
              <button 
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Contract Header */}
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-primary rounded-lg flex items-center justify-center text-white">
                  <FileText className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-medium text-gray-900">{selectedContract.maHopDong}</h4>
                  <p className="text-gray-600">{selectedContract.tenMauHopDong}</p>
                  <div className="mt-2">
                    {getStatusBadge(selectedContract.trangThai)}
                  </div>
                </div>
              </div>
              
              {/* Contract Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h5 className="font-medium text-gray-900 mb-3">Thông tin cư dân</h5>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      Tên cư dân
                    </label>
                    <p className="text-gray-900">{selectedContract.tenCuDan}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center">
                      <Building className="h-4 w-4 mr-1" />
                      Căn hộ
                    </label>
                    <p className="text-gray-900">{selectedContract.maCanHo}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-900">{selectedContract.emailCuDan}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Số điện thoại</label>
                    <p className="text-gray-900">{selectedContract.soDienThoaiCuDan}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h5 className="font-medium text-gray-900 mb-3">Thông tin hợp đồng</h5>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Ngày ký
                    </label>
                    <p className="text-gray-900">{new Date(selectedContract.ngayKy).toLocaleDateString('vi-VN')}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      Người ký BQL
                    </label>
                    <p className="text-gray-900">{selectedContract.tenNguoiKyBQL}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Mã cư dân</label>
                    <p className="text-gray-900">{selectedContract.maCuDan}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Mã mẫu hợp đồng</label>
                    <p className="text-gray-900">{selectedContract.mauHopDongId}</p>
                  </div>
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
    </div>
  );
};

export default ContractManagementTab;
