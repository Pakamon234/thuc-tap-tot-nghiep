package QLDV.addendumService.model;

import java.math.BigDecimal;
import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Table(name = "phulucdichvu")
public class PhuLucDichVu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "mahopdong", nullable = false, length = 255)
    private String maHopDong;

    @ManyToOne
    @JoinColumn(name = "madichvu", referencedColumnName = "madichvu", nullable = false)
    private DichVu dichVu;

    @ManyToOne
    @JoinColumn(name = "cauhinhid", referencedColumnName = "id")
    private CauHinhDichVu cauHinhDichVu;

    @ManyToOne
    @JoinColumn(name = "goicuocid", referencedColumnName = "id")
    private GoiCuocDichVu goiCuocDichVu;

    @Column(name = "dongiacodinh", precision = 18, scale = 2)
    private BigDecimal donGiaCoDinh;

    @Enumerated(EnumType.STRING)
    @Column(name = "trangthai", nullable = false)
    private TrangThai trangThai;

    @Column(name = "ngaybatdau", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date ngayBatDau;

    @Column(name = "ngayketthuc", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date ngayKetThuc;

    @Column(name = "thongtinthem", columnDefinition = "TEXT")
    private String thongTinThem;
    // Getters and Setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getMaHopDong() {
        return maHopDong;
    }

    public void setMaHopDong(String maHopDong) {
        this.maHopDong = maHopDong;
    }

    public DichVu getDichVu() {
        return dichVu;
    }

    public void setDichVu(DichVu dichVu) {
        this.dichVu = dichVu;
    }

    public CauHinhDichVu getCauHinhDichVu() {
        return cauHinhDichVu;
    }

    public void setCauHinhDichVu(CauHinhDichVu cauHinhDichVu) {
        this.cauHinhDichVu = cauHinhDichVu;
    }

    public GoiCuocDichVu getGoiCuocDichVu() {
        return goiCuocDichVu;
    }

    public void setGoiCuocDichVu(GoiCuocDichVu goiCuocDichVu) {
        this.goiCuocDichVu = goiCuocDichVu;
    }

    public BigDecimal getDonGiaCoDinh() {
        return donGiaCoDinh;
    }

    public void setDonGiaCoDinh(BigDecimal donGiaCoDinh) {
        this.donGiaCoDinh = donGiaCoDinh;
    }

    public TrangThai getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(TrangThai trangThai) {
        this.trangThai = trangThai;
    }

    // Enum for trangThai
    public enum TrangThai {
        HoatDong, NgungHoatDong
    }

    public Date getNgayBatDau() {
        return ngayBatDau;
    }

    public void setNgayBatDau(Date ngayBatDau) {
        this.ngayBatDau = ngayBatDau;
    }

    public Date getNgayKetThuc() {
        return ngayKetThuc;
    }

    public void setNgayKetThuc(Date ngayKetThuc) {
        this.ngayKetThuc = ngayKetThuc;
    }

    public String getThongTinThem() {
        return thongTinThem;
    }

    public void setThongTinThem(String thongTinThem) {
        this.thongTinThem = thongTinThem;
    }
}
