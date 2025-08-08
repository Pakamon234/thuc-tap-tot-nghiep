package QLDV.billingPaymentService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import QLDV.billingPaymentService.model.LichSuThanhToan;
import QLDV.billingPaymentService.repository.LichSuThanhToanRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/lichsuthanhtoan")
public class LichSuThanhToanController {

    @Autowired
    private LichSuThanhToanRepository lichSuThanhToanRepository;

    // Lấy tất cả lịch sử thanh toán
    @GetMapping("/")
    public ResponseEntity<List<LichSuThanhToan>> getAllLichSuThanhToan() {
        List<LichSuThanhToan> lichSuThanhToans = lichSuThanhToanRepository.findAll();
        return ResponseEntity.ok(lichSuThanhToans);
    }

    // Lấy lịch sử thanh toán theo ID hóa đơn
    @GetMapping("/hoadon/{hoaDonId}")
    public ResponseEntity<List<LichSuThanhToan>> getLichSuThanhToanByHoaDonId(@PathVariable("hoaDonId") Integer hoaDonId) {
        List<LichSuThanhToan> lichSuThanhToans = lichSuThanhToanRepository.findByHoaDonId(hoaDonId);
        if (lichSuThanhToans.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(lichSuThanhToans);
    }

    // Lấy lịch sử thanh toán theo ID
    @GetMapping("/{id}")
    public ResponseEntity<LichSuThanhToan> getLichSuThanhToanById(@PathVariable("id") Integer id) {
        Optional<LichSuThanhToan> lichSuThanhToan = lichSuThanhToanRepository.findById(id);
        if (lichSuThanhToan.isPresent()) {
            return ResponseEntity.ok(lichSuThanhToan.get());
        }
        return ResponseEntity.notFound().build();
    }
}
