package QLDV.addendumService.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import QLDV.addendumService.model.ThamSoPhi;

public interface ThamSoPhiRepository extends JpaRepository<ThamSoPhi, Integer> {

    List<ThamSoPhi> findByCauHinhDichVu_Id(int configurationId);
}
