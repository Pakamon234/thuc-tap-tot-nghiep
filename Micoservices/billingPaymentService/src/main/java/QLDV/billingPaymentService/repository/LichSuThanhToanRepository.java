package QLDV.billingPaymentService.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import QLDV.billingPaymentService.model.LichSuThanhToan;

import java.util.List;

public interface LichSuThanhToanRepository extends JpaRepository<LichSuThanhToan, Integer> {
    List<LichSuThanhToan> findByHoaDonId(Integer hoaDonId);
}
