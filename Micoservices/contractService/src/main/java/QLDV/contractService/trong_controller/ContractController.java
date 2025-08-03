package QLDV.contractService.trong_controller;

import QLDV.contractService.trong_dto.ContractSummaryDTO;
import QLDV.contractService.trong_service.ContractService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contracts")
@RequiredArgsConstructor
public class ContractController {

    private final ContractService contractService;

    /**
     * API 1.1: Xem danh sách hợp đồng cư dân đã ký
     * Endpoint: GET /api/contracts/resident/{maCuDan}
     */
    @GetMapping("/resident/{maCuDan}")
    public ResponseEntity<Page<ContractSummaryDTO>> getContractsByResident(
            @PathVariable Long maCuDan,
            @RequestParam(value = "trangThai", required = false) String trangThai,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        Page<ContractSummaryDTO> contracts = contractService.getContractsByResident(maCuDan, trangThai, page, size);
        return ResponseEntity.ok(contracts);
    }
}

