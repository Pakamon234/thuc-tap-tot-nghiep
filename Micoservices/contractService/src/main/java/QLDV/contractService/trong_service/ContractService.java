package QLDV.contractService.trong_service;

import org.springframework.data.domain.Pageable;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import QLDV.contractService.trong_client.MauHopDongClient;
import QLDV.contractService.trong_dto.ContractSummaryDTO;
import QLDV.contractService.trong_model.HopDong;
import QLDV.contractService.trong_model.PhuLucDichVu;
import QLDV.contractService.trong_repo.HopDongRepository;
import QLDV.contractService.trong_repo.PhuLucDichVuRepository;


@Service
@RequiredArgsConstructor
public class ContractService {

    private final HopDongRepository hopDongRepository;
    private final PhuLucDichVuRepository phuLucDichVuRepository;
    private final MauHopDongClient mauHopDongClient;

    public Page<ContractSummaryDTO> getContractsByResident(Long maCuDan, String trangThaiStr, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<HopDong> hopDongs;

        if (trangThaiStr != null) {
            HopDong.TrangThaiHopDong trangThai = HopDong.TrangThaiHopDong.valueOf(trangThaiStr.replace(" ", "_"));
            hopDongs = hopDongRepository.findByMaCuDanAndTrangThai(maCuDan, trangThai, pageable);
        } else {
            hopDongs = hopDongRepository.findByMaCuDan(maCuDan, pageable);
        }

        return hopDongs.map(hd -> {
            String tenMau = mauHopDongClient.getTenMauHopDong(hd.getMauHopDongId());
            int soDichVu = phuLucDichVuRepository.countByMaHopDong(hd.getMaHopDong());
            return new ContractSummaryDTO(
                hd.getMaHopDong(),
                hd.getNgayKy(),
                hd.getTrangThai().name().replace("_", " "),
                hd.getMaCanHo(),
                tenMau,
                soDichVu
            );
        });
    }
}

