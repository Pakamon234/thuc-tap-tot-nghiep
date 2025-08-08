package QLDV.contractService.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import QLDV.contractService.model.HopDong;

@Repository
public interface HopDongRepository extends JpaRepository<HopDong, String> {
    List<HopDong> findByMaCuDan(int maCuDan);  // Tìm hợp đồng theo mã cư dân
}
