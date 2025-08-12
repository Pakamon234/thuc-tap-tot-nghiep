package QLDV.userService.repository;

import QLDV.userService.model.CanHo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Giao diện Repository cho entity CanHo.
 * Mở rộng JpaRepository để có sẵn các phương thức CRUD cơ bản.
 * Khóa chính của CanHo là String (maCanHo).
 */
@Repository
public interface CanHoRepository extends JpaRepository<CanHo, String> {
    // Spring Data JPA sẽ tự động cung cấp các phương thức CRUD như save(), findById(), deleteById(), findAll()
    // Không cần thêm phương thức tùy chỉnh nào ở đây cho các hoạt động cơ bản.
    Optional<CanHo> findByMaCanHo(String maCanHo); // Tìm căn hộ theo maCanHo
}
