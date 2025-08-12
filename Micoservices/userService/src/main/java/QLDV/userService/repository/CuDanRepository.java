package QLDV.userService.repository;

import QLDV.userService.model.CuDan;
import QLDV.userService.model.CuDan.TrangThaiCuDan;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CuDanRepository extends JpaRepository<CuDan, Long> {
    // tự động có phương thức findById(id)
    boolean existsByCccd(String cccd);

    long countByTrangThai(TrangThaiCuDan trangThai);

    // ⬇⬇⬇ Đổi nested property status -> trangThai
    long countByTaiKhoan_TrangThaiIgnoreCase(String trangThai);

    @Query("""
      SELECT cd FROM CuDan cd
        LEFT JOIN cd.canHo ch
        LEFT JOIN cd.taiKhoan tk
      WHERE (:search IS NULL OR
            LOWER(cd.hoTen)       LIKE LOWER(CONCAT('%', :search, '%')) OR
            LOWER(cd.email)       LIKE LOWER(CONCAT('%', :search, '%')) OR
            LOWER(cd.soDienThoai) LIKE LOWER(CONCAT('%', :search, '%')) OR
            LOWER(cd.cccd)        LIKE LOWER(CONCAT('%', :search, '%')))
        AND (:maCanHo IS NULL OR ch.maCanHo = :maCanHo)
        AND (:trangThai IS NULL OR cd.trangThai = :trangThai)
      """)
    Page<CuDan> searchResidents(String search, String maCanHo, TrangThaiCuDan trangThai, Pageable pageable);
}
