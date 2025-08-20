package QLDV.addendumService.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import QLDV.addendumService.model.GoiCuocDichVu;

public interface GoiCuocDichVuRepository extends JpaRepository<GoiCuocDichVu, Integer> {

    boolean existsByDichVu_MaDichVu(String maDichVu);

    List<GoiCuocDichVu> findByDichVu_MaDichVu(String serviceId);
}
