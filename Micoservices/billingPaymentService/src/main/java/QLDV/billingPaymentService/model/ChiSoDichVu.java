package QLDV.billingPaymentService.model;

import jakarta.persistence.*;

@Entity
@Table(name = "chisodichvu")
public class ChiSoDichVu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "macanho", nullable = false)
    private String maCanHo;

    @Column(name = "madichvu", nullable = false)
    private String maDichVu;

    @Column(name = "thang", nullable = false)
    private String thang;

    @Column(name = "chisocu", nullable = false)
    private Float chiSoCu;

    @Column(name = "chisomoi", nullable = false)
    private Float chiSoMoi;

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getMaCanHo() {
        return maCanHo;
    }

    public void setMaCanHo(String maCanHo) {
        this.maCanHo = maCanHo;
    }

    public String getMaDichVu() {
        return maDichVu;
    }

    public void setMaDichVu(String maDichVu) {
        this.maDichVu = maDichVu;
    }

    public String getThang() {
        return thang;
    }

    public void setThang(String thang) {
        this.thang = thang;
    }

    public Float getChiSoCu() {
        return chiSoCu;
    }

    public void setChiSoCu(Float chiSoCu) {
        this.chiSoCu = chiSoCu;
    }

    public Float getChiSoMoi() {
        return chiSoMoi;
    }

    public void setChiSoMoi(Float chiSoMoi) {
        this.chiSoMoi = chiSoMoi;
    }
}
