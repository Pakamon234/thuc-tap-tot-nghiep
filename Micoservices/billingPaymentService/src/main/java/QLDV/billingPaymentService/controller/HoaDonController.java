package QLDV.billingPaymentService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import QLDV.billingPaymentService.model.HoaDon;
import QLDV.billingPaymentService.repository.HoaDonRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/hoadon")
public class HoaDonController {

    @Autowired
    private HoaDonRepository hoaDonRepository;

    // Lấy tất cả hóa đơn
    @GetMapping("/")
    public ResponseEntity<List<HoaDon>> getAllHoaDon() {
        List<HoaDon> hoaDons = hoaDonRepository.findAll();
        return ResponseEntity.ok(hoaDons);
    }

    // Lấy hóa đơn theo mã cư dân
    @GetMapping("/cudan/{maCuDan}")
    public ResponseEntity<List<HoaDon>> getHoaDonByMaCuDan(@PathVariable("maCuDan") Long maCuDan) {
        List<HoaDon> hoaDons = hoaDonRepository.findByMaCuDan(maCuDan);
        if (hoaDons.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(hoaDons);
    }

    // Lấy hóa đơn theo ID
    @GetMapping("/{id}")
    public ResponseEntity<HoaDon> getHoaDonById(@PathVariable("id") Integer id) {
        Optional<HoaDon> hoaDon = hoaDonRepository.findById(id);
        if (hoaDon.isPresent()) {
            return ResponseEntity.ok(hoaDon.get());
        }
        return ResponseEntity.notFound().build();
    }
}
