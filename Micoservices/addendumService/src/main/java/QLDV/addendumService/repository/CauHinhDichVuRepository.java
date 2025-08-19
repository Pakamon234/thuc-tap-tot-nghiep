package QLDV.addendumService.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import QLDV.addendumService.model.CauHinhDichVu;

import java.util.List;

public interface CauHinhDichVuRepository extends JpaRepository<CauHinhDichVu, Integer> {

    boolean existsByDichVu_MaDichVu(String maDichVu);
    List<CauHinhDichVu> findByDichVu_MaDichVu(String maDichVu);
}

