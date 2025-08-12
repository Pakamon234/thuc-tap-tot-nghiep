package QLDV.userService.dto;


import java.util.Date;

public class ResidentListItemDTO {
    public Long id;
    public String hoTen;
    public String email;
    public String soDienThoai;
    public String maCanHo;
    public String trangThai;          // 'ở' | 'không ở nữa'
    public String tenDangNhap;        // từ TaiKhoan
    public String trangThaiTaiKhoan;  // từ TaiKhoan
    public Date ngayDangKy;           // từ TaiKhoan

    public ResidentListItemDTO(Long id, String hoTen, String email, String soDienThoai,
                               String maCanHo, String trangThai, String tenDangNhap,
                               String trangThaiTaiKhoan, Date ngayDangKy) {
        this.id = id; this.hoTen = hoTen; this.email = email; this.soDienThoai = soDienThoai;
        this.maCanHo = maCanHo; this.trangThai = trangThai; this.tenDangNhap = tenDangNhap;
        this.trangThaiTaiKhoan = trangThaiTaiKhoan; this.ngayDangKy = ngayDangKy;
    }
}
