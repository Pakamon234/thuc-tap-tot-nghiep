package QLDV.contractService.trong_repo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import QLDV.contractService.trong_model.HopDong;

public interface HopDongRepository extends JpaRepository<HopDong, String> {
    Page<HopDong> findByMaCuDan(Long maCuDan, Pageable pageable);
    Page<HopDong> findByMaCuDanAndTrangThai(Long maCuDan, HopDong.TrangThaiHopDong trangThai, Pageable pageable);
}
