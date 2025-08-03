package QLDV.contractService.trong_dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContractSummaryDTO {
    private String maHopDong;
    private LocalDate ngayKy;
    private String trangThai;
    private String maCanHo;
    private String tenMauHopDong;
    private Integer tongSoDichVu;
}

