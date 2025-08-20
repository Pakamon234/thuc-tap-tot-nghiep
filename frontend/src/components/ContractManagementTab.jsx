import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContractManagementTab = () => {
  const [contracts, setContracts] = useState([]);
  const [newContractCuDan, setNewContractCuDan] = useState('');
  const [newContractCanHo, setNewContractCanHo] = useState('');
  const [newContractMauId, setNewContractMauId] = useState('');
  const [newContractNgayKy, setNewContractNgayKy] = useState('');
  const [newContractNgayKetThuc, setNewContractNgayKetThuc] = useState('');
  const [editingContract, setEditingContract] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

  // Fetch contracts data from the API
  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/hopdong');
        setContracts(response.data);
      } catch (error) {
        console.error('Error fetching contracts:', error);
        alert('Lỗi khi lấy danh sách hợp đồng');
      }
    };
    fetchContracts();
  }, []);

  // Handle adding a new contract
  const handleAddContract = async () => {
    if (!newContractCuDan || !newContractCanHo || !newContractMauId || !newContractNgayKy) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }

    try {
      const newContractData = {
        maCuDan: parseInt(newContractCuDan),
        maCanHo: newContractCanHo,
        mauHopDongId: parseInt(newContractMauId),
        ngayKy: newContractNgayKy,
        ngayKetThuc: newContractNgayKetThuc || null,
      };
      const response = await axios.post('http://localhost:8080/api/hopdong', newContractData);
      setContracts([...contracts, response.data]);
      clearForm();
      setShowModal(false);
    } catch (error) {
      console.error('Error adding contract:', error);
      alert(error.response?.data || 'Lỗi khi thêm hợp đồng');
    }
  };

  // Handle editing an existing contract
  const handleEditContract = async () => {
    if (!editingContract || !newContractCuDan || !newContractCanHo || !newContractMauId || !newContractNgayKy) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }

    try {
      const updatedContractData = {
        maCuDan: parseInt(newContractCuDan),
        maCanHo: newContractCanHo,
        mauHopDongId: parseInt(newContractMauId),
        ngayKy: newContractNgayKy,
        ngayKetThuc: newContractNgayKetThuc || null,
      };
      const response = await axios.put(`http://localhost:8080/api/hopdong/${editingContract.maHopDong}`, updatedContractData);
      setContracts(contracts.map(contract =>
        contract.maHopDong === editingContract.maHopDong ? response.data : contract
      ));
      clearForm();
      setShowModal(false);
      setEditingContract(null);
      if (selectedContract && selectedContract.maHopDong === editingContract.maHopDong) {
        setSelectedContract(response.data);
      }
    } catch (error) {
      console.error('Error editing contract:', error);
      alert(error.response?.data || 'Lỗi khi chỉnh sửa hợp đồng');
    }
  };

  // Handle deleting a contract
  const handleDeleteContract = async (maHopDong) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/hopdong/${maHopDong}`);
      setContracts(contracts.filter(contract => contract.maHopDong !== maHopDong));
      alert(response.data || 'Xóa hợp đồng thành công');
      if (selectedContract && selectedContract.maHopDong === maHopDong) {
        setShowDetailModal(false);
        setSelectedContract(null);
      }
    } catch (error) {
      console.error('Error deleting contract:', error);
      alert(error.response?.data || 'Lỗi khi xóa hợp đồng');
    }
  };

  // Handle approving a contract
  const handleApproveContract = async (maHopDong) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('User ID not found in local storage.');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/api/hopdong/duyet/${maHopDong}`,
        { maNguoiKyBQL: parseInt(userId) }
      );
      setContracts(contracts.map(contract =>
        contract.maHopDong === maHopDong ? { ...contract, trangThai: 'Hiệu_lực', maNguoiKyBQL: parseInt(userId) } : contract
      ));
      alert(response.data || 'Duyệt hợp đồng thành công');
      if (selectedContract && selectedContract.maHopDong === maHopDong) {
        setSelectedContract({ ...selectedContract, trangThai: 'Hiệu_lực', maNguoiKyBQL: parseInt(userId) });
      }
    } catch (error) {
      console.error('Error approving contract:', error);
      alert(error.response?.data || 'Lỗi khi duyệt hợp đồng');
    }
  };

  // Handle viewing contract details
  const handleViewContractDetails = async (contract) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/hopdong/${contract.maHopDong}`);
      setSelectedContract(response.data);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error fetching contract details:', error);
      alert(error.response?.data || 'Lỗi khi lấy chi tiết hợp đồng');
    }
  };

  // Clear the form fields
  const clearForm = () => {
    setNewContractCuDan('');
    setNewContractCanHo('');
    setNewContractMauId('');
    setNewContractNgayKy('');
    setNewContractNgayKetThuc('');
  };

  // Open modal for adding or editing contract
  const openModal = (contract = null) => {
    if (contract) {
      setEditingContract(contract);
      setNewContractCuDan(contract.maCuDan.toString());
      setNewContractCanHo(contract.maCanHo);
      setNewContractMauId(contract.mauHopDongId.toString());
      setNewContractNgayKy(contract.ngayKy);
      setNewContractNgayKetThuc(contract.ngayKetThuc || '');
    } else {
      clearForm();
      setEditingContract(null);
    }
    setShowModal(true);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800">Quản lý Hợp Đồng</h2>

      {/* Button to open Add Contract Modal */}
      <button
        onClick={() => openModal()}
        className="bg-blue-500 text-white p-2 rounded-md mt-4"
      >
        Thêm Hợp Đồng
      </button>

      {/* Contracts List */}
      <div className="mt-6">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="border px-4 py-2">Mã Hợp Đồng</th>
              <th className="border px-4 py-2">Mã Cư Dân</th>
              <th className="border px-4 py-2">Mã Căn Hộ</th>
              <th className="border px-4 py-2">Ngày Ký</th>
              <th className="border px-4 py-2">Trạng Thái</th>
              <th className="border px-4 py-2">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((contract) => (
              <tr key={contract.maHopDong}>
                <td className="border px-4 py-2">{contract.maHopDong}</td>
                <td className="border px-4 py-2">{contract.maCuDan}</td>
                <td className="border px-4 py-2">{contract.maCanHo}</td>
                <td className="border px-4 py-2">{contract.ngayKy}</td>
                <td className="border px-4 py-2">{contract.trangThai}</td>
                <td className="border px-4 py-2">
                  {contract.trangThai === 'Chờ_duyệt' && (
                    <button
                      onClick={() => handleApproveContract(contract.maHopDong)}
                      className="bg-green-500 text-white p-1 rounded-md mr-2"
                    >
                      Duyệt
                    </button>
                  )}
                  <button
                    onClick={() => openModal(contract)}
                    className="bg-yellow-500 text-white p-1 rounded-md mr-2"
                    disabled={contract.trangThai === 'Hiệu_lực'}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteContract(contract.maHopDong)}
                    className="bg-red-500 text-white p-1 rounded-md mr-2"
                    disabled={contract.trangThai === 'Hiệu_lực'}
                  >
                    Xóa
                  </button>
                  <button
                    onClick={() => handleViewContractDetails(contract)}
                    className="bg-blue-500 text-white p-1 rounded-md"
                  >
                    Xem
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Adding/Editing Contract */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">{editingContract ? 'Chỉnh sửa hợp đồng' : 'Thêm hợp đồng'}</h3>
            <input
              type="number"
              value={newContractCuDan}
              onChange={(e) => setNewContractCuDan(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full mt-2"
              placeholder="Mã cư dân"
            />
            <input
              type="text"
              value={newContractCanHo}
              onChange={(e) => setNewContractCanHo(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full mt-2"
              placeholder="Mã căn hộ"
            />
            <input
              type="number"
              value={newContractMauId}
              onChange={(e) => setNewContractMauId(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full mt-2"
              placeholder="Mã mẫu hợp đồng"
            />
            <input
              type="date"
              value={newContractNgayKy}
              onChange={(e) => setNewContractNgayKy(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full mt-2"
              placeholder="Ngày ký"
            />
            <input
              type="date"
              value={newContractNgayKetThuc}
              onChange={(e) => setNewContractNgayKetThuc(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full mt-2"
              placeholder="Ngày kết thúc (tùy chọn)"
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={editingContract ? handleEditContract : handleAddContract}
                className="bg-green-500 text-white p-2 rounded-md"
              >
                {editingContract ? 'Cập nhật' : 'Thêm'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="ml-2 bg-gray-300 text-black p-2 rounded-md"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal for Viewing Contract */}
      {showDetailModal && selectedContract && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96 relative">
            <button
              onClick={() => setShowDetailModal(false)}
              className="absolute top-4 right-4 text-gray-500 text-xl"
            >
              ×
            </button>

            <h3 className="text-lg font-semibold mb-4">Chi tiết hợp đồng</h3>

            <div className="mb-4">
              <strong>Mã Hợp Đồng:</strong> {selectedContract.maHopDong}
            </div>
            <div className="mb-4">
              <strong>Mã Cư Dân:</strong> {selectedContract.maCuDan}
            </div>
            <div className="mb-4">
              <strong>Mã Người Ký BQL:</strong> {selectedContract.maNguoiKyBQL || 'N/A'}
            </div>
            <div className="mb-4">
              <strong>Mã Căn Hộ:</strong> {selectedContract.maCanHo}
            </div>
            <div className="mb-4">
              <strong>Mã Mẫu Hợp Đồng:</strong> {selectedContract.mauHopDongId}
            </div>
            <div className="mb-4">
              <strong>Ngày Ký:</strong> {selectedContract.ngayKy}
            </div>
            <div className="mb-4">
              <strong>Ngày Kết Thúc:</strong> {selectedContract.ngayKetThuc || 'N/A'}
            </div>
            <div className="mb-4">
              <strong>Trạng Thái:</strong> {selectedContract.trangThai}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractManagementTab;