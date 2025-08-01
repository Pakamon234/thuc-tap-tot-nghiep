package QLDV.userService.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "NhanVienBQL")
public class NhanVienBQL {

    @Id
    private Long id;

    @Column(nullable = false)
    private String hoTen;

    private String email;
    private String soDienThoai;
    private String CCCD;

    @Temporal(TemporalType.DATE)
    private Date ngaySinh;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TrangThaiNhanVien trangThai;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private TaiKhoan taiKhoan;

    // Enum trạng thái làm việc
    public enum TrangThaiNhanVien {
        Đang_làm_việc,
        Đã_nghỉ_việc,
        Tạm_ngưng
    }

    // Getters/Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getHoTen() { return hoTen; }
    public void setHoTen(String hoTen) { this.hoTen = hoTen; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSoDienThoai() { return soDienThoai; }
    public void setSoDienThoai(String soDienThoai) { this.soDienThoai = soDienThoai; }

    public String getCCCD() { return CCCD; }
    public void setCCCD(String CCCD) { this.CCCD = CCCD; }

    public Date getNgaySinh() { return ngaySinh; }
    public void setNgaySinh(Date ngaySinh) { this.ngaySinh = ngaySinh; }

    public TrangThaiNhanVien getTrangThai() { return trangThai; }
    public void setTrangThai(TrangThaiNhanVien trangThai) { this.trangThai = trangThai; }

    public TaiKhoan getTaiKhoan() { return taiKhoan; }
    public void setTaiKhoan(TaiKhoan taiKhoan) { this.taiKhoan = taiKhoan; }
}
