package QLDV.userService.repository;

import QLDV.userService.model.CuDan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CuDanRepository extends JpaRepository<CuDan, Long> {
    // tự động có phương thức findById(id)
}
