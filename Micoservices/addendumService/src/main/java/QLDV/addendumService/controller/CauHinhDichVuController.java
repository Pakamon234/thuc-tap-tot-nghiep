package QLDV.addendumService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import QLDV.addendumService.model.CauHinhDichVu;
import QLDV.addendumService.model.DichVu;
import QLDV.addendumService.repository.CauHinhDichVuRepository;
import QLDV.addendumService.repository.DichVuRepository;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

// @RestController
// @RequestMapping("/api/cauhinhdichvu")
// public class CauHinhDichVuController {

//     @Autowired
//     private CauHinhDichVuRepository cauHinhDichVuRepository;

//     // Lấy tất cả cấu hình dịch vụ
//     @GetMapping
//     public List<CauHinhDichVu> getAllCauHinhDichVu() {
//         return cauHinhDichVuRepository.findAll();
//     }

//     // Lấy cấu hình dịch vụ theo id
//     @GetMapping("/{id}")
//     public CauHinhDichVu getCauHinhDichVuById(@PathVariable int id) {
//         return cauHinhDichVuRepository.findById(id).orElse(null);
//     }

//     // Thêm cấu hình dịch vụ mới
//     @PostMapping
//     public CauHinhDichVu addCauHinhDichVu(@RequestBody CauHinhDichVu cauHinhDichVu) {
//         return cauHinhDichVuRepository.save(cauHinhDichVu);
//     }
// }
@RestController
@RequestMapping("/api/cauhinhdichvu")
public class CauHinhDichVuController {

    @Autowired
    private CauHinhDichVuRepository cauHinhDichVuRepository;

    @Autowired
    private DichVuRepository dichVuRepository;

    // Lấy tất cả
    @GetMapping
    public List<CauHinhDichVu> getAll() {
        return cauHinhDichVuRepository.findAll();
    }

    // Lấy theo ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable int id) {
        Optional<CauHinhDichVu> optional = cauHinhDichVuRepository.findById(id);
        if (optional.isPresent()) {
            return ResponseEntity.ok(optional.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy cấu hình");
        }
    }
// Get configurations by service ID (maDichVu)
    @GetMapping("/service/{serviceId}")
    public ResponseEntity<?> getConfigurationsByServiceId(@PathVariable String serviceId) {
        List<CauHinhDichVu> configurations = cauHinhDichVuRepository.findByDichVu_MaDichVu(serviceId);
        if (!configurations.isEmpty()) {
            return ResponseEntity.ok(configurations);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy cấu hình cho dịch vụ");
        }
    }
    // THÊM mới
    @PostMapping
    public ResponseEntity<?> create(@RequestBody CauHinhDichVu cauHinh) {
        System.out.println("Received maDichVu: " + cauHinh.getDichVu());

        String validationError = validate(cauHinh);
        if (validationError != null) {
            return ResponseEntity.badRequest().body(validationError);
        }

        // Kiểm tra mã dịch vụ tồn tại
        Optional<DichVu> dichVuOpt = dichVuRepository.findById(cauHinh.getDichVu().getMaDichVu());
        if (dichVuOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Dịch vụ không tồn tại");
        }

        cauHinh.setDichVu(dichVuOpt.get());
        return ResponseEntity.status(HttpStatus.CREATED).body(cauHinhDichVuRepository.save(cauHinh));
    }

    // CẬP NHẬT
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable int id, @RequestBody CauHinhDichVu cauHinh) {
        return cauHinhDichVuRepository.findById(id).map(existing -> {
            String validationError = validate(cauHinh);
            if (validationError != null) {
                return ResponseEntity.badRequest().body(validationError);
            }

            Optional<DichVu> dichVuOpt = dichVuRepository.findById(cauHinh.getDichVu().getMaDichVu());
            if (dichVuOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Dịch vụ không tồn tại");
            }

            existing.setTenCauHinh(cauHinh.getTenCauHinh());
            existing.setNgayHieuLuc(cauHinh.getNgayHieuLuc());
            existing.setDichVu(dichVuOpt.get());

            return ResponseEntity.ok(cauHinhDichVuRepository.save(existing));
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy cấu hình để cập nhật"));
    }

    // XÓA
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable int id) {
        return cauHinhDichVuRepository.findById(id).map(existing -> {
            cauHinhDichVuRepository.delete(existing);
            return ResponseEntity.ok("Xóa cấu hình thành công");
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy cấu hình để xóa"));
    }

    // VALIDATION chung
    private String validate(CauHinhDichVu cauHinh) {
        if (cauHinh.getTenCauHinh() == null || cauHinh.getTenCauHinh().isBlank()) {
            return "Tên cấu hình không được để trống";
        }
        if (cauHinh.getNgayHieuLuc() == null) {
            return "Ngày hiệu lực không được để trống";
        }
        // Check ngày hiệu lực không nằm trong quá khứ
        LocalDate today = LocalDate.now();
        LocalDate ngay = cauHinh.getNgayHieuLuc().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        if (ngay.isBefore(today)) {
            return "Ngày hiệu lực không được nằm trong quá khứ";
        }

        if (cauHinh.getDichVu() == null || cauHinh.getDichVu().getMaDichVu() == null
                || cauHinh.getDichVu().getMaDichVu().isBlank()) {
            return "Mã dịch vụ không được để trống";
        }

        return null;
    }
}
