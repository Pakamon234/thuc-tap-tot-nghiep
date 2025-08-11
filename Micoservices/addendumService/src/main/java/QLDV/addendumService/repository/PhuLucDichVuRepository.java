package QLDV.addendumService.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import QLDV.addendumService.model.PhuLucDichVu;

public interface PhuLucDichVuRepository extends JpaRepository<PhuLucDichVu, Integer> {

    @Query("SELECT p FROM PhuLucDichVu p WHERE p.maHopDong = :maHopDong AND :today BETWEEN p.ngayBatDau AND p.ngayKetThuc")
    List<PhuLucDichVu> findDangHieuLucByMaHopDong(@Param("maHopDong") String maHopDong, @Param("today") Date today);

    @Query("SELECT p FROM PhuLucDichVu p WHERE p.maHopDong = :maHopDong AND p.ngayKetThuc < :today")
    List<PhuLucDichVu> findPhuLucHetHan(@Param("maHopDong") String maHopDong, @Param("today") Date today);

    @Query("SELECT p FROM PhuLucDichVu p WHERE p.maHopDong = :maHopDong AND p.ngayKetThuc BETWEEN :today AND :soon")
    List<PhuLucDichVu> findPhuLucSapHetHan(@Param("maHopDong") String maHopDong, @Param("today") Date today,
            @Param("soon") Date soon);

    boolean existsByDichVu_MaDichVu(String maDichVu);

    boolean existsByDichVu_MaDichVuAndNgayKetThucAfter(String maDichVu, Date date);

    @Query("SELECT p FROM PhuLucDichVu p JOIN FETCH p.dichVu WHERE p.maHopDong = :maHopDong")
    List<PhuLucDichVu> findByMaHopDongWithDichVu(@Param("maHopDong") String maHopDong);
}
