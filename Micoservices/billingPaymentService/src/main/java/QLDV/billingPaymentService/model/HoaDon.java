package QLDV.billingPaymentService.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "hoadon")
public class HoaDon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "mahopdong", nullable = false)
    private String maHopDong;

    @Column(name = "ngay", nullable = false)
    private LocalDate ngay;

    @Column(name = "tongtien", nullable = false)
    private BigDecimal tongTien;

    @Enumerated(EnumType.STRING)
    @Column(name = "trangthai", nullable = false)
    private TrangThaiHoaDon trangThai;

    public enum TrangThaiHoaDon {
        Chưa_thanh_toán, Đã_thanh_toán
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getMaHopDong() {
        return maHopDong;
    }

    public void setMaHopDong(String maHopDong) {
        this.maHopDong = maHopDong;
    }

    public LocalDate getNgay() {
        return ngay;
    }

    public void setNgay(LocalDate ngay) {
        this.ngay = ngay;
    }

    public BigDecimal getTongTien() {
        return tongTien;
    }

    public void setTongTien(BigDecimal tongTien) {
        this.tongTien = tongTien;
    }

    public TrangThaiHoaDon getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(TrangThaiHoaDon trangThai) {
        this.trangThai = trangThai;
    }
}
