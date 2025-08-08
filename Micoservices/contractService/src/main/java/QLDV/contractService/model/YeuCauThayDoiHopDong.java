package QLDV.contractService.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "yeucauthaydoihopdong")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class YeuCauThayDoiHopDong {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "mahopdong", nullable = false)
    private HopDong hopDong;

    @Column(name = "nguoiguiid", nullable = false)
    private int nguoiGuiId;

    @Enumerated(EnumType.STRING)
    @Column(name = "loaithaydoi", nullable = false)
    private LoaiThayDoi loaiThayDoi;

    @Enumerated(EnumType.STRING)
    @Column(name = "trangthai", nullable = false)
    private TrangThaiYeuCau trangThai;

    @Column(name = "ngaytao", nullable = false)
    private LocalDateTime ngayTao;

    @Column(name = "noidungchitiet", columnDefinition = "TEXT")
    private String noiDungChiTiet;

    public enum LoaiThayDoi {
        Nâng_cấp_gói_cước,
        Hủy_dịch_vụ,
        Đăng_ký_mới;
    }

    public enum TrangThaiYeuCau {
        Chờ_duyệt,
        Đã_duyệt,
        Từ_chối;
    }

    // Getter and Setter methods
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public HopDong getHopDong() {
        return hopDong;
    }

    public void setHopDong(HopDong hopDong) {
        this.hopDong = hopDong;
    }

    public int getNguoiGuiId() {
        return nguoiGuiId;
    }

    public void setNguoiGuiId(int nguoiGuiId) {
        this.nguoiGuiId = nguoiGuiId;
    }

    public LoaiThayDoi getLoaiThayDoi() {
        return loaiThayDoi;
    }

    public void setLoaiThayDoi(LoaiThayDoi loaiThayDoi) {
        this.loaiThayDoi = loaiThayDoi;
    }

    public TrangThaiYeuCau getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(TrangThaiYeuCau trangThai) {
        this.trangThai = trangThai;
    }

    public LocalDateTime getNgayTao() {
        return ngayTao;
    }

    public void setNgayTao(LocalDateTime ngayTao) {
        this.ngayTao = ngayTao;
    }

    public String getNoiDungChiTiet() {
        return noiDungChiTiet;
    }

    public void setNoiDungChiTiet(String noiDungChiTiet) {
        this.noiDungChiTiet = noiDungChiTiet;
    }
}