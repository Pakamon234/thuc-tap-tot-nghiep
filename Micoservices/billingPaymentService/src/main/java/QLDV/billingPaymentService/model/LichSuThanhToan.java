package QLDV.billingPaymentService.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "lichsuthanhtoan")
public class LichSuThanhToan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hoadonid", nullable = false)
    private HoaDon hoaDon;

    @Column(name = "sotien", nullable = false)
    private BigDecimal soTien;

    @Enumerated(EnumType.STRING)
    @Column(name = "hinhthuc", nullable = false)
    private HinhThucThanhToan hinhThuc;

    @Column(name = "thoigian", nullable = false, columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime thoiGian;

    @Enumerated(EnumType.STRING)
    @Column(name = "trangthai", nullable = false)
    private TrangThaiThanhToan trangThai;

    @Column(name = "nguoixacnhanid", nullable = false)
    private Integer nguoiXacNhanId;

    public enum HinhThucThanhToan {
        Chuyển_khoản,
        Tiền_mặt
    }

    public enum TrangThaiThanhToan {
        Thành_công,
        Thất_bại
    }

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

    public BigDecimal getSoTien() {
        return soTien;
    }

    public void setSoTien(BigDecimal soTien) {
        this.soTien = soTien;
    }

    public HinhThucThanhToan getHinhThuc() {
        return hinhThuc;
    }

    public void setHinhThuc(HinhThucThanhToan hinhThuc) {
        this.hinhThuc = hinhThuc;
    }

    public LocalDateTime getThoiGian() {
        return thoiGian;
    }

    public void setThoiGian(LocalDateTime thoiGian) {
        this.thoiGian = thoiGian;
    }

    public TrangThaiThanhToan getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(TrangThaiThanhToan trangThai) {
        this.trangThai = trangThai;
    }

    public Integer getNguoiXacNhanId() {
        return nguoiXacNhanId;
    }

    public void setNguoiXacNhanId(Integer nguoiXacNhanId) {
        this.nguoiXacNhanId = nguoiXacNhanId;
    }
}

