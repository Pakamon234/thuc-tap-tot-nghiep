package QLDV.addendumService.model;


import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "dichvu")
public class DichVu {

    @Id
    @Column(name = "madichvu", length = 255)
    private String maDichVu;

    @Column(name = "tendichvu", nullable = false, length = 255)
    private String tenDichVu;

    @Column(name = "donvitinh", length = 50)
    private String donViTinh;

    @Column(name = "mota", columnDefinition = "TEXT")
    private String moTa;

    @Enumerated(EnumType.STRING)
    @Column(name = "loaitinhphi", nullable = false)
    private LoaiTinhPhi loaiTinhPhi;

    @Column(name = "batbuoc", nullable = false)
    private boolean batBuoc = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "trangthai", nullable = false)
    private TrangThai trangThai;

    // Getters and Setters

    public String getMaDichVu() {
        return maDichVu;
    }

    public void setMaDichVu(String maDichVu) {
        this.maDichVu = maDichVu;
    }

    public String getTenDichVu() {
        return tenDichVu;
    }

    public void setTenDichVu(String tenDichVu) {
        this.tenDichVu = tenDichVu;
    }

    public String getDonViTinh() {
        return donViTinh;
    }

    public void setDonViTinh(String donViTinh) {
        this.donViTinh = donViTinh;
    }

    public String getMoTa() {
        return moTa;
    }

    public void setMoTa(String moTa) {
        this.moTa = moTa;
    }

    public LoaiTinhPhi getLoaiTinhPhi() {
        return loaiTinhPhi;
    }

    public void setLoaiTinhPhi(LoaiTinhPhi loaiTinhPhi) {
        this.loaiTinhPhi = loaiTinhPhi;
    }

    public boolean isBatBuoc() {
        return batBuoc;
    }

    public void setBatBuoc(boolean batBuoc) {
        this.batBuoc = batBuoc;
    }

    public TrangThai getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(TrangThai trangThai) {
        this.trangThai = trangThai;
    }

    // Enum for loaiTinhPhi
    public enum LoaiTinhPhi {
        TheoChiSo, CoDinh, GoiCuoc
    }

    // Enum for trangThai
    public enum TrangThai {
        HoatDong, NgungHoatDong
    }

}
