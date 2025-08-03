package QLDV.contractService.trong_repo;

import org.springframework.data.jpa.repository.JpaRepository;

import QLDV.contractService.trong_model.PhuLucDichVu;

public interface PhuLucDichVuRepository extends JpaRepository<PhuLucDichVu, Long> {
    int countByMaHopDong(String maHopDong);
}

