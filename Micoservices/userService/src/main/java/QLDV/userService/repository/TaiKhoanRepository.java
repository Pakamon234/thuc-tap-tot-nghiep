package QLDV.userService.repository;

import QLDV.userService.model.TaiKhoan;
import org.springframework.data.jpa.repository.JpaRepository;

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
}