import React, { useState, useEffect } from 'react';
import { X, Edit3, Save, User, Mail, Phone, Calendar, MapPin, CreditCard, Building, Hash } from 'lucide-react';
import { getUserProfile, updateUserProfile } from '../services/userService';
import Loading from './Loading';
import { ErrorFallback } from './ErrorBoundary';

const ProfileModal = ({ isOpen, onClose }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({
        name: '',             // cuDan.hoTen
        email: '',            // cuDan.email
        phone: '',            // cuDan.soDienThoai
        dateOfBirth: '',      // cuDan.ngaySinh
        address: '',          // cuDan.diaChi
        cccd: '',             // cuDan.cccd
        apartmentNumber: '',  // canHo.maCanHo
        building: '',         // canHo.toaNha
        floor: '',            // canHo.tang
        area: '',              // canHo.dienTich
        status: ''            // cuDan.trangthai
    });

  const [validationErrors, setValidationErrors] = useState({});

  const userId = Number(localStorage.getItem('userId'));
  const loaitk = localStorage.getItem('loaiTaiKhoan'); // 'BQL' | 'CuDan'

  // Hàm xử lý lỗi API trực tiếp ở đây
  const handleApiError = (err) => {
    if (!err) return 'Đã xảy ra lỗi không xác định';
    if (err.response?.data?.message) return err.response.data.message;
    if (err.message) return err.message;
    return 'Đã xảy ra lỗi, vui lòng thử lại';
  };

  useEffect(() => {
    if (isOpen && userId) {
      loadProfileData();
    }
  }, [isOpen, userId]);

  const loadProfileData = async () => {
        // if (!userId) return;
        // setIsLoading(true);
        // setError(null);
        try {
            const profile = await getUserProfile(userId);
            const data = profile.data;

            setFormData({
            name: data.cuDan?.hoTen || '',
            email: data.cuDan?.email || '',
            phone: data.cuDan?.soDienThoai || '',
            dateOfBirth: data.cuDan?.ngaySinh || '',
            address: data.cuDan?.diaChi || '',
            cccd: data.cuDan?.cccd || '',
            apartmentNumber: data.canHo?.maCanHo || '',
            building: data.canHo?.toaNha || '',
            floor: data.canHo?.tang || '',
            area: data.canHo?.dienTich || '',
            status: data.cuDan?.trangThai || ''
            });

            setProfileData(data);
        } catch (error) {
            console.error("Lỗi khi load profile:", error);
        }
    };


  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Họ tên không được để trống';
    } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(formData.name)) {
      errors.name = 'Họ tên không được chứa ký tự đặc biệt';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email không đúng định dạng';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Số điện thoại không được để trống';
    } else if (!/^0\d{9}$/.test(formData.phone)) {
      errors.phone = 'Số điện thoại phải có 10 chữ số và bắt đầu bằng 0';
    }
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        if (age - 1 < 18) {
          errors.dateOfBirth = 'Bạn phải đủ 18 tuổi';
        }
      } else if (age < 18) {
        errors.dateOfBirth = 'Bạn phải đủ 18 tuổi';
      }
      if (birthDate > today) {
        errors.dateOfBirth = 'Ngày sinh không thể trong tương lai';
      }
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

    const handleSave = async () => {
        if (!validateForm() || !userId) return;
        setIsSaving(true);
        setError(null);

        console.log("User ID trước khi gọi API:", userId, typeof userId);

        const payload = {
            hoTen: formData.name,
            email: formData.email,
            soDienThoai: formData.phone,
            cccd: formData.cccd,
            diaChi: formData.address,
            trangThai: formData.status || "ở", // mặc định là "ở" nếu chưa chọn
            ngaySinh: new Date(formData.dateOfBirth).toISOString().split('T')[0],
            maCanHo: formData.apartmentNumber
        };

        try {
            const updatedProfile = await updateUserProfile(userId, payload);

            // ✅ Lưu tên vào localStorage
            localStorage.setItem('userName', updatedProfile.data.hoTen || '');

            // ✅ Reset lại form bằng dữ liệu mới
            await loadProfileData(); // ← gọi lại API để lấy dữ liệu mới

            setIsEditMode(false);
            alert('✅ Cập nhật thông tin thành công!');
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setIsSaving(false);
        }
};

  const handleCancel = () => {
    if (profileData) {
      setFormData({
        name: profileData.name || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        dateOfBirth: profileData.dateOfBirth || '',
        address: profileData.address || ''
      });
    }
    setValidationErrors({});
    setIsEditMode(false);
    setError(null);
  };

  const handleClose = () => {
    if (isEditMode) {
      const hasChanges = profileData && (
        formData.name !== profileData.name ||
        formData.email !== profileData.email ||
        formData.phone !== profileData.phone ||
        formData.dateOfBirth !== profileData.dateOfBirth ||
        formData.address !== profileData.address
      );
      if (hasChanges && !window.confirm('Bạn có chắc muốn hủy các thay đổi?')) {
        return;
      }
      handleCancel();
    }
    onClose();
  };

  if (!isOpen) return null;

