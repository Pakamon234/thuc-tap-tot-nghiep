package QLDV.addendumService.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "thamsophi")
public class ThamSoPhi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @ManyToOne
    @JoinColumn(name = "cauhinhid", referencedColumnName = "id", nullable = false)
    private CauHinhDichVu cauHinhDichVu;

    @Column(name = "ten", nullable = false, length = 255)
    private String ten;

    @Column(name = "giatritu", nullable = false, precision = 18, scale = 4)
    private BigDecimal giaTriTu;

    @Column(name = "giatriden", nullable = false, precision = 18, scale = 4)
    private BigDecimal giaTriDen;

    @Column(name = "dongia", nullable = false, precision = 18, scale = 2)
    private BigDecimal donGia;

    // Getters and Setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public CauHinhDichVu getCauHinhDichVu() {
        return cauHinhDichVu;
    }

    public void setCauHinhDichVu(CauHinhDichVu cauHinhDichVu) {
        this.cauHinhDichVu = cauHinhDichVu;
    }

    public String getTen() {
        return ten;
    }

    public void setTen(String ten) {
        this.ten = ten;
    }

    public BigDecimal getGiaTriTu() {
        return giaTriTu;
    }

    public void setGiaTriTu(BigDecimal giaTriTu) {
        this.giaTriTu = giaTriTu;
    }

    public BigDecimal getGiaTriDen() {
        return giaTriDen;
    }

    public void setGiaTriDen(BigDecimal giaTriDen) {
        this.giaTriDen = giaTriDen;
    }

    public BigDecimal getDonGia() {
        return donGia;
    }

    public void setDonGia(BigDecimal donGia) {
        this.donGia = donGia;
    }
}
