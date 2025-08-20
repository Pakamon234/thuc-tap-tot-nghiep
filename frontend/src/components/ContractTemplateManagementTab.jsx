import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContractTemplateManagementTab = () => {
  const [templates, setTemplates] = useState([]);
  const [services, setServices] = useState([]); // Danh sách tất cả dịch vụ
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newMainTerms, setNewMainTerms] = useState('');
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateServices, setTemplateServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');

  // Fetch templates and services data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [templateResponse, serviceResponse] = await Promise.all([
          axios.get('http://localhost:8080/api/mauhopdong'),
          axios.get('http://localhost:8080/api/dichvu'),
        ]);
        setTemplates(templateResponse.data);
        setServices(serviceResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Lỗi khi lấy dữ liệu mẫu hợp đồng hoặc dịch vụ');
      }
    };
    fetchData();
  }, []);

  // Handle viewing template details and associated services
  const handleViewTemplateDetails = async (template) => {
    try {
      const [templateResponse, servicesResponse] = await Promise.all([
        axios.get(`http://localhost:8080/api/mauhopdong/${template.id}`),
        axios.get(`http://localhost:8080/api/mauhopdongdichvu/mau/${template.id}`),
      ]);
      setSelectedTemplate(templateResponse.data);
      setTemplateServices(servicesResponse.data);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error fetching template details or services:', error);
      alert(error.response?.data || 'Lỗi khi lấy thông tin mẫu hợp đồng hoặc danh sách dịch vụ');
    }
  };

  // Handle adding a new template
  const handleAddTemplate = async () => {
    if (!newTemplateName) {
      alert('Vui lòng điền tên mẫu hợp đồng.');
      return;
    }

    try {
      const newTemplateData = {
        tenMau: newTemplateName,
        moTa: newDescription,
        dieuKhoanChinh: newMainTerms,
      };
      const response = await axios.post('http://localhost:8080/api/mauhopdong', newTemplateData);
      setTemplates([...templates, response.data]);
      clearForm();
      setShowModal(false);
    } catch (error) {
      console.error('Error adding template:', error);
      alert(error.response?.data || 'Lỗi khi thêm mẫu hợp đồng');
    }
  };

  // Handle editing an existing template
  const handleEditTemplate = async () => {
    if (!editingTemplate || !newTemplateName) {
      alert('Vui lòng điền tên mẫu hợp đồng.');
      return;
    }

    try {
      const updatedTemplateData = {
        tenMau: newTemplateName,
        moTa: newDescription,
        dieuKhoanChinh: newMainTerms,
      };
      const response = await axios.put(`http://localhost:8080/api/mauhopdong/${editingTemplate.id}`, updatedTemplateData);
      setTemplates(templates.map(template =>
        template.id === editingTemplate.id ? response.data : template
      ));
      clearForm();
      setShowModal(false);
      setEditingTemplate(null);
      if (selectedTemplate && selectedTemplate.id === editingTemplate.id) {
        setSelectedTemplate(response.data);
      }
    } catch (error) {
      console.error('Error editing template:', error);
      alert(error.response?.data || 'Lỗi khi chỉnh sửa mẫu hợp đồng');
    }
  };

  // Handle deleting a template
  const handleDeleteTemplate = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/mauhopdong/${id}`);
      setTemplates(templates.filter(template => template.id !== id));
      alert(response.data || 'Xóa mẫu hợp đồng thành công');
      if (selectedTemplate && selectedTemplate.id === id) {
        setShowDetailModal(false);
        setSelectedTemplate(null);
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      alert(error.response?.data || 'Lỗi khi xóa mẫu hợp đồng');
    }
  };

  // Handle adding a service to a template
  const handleAddServiceToTemplate = async () => {
    if (!selectedService) {
      alert('Vui lòng chọn một dịch vụ.');
      return;
    }

    try {
      const newServiceLink = {
        id: {
          mauId: selectedTemplate.id,
          maDichVu: selectedService,
        },
      };
      const response = await axios.post('http://localhost:8080/api/mauhopdongdichvu', newServiceLink);
      setTemplateServices([...templateServices, response.data]);
      setSelectedService('');
    } catch (error) {
      console.error('Error adding service to template:', error);
      alert(error.response?.data || 'Lỗi khi thêm dịch vụ vào mẫu hợp đồng');
    }
  };

  // Handle deleting a service from a template
  const handleDeleteServiceFromTemplate = async (mauId, maDichVu) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/mauhopdongdichvu/${mauId}/${maDichVu}`);
      setTemplateServices(templateServices.filter(service => 
        !(service.id.mauId === mauId && service.id.maDichVu === maDichVu)
      ));
      alert(response.data || 'Xóa dịch vụ khỏi mẫu hợp đồng thành công');
    } catch (error) {
      console.error('Error deleting service from template:', error);
      alert(error.response?.data || 'Lỗi khi xóa dịch vụ khỏi mẫu hợp đồng');
    }
  };

  // Clear the form fields
  const clearForm = () => {
    setNewTemplateName('');
    setNewDescription('');
    setNewMainTerms('');
    setSelectedService('');
  };

  // Open modal for adding or editing template
  const openModal = (template = null) => {
    if (template) {
      setEditingTemplate(template);
      setNewTemplateName(template.tenMau);
      setNewDescription(template.moTa || '');
      setNewMainTerms(template.dieuKhoanChinh || '');
    } else {
      clearForm();
      setEditingTemplate(null);
    }
    setShowModal(true);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800">Quản lý Mẫu Hợp Đồng</h2>

      {/* Button to open Add Template Modal */}
      <button
        onClick={() => openModal()}
        className="bg-blue-500 text-white p-2 rounded-md mt-4"
      >
        Thêm Mẫu Hợp Đồng
      </button>

      {/* Templates List */}
      <div className="mt-6">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="border px-4 py-2">Mã Mẫu</th>
              <th className="border px-4 py-2">Tên Mẫu</th>
              <th className="border px-4 py-2">Mô Tả</th>
              <th className="border px-4 py-2">Điều Khoản Chính</th>
              <th className="border px-4 py-2">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((template) => (
              <tr key={template.id}>
                <td className="border px-4 py-2">{template.id}</td>
                <td className="border px-4 py-2">{template.tenMau}</td>
                <td className="border px-4 py-2">{template.moTa || 'N/A'}</td>
                <td className="border px-4 py-2">{template.dieuKhoanChinh || 'N/A'}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => openModal(template)}
                    className="bg-yellow-500 text-white p-1 rounded-md"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="ml-2 bg-red-500 text-white p-1 rounded-md"
                  >
                    Xóa
                  </button>
                  <button
                    onClick={() => handleViewTemplateDetails(template)}
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

      {/* Modal for Adding/Editing Template */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">{editingTemplate ? 'Chỉnh sửa mẫu hợp đồng' : 'Thêm mẫu hợp đồng'}</h3>
            <input
              type="text"
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full mt-2"
              placeholder="Tên mẫu hợp đồng"
            />
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full mt-2"
              placeholder="Mô tả"
            />
            <textarea
              value={newMainTerms}
              onChange={(e) => setNewMainTerms(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full mt-2"
              placeholder="Điều khoản chính"
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={editingTemplate ? handleEditTemplate : handleAddTemplate}
                className="bg-green-500 text-white p-2 rounded-md"
              >
                {editingTemplate ? 'Cập nhật' : 'Thêm'}
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

      {/* Detail Modal for Viewing Template and Associated Services */}
      {showDetailModal && selectedTemplate && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-3/4 max-h-[80vh] overflow-auto relative">
            <button
              onClick={() => setShowDetailModal(false)}
              className="absolute top-4 right-4 text-gray-500 text-xl"
            >
              ×
            </button>

            <h3 className="text-lg font-semibold mb-4">Chi tiết mẫu hợp đồng</h3>

            {/* Template Information */}
            <div className="mb-4">
              <strong>Mã Mẫu:</strong> {selectedTemplate.id}
            </div>
            <div className="mb-4">
              <strong>Tên Mẫu:</strong> {selectedTemplate.tenMau}
            </div>
            <div className="mb-4">
              <strong>Mô Tả:</strong> {selectedTemplate.moTa || 'N/A'}
            </div>
            <div className="mb-4">
              <strong>Điều Khoản Chính:</strong> {selectedTemplate.dieuKhoanChinh || 'N/A'}
            </div>

            {/* Services Associated with Template */}
            <h4 className="mt-4 font-semibold">Danh sách dịch vụ liên kết</h4>
            <div className="mt-2 flex items-center">
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="p-2 border border-gray-300 rounded-md w-1/2 mr-2"
              >
                <option value="">Chọn dịch vụ</option>
                {services.map((service) => (
                  <option key={service.maDichVu} value={service.maDichVu}>
                    {service.tenDichVu}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddServiceToTemplate}
                className="bg-blue-500 text-white p-2 rounded-md"
              >
                Thêm Dịch Vụ
              </button>
            </div>
            {templateServices.length === 0 ? (
              <p className="mt-2 text-red-500">Không có dịch vụ liên kết</p>
            ) : (
              <table className="w-full table-auto mt-2">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Mã Dịch Vụ</th>
                    <th className="border px-4 py-2">Tên Dịch Vụ</th>
                    <th className="border px-4 py-2">Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {templateServices.map((serviceLink) => (
                    <tr key={`${serviceLink.id.mauId}-${serviceLink.id.maDichVu}`}>
                      <td className="border px-4 py-2">{serviceLink.id.maDichVu}</td>
                      <td className="border px-4 py-2">{serviceLink.dichVu.tenDichVu}</td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleDeleteServiceFromTemplate(serviceLink.id.mauId, serviceLink.id.maDichVu)}
                          className="bg-red-500 text-white p-1 rounded-md"
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
    </div>
  );
};

export default ContractTemplateManagementTab;