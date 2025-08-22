// src/components/AccountManagementTab.jsx
import React, { useState, useEffect } from 'react';
import {
    Search, Filter, UserPlus, Lock, Unlock,
    Edit3, Eye, MoreHorizontal, UserCheck, UserX, TrendingUp, X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { accountService } from '../services/userManagementService';
import Loading, { TableLoading, StatsLoading } from './Loading';
import { ErrorFallback } from './ErrorBoundary';
import { handleApiError } from '../services/api';

const AccountManagementTab = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const [accounts, setAccounts] = useState([]);
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // modal: chi tiết
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    // modal: tạo cư dân
    const [showCreate, setShowCreate] = useState(false);
    const [apartments, setApartments] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState('');
    const [createForm, setCreateForm] = useState({
        hoTen: '',
        email: '',
        soDienThoai: '',
        cccd: '',
        ngaySinh: '',
        diaChi: '',
        canHoId: '',
        tenDangNhap: '',
        password: '',
        confirm: '',
    });

    useEffect(() => {
        const t = setTimeout(() => loadAccounts(), 300);
        return () => clearTimeout(t);
    }, [currentPage, searchTerm, typeFilter, statusFilter]);

    useEffect(() => { loadStats(); }, []);

    const loadAccounts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const filters = {
                search: searchTerm || undefined,
                loaiTaiKhoan: typeFilter !== 'all' ? typeFilter : undefined,
                trangThai: statusFilter !== 'all' ? statusFilter : undefined,
                page: currentPage,
                limit: 10,
            };
            const response = await accountService.getAccounts(filters);
            setAccounts(response.data || []);
            setTotalPages(response.pagination?.totalPages || 1);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setIsLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const statsData = await accountService.getAccountStats();
            setStats(statsData);
        } catch (err) { }
    };

    const handleRetry = () => { loadAccounts(); loadStats(); };

    const handleStatusChange = async (accountId, newStatus) => {
        setIsUpdating(true);
        try {
            await accountService.updateAccountStatus(accountId, newStatus);
            setAccounts(prev =>
                prev.map(acc => acc.id === accountId
                    ? { ...acc, trangThai: newStatus, ngayCapNhat: new Date().toISOString() }
                    : acc
                )
            );
            loadStats();
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setIsUpdating(false);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            'Chờ duyệt': 'bg-yellow-100 text-yellow-800',
            'Đang hoạt động': 'bg-green-100 text-green-800',
            'Đã khóa': 'bg-red-100 text-red-800',
        };
        return <span className={cn('px-2 py-1 rounded-full text-xs font-medium', styles[status])}>{status}</span>;
    };

    const getTypeBadge = (type) => {
        const styles = { 'CuDan': 'bg-blue-100 text-blue-800', 'BQL': 'bg-purple-100 text-purple-800' };
        const labels = { 'CuDan': 'Cư dân', 'BQL': 'Ban quản lý' };
        return <span className={cn('px-2 py-1 rounded-full text-xs font-medium', styles[type])}>{labels[type]}</span>;
    };

    const statistics = [
        { label: 'Tổng tài khoản', value: stats?.total || 0, color: 'text-blue-600' },
        { label: 'Đang hoạt động', value: stats?.dangHoatDong || 0, color: 'text-green-600' },
        { label: 'Chờ duyệt', value: stats?.choDuyet || 0, color: 'text-yellow-600' },
        { label: 'Đã khóa', value: stats?.daKhoa || 0, color: 'text-red-600' },
    ];

    // ====== CREATE (Đăng ký cư dân) ======
    const openCreate = async () => {
        setCreateError('');
        setShowCreate(true);
        try {
            const res = await accountService.getApartments();
            setApartments(Array.isArray(res) ? res : (res?.data ?? []));
        } catch (e) {
            setApartments([]);
        }
    };
    const closeCreate = () => { if (!isCreating) setShowCreate(false); };

    const validateCreate = () => {
        if (!createForm.tenDangNhap.trim() || !createForm.password.trim()) {
            setCreateError('Vui lòng nhập tên đăng nhập và mật khẩu.');
            return false;
        }
        if (createForm.password !== createForm.confirm) {
            setCreateError('Mật khẩu xác nhận không khớp.');
            return false;
        }
        if (!/^[A-Za-z0-9._%+-]+@gmail\.com$/.test(createForm.email || '')) {
            setCreateError('Email không hợp lệ. Chỉ chấp nhận @gmail.com');
            return false;
        }
        if (!createForm.canHoId || createForm.canHoId === '') {
            setCreateError('Vui lòng chọn căn hộ.');
            return false;
        }
        return true;
    };

    const submitCreate = async (e) => {
        e.preventDefault();
        setCreateError('');
        if (!validateCreate()) return;

        setIsCreating(true);
        try {
            await accountService.registerResident({
                ...createForm,
                ngaySinh: createForm.ngaySinh || null, // input type="date" -> 'YYYY-MM-DD'
            });
            setShowCreate(false);
            setCreateForm({
                hoTen: '', email: '', soDienThoai: '', cccd: '', ngaySinh: '', diaChi: '',
                canHoId: '', tenDangNhap: '', password: '', confirm: '',
            });
            await loadAccounts();
            await loadStats();
        } catch (err) {
            setCreateError(handleApiError(err));
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Danh sách tài khoản</h3>
                    <p className="text-sm text-gray-600 mt-1">Quản lý tài khoản đăng nhập và phân quyền</p>
                </div>
                <button
                    onClick={openCreate}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    disabled={isUpdating || isCreating}
                >
                    <UserPlus className="h-4 w-4 mr-2" /> Tạo tài khoản (Cư dân)
                </button>

            </div>

            {/* Statistics */}
            {!stats ? <StatsLoading count={4} /> : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {statistics.map((s, i) => (
                        <div key={i} className="bg-white rounded-lg p-4 border">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{s.label}</p>
                                    <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
                                </div>
                                <TrendingUp className="h-5 w-5 text-gray-300" />
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
                                placeholder="Tìm kiếm theo tên đăng nhập..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="border rounded-lg px-3 py-2">
                            <option value="all">Tất cả loại</option>
                            <option value="CuDan">Cư dân</option>
                            <option value="BQL">Ban quản lý</option>
                        </select>

                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border rounded-lg px-3 py-2">
                            <option value="all">Tất cả trạng thái</option>
                            <option value="Chờ duyệt">Chờ duyệt</option>
                            <option value="Đang hoạt động">Đang hoạt động</option>
                            <option value="Đã khóa">Đã khóa</option>
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
                                    {['Tài khoản', 'Loại tài khoản', 'Trạng thái', 'Ngày đăng ký', 'Cập nhật cuối', 'Thao tác'].map(h => (
                                        <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {accounts.map((account) => (
                                    <tr key={account.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                                                    {account.tenDangNhap?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-900">{account.tenDangNhap}</div>
                                                    <div className="text-sm text-gray-500">ID: {account.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{getTypeBadge(account.loaiTaiKhoan)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(account.trangThai)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {account.ngayDangKy ? new Date(account.ngayDangKy).toLocaleDateString('vi-VN') : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {account.ngayCapNhat ? new Date(account.ngayCapNhat).toLocaleDateString('vi-VN') : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <button onClick={() => { setSelectedAccount(account); setShowDetails(true); }} className="text-blue-600 hover:text-blue-900 p-1 rounded" title="Xem chi tiết">
                                                    <Eye className="h-4 w-4" />
                                                </button>

                                                {account.trangThai === 'Chờ duyệt' && (
                                                    <button onClick={() => handleStatusChange(account.id, 'Đang hoạt động')} disabled={isUpdating} className="text-green-600 hover:text-green-900 p-1 rounded disabled:opacity-50" title="Duyệt tài khoản">
                                                        <UserCheck className="h-4 w-4" />
                                                    </button>
                                                )}
                                                {account.trangThai === 'Đang hoạt động' && (
                                                    <button onClick={() => handleStatusChange(account.id, 'Đã khóa')} disabled={isUpdating} className="text-red-600 hover:text-red-900 p-1 rounded disabled:opacity-50" title="Khóa tài khoản">
                                                        <Lock className="h-4 w-4" />
                                                    </button>
                                                )}
                                                {account.trangThai === 'Đã khóa' && (
                                                    <button onClick={() => handleStatusChange(account.id, 'Đang hoạt động')} disabled={isUpdating} className="text-green-600 hover:text-green-900 p-1 rounded disabled:opacity-50" title="Mở khóa tài khoản">
                                                        <Unlock className="h-4 w-4" />
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
                                {!accounts.length && !isLoading && (
                                    <tr><td colSpan={6} className="text-center py-8 text-gray-500">Không tìm thấy tài khoản nào phù hợp</td></tr>
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

            {/* Overlay updating */}
            {isUpdating && (
                <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-40">
                    <Loading text="Đang cập nhật..." />
                </div>
            )}

            {/* Modal: Đăng ký cư dân */}
            {showCreate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <form onSubmit={submitCreate} className="bg-white rounded-xl w-full max-w-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Tạo tài khoản (Cư dân)</h3>
                            <button type="button" onClick={closeCreate} className="text-gray-500 hover:text-gray-700"><X className="h-5 w-5" /></button>
                        </div>

                        {createError && (
                            <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{createError}</div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Họ tên</label>
                                <input value={createForm.hoTen} onChange={(e) => setCreateForm({ ...createForm, hoTen: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2" required />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Email (@gmail.com)</label>
                                <input type="email" value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2" required />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
                                <input value={createForm.soDienThoai} onChange={(e) => setCreateForm({ ...createForm, soDienThoai: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">CCCD</label>
                                <input value={createForm.cccd} onChange={(e) => setCreateForm({ ...createForm, cccd: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2" required />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Ngày sinh</label>
                                <input type="date" value={createForm.ngaySinh} onChange={(e) => setCreateForm({ ...createForm, ngaySinh: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Địa chỉ</label>
                                <input value={createForm.diaChi} onChange={(e) => setCreateForm({ ...createForm, diaChi: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Căn hộ</label>
                                <select
                                    value={createForm.canHoId}
                                    onChange={(e) => setCreateForm({ ...createForm, canHoId: e.target.value })}
                                    className="mt-1 w-full border rounded-lg px-3 py-2"
                                    required
                                >
                                    <option value="">-- Chọn căn hộ --</option>
                                    {apartments.map((a) => (
                                        <option key={a.maCanHo} value={a.maCanHo}>{a.maCanHo}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">Tên đăng nhập</label>
                                <input value={createForm.tenDangNhap} onChange={(e) => setCreateForm({ ...createForm, tenDangNhap: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2" required />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Mật khẩu</label>
                                <input type="password" value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2" required />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
                                <input type="password" value={createForm.confirm} onChange={(e) => setCreateForm({ ...createForm, confirm: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2" required />
                            </div>
                        </div>

                        <div className="mt-5 flex gap-3">
                            <button type="button" onClick={closeCreate} className="flex-1 border rounded-lg px-4 py-2 hover:bg-gray-50" disabled={isCreating}>Hủy</button>
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 disabled:opacity-50"
                                disabled={isCreating}
                            >
                                {isCreating ? 'Đang tạo...' : 'Tạo tài khoản'}
                            </button>

                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AccountManagementTab;