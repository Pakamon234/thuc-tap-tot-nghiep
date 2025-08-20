import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NewServicesManagementTab = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState('');
  const [newUnit, setNewUnit] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newFeeType, setNewFeeType] = useState('TheoChiSo');
  const [newIsMandatory, setNewIsMandatory] = useState(0); // 0 = optional, 1 = mandatory
  const [newStatus, setNewStatus] = useState('HoatDong');
  const [editingService, setEditingService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [serviceDetails, setServiceDetails] = useState(null); // To store details for the view modal

  // Fetch services data from the API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/dichvu'); // Backend API endpoint
        setServices(response.data); // Assuming response is a list of services
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    fetchServices();
  }, []);

  // Handle adding a new service
  const handleAddService = async () => {
    try {
      const newServiceData = {
        maDichVu: 'DV'+ Date.now().toString(), // Generate unique ID for the new service
        tenDichVu: newService,
        donViTinh: newUnit,
        moTa: newDescription,
        loaiTinhPhi: newFeeType,
        batBuoc: newIsMandatory,
        trangThai: newStatus,
      };
      const response = await axios.post('http://localhost:8080/api/dichvu', newServiceData);
      setServices([...services, response.data]); // Update the service list
      clearForm();
      setShowModal(false);
    } catch (error) {
      console.error('Error adding service:', error);
    }
  };

  // Handle editing an existing service
  const handleEditService = async () => {
    if (editingService) {
      try {
        const updatedServiceData = {
          tenDichVu: newService,
          donViTinh: newUnit,
          moTa: newDescription,
          loaiTinhPhi: newFeeType,
          batBuoc: newIsMandatory,
          trangThai: newStatus,
        };
        const response = await axios.put(`http://localhost:8080/api/dichvu/${editingService.maDichVu}`, updatedServiceData);
        setServices(services.map(service => 
          service.maDichVu === editingService.maDichVu ? response.data : service
        ));
        clearForm();
        setShowModal(false);
        setEditingService(null);
      } catch (error) {
        console.error('Error editing service:', error);
      }
    }
  };

  // Handle deleting a service
  const handleDeleteService = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/dichvu/${id}`);
      setServices(services.filter(service => service.maDichVu !== id));
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  // Handle viewing the service details
  // Handle viewing the service details
const handleViewService = async (serviceId) => {
  try {
    // Fetch service details
    const serviceDetailsResponse = await axios.get(`http://localhost:8080/api/dichvu/${serviceId}`);
    console.log('Service Details:', serviceDetailsResponse.data);

    // Fetch configurations for the service
    try {
      const configResponse = await axios.get(`http://localhost:8080/api/cauhinhdichvu/service/${serviceId}`);
      console.log('Configurations for Service:', configResponse.data);

      // Check if there are any configurations available for this service
      if (configResponse.data && configResponse.data.length > 0) {
        const configurationId = configResponse.data[0].id;
        console.log('Configuration ID:', configurationId);

        // Fetch fee parameters using the configuration ID (instead of the service ID)
        const feeResponse = await axios.get(`http://localhost:8080/api/thamsophi/configuration/${configurationId}`);
        console.log('Fee Parameters for Configuration:', feeResponse.data);

        // Fetch service packages for the service
        const packageResponse = await axios.get(`http://localhost:8080/api/goicuocdichvu/service/${serviceId}`);
        console.log('Service Packages for Service:', packageResponse.data);

        // Set the service details along with configurations, fee parameters, and packages
        setServiceDetails({
          service: serviceDetailsResponse.data,
          configurations: configResponse.data,
          feeParameters: feeResponse.data,
          servicePackages: packageResponse.data,
        });
      } else {
        // No configurations found, update state with no configurations
        console.log('No configurations found for this service.');
        setServiceDetails({
          service: serviceDetailsResponse.data,
          configurations: [],
          feeParameters: [],
          servicePackages: [],
        });
      }
    } catch (configError) {
      // Handle the error if configurations are not found
      console.error('Error fetching configurations:', configError);
      setServiceDetails({
        service: serviceDetailsResponse.data,
        configurations: [],
        feeParameters: [],
        servicePackages: [],
      });
    }
  } catch (error) {
    console.error('Error fetching service details:', error);
  }
};


  // Clear the form fields
  const clearForm = () => {
    setNewService('');
    setNewUnit('');
    setNewDescription('');
    setNewFeeType('TheoChiSo');
    setNewIsMandatory(0);
    setNewStatus('HoatDong');
  };

  // Open modal for editing or adding
  const openModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setNewService(service.tenDichVu);
      setNewUnit(service.donViTinh);
      setNewDescription(service.moTa);
      setNewFeeType(service.loaiTinhPhi);
      setNewIsMandatory(service.batBuoc);
      setNewStatus(service.trangThai);
    } else {
      clearForm();
    }
    setShowModal(true);
  };

  // Handle closing the modal
  const closeModal = () => {
    setServiceDetails(null);
    setShowModal(false);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800">Quản lý Dịch vụ</h2>

      {/* Button to open Add Service Modal */}
      <button
        onClick={() => openModal()}
        className="bg-blue-500 text-white p-2 rounded-md mt-4"
      >
        Thêm Dịch Vụ
      </button>

      {/* Services List */}
      <div className="mt-6">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="border px-4 py-2">Mã Dịch Vụ</th>
              <th className="border px-4 py-2">Tên Dịch Vụ</th>
              <th className="border px-4 py-2">Đơn Vị Tính</th>
              <th className="border px-4 py-2">Mô Tả</th>
              <th className="border px-4 py-2">Loại Tính Phí</th>
              <th className="border px-4 py-2">Bắt Buộc</th>
              <th className="border px-4 py-2">Trạng Thái</th>
              <th className="border px-4 py-2">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.maDichVu}>
                <td className="border px-4 py-2">{service.maDichVu}</td>
                <td className="border px-4 py-2">{service.tenDichVu}</td>
                <td className="border px-4 py-2">{service.donViTinh}</td>
                <td className="border px-4 py-2">{service.moTa}</td>
                <td className="border px-4 py-2">{service.loaiTinhPhi}</td>
                <td className="border px-4 py-2">{service.batBuoc === 1 ? 'Bắt Buộc' : 'Không Bắt Buộc'}</td>
                <td className="border px-4 py-2">{service.trangThai}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => openModal(service)}
                    className="bg-yellow-500 text-white p-1 rounded-md"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteService(service.maDichVu)}
                    className="ml-2 bg-red-500 text-white p-1 rounded-md"
                  >
                    Xóa
                  </button>
                  <button
                    onClick={() => handleViewService(service.maDichVu)}
                    className="ml-2 bg-green-500 text-white p-1 rounded-md"
                  >
                    Xem
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Service Details Modal */}
      {serviceDetails && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-3/4 max-h-[80vh] overflow-auto relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 text-xl"
            >
              ×
            </button>

            <h3 className="text-lg font-semibold mb-4">Thông Tin Dịch Vụ</h3>

            {/* Service Information */}
            <div className="mb-4">
              <strong>Tên Dịch Vụ:</strong> {serviceDetails.service.tenDichVu}
            </div>
            <div className="mb-4">
              <strong>Mô Tả:</strong> {serviceDetails.service.moTa}
            </div>

            {/* Configurations Table */}
            <h4 className="mt-4 font-semibold">Cấu Hình Dịch Vụ</h4>
            <button
              className="bg-blue-500 text-white p-2 rounded-md mt-4"
              onClick={() => console.log('Add configuration')}
            >
              Thêm Cấu Hình
            </button>
            {serviceDetails.configurations.length === 0 ? (
              <p className="mt-2 text-red-500">Không có cấu hình</p>
            ) : (
              <table className="w-full table-auto mt-2">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Tên Cấu Hình</th>
                    <th className="border px-4 py-2">Ngày Hiệu Lực</th>
                    <th className="border px-4 py-2">Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceDetails.configurations.map((config, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">{config.tenCauHinh}</td>
                      <td className="border px-4 py-2">{config.ngayHieuLuc}</td>
                      <td className="border px-4 py-2">
                        <button className="bg-yellow-500 text-white p-1 rounded-md">Sửa</button>
                        <button className="ml-2 bg-red-500 text-white p-1 rounded-md">Xóa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Fee Parameters Table */}
            <h4 className="mt-4 font-semibold">Tham Số Phí</h4>
            <button
              className="bg-blue-500 text-white p-2 rounded-md mt-4"
              onClick={() => console.log('Add fee parameter')}
            >
              Thêm Tham Số Phí
            </button>
            {serviceDetails.feeParameters.length === 0 ? (
              <p className="mt-2 text-red-500">Không có tham số phí</p>
            ) : (
              <table className="w-full table-auto mt-2">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Tên</th>
                    <th className="border px-4 py-2">Giá Trị Từ</th>
                    <th className="border px-4 py-2">Giá Trị Đến</th>
                    <th className="border px-4 py-2">Đơn Giá</th>
                    <th className="border px-4 py-2">Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceDetails.feeParameters.map((fee, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">{fee.ten}</td>
                      <td className="border px-4 py-2">{fee.giaTriTu}</td>
                      <td className="border px-4 py-2">{fee.giaTriDen}</td>
                      <td className="border px-4 py-2">{fee.donGia}</td>
                      <td className="border px-4 py-2">
                        <button className="bg-yellow-500 text-white p-1 rounded-md">Sửa</button>
                        <button className="ml-2 bg-red-500 text-white p-1 rounded-md">Xóa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Service Packages Table */}
            <h4 className="mt-4 font-semibold">Gói Cước</h4>
            <button
              className="bg-blue-500 text-white p-2 rounded-md mt-4"
              onClick={() => console.log('Add package')}
            >
              Thêm Gói Cước
            </button>
            {serviceDetails.servicePackages.length === 0 ? (
              <p className="mt-2 text-red-500">Không có gói cước</p>
            ) : (
              <table className="w-full table-auto mt-2">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Tên Gói</th>
                    <th className="border px-4 py-2">Đơn Giá</th>
                    <th className="border px-4 py-2">Mô Tả</th>
                    <th className="border px-4 py-2">Trạng Thái</th>
                    <th className="border px-4 py-2">Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceDetails.servicePackages.map((pkg, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">{pkg.tenGoi}</td>
                      <td className="border px-4 py-2">{pkg.donGia}</td>
                      <td className="border px-4 py-2">{pkg.moTa}</td>
                      <td className="border px-4 py-2">{pkg.trangThai}</td>
                      <td className="border px-4 py-2">
                        <button className="bg-yellow-500 text-white p-1 rounded-md">Sửa</button>
                        <button className="ml-2 bg-red-500 text-white p-1 rounded-md">Xóa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Modal for Adding/Editing Service */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">{editingService ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ'}</h3>
            <input
              type="text"
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full"
              placeholder="Tên dịch vụ"
            />
            <input
              type="text"
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full mt-2"
              placeholder="Đơn vị tính"
            />
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full mt-2"
              placeholder="Mô tả dịch vụ"
            />
            <select
              value={newFeeType}
              onChange={(e) => setNewFeeType(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full mt-2"
            >
              <option value="TheoChiSo">Theo chỉ số</option>
              <option value="CoDinh">Cố định</option>
              <option value="GoiCuoc">Gói cước</option>
            </select>
            <select
              value={newIsMandatory}
              onChange={(e) => setNewIsMandatory(parseInt(e.target.value))}
              className="p-2 border border-gray-300 rounded-md w-full mt-2"
            >
              <option value={0}>Không bắt buộc</option>
              <option value={1}>Bắt buộc</option>
            </select>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full mt-2"
            >
              <option value="HoatDong">Hoạt động</option>
              <option value="NgungHoatDong">Ngừng hoạt động</option>
            </select>

            <div className="mt-4 flex justify-end">
              <button
                onClick={editingService ? handleEditService : handleAddService}
                className="bg-green-500 text-white p-2 rounded-md"
              >
                {editingService ? 'Cập nhật' : 'Thêm'}
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
    </div>
  );
};

export default NewServicesManagementTab;
