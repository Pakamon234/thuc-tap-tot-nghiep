package QLDV.addendumService.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import QLDV.addendumService.model.DichVu;
import QLDV.addendumService.model.DichVu.TrangThai;

public interface DichVuRepository extends JpaRepository<DichVu, String> {
     long countByTrangThai(TrangThai trangThai);
}

