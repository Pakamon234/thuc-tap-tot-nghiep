package QLDV.addendumService.util;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;



@Embeddable
public class MauHopDongDichVuId implements Serializable {

    @Column(name = "mauid")
    private int mauId;

    @Column(name = "madichvu")
    private String maDichVu;

    // Getters, Setters, Equals, and HashCode methods

    public int getMauId() {
        return mauId;
    }

    public void setMauHopDong(int mauId) {
        this.mauId = mauId;
    }

    public String getMaDichVu() {
        return maDichVu;
    }

    public void setMaDichVu(String maDichVu) {
        this.maDichVu = maDichVu;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MauHopDongDichVuId that = (MauHopDongDichVuId) o;
        return mauId == that.mauId && maDichVu.equals(that.maDichVu);
    }

    @Override
    public int hashCode() {
        return 31 * mauId + maDichVu.hashCode();
    }
}
