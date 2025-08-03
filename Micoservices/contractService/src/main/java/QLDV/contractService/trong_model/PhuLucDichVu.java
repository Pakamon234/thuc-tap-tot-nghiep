package QLDV.contractService.trong_model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "PhuLucDichVu")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhuLucDichVu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String maHopDong;

    @Column(nullable = false)
    private String maDichVu;

    private Integer cauHinhId;

    private Integer goiCuocId;

    @Column(precision = 18, scale = 2)
    private BigDecimal donGiaCoDinh;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TrangThaiPhuLuc trangThai;

    public enum TrangThaiPhuLuc {
        Hoạt_động,
        Ngừng_hoạt_động
    }
}

