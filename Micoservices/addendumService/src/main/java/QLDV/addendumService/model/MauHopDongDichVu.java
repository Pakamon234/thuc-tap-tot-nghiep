package QLDV.addendumService.model;

import QLDV.addendumService.util.MauHopDongDichVuId;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;



@Entity
@Table(name = "mauhopdongdichvu")
public class MauHopDongDichVu {

    @EmbeddedId
    private MauHopDongDichVuId id;

    @ManyToOne
    @JoinColumn(name = "mauid", referencedColumnName = "id", insertable = false, updatable = false)
    private MauHopDong mauHopDong;

    @ManyToOne
    @JoinColumn(name = "madichvu", referencedColumnName = "madichvu", insertable = false, updatable = false)
    private DichVu dichVu;

    // Getters and Setters

    public MauHopDongDichVuId getId() {
        return id;
    }

    public void setId(MauHopDongDichVuId id) {
        this.id = id;
    }

    public MauHopDong getMauHopDong() {
        return mauHopDong;
    }

    public void setMauHopDong(MauHopDong mauHopDong) {
        this.mauHopDong = mauHopDong;
    }

    public DichVu getDichVu() {
        return dichVu;
    }

    public void setDichVu(DichVu dichVu) {
        this.dichVu = dichVu;
    }
}
