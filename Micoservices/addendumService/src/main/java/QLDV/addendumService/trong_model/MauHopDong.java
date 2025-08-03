package QLDV.addendumService.trong_model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "MauHopDong")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MauHopDong {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String tenMau;

    private String moTa;

    private String dieuKhoanChinh;
}
