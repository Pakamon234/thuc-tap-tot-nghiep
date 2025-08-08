import React, { useState, useEffect } from "react";
import { getAllCanHo, dangKyCuDan } from "../services/userService"; // import API đã tạo

export default function DangKy() {
  const [formData, setFormData] = useState({
    hoTen: "",
    tenDangNhap: "",
    matKhau: "",
    email: "",
    soDienThoai: "",
    ngaySinh: "",
    cccd: "",
    maCanHo: "",
  });

  const [errors, setErrors] = useState({});
  const [canHoList, setCanHoList] = useState([]);

  // Fetch danh sách căn hộ khi load trang
  useEffect(() => {
    getAllCanHo()
      .then((res) => {
        setCanHoList(res.data);
      })
      .catch((err) => {
        console.error("Lỗi khi tải danh sách căn hộ:", err);
      });
  }, []);

  const validate = () => {
    let newErrors = {};
    const today = new Date();
    const birthDate = formData.ngaySinh ? new Date(formData.ngaySinh) : null;

    if (!formData.hoTen.trim()) {
      newErrors.hoTen = "Họ tên không được để trống";
    } else if (!/^[A-Za-zÀ-ỹ\s]+$/.test(formData.hoTen)) {
      newErrors.hoTen = "Họ tên không được chứa ký tự đặc biệt hoặc số";
    }

    if (!formData.tenDangNhap.trim()) {
      newErrors.tenDangNhap = "Tên đăng nhập không được để trống";
    }

    if (!formData.matKhau) {
      newErrors.matKhau = "Mật khẩu không được để trống";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,}$/.test(formData.matKhau)) {
      newErrors.matKhau =
        "Mật khẩu phải có ít nhất 1 chữ thường, 1 chữ hoa, 1 ký tự đặc biệt và tối thiểu 6 ký tự";
    }

    if (!formData.email) {
      newErrors.email = "Email không được để trống";
    } else if (!/^[\w.-]+@gmail\.com$/.test(formData.email)) {
      newErrors.email = "Email phải có dạng example@gmail.com";
    }

    if (!formData.soDienThoai) {
      newErrors.soDienThoai = "Số điện thoại không được để trống";
    } else if (!/^\d{10}$/.test(formData.soDienThoai)) {
      newErrors.soDienThoai = "Số điện thoại phải gồm 10 chữ số";
    }

    if (!formData.ngaySinh) {
      newErrors.ngaySinh = "Ngày sinh không được để trống";
    } else {
      if (birthDate > today) {
        newErrors.ngaySinh = "Ngày sinh không được lớn hơn hôm nay";
      } else {
        // Kiểm tra tuổi ≥ 18
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();
        const is18 =
          age > 18 || (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)));
        if (!is18) {
          newErrors.ngaySinh = "Bạn phải đủ 18 tuổi để đăng ký";
        }
      }
    }

    if (!formData.cccd) {
      newErrors.cccd = "CCCD không được để trống";
    } else if (!/^\d{12}$/.test(formData.cccd)) {
      newErrors.cccd = "CCCD phải gồm 12 chữ số";
    }

    if (!formData.maCanHo) {
      newErrors.maCanHo = "Vui lòng chọn mã căn hộ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const payload = {
        hoTen: formData.hoTen,
        tenDangNhap: formData.tenDangNhap,
        matKhau: formData.matKhau,
        email: formData.email,
        soDienThoai: formData.soDienThoai,
        ngaySinh: formData.ngaySinh,
        cccd: formData.cccd,
        canHoId: formData.maCanHo, // BE dùng canHoId
      };

      dangKyCuDan(payload)
        .then((res) => {
          alert(res.data); // thông báo từ BE
        })
        .catch((err) => {
          alert(err.response?.data || "Lỗi khi đăng ký");
        });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Đăng ký tài khoản
        </h2>

        {/* Họ tên */}
        <div className="mb-4">
          <label className="block font-semibold">Họ tên</label>
          <input
            type="text"
            name="hoTen"
            value={formData.hoTen}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Nhập họ tên"
          />
          {errors.hoTen && <p className="text-red-500 text-sm">{errors.hoTen}</p>}
        </div>

        {/* Tên đăng nhập */}
        <div className="mb-4">
          <label className="block font-semibold">Tên đăng nhập</label>
          <input
            type="text"
            name="tenDangNhap"
            value={formData.tenDangNhap}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Nhập tên đăng nhập"
          />
          {errors.tenDangNhap && (
            <p className="text-red-500 text-sm">{errors.tenDangNhap}</p>
          )}
        </div>

        {/* Mật khẩu */}
        <div className="mb-4">
          <label className="block font-semibold">Mật khẩu</label>
          <input
            type="password"
            name="matKhau"
            value={formData.matKhau}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Nhập mật khẩu"
          />
          {errors.matKhau && (
            <p className="text-red-500 text-sm">{errors.matKhau}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="example@gmail.com"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        {/* SĐT */}
        <div className="mb-4">
          <label className="block font-semibold">Số điện thoại</label>
          <input
            type="tel"
            name="soDienThoai"
            value={formData.soDienThoai}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Nhập số điện thoại"
          />
          {errors.soDienThoai && (
            <p className="text-red-500 text-sm">{errors.soDienThoai}</p>
          )}
        </div>

        {/* Ngày sinh */}
        <div className="mb-4">
          <label className="block font-semibold">Ngày sinh</label>
          <input
            type="date"
            name="ngaySinh"
            value={formData.ngaySinh}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            max={new Date().toISOString().split("T")[0]} // chặn chọn ngày tương lai
          />
          {errors.ngaySinh && (
            <p className="text-red-500 text-sm">{errors.ngaySinh}</p>
          )}
        </div>

        {/* CCCD */}
        <div className="mb-4">
          <label className="block font-semibold">CCCD</label>
          <input
            type="text"
            name="cccd"
            value={formData.cccd}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Nhập CCCD"
          />
          {errors.cccd && <p className="text-red-500 text-sm">{errors.cccd}</p>}
        </div>

        {/* Mã căn hộ */}
        <div className="mb-4">
          <label className="block font-semibold">Mã căn hộ</label>
          <select
            name="maCanHo"
            value={formData.maCanHo}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Chọn mã căn hộ --</option>
            {canHoList.map((canHo) => (
              <option key={canHo.id} value={canHo.id}>
                {canHo.maCanHo}
              </option>
            ))}
          </select>
          {errors.maCanHo && (
            <p className="text-red-500 text-sm">{errors.maCanHo}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Đăng ký
        </button>
      </form>
    </div>
  );
}
