package QLDV.addendumService.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "mauhopdong")
public class MauHopDong {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "tenmau", nullable = false, length = 255)
    private String tenMau;

    @Column(name = "mota", columnDefinition = "TEXT")
    private String moTa;

    @Column(name = "dieukhoanchinh", columnDefinition = "TEXT")
    private String dieuKhoanChinh;

    // Getters and Setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTenMau() {
        return tenMau;
    }

    public void setTenMau(String tenMau) {
        this.tenMau = tenMau;
    }

    public String getMoTa() {
        return moTa;
    }

    public void setMoTa(String moTa) {
        this.moTa = moTa;
    }

    public String getDieuKhoanChinh() {
        return dieuKhoanChinh;
    }

    public void setDieuKhoanChinh(String dieuKhoanChinh) {
        this.dieuKhoanChinh = dieuKhoanChinh;
    }
}

