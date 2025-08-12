package QLDV.userService.repository;

import QLDV.userService.model.TaiKhoan;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface TaiKhoanRepository extends JpaRepository<TaiKhoan, Long> {
    /**
     * Tìm kiếm một TaiKhoan dựa trên tên đăng nhập.
     * Phương thức này sẽ được Spring Data JPA tự động triển khai.
     * @param tenDangNhap Tên đăng nhập cần tìm.
     * @return Optional chứa TaiKhoan nếu tìm thấy, ngược lại là Optional.empty().
     */
    TaiKhoan findByTenDangNhap(String tenDangNhap);

    /**
     * Kiểm tra xem một tên đăng nhập đã tồn tại hay chưa.
     * @param tenDangNhap Tên đăng nhập cần kiểm tra.
     * @return true nếu tên đăng nhập tồn tại, ngược lại là false.
     */
    boolean existsByTenDangNhap(String tenDangNhap);

    // ⬇⬇⬇ Đổi status -> trangThai (đúng với tên field trong entity)
    long countByTrangThaiIgnoreCase(String trangThai);

    // Lọc danh sách bằng JPQL + tham số tuỳ chọn (không cần JpaSpecificationExecutor)
    @Query("""
      SELECT tk FROM TaiKhoan tk
      WHERE (:search IS NULL OR LOWER(tk.tenDangNhap) LIKE LOWER(CONCAT('%', :search, '%')))
        AND (:loai IS NULL OR LOWER(tk.loaiTaiKhoan) = LOWER(:loai))
        AND (:trangThai IS NULL OR LOWER(tk.trangThai) = LOWER(:trangThai))
      """)
    Page<TaiKhoan> searchAccounts(String search, String loai, String trangThai, Pageable pageable);

}