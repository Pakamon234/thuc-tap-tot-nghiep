package QLDV.addendumService.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import QLDV.addendumService.model.GoiCuocDichVu;

import java.util.List;

public interface GoiCuocDichVuRepository extends JpaRepository<GoiCuocDichVu, Integer> {

    boolean existsByDichVu_MaDichVu(String maDichVu);
    List<GoiCuocDichVu> findByDichVu_MaDichVu(String maDichVu);
}
