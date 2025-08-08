package QLDV.contractService.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "hopdong")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HopDong {

    @Id
    @Column(name = "mahopdong")
    private String maHopDong;

    @Column(name = "macudan", nullable = false)
    private int maCuDan;

    @Column(name = "manguoikybql", nullable = true)
    private int maNguoiKyBQL;

    @Column(name = "macanho", nullable = true)
    private String maCanHo;

    @Column(name = "mauhopdongid", nullable = false)
    private Integer mauHopDongId;

    @Column(name = "ngayky", nullable = false)
    private LocalDate ngayKy;

    @Column(name = "ngayketthuc")
    private LocalDate ngayKetThuc;

    @Enumerated(EnumType.STRING)
    @Column(name = "trangthai", nullable = false)
    private TrangThaiHopDong trangThai;

    // public enum TrangThaiHopDong {
    // Hiệu_lực("Hiệu lực"),
    // Chờ_duyệt("Chờ duyệt"),
    // Đã_hủy("Đã hủy");

    // private final String value;

    // TrangThaiHopDong(String value) {
    // this.value = value;
    // }

    // @Override
    // public String toString() {
    // return value;
    // }
    // }
    public enum TrangThaiHopDong {

        Chờ_duyệt,
        Hiệu_lực,
        Đã_hủy;

    }

    // Getter and Setter methods
    public String getMaHopDong() {
        return maHopDong;
    }

    public void setMaHopDong(String maHopDong) {
        this.maHopDong = maHopDong;
    }

    public int getMaCuDan() {
        return maCuDan;
    }

    public void setMaCuDan(int maCuDan) {
        this.maCuDan = maCuDan;
    }

    public int getMaNguoiKyBQL() {
        return maNguoiKyBQL;
    }

    public void setMaNguoiKyBQL(int maNguoiKyBQL) {
        this.maNguoiKyBQL = maNguoiKyBQL;
    }

    public String getMaCanHo() {
        return maCanHo;
    }

    public void setMaCanHo(String maCanHo) {
        this.maCanHo = maCanHo;
    }

    public Integer getMauHopDongId() {
        return mauHopDongId;
    }

    public void setMauHopDongId(int mauHopDongId) {
        this.mauHopDongId = mauHopDongId;
    }

    public LocalDate getNgayKy() {
        return ngayKy;
    }

    public void setNgayKy(LocalDate ngayKy) {
        this.ngayKy = ngayKy;
    }

    public LocalDate getNgayKetThuc() {
        return ngayKetThuc;
    }

    public void setNgayKetThuc(LocalDate ngayKetThuc) {
        this.ngayKetThuc = ngayKetThuc;
    }

    public TrangThaiHopDong getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(TrangThaiHopDong trangThai) {
        this.trangThai = trangThai;
    }
}