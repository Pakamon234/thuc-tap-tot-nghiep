package QLDV.addendumService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import QLDV.addendumService.model.DichVu;
import QLDV.addendumService.model.GoiCuocDichVu;
import QLDV.addendumService.repository.DichVuRepository;
import QLDV.addendumService.repository.GoiCuocDichVuRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

// @RestController
// @RequestMapping("/api/goicuocdichvu")
// public class GoiCuocDichVuController {

//     @Autowired
//     private GoiCuocDichVuRepository goiCuocDichVuRepository;

//     // Lấy tất cả gói cước dịch vụ
//     @GetMapping
//     public List<GoiCuocDichVu> getAllGoiCuocDichVu() {
//         return goiCuocDichVuRepository.findAll();
//     }

//     // Lấy gói cước dịch vụ theo id
//     @GetMapping("/{id}")
//     public GoiCuocDichVu getGoiCuocDichVuById(@PathVariable int id) {
//         return goiCuocDichVuRepository.findById(id).orElse(null);
//     }

//     // Thêm gói cước dịch vụ mới
//     @PostMapping
//     public GoiCuocDichVu addGoiCuocDichVu(@RequestBody GoiCuocDichVu goiCuocDichVu) {
//         return goiCuocDichVuRepository.save(goiCuocDichVu);
//     }
// }
@RestController
@RequestMapping("/api/goicuocdichvu")
public class GoiCuocDichVuController {

    @Autowired
    private GoiCuocDichVuRepository goiCuocDichVuRepository;

    @Autowired
    private DichVuRepository dichVuRepository;

    // Lấy tất cả
    @GetMapping
    public List<GoiCuocDichVu> getAll() {
        return goiCuocDichVuRepository.findAll();
    }

    // Lấy theo ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable int id) {
        return goiCuocDichVuRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy gói cước"));
    }
    @GetMapping("/service/{serviceId}")
    public ResponseEntity<?> getServicePackagesByServiceId(@PathVariable String serviceId) {
        List<GoiCuocDichVu> servicePackages = goiCuocDichVuRepository.findByDichVu_MaDichVu(serviceId);
        if (!servicePackages.isEmpty()) {
            return ResponseEntity.ok(servicePackages);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy gói cước cho dịch vụ");
        }
    }

    // Thêm mới
    @PostMapping
    public ResponseEntity<?> create(@RequestBody GoiCuocDichVu goiCuoc) {
        String error = validate(goiCuoc);
        if (error != null) return ResponseEntity.badRequest().body(error);

        Optional<DichVu> dv = dichVuRepository.findById(goiCuoc.getDichVu().getMaDichVu());
        if (dv.isEmpty()) return ResponseEntity.badRequest().body("Dịch vụ không tồn tại");

        goiCuoc.setDichVu(dv.get());
        return ResponseEntity.status(HttpStatus.CREATED).body(goiCuocDichVuRepository.save(goiCuoc));
    }

    // Cập nhật
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable int id, @RequestBody GoiCuocDichVu goiCuoc) {
        return goiCuocDichVuRepository.findById(id).map(existing -> {
            String error = validate(goiCuoc);
            if (error != null) return ResponseEntity.badRequest().body(error);

            Optional<DichVu> dv = dichVuRepository.findById(goiCuoc.getDichVu().getMaDichVu());
            if (dv.isEmpty()) return ResponseEntity.badRequest().body("Dịch vụ không tồn tại");

            existing.setTenGoi(goiCuoc.getTenGoi());
            existing.setDonGia(goiCuoc.getDonGia());
            existing.setMoTa(goiCuoc.getMoTa());
            existing.setNgayHieuLuc(goiCuoc.getNgayHieuLuc());
            existing.setTrangThai(goiCuoc.getTrangThai());
            existing.setDichVu(dv.get());

            return ResponseEntity.ok(goiCuocDichVuRepository.save(existing));
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy gói cước để cập nhật"));
    }

    // Xóa
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable int id) {
        return goiCuocDichVuRepository.findById(id).map(g -> {
            goiCuocDichVuRepository.delete(g);
            return ResponseEntity.ok("Đã xóa thành công");
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy gói cước để xóa"));
    }

    // Validate logic
    private String validate(GoiCuocDichVu goi) {
        if (goi.getTenGoi() == null || goi.getTenGoi().isBlank()) return "Tên gói không được để trống";
        if (goi.getDonGia() == null || goi.getDonGia().compareTo(BigDecimal.ZERO) < 0) return "Đơn giá không hợp lệ";
        if (goi.getNgayHieuLuc() == null) return "Ngày hiệu lực không được để trống";

        LocalDate today = LocalDate.now();
        LocalDate ngay = goi.getNgayHieuLuc().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        if (ngay.isBefore(today)) return "Ngày hiệu lực không được nằm trong quá khứ";

        if (goi.getTrangThai() == null) return "Trạng thái không được để trống";
        if (goi.getDichVu() == null || goi.getDichVu().getMaDichVu() == null || goi.getDichVu().getMaDichVu().isBlank())
            return "Mã dịch vụ không được để trống";

        return null;
    }
}
