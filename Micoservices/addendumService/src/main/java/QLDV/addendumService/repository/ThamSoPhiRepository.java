package QLDV.addendumService.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import QLDV.addendumService.model.ThamSoPhi;

import java.util.List;

public interface ThamSoPhiRepository extends JpaRepository<ThamSoPhi, Integer> {
    List<ThamSoPhi> findByCauHinhDichVu_Id(int cauHinhDichVuId);
}
