package QLDV.userService.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "CuDan")
public class CuDan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String hoTen;

    private String email;
    private String soDienThoai;

    @Column(name = "CCCD", unique = true, nullable = false)
    private String cccd;

    @Temporal(TemporalType.DATE)
    private Date ngaySinh;

    @Column(columnDefinition = "TEXT")
    private String diaChi;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TrangThaiCuDan trangThai;

    @ManyToOne
    @JoinColumn(name = "maCanHo", referencedColumnName = "maCanHo", nullable = false)
    private CanHo canHo;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private TaiKhoan taiKhoan;

    // Enum trạng thái cư dân
    public enum TrangThaiCuDan {
        ở, không_ở_nữa
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

    public Date getNgaySinh() { return ngaySinh; }
    public void setNgaySinh(Date ngaySinh) { this.ngaySinh = ngaySinh; }

    public String getCCCD() { return cccd; }
    public void setCCCD(String cccd) { this.cccd = cccd; }

    public String getDiaChi() { return diaChi; }
    public void setDiaChi(String diaChi) { this.diaChi = diaChi; }

    public TrangThaiCuDan getTrangThai() { return trangThai; }
    public void setTrangThai(TrangThaiCuDan trangThai) { this.trangThai = trangThai; }

    public CanHo getCanHo() { return canHo; }
    public void setCanHo(CanHo canHo) { this.canHo = canHo; }

    public TaiKhoan getTaiKhoan() { return taiKhoan; }
    public void setTaiKhoan(TaiKhoan taiKhoan) { this.taiKhoan = taiKhoan; }
}
