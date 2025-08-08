package QLDV.billingPaymentService.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "chitiethoadon")
public class ChiTietHoaDon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hoadonid", nullable = false)
    private HoaDon hoaDon;

    @Column(name = "madichvu", nullable = false)
    private String maDichVu;

    @Column(name = "tenkhoanmuc", nullable = false)
    private String tenKhoanMuc;

    @Column(name = "soluong", nullable = false)
    private Float soLuong;

    @Column(name = "dondia", nullable = false)
    private BigDecimal donGia;

    @Column(name = "thanhtien", nullable = false)
    private BigDecimal thanhTien;

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public HoaDon getHoaDon() {
        return hoaDon;
    }

    public void setHoaDon(HoaDon hoaDon) {
        this.hoaDon = hoaDon;
    }

    public String getMaDichVu() {
        return maDichVu;
    }

    public void setMaDichVu(String maDichVu) {
        this.maDichVu = maDichVu;
    }

    public String getTenKhoanMuc() {
        return tenKhoanMuc;
    }

    public void setTenKhoanMuc(String tenKhoanMuc) {
        this.tenKhoanMuc = tenKhoanMuc;
    }

    public Float getSoLuong() {
        return soLuong;
    }

    public void setSoLuong(Float soLuong) {
        this.soLuong = soLuong;
    }

    public BigDecimal getDonGia() {
        return donGia;
    }

    public void setDonGia(BigDecimal donGia) {
        this.donGia = donGia;
    }

    public BigDecimal getThanhTien() {
        return thanhTien;
    }

    public void setThanhTien(BigDecimal thanhTien) {
        this.thanhTien = thanhTien;
    }
}
