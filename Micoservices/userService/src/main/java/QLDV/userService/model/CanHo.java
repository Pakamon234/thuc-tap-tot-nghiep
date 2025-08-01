package QLDV.userService.model;

import jakarta.persistence.*;

@Entity
@Table(name = "CanHo")
public class CanHo {

    @Id
    private String maCanHo;

    @Column(nullable = false)
    private String toaNha;

    @Column(nullable = false)
    private String tang;

    @Column(nullable = false)
    private Float dienTich;

    // Getters/Setters
    public String getMaCanHo() { return maCanHo; }
    public void setMaCanHo(String maCanHo) { this.maCanHo = maCanHo; }

    public String getToaNha() { return toaNha; }
    public void setToaNha(String toaNha) { this.toaNha = toaNha; }

    public String getTang() { return tang; }
    public void setTang(String tang) { this.tang = tang; }

    public Float getDienTich() { return dienTich; }
    public void setDienTich(Float dienTich) { this.dienTich = dienTich; }
}
