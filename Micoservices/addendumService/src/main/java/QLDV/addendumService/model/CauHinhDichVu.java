package QLDV.addendumService.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

import java.util.Date;

@Entity
@Table(name = "cauhinhdichvu")
public class CauHinhDichVu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "tencauhinh", nullable = false, length = 255)
    private String tenCauHinh;

    @Column(name = "ngayhieuluc", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date ngayHieuLuc;

    @ManyToOne
    @JoinColumn(name = "madichvu", referencedColumnName = "madichvu", nullable = false)
    private DichVu dichVu;

    // Getters and Setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTenCauHinh() {
        return tenCauHinh;
    }

    public void setTenCauHinh(String tenCauHinh) {
        this.tenCauHinh = tenCauHinh;
    }

    public Date getNgayHieuLuc() {
        return ngayHieuLuc;
    }

    public void setNgayHieuLuc(Date ngayHieuLuc) {
        this.ngayHieuLuc = ngayHieuLuc;
    }

    public DichVu getDichVu() {
        return dichVu;
    }

    public void setDichVu(DichVu dichVu) {
        this.dichVu = dichVu;
    }
}
