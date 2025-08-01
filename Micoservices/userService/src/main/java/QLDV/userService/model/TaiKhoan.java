package QLDV.userService.model;

import jakarta.persistence.*;

// @Entity
// @Table(name = "taikhoan")
// public class TaiKhoan {
//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     @Column(name = "tenDangNhap", unique = true, nullable = false)
//     private String tenDangNhap;

//     @Column(name = "matKhauHash")
//     private String matKhauHash;

//     @Column(name = "trangThai")
//     private String trangThai;

//     // Tài khoản bị khóa nếu trạng thái khác "Đang hoạt động"
//     public boolean isLocked() {
//         return !"Đang hoạt động".equalsIgnoreCase(trangThai);
//     }

//     // getters/setters
//     public Long getId() { return id; }
//     public void setId(Long id) { this.id = id; }

//     public String getUsername() { return tenDangNhap; }
//     public void setUsername(String tenDangNhap) { this.tenDangNhap = tenDangNhap; }

//     public String getPassword() { return matKhauHash; }
//     public void setPassword(String matKhauHash) { this.matKhauHash = matKhauHash; }

//     public String getStatus() { return trangThai; }
//     public void setStatus(String trangThai) { this.trangThai = trangThai; }
// }

@Entity
@Table(name = "taikhoan")
public class TaiKhoan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tenDangNhap", unique = true, nullable = false)
    private String tenDangNhap;

    @Column(name = "matKhauHash")
    private String matKhauHash;

    @Column(name = "trangThai")
    private String trangThai;

    @Column(name = "loaiTaiKhoan")
    private String loaiTaiKhoan; // Thêm trường loại tài khoản

    public boolean isLocked() {
        return !"Đang hoạt động".equalsIgnoreCase(trangThai);
    }

    // Getters/Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return tenDangNhap; }
    public void setUsername(String tenDangNhap) { this.tenDangNhap = tenDangNhap; }

    public String getPassword() { return matKhauHash; }
    public void setPassword(String matKhauHash) { this.matKhauHash = matKhauHash; }

    public String getStatus() { return trangThai; }
    public void setStatus(String trangThai) { this.trangThai = trangThai; }

    public String getLoaiTaiKhoan() { return loaiTaiKhoan; }
    public void setLoaiTaiKhoan(String loaiTaiKhoan) { this.loaiTaiKhoan = loaiTaiKhoan; }
}
