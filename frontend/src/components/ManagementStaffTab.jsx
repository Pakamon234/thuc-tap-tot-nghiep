import React, { useState, useEffect } from 'react';
import {
  Search, Filter, UserPlus, Edit3, Eye, MoreHorizontal,
  Mail, Phone, Calendar, CreditCard, Shield
} from 'lucide-react';
import { cn } from '../lib/utils';
import { managementStaffService } from '../services/userManagementService';
import Loading, { TableLoading, StatsLoading } from './Loading';
import { ErrorFallback } from './ErrorBoundary';
import apiClient, { handleApiError } from '../services/api';


const ManagementStaffTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const [staff, setStaff] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => loadStaff(), 300);
    return () => clearTimeout(t);
  }, [currentPage, searchTerm, statusFilter]);

  useEffect(() => { loadStats(); }, []);

  const loadStaff = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const filters = {
        search: searchTerm || undefined,
        trangThai: statusFilter !== 'all' ? statusFilter : undefined, // 'Đang làm việc' | 'Tạm ngưng' | 'Đã nghỉ việc'
        page: currentPage,
        limit: 10,
      };
      const response = await managementStaffService.getStaff(filters);
      setStaff(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const s = await managementStaffService.getStaffStats();
      setStats(s);
    } catch (err) { console.error(err); }
  };

  const handleRetry = () => {
    loadStaff();
    loadStats();
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Đang làm việc': 'bg-green-100 text-green-800',
      'Đã nghỉ việc': 'bg-red-100 text-red-800',
      'Tạm ngưng': 'bg-yellow-100 text-yellow-800',
    };
    return <span className={cn('px-2 py-1 rounded-full text-xs font-medium', styles[status])}>{status}</span>;
  };

  const getAccountStatusBadge = (status) => {
    if (!status) return null;
    const styles = {
      'Chờ duyệt': 'bg-yellow-100 text-yellow-800',
      'Đang hoạt động': 'bg-green-100 text-green-800',
      'Đã khóa': 'bg-red-100 text-red-800',
    };
    return <span className={cn('px-2 py-1 rounded-full text-xs font-medium', styles[status])}>{status}</span>;
  };

  const statistics = [
    { label: 'Tổng nhân viên', value: stats?.total || 0, color: 'text-blue-600' },
    { label: 'Đang làm việc', value: stats?.dangLamViec || 0, color: 'text-green-600' },
    { label: 'Tạm ngưng', value: stats?.tamNgung || 0, color: 'text-yellow-600' },
    { label: 'Đã nghỉ việc', value: stats?.daNghiViec || 0, color: 'text-red-600' },
  ];

  if (error && !staff.length) {
    return <ErrorFallback error={error} onRetry={handleRetry} message="Không thể tải danh sách nhân viên ban quản lý" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Danh sách nhân viên ban quản lý</h3>
          <p className="text-sm text-gray-600 mt-1">Quản lý nhân viên ban quản lý chung cư</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center" disabled={isUpdating}>
          <UserPlus className="h-4 w-4 mr-2" /> Thêm nhân viên
        </button>
      </div>

      {/* Statistics */}
      {!stats ? (
        <StatsLoading count={4} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {statistics.map((s, i) => (
            <div key={i} className="bg-white rounded-lg p-4 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{s.label}</p>
                  <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email, CCCD..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border rounded-lg px-3 py-2">
              <option value="all">Tất cả trạng thái</option>
              <option value="Đang làm việc">Đang làm việc</option>
              <option value="Tạm ngưng">Tạm ngưng</option>
              <option value="Đã nghỉ việc">Đã nghỉ việc</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {isLoading ? (
          <div className="p-6"><TableLoading rows={5} columns={6} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['Nhân viên', 'Liên hệ', 'CCCD', 'Trạng thái làm việc', 'Tài khoản', 'Thao tác'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {staff.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-purple-600 rounded-full flex items-center justify-center text-white">
                          <Shield className="h-5 w-5" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{m.hoTen}</div>
                          <div className="text-sm text-gray-500">{m.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600"><Mail className="h-3 w-3 mr-1" />{m.email}</div>
                        <div className="flex items-center text-sm text-gray-600"><Phone className="h-3 w-3 mr-1" />{m.soDienThoai}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900"><CreditCard className="h-3 w-3 mr-1 text-gray-400" />{m.CCCD}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(m.trangThai)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900">{m.tenDangNhap || '-'}</div>
                        {m.trangThaiTaiKhoan && getAccountStatusBadge(m.trangThaiTaiKhoan)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => { setSelectedStaff(m); setShowDetails(true); }} className="text-blue-600 hover:text-blue-900 p-1 rounded" title="Xem chi tiết"><Eye className="h-4 w-4" /></button>
                        <button className="text-gray-600 hover:text-gray-900 p-1 rounded" title="Chỉnh sửa"><Edit3 className="h-4 w-4" /></button>
                        <button className="text-gray-600 hover:text-gray-900 p-1 rounded"><MoreHorizontal className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!staff.length && !isLoading && (
                  <tr><td colSpan={6} className="text-center py-8 text-gray-500">Không tìm thấy nhân viên nào phù hợp</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-700">Trang {currentPage} / {totalPages}</p>
          <div className="flex space-x-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1 || isLoading} className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50">Trước</button>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || isLoading} className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50">Sau</button>
          </div>
        </div>
      )}

      {/* Overlay */}
      {isUpdating && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-40">
          <Loading text="Đang cập nhật..." />
        </div>
      )}

      {/* Details modal */}
      {showDetails && selectedStaff && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Chi tiết nhân viên BQL</h3>
              <button onClick={() => setShowDetails(false)} className="text-gray-500 hover:text-gray-700">×</button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-purple-600 rounded-full flex items-center justify-center text-white"><Shield className="h-8 w-8" /></div>
                <div className="flex-1">
                  <h4 className="text-xl font-medium text-gray-900">{selectedStaff.hoTen}</h4>
                  <p className="text-gray-600">{selectedStaff.email}</p>
                  <div className="flex space-x-2 mt-2">
                    {getStatusBadge(selectedStaff.trangThai)}
                    {selectedStaff.trangThaiTaiKhoan && getAccountStatusBadge(selectedStaff.trangThaiTaiKhoan)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h5 className="font-medium text-gray-900">Thông tin liên hệ</h5>
                  <div><label className="text-sm font-medium text-gray-600 flex items-center"><Phone className="h-4 w-4 mr-1" />Số điện thoại</label><p className="text-gray-900">{selectedStaff.soDienThoai}</p></div>
                  <div><label className="text-sm font-medium text-gray-600 flex items-center"><Mail className="h-4 w-4 mr-1" />Email</label><p className="text-gray-900">{selectedStaff.email}</p></div>
                </div>
                <div className="space-y-4">
                  <h5 className="font-medium text-gray-900">Thông tin cá nhân</h5>
                  <div><label className="text-sm font-medium text-gray-600 flex items-center"><Calendar className="h-4 w-4 mr-1" />Ngày sinh</label><p className="text-gray-900">{new Date(selectedStaff.ngaySinh).toLocaleDateString('vi-VN')}</p></div>
                  <div><label className="text-sm font-medium text-gray-600 flex items-center"><CreditCard className="h-4 w-4 mr-1" />CCCD</label><p className="text-gray-900">{selectedStaff.CCCD}</p></div>
                </div>
              </div>

              {selectedStaff.tenDangNhap && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Thông tin tài khoản</h5>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className="text-sm font-medium text-gray-600">Tên đăng nhập</label><p className="text-gray-900">{selectedStaff.tenDangNhap}</p></div>
                      <div><label className="text-sm font-medium text-gray-600">Trạng thái tài khoản</label><div className="mt-1">{selectedStaff.trangThaiTaiKhoan && getAccountStatusBadge(selectedStaff.trangThaiTaiKhoan)}</div></div>
                      {selectedStaff.ngayDangKy && (<div><label className="text-sm font-medium text-gray-600">Ngày đăng ký</label><p className="text-gray-900">{new Date(selectedStaff.ngayDangKy).toLocaleDateString('vi-VN')}</p></div>)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-3 mt-6">
              <button onClick={() => setShowDetails(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">Đóng</button>
              <button className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600">Chỉnh sửa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagementStaffTab;
