import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit3, 
  X,
  FileText,
  Building,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import contractsService from '../services/contractsService';
import Loading, { TableLoading } from '../components/Loading';
import { ErrorFallback } from '../components/ErrorBoundary';
import { cn } from '../lib/utils';
import ContractModal from '../components/ContractModal'; // mở lại import

/**
 * @typedef {Object} HopDongApiResponse
 * @property {string} maHopDong
 * @property {number} maCuDan
 * @property {number} maNguoiKyBQL
 * @property {string} maCanHo
 * @property {number} mauHopDongId
 * @property {string} ngayKy
 * @property {string} ngayKetThuc
 * @property {string} trangThai
 */

/**
 * @typedef {Object} Contract
 * @property {string} id
 * @property {string} maHopDong
 * @property {string} maCanHo
 * @property {string} trangThai
 * @property {string} ngayLap
 * @property {string} ngayHieuLuc
 * @property {string} ngayHetHan
 */

const MyContracts = () => {
  /** @type {[Contract[], Function]} */
  const [contracts, setContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // mở lại các state liên quan modal
  const [selectedContract, setSelectedContract] = useState(null);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');

  const userId = Number(localStorage.getItem('userId'));

  // Thêm ở đầu function MyContracts
  const hasActiveContract = contracts.some(c => c.trangThai === 'Hoạt động');

  useEffect(() => {
    loadContracts();
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      loadContracts();
    }, 300);
    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const handleApiError = (error) => {
    if (error.response) {
      return error.response.data?.message || `Lỗi API: ${error.response.status}`;
    } else if (error.request) {
      return 'Không thể kết nối tới máy chủ';
    } else {
      return error.message || 'Lỗi không xác định';
    }
  };

  const loadContracts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      /** @type {HopDongApiResponse[]} */
      const rawData = await contractsService.getContractsByCuDan(userId);
      /** @type {Contract[]} */
      const mappedData = rawData.map(item => {
      let status = item.trangThai ? item.trangThai.replace('_', ' ') : 'Chờ duyệt';
      const today = new Date();
      const endDate = new Date(item.ngayKetThuc);
      if (status === 'Hiệu lực' && endDate < today) {
        status = 'Hết hạn';
      }
      return {
        id: item.maHopDong,
        maHopDong: item.maHopDong,
        mauHopDongId: item.mauHopDongId, // thêm dòng này
        maCanHo: item.maCanHo,
        trangThai: status,
        ngayLap: item.ngayKy,
        ngayHieuLuc: item.ngayKy,
        ngayHetHan: item.ngayKetThuc
      };
    });

      setContracts(mappedData);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    loadContracts();
  };

  const getStatusBadge = (trangThai) => {
    const styles = {
      'Chờ duyệt': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Hiệu lực': 'bg-green-100 text-green-800 border-green-200',
      'Hết hạn': 'bg-gray-100 text-gray-800 border-gray-200',
      'Đã hủy': 'bg-red-100 text-red-800 border-red-200'
    };
    const icons = {
      'Chờ duyệt': Clock,
      'Hiệu lực': CheckCircle,
      'Hết hạn': AlertTriangle,
      'Đã hủy': X
    };
    const Icon = icons[trangThai] || Clock;
    return (
      <span className={cn('inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border', styles[trangThai] || styles['Chờ duyệt'])}>
        <Icon className="h-3 w-3 mr-1" />
        {trangThai}
      </span>
    );
  };

  const getRowHighlight = (trangThai) => {
    return trangThai === 'Hiệu lực' ? 'bg-green-50 hover:bg-green-100' : 'hover:bg-gray-50';
  };

  // mở lại các handler modal
  const handleViewContract = (contract) => {
    setSelectedContract(contract);
    setModalMode('view');
    setIsContractModalOpen(true);
  };
  const handleEditContract = (contract) => {
    setSelectedContract(contract);
    setModalMode('edit');
    setIsContractModalOpen(true);
  };
  const handleCreateContract = () => {
    setSelectedContract(null);
    setModalMode('create');
    setIsContractModalOpen(true);
  };
  const handleContractSaved = () => {
    setIsContractModalOpen(false);
    loadContracts();
  };

  const statistics = [
    { label: 'Tổng hợp đồng', value: contracts.length, icon: FileText, color: 'text-blue-600' },
    { label: 'Đang hiệu lực', value: contracts.filter(c => c.trangThai === 'Hiệu lực').length, icon: CheckCircle, color: 'text-green-600' },
    { label: 'Chờ duyệt', value: contracts.filter(c => c.trangThai === 'Chờ duyệt').length, icon: Clock, color: 'text-yellow-600' },
    { label: 'Hết hạn', value: contracts.filter(c => c.trangThai === 'Hết hạn').length, icon: AlertTriangle, color: 'text-gray-600' }
  ];

  if (error && !contracts.length) {
    return (
      <div className="p-6">
        <ErrorFallback error={error} onRetry={handleRetry} message="Không thể tải danh sách hợp đồng" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hợp đồng của tôi</h1>
          <p className="text-gray-600 mt-1">Quản lý các hợp đồng dịch vụ chung cư của bạn</p>
        </div>
        {!hasActiveContract && (
          <button
            onClick={handleCreateContract}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tạo hợp đồng mới
          </button>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Search */}
      <div className="bg-white rounded-lg p-4 border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã hợp đồng, căn hộ, trạng thái..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <TableLoading rows={5} columns={6} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Mã hợp đồng</th>
                  <th className="px-6 py-3">Căn hộ</th>
                  <th className="px-6 py-3">Ngày lập</th>
                  <th className="px-6 py-3">Ngày hiệu lực</th>
                  <th className="px-6 py-3">Ngày hết hạn</th>
                  <th className="px-6 py-3">Trạng thái</th>
                  <th className="px-6 py-3">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((contract) => (
                  <tr key={contract.id} className={getRowHighlight(contract.trangThai)}>
                    <td className="px-6 py-4">{contract.maHopDong}</td>
                    <td className="px-6 py-4">{contract.maCanHo}</td>
                    <td className="px-6 py-4">{new Date(contract.ngayLap).toLocaleDateString('vi-VN')}</td>
                    <td className="px-6 py-4">{new Date(contract.ngayHieuLuc).toLocaleDateString('vi-VN')}</td>
                    <td className="px-6 py-4">{new Date(contract.ngayHetHan).toLocaleDateString('vi-VN')}</td>
                    <td className="px-6 py-4">{getStatusBadge(contract.trangThai)}</td>
                    <td className="px-6 py-4 flex space-x-2">
                      <button onClick={() => handleViewContract(contract)} title="Xem" className="text-blue-600 hover:text-blue-800">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleEditContract(contract)} title="Sửa" className="text-green-600 hover:text-green-800">
                        <Edit3 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Contract Modal */}
      <ContractModal
        isOpen={isContractModalOpen}
        onClose={() => setIsContractModalOpen(false)}
        onSaved={handleContractSaved}
        contract={selectedContract}
        mode={modalMode}
        idMauHopDong={selectedContract?.mauHopDongId} // bạn cần lưu thêm field này ở mappedData khi loadContracts
        maHopDong={selectedContract?.maHopDong}
      />
    </div>
  );
};

export default MyContracts;
