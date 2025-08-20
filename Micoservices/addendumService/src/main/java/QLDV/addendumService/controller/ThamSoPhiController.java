package QLDV.addendumService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import QLDV.addendumService.model.ThamSoPhi;
import QLDV.addendumService.repository.CauHinhDichVuRepository;
import QLDV.addendumService.repository.ThamSoPhiRepository;

import java.math.BigDecimal;
import java.util.List;

// @RestController
// @RequestMapping("/api/thamsophi")
// public class ThamSoPhiController {

//     @Autowired
//     private ThamSoPhiRepository thamSoPhiRepository;

//     // Lấy tất cả tham số phí
//     @GetMapping
//     public List<ThamSoPhi> getAllThamSoPhi() {
//         return thamSoPhiRepository.findAll();
//     }

//     // Lấy tham số phí theo id
//     @GetMapping("/{id}")
//     public ThamSoPhi getThamSoPhiById(@PathVariable int id) {
//         return thamSoPhiRepository.findById(id).orElse(null);
//     }

//     // Thêm tham số phí mới
//     @PostMapping
//     public ThamSoPhi addThamSoPhi(@RequestBody ThamSoPhi thamSoPhi) {
//         return thamSoPhiRepository.save(thamSoPhi);
//     }
// }
@RestController
@RequestMapping("/api/thamsophi")
public class ThamSoPhiController {

    @Autowired
    private ThamSoPhiRepository thamSoPhiRepository;

    @Autowired
    private CauHinhDichVuRepository cauHinhDichVuRepository;

    // Lấy tất cả
    @GetMapping
    public List<ThamSoPhi> getAll() {
        return thamSoPhiRepository.findAll();
    }

    // Lấy theo ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable int id) {
        return thamSoPhiRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy tham số phí"));
    }

    // Thêm mới
    @PostMapping
    public ResponseEntity<?> create(@RequestBody ThamSoPhi thamSoPhi) {
        String error = validate(thamSoPhi);
        if (error != null) return ResponseEntity.badRequest().body(error);

        int cauHinhId = thamSoPhi.getCauHinhDichVu().getId();
        if (!cauHinhDichVuRepository.existsById(cauHinhId)) {
            return ResponseEntity.badRequest().body("Cấu hình dịch vụ không tồn tại");
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(thamSoPhiRepository.save(thamSoPhi));
    }
// Get fee parameters by configuration ID
    @GetMapping("/configuration/{cauHinhId}")
    public ResponseEntity<?> getFeeParametersByConfigurationId(@PathVariable int cauHinhId) {
        List<ThamSoPhi> feeParameters = thamSoPhiRepository.findByCauHinhDichVu_Id(cauHinhId);  // Adjust to use cauHinhId
        if (!feeParameters.isEmpty()) {
            return ResponseEntity.ok(feeParameters);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy tham số phí cho cấu hình");
        }
    }
    // Cập nhật
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable int id, @RequestBody ThamSoPhi thamSoPhi) {
        return thamSoPhiRepository.findById(id).map(existing -> {
            String error = validate(thamSoPhi);
            if (error != null) return ResponseEntity.badRequest().body(error);

            int cauHinhId = thamSoPhi.getCauHinhDichVu().getId();
            if (!cauHinhDichVuRepository.existsById(cauHinhId)) {
                return ResponseEntity.badRequest().body("Cấu hình dịch vụ không tồn tại");
            }

            existing.setTen(thamSoPhi.getTen());
            existing.setGiaTriTu(thamSoPhi.getGiaTriTu());
            existing.setGiaTriDen(thamSoPhi.getGiaTriDen());
            existing.setDonGia(thamSoPhi.getDonGia());
            existing.setCauHinhDichVu(thamSoPhi.getCauHinhDichVu());

            return ResponseEntity.ok(thamSoPhiRepository.save(existing));
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy tham số phí để cập nhật"));
    }

    // Xoá
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable int id) {
        return thamSoPhiRepository.findById(id).map(ts -> {
            thamSoPhiRepository.delete(ts);
            return ResponseEntity.ok("Xoá thành công");
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy tham số phí để xoá"));
    }

    // Kiểm tra logic đầu vào
    private String validate(ThamSoPhi t) {
        if (t.getTen() == null || t.getTen().isBlank()) return "Tên không được để trống";
        if (t.getGiaTriTu() == null || t.getGiaTriTu().compareTo(BigDecimal.ZERO) < 0) return "Giá trị từ không hợp lệ";
        if (t.getGiaTriDen() == null || t.getGiaTriDen().compareTo(t.getGiaTriTu()) < 0) return "Giá trị đến phải lớn hơn hoặc bằng giá trị từ";
        if (t.getDonGia() == null || t.getDonGia().compareTo(BigDecimal.ZERO) < 0) return "Đơn giá không hợp lệ";
        if (t.getCauHinhDichVu() == null || t.getCauHinhDichVu().getId() == 0) return "Cấu hình dịch vụ không được để trống";
        return null;
    }
}

