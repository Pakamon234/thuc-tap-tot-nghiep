package QLDV.billingPaymentService.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import QLDV.billingPaymentService.model.HoaDon;

import java.util.List;

public interface HoaDonRepository extends JpaRepository<HoaDon, Integer> {
    List<HoaDon> findByMaCuDan(Long maCuDan);
}