//   console.log("FormData:", formData);
//   console.log("ProfileData:", profileData);
//   console.log("User ID trước khi gọi API:", userId, typeof userId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Thông tin cá nhân</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 p-1 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="py-8">
            <Loading text="Đang tải thông tin..." />
          </div>
        ) : error ? (
          <ErrorFallback error={error} onRetry={loadProfileData} message="Không thể tải thông tin cá nhân" />
        ) : profileData ? (
          <div className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
                {profileData?.cuDan?.hoTen.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{profileData?.cuDan?.hoTen || ''}</h3>
                <p className="text-gray-600">
                  {loaitk === 'BQL'
                    ? 'Ban quản lý'
                    : `Căn hộ ${profileData?.canHo?.maCanHo || ''}`}
                </p>
                <div className="flex items-center mt-1">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      profileData?.cuDan?.trangThai === 'ở'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {profileData?.cuDan?.trangThai === 'ở' ? 'Đang hoạt động' : 'Không hoạt động'}
                  </span>
                </div>
                {/* <div className="flex items-center mt-1">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Chưa có trạng thái
                    </span>
                </div> */}
              </div>
            </div>

            {/* Nội dung form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 border-b pb-2">Thông tin có thể chỉnh sửa</h4>

                {/* Name */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <User className="h-4 w-4 mr-2" /> Họ và tên
                  </label>
                  {isEditMode ? (
                    <>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                          validationErrors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nhập họ và tên"
                      />
                      {validationErrors.name && <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>}
                    </>
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{profileData?.cuDan?.hoTen || ''}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Mail className="h-4 w-4 mr-2" /> Email
                  </label>
                  {isEditMode ? (
                    <>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                          validationErrors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="example@gmail.com"
                      />
                      {validationErrors.email && <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>}
                    </>
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{profileData?.cuDan?.email || ''}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Phone className="h-4 w-4 mr-2" /> Số điện thoại
                  </label>
                  {isEditMode ? (
                    <>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                          validationErrors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0123456789"
                      />
                      {validationErrors.phone && <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>}
                    </>
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{profileData?.cuDan?.soDienThoai || ''}</p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="h-4 w-4 mr-2" /> Ngày sinh
                  </label>
                  {isEditMode ? (
                    <>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                          validationErrors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {validationErrors.dateOfBirth && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.dateOfBirth}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      {profileData?.cuDan?.ngaySinh
                        ? new Date(profileData.cuDan.ngaySinh).toLocaleDateString('vi-VN')
                        : 'Chưa cập nhật'}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <MapPin className="h-4 w-4 mr-2" /> Địa chỉ
                  </label>
                  {isEditMode ? (
                    <textarea
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Nhập địa chỉ"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg min-h-[80px]">
                      {profileData?.cuDan?.diaChi || 'Chưa cập nhật'}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 border-b pb-2">Thông tin không thể sửa</h4>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <CreditCard className="h-4 w-4 mr-2" /> Số CCCD
                  </label>
                  <p className="text-gray-900 bg-gray-100 px-3 py-2 rounded-lg">
                    {profileData?.cuDan?.cccd || 'Chưa cập nhật'}
                  </p>
                </div>

                {loaitk === 'CuDan' && (
                  <>
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                        <Building className="h-4 w-4 mr-2" /> Mã căn hộ
                      </label>
                      <p className="text-gray-900 bg-gray-100 px-3 py-2 rounded-lg">
                        {profileData?.canHo?.maCanHo || 'Chưa cập nhật'}
                      </p>
                    </div>
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                        <Hash className="h-4 w-4 mr-2" /> Tòa nhà
                      </label>
                      <p className="text-gray-900 bg-gray-100 px-3 py-2 rounded-lg">
                        {profileData?.canHo?.toaNha || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                        <Hash className="h-4 w-4 mr-2" /> Tầng
                      </label>
                      <p className="text-gray-900 bg-gray-100 px-3 py-2 rounded-lg">
                        {profileData?.canHo?.tang || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                        <Hash className="h-4 w-4 mr-2" /> Diện tích
                      </label>
                      <p className="text-gray-900 bg-gray-100 px-3 py-2 rounded-lg">
                        {profileData?.canHo?.dienTich ? `${profileData.canHo.dienTich} m²` : 'N/A'}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">{error}</div>}

            <div className="flex justify-end space-x-3 pt-4 border-t">
              {isEditMode ? (
                <>
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
                  >
                    {isSaving ? (
                      <>
                        <Loading size="sm" text="" className="mr-2" /> Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" /> Lưu thay đổi
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                    onClick={() => {
                        if (profileData) {
                        setFormData({
                            name: profileData.cuDan?.hoTen || '',
                            email: profileData.cuDan?.email || '',
                            phone: profileData.cuDan?.soDienThoai || '',
                            dateOfBirth: profileData.cuDan?.ngaySinh || '',
                            address: profileData.cuDan?.diaChi || '',
                            cccd: profileData.cuDan?.cccd || '',
                            apartmentNumber: profileData.canHo?.maCanHo || '',
                            building: profileData.canHo?.toaNha || '',
                            floor: profileData.canHo?.tang || '',
                            area: profileData.canHo?.dienTich || ''
                        });
                        }
                        setIsEditMode(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                    >
                    <Edit3 className="h-4 w-4 mr-2" /> Chỉnh sửa
                </button>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProfileModal;
