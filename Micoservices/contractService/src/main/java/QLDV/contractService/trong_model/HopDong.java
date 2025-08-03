package QLDV.contractService.trong_model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "HopDong")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HopDong {

    @Id
    private String maHopDong;

    @Column(nullable = false)
    private Long maCuDan;

    @Column(nullable = false)
    private Long maNguoiKyBQL;

    @Column(nullable = false)
    private String maCanHo;

    @Column(nullable = false)
    private Integer mauHopDongId;

    @Column(nullable = false)
    private LocalDate ngayKy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TrangThaiHopDong trangThai;

    public enum TrangThaiHopDong {
        Hiệu_lực, Đã_hủy
    }
}
