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

  // States for the Add/Edit/Delete modals for configurations, fee parameters, and service packages
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showFeeParamModal, setShowFeeParamModal] = useState(false);
  const [showPackageModal, setShowPackageModal] = useState(false);

  const [newConfig, setNewConfig] = useState('');
  const [newFeeParam, setNewFeeParam] = useState('');
  const [newDateEffective, setNewDateEffective] = useState('');
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [selectedFeeParam, setSelectedFeeParam] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  // Fee parameter states
  const [newStartValue, setNewStartValue] = useState('');
  const [newEndValue, setNewEndValue] = useState('');
  const [newUnitPrice, setNewUnitPrice] = useState('');

  // Package states
  const [newPackageName, setNewPackageName] = useState('');
  const [newPackagePrice, setNewPackagePrice] = useState('');
  const [newPackageDescription, setNewPackageDescription] = useState('');
  const [newPackageEffectiveDate, setNewPackageEffectiveDate] = useState('');
  const [newPackageStatus, setNewPackageStatus] = useState('HoatDong');

  // Fetch services data from the API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/dichvu');
        setServices(response.data);
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
        maDichVu: 'DV' + Date.now().toString(),
        tenDichVu: newService,
        donViTinh: newUnit,
        moTa: newDescription,
        loaiTinhPhi: newFeeType,
        batBuoc: newIsMandatory,
        trangThai: newStatus,
      };
      const response = await axios.post('http://localhost:8080/api/dichvu', newServiceData);
      setServices([...services, response.data]);
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
  const handleViewService = async (serviceId) => {
    try {
      const serviceDetailsResponse = await axios.get(`http://localhost:8080/api/dichvu/${serviceId}`);
      console.log('Service Details:', serviceDetailsResponse.data);
      try {
        const configResponse = await axios.get(`http://localhost:8080/api/cauhinhdichvu/service/${serviceId}`);
        console.log('Configurations for Service:', configResponse.data);

        let feeParameters = [];
        if (configResponse.data && configResponse.data.length > 0) {
          const configurationId = configResponse.data[0].id;
          console.log('Configuration ID:', configurationId);
          const feeResponse = await axios.get(`http://localhost:8080/api/thamsophi/configuration/${configurationId}`);
          console.log('Fee Parameters for Configuration:', feeResponse.data);
          feeParameters = feeResponse.data;
        }

        const packageResponse = await axios.get(`http://localhost:8080/api/goicuocdichvu/service/${serviceId}`);
        console.log('Service Packages for Service:', packageResponse.data);

        setServiceDetails({
          service: serviceDetailsResponse.data,
          configurations: configResponse.data,
          feeParameters: feeParameters,
          servicePackages: packageResponse.data,
        });
      } catch (configError) {
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

  // Handle opening fee parameter modal with pre-selected configuration
  const openFeeParamModal = (config = null) => {
    if (config) {
      setSelectedConfig(config);
      setNewFeeParam('');
      setNewStartValue('');
      setNewEndValue('');
      setNewUnitPrice('');
      setSelectedFeeParam(null);
    } else {
      setSelectedConfig(serviceDetails.configurations.length > 0 ? serviceDetails.configurations[0] : null);
      setNewFeeParam('');
      setNewStartValue('');
      setNewEndValue('');
      setNewUnitPrice('');
      setSelectedFeeParam(null);
    }
    setShowFeeParamModal(true);
  };

  // Handle adding, editing and deleting configurations
  const handleAddConfig = async () => {
    try {
      const newConfigData = {
        tenCauHinh: newConfig,
        ngayHieuLuc: newDateEffective,
        dichVu: {
          maDichVu: serviceDetails.service.maDichVu
        }
      };
      console.log('New Configuration Data:', newConfigData);
      const response = await axios.post('http://localhost:8080/api/cauhinhdichvu', newConfigData);
      console.log('New Configuration Added:', response.data);

      setServiceDetails({
        ...serviceDetails,
        configurations: [...serviceDetails.configurations, response.data],
      });

      setShowConfigModal(false);
    } catch (error) {
      console.error('Error adding configuration:', error);
    }
  };

  const handleEditConfig = async () => {
    try {
      const updatedConfigData = {
        tenCauHinh: newConfig,
        ngayHieuLuc: newDateEffective,
      };

      const response = await axios.put(`http://localhost:8080/api/cauhinhdichvu/${selectedConfig.id}`, updatedConfigData);
      console.log('Configuration Updated:', response.data);

      setServiceDetails({
        ...serviceDetails,
        configurations: serviceDetails.configurations.map(config => 
          config.id === selectedConfig.id ? response.data : config
        ),
      });

      setShowConfigModal(false);
    } catch (error) {
      console.error('Error editing configuration:', error);
    }
  };

  const handleDeleteConfig = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/cauhinhdichvu/${id}`);
      console.log('Configuration Deleted');

      setServiceDetails({
        ...serviceDetails,
        configurations: serviceDetails.configurations.filter(config => config.id !== id),
      });

      setShowConfigModal(false);
    } catch (error) {
      console.error('Error deleting configuration:', error);
    }
  };

  // Handle adding, editing and deleting fee parameters
  const handleAddFeeParam = async () => {
    if (!selectedConfig) {
      console.error('Chưa chọn cấu hình!');
      alert('Vui lòng chọn một cấu hình trước khi thêm tham số phí.');
      return;
    }

    try {
      const newFeeParamData = {
        ten: newFeeParam,
        giaTriTu: parseFloat(newStartValue),
        giaTriDen: newEndValue ? parseFloat(newEndValue) : 999999,
        donGia: parseFloat(newUnitPrice),
        cauHinh: { id: selectedConfig.id }
      };

      const response = await axios.post('http://localhost:8080/api/thamsophi', newFeeParamData);
      console.log('Tham số phí mới đã được thêm:', response.data);

      setServiceDetails({
        ...serviceDetails,
        feeParameters: [...serviceDetails.feeParameters, response.data],
      });

      setShowFeeParamModal(false);
      setNewFeeParam('');
      setNewStartValue('');
      setNewEndValue('');
      setNewUnitPrice('');
    } catch (error) {
      console.error('Lỗi khi thêm tham số phí:', error);
    }
  };

  const handleEditFeeParam = async () => {
    if (!selectedFeeParam || !selectedConfig) {
      console.error('Chưa chọn tham số phí hoặc cấu hình!');
      return;
    }

    try {
      const updatedFeeParamData = {
        ten: newFeeParam,
        giaTriTu: parseFloat(newStartValue),
        giaTriDen: newEndValue ? parseFloat(newEndValue) : 999999,
        donGia: parseFloat(newUnitPrice),
        cauHinh: { id: selectedConfig.id }
      };

      const response = await axios.put(`http://localhost:8080/api/thamsophi/${selectedFeeParam.id}`, updatedFeeParamData);
      console.log('Fee Parameter Updated:', response.data);

      setServiceDetails({
        ...serviceDetails,
        feeParameters: serviceDetails.feeParameters.map(fee =>
          fee.id === selectedFeeParam.id ? response.data : fee
        ),
      });

      setShowFeeParamModal(false);
      setNewFeeParam('');
      setNewStartValue('');
      setNewEndValue('');
      setNewUnitPrice('');
      setSelectedFeeParam(null);
    } catch (error) {
      console.error('Error editing fee parameter:', error);
    }
  };

  const handleDeleteFeeParam = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/thamsophi/${id}`);
      console.log('Fee Parameter Deleted');

      setServiceDetails({
        ...serviceDetails,
        feeParameters: serviceDetails.feeParameters.filter(fee => fee.id !== id),
      });

      setShowFeeParamModal(false);
    } catch (error) {
      console.error('Error deleting fee parameter:', error);
    }
  };

  // Handle adding, editing and deleting packages
  const handleAddPackage = async () => {
    if (!newPackageName || !newPackagePrice || !newPackageEffectiveDate) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc: Tên gói, Đơn giá, Ngày hiệu lực.');
      return;
    }

    const newPkg = {
      tenGoi: newPackageName,
      donGia: parseFloat(newPackagePrice),
      moTa: newPackageDescription,
      ngayHieuLuc: newPackageEffectiveDate,
      trangThai: newPackageStatus,
      dichVu: { maDichVu: serviceDetails.service.maDichVu }
    };

    try {
      const response = await axios.post('http://localhost:8080/api/goicuocdichvu', newPkg);
      setServiceDetails({
        ...serviceDetails,
        servicePackages: [...serviceDetails.servicePackages, response.data],
      });
      setShowPackageModal(false);
      resetPackageForm();
    } catch (error) {
      console.error('Error adding package:', error);
      alert(error.response?.data || 'Lỗi khi thêm gói cước');
    }
  };

  const handleEditPackage = async () => {
    if (!selectedPackage || !newPackageName || !newPackagePrice || !newPackageEffectiveDate) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc: Tên gói, Đơn giá, Ngày hiệu lực.');
      return;
    }

    const updatedPkg = {
      tenGoi: newPackageName,
      donGia: parseFloat(newPackagePrice),
      moTa: newPackageDescription,
      ngayHieuLuc: newPackageEffectiveDate,
      trangThai: newPackageStatus,
      dichVu: { maDichVu: serviceDetails.service.maDichVu }
    };

    try {
      const response = await axios.put(`http://localhost:8080/api/goicuocdichvu/${selectedPackage.id}`, updatedPkg);
      setServiceDetails({
        ...serviceDetails,
        servicePackages: serviceDetails.servicePackages.map(pkg =>
          pkg.id === selectedPackage.id ? response.data : pkg
        ),
      });
      setShowPackageModal(false);
      resetPackageForm();
      setSelectedPackage(null);
    } catch (error) {
      console.error('Error editing package:', error);
      alert(error.response?.data || 'Lỗi khi chỉnh sửa gói cước');
    }
  };

  const handleDeletePackage = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/goicuocdichvu/${id}`);
      console.log('Service Package Deleted');
      setServiceDetails({
        ...serviceDetails,
        servicePackages: serviceDetails.servicePackages.filter(pkg => pkg.id !== id),
      });
    } catch (error) {
      console.error('Error deleting service package:', error);
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
    setNewDateEffective('');
    setNewFeeParam('');
    setNewStartValue('');
    setNewEndValue('');
    setNewUnitPrice('');
    resetPackageForm();
  };

  const resetPackageForm = () => {
    setNewPackageName('');
    setNewPackagePrice('');
    setNewPackageDescription('');
    setNewPackageEffectiveDate('');
    setNewPackageStatus('HoatDong');
  };

  // Open modal for editing or adding service
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

  // Handle closing the service details modal
  const closeModal = () => {
    setServiceDetails(null);
    setShowModal(false);
  };

  const openConfigModal = (config = null) => {
    if (config) {
      setSelectedConfig(config);
      setNewConfig(config.tenCauHinh);
      setNewDateEffective(config.ngayHieuLuc.split('T')[0]); // Format date for input
    } else {
      setSelectedConfig(null);
      setNewConfig('');
      setNewDateEffective('');
    }
    setShowConfigModal(true);
  };

  const openPackageModal = (pkg = null) => {
    if (pkg) {
      setSelectedPackage(pkg);
      setNewPackageName(pkg.tenGoi);
      setNewPackagePrice(pkg.donGia.toString());
      setNewPackageDescription(pkg.moTa || '');
      setNewPackageEffectiveDate(pkg.ngayHieuLuc.split('T')[0]);
      setNewPackageStatus(pkg.trangThai);
    } else {
      resetPackageForm();
      setSelectedPackage(null);
    }
    setShowPackageModal(true);
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
              onClick={() => openConfigModal()}
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
                  {serviceDetails.configurations.map((config) => (
                    <tr key={config.id}>
                      <td className="border px-4 py-2">{config.tenCauHinh}</td>
                      <td className="border px-4 py-2">{config.ngayHieuLuc}</td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => openConfigModal(config)}
                          className="bg-yellow-500 text-white p-1 rounded-md"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteConfig(config.id)}
                          className="ml-2 bg-red-500 text-white p-1 rounded-md"
                        >
                          Xóa
                        </button>
                        <button
                          onClick={() => openFeeParamModal(config)}
                          className="ml-2 bg-blue-500 text-white p-1 rounded-md"
                        >
                          Thêm Tham Số Phí
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Fee Parameters Table */}
            <h4 className="mt-4 font-semibold">Tham Số Phí</h4>
            {serviceDetails.configurations.length === 0 ? (
              <p className="mt-2 text-red-500">Vui lòng thêm cấu hình trước khi thêm tham số phí</p>
            ) : (
              <button
                className="bg-blue-500 text-white p-2 rounded-md mt-4"
                onClick={() => openFeeParamModal()}
              >
                Thêm Tham Số Phí
              </button>
            )}
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
                  {serviceDetails.feeParameters.map((fee) => (
                    <tr key={fee.id}>
                      <td className="border px-4 py-2">{fee.ten}</td>
                      <td className="border px-4 py-2">{fee.giaTriTu}</td>
                      <td className="border px-4 py-2">{fee.giaTriDen}</td>
                      <td className="border px-4 py-2">{fee.donGia}</td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => {
                            setSelectedFeeParam(fee);
                            setNewFeeParam(fee.ten);
                            setNewStartValue(fee.giaTriTu.toString());
                            setNewEndValue(fee.giaTriDen.toString());
                            setNewUnitPrice(fee.donGia.toString());
                            setShowFeeParamModal(true);
                          }}
                          className="bg-yellow-500 text-white p-1 rounded-md"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteFeeParam(fee.id)}
                          className="ml-2 bg-red-500 text-white p-1 rounded-md"
                        >
                          Xóa
                        </button>
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
              onClick={() => openPackageModal()}
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
                    <th className="border px-4 py-2">Ngày Hiệu Lực</th>
                    <th className="border px-4 py-2">Trạng Thái</th>
                    <th className="border px-4 py-2">Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceDetails.servicePackages.map((pkg) => (
                    <tr key={pkg.id}>
                      <td className="border px-4 py-2">{pkg.tenGoi}</td>
                      <td className="border px-4 py-2">{pkg.donGia}</td>
                      <td className="border px-4 py-2">{pkg.moTa}</td>
                      <td className="border px-4 py-2">{pkg.ngayHieuLuc}</td>
                      <td className="border px-4 py-2">{pkg.trangThai}</td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => openPackageModal(pkg)}
                          className="bg-yellow-500 text-white p-1 rounded-md"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeletePackage(pkg.id)}
                          className="ml-2 bg-red-500 text-white p-1 rounded-md"
                        >
                          Xóa
                        </button>
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

      {/* Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">{selectedConfig ? 'Chỉnh sửa cấu hình' : 'Thêm cấu hình'}</h3>
            <input
              type="text"
              value={newConfig}
              onChange={(e) => setNewConfig(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full"
              placeholder="Tên cấu hình"
            />
            <input
              type="date"
              value={newDateEffective}
              onChange={(e) => setNewDateEffective(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full mt-2"
              placeholder="Ngày hiệu lực"
            />

            <div className="mt-4 flex justify-end">
              <button
                onClick={selectedConfig ? handleEditConfig : handleAddConfig}
                className="bg-green-500 text-white p-2 rounded-md"
              >
                {selectedConfig ? 'Cập nhật' : 'Thêm'}
              </button>
              <button
                onClick={() => setShowConfigModal(false)}
                className="ml-2 bg-gray-300 text-black p-2 rounded-md"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fee Parameter Modal */}
      {showFeeParamModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">{selectedFeeParam ? 'Chỉnh sửa tham số phí' : 'Thêm tham số phí'}</h3>

            {/* Dropdown for selecting Configuration */}
            <select
              value={selectedConfig ? selectedConfig.id : ''}
              onChange={(e) => {
                const config = serviceDetails.configurations.find(config => config.id === e.target.value);
                setSelectedConfig(config || null);
              }}
              className="p-2 border border-gray-300 rounded-md w-full mb-2"
              disabled={selectedFeeParam !== null} // Disable dropdown when editing
            >
              <option value="">Chọn cấu hình</option>
              {serviceDetails.configurations.map((config) => (
                <option key={config.id} value={config.id}>
                  {config.tenCauHinh} - {config.ngayHieuLuc}
                </option>
              ))}
            </select>

            {/* Fee Parameter Input Fields */}
            <input
              type="text"
              value={newFeeParam}
              onChange={(e) => setNewFeeParam(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full mt-2"
              placeholder="Tên tham số phí"
            />
            <input
              type="number"
              value={newStartValue}
              onChange={(e) => setNewStartValue(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full mt-2"
              placeholder="Giá trị từ"
            />
            <input
              type="number"
              value={newEndValue}
              onChange={(e) => setNewEndValue(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full mt-2"
              placeholder="Giá trị đến"
            />
            <input
              type="number"
              value={newUnitPrice}
              onChange={(e) => setNewUnitPrice(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full mt-2"
              placeholder="Đơn giá"
            />

            <div className="mt-4 flex justify-end">
              <button
                onClick={selectedFeeParam ? handleEditFeeParam : handleAddFeeParam}
                className="bg-green-500 text-white p-2 rounded-md"
                disabled={!selectedConfig}
              >
                {selectedFeeParam ? 'Cập nhật' : 'Thêm'}
              </button>
              <button
                onClick={() => {
                  setShowFeeParamModal(false);
                  setSelectedConfig(null);
                  setNewFeeParam('');
                  setNewStartValue('');
                  setNewEndValue('');
                  setNewUnitPrice('');
                  setSelectedFeeParam(null);
                }}
                className="ml-2 bg-gray-300 text-black p-2 rounded-md"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service Package Modal */}
      {showPackageModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">{selectedPackage ? 'Chỉnh sửa gói cước' : 'Thêm gói cước'}</h3>
            <input
              type="text"
              value={newPackageName}
              onChange={(e) => setNewPackageName(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full mt-2"
              placeholder="Tên gói cước"
            />
            <input
              type="number"
              value={newPackagePrice}
              onChange={(e) => setNewPackagePrice(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full mt-2"
              placeholder="Đơn giá"
            />
            <textarea
              value={newPackageDescription}
              onChange={(e) => setNewPackageDescription(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full mt-2"
              placeholder="Mô tả"
            />
            <input
              type="date"
              value={newPackageEffectiveDate}
              onChange={(e) => setNewPackageEffectiveDate(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full mt-2"
              placeholder="Ngày hiệu lực"
            />
            <select
              value={newPackageStatus}
              onChange={(e) => setNewPackageStatus(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full mt-2"
            >
              <option value="HoatDong">Hoạt động</option>
              <option value="NgungHoatDong">Ngừng hoạt động</option>
            </select>
            <div className="mt-4 flex justify-end">
              <button
                onClick={selectedPackage ? handleEditPackage : handleAddPackage}
                className="bg-green-500 text-white p-2 rounded-md"
              >
                {selectedPackage ? 'Cập nhật' : 'Thêm'}
              </button>
              <button
                onClick={() => {
                  setShowPackageModal(false);
                  resetPackageForm();
                  setSelectedPackage(null);
                }}
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