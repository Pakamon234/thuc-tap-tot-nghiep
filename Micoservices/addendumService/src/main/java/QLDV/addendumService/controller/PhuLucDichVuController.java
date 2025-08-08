package QLDV.addendumService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import QLDV.addendumService.model.PhuLucDichVu;
import QLDV.addendumService.repository.CauHinhDichVuRepository;
import QLDV.addendumService.repository.DichVuRepository;
import QLDV.addendumService.repository.GoiCuocDichVuRepository;
import QLDV.addendumService.repository.PhuLucDichVuRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

// @RestController
// @RequestMapping("/api/phulucdichvu")
// public class PhuLucDichVuController {

//     @Autowired
//     private PhuLucDichVuRepository phuLucDichVuRepository;

//     // Lấy tất cả phụ lục dịch vụ
//     @GetMapping
//     public List<PhuLucDichVu> getAllPhuLucDichVu() {
//         return phuLucDichVuRepository.findAll();
//     }

//     // Lấy phụ lục dịch vụ theo id
//     @GetMapping("/{id}")
//     public PhuLucDichVu getPhuLucDichVuById(@PathVariable int id) {
//         return phuLucDichVuRepository.findById(id).orElse(null);
//     }

//     // Thêm phụ lục dịch vụ mới
//     @PostMapping
//     public PhuLucDichVu addPhuLucDichVu(@RequestBody PhuLucDichVu phuLucDichVu) {
//         return phuLucDichVuRepository.save(phuLucDichVu);
//     }
// }
// 
@RestController
@RequestMapping("/api/phulucdichvu")
public class PhuLucDichVuController {

    @Autowired
    private PhuLucDichVuRepository repository;

    @Autowired
    private DichVuRepository dichVuRepository;

    @Autowired
    private CauHinhDichVuRepository cauHinhDichVuRepository;

    @Autowired
    private GoiCuocDichVuRepository goiCuocDichVuRepository;

    // Lấy tất cả
    @GetMapping
    public List<PhuLucDichVu> getAll() {
        return repository.findAll();
    }

    // Lấy theo ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable int id) {
        return repository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy phụ lục dịch vụ"));
    }

    // Thêm mới
    @PostMapping
    public ResponseEntity<?> create(@RequestBody PhuLucDichVu pl) {
        String error = validate(pl);
        if (error != null)
            return ResponseEntity.badRequest().body(error);

        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(pl));
    }

    // Cập nhật
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable int id, @RequestBody PhuLucDichVu pl) {
        return repository.findById(id).map(existing -> {
            String error = validate(pl);
            if (error != null)
                return ResponseEntity.badRequest().body(error);

            pl.setId(id); // giữ ID cũ
            return ResponseEntity.ok(repository.save(pl));
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy phụ lục để cập nhật"));
    }

    // Xoá
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable int id) {
        return repository.findById(id).map(pl -> {
            LocalDate today = LocalDate.now();
            LocalDate batDau = pl.getNgayBatDau().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
            LocalDate ketThuc = pl.getNgayKetThuc().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

            if ((today.isEqual(batDau) || today.isAfter(batDau))
                    && (today.isBefore(ketThuc) || today.isEqual(ketThuc))) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Không thể xoá phụ lục khi đang còn hiệu lực");
            }

            repository.delete(pl);
            return ResponseEntity.ok("Xoá thành công");
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy phụ lục để xoá"));
    }

    @GetMapping("/hieuluc/{maHopDong}")
    public ResponseEntity<?> getPhuLucDangHieuLuc(@PathVariable String maHopDong) {
        Date today = new Date(); // thời gian hiện tại
        List<PhuLucDichVu> list = repository.findDangHieuLucByMaHopDong(maHopDong, today);
        if (list.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Không có phụ lục nào đang hiệu lực cho hợp đồng: " + maHopDong);
        }
        return ResponseEntity.ok(list);
    }

    @GetMapping("/quahan/{maHopDong}")
    public ResponseEntity<?> getPhuLucHetHan(@PathVariable String maHopDong) {
        Date today = new Date();
        List<PhuLucDichVu> result = repository.findPhuLucHetHan(maHopDong, today);
        if (result.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không có phụ lục nào đã hết hạn");
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/saphethan/{maHopDong}")
    public ResponseEntity<?> getPhuLucSapHetHan(@PathVariable String maHopDong) {
        LocalDate todayLocal = LocalDate.now();
        LocalDate soonLocal = todayLocal.plusDays(30);

        Date today = Date.from(todayLocal.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date soon = Date.from(soonLocal.atStartOfDay(ZoneId.systemDefault()).toInstant());

        List<PhuLucDichVu> result = repository.findPhuLucSapHetHan(maHopDong, today, soon);
        if (result.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Không có phụ lục nào sắp hết hạn trong 3 ngày tới");
        }
        return ResponseEntity.ok(result);
    }

    // Kiểm tra logic đầu vào
    private String validate(PhuLucDichVu pl) {
        if (pl.getMaHopDong() == null || pl.getMaHopDong().isBlank())
            return "Mã hợp đồng không được để trống";

        if (pl.getDichVu() == null || pl.getDichVu().getMaDichVu() == null ||
                !dichVuRepository.existsById(pl.getDichVu().getMaDichVu()))
            return "Dịch vụ không tồn tại";

        if (pl.getCauHinhDichVu() != null && pl.getCauHinhDichVu().getId() != 0 &&
                !cauHinhDichVuRepository.existsById(pl.getCauHinhDichVu().getId()))
            return "Cấu hình dịch vụ không tồn tại";

        if (pl.getGoiCuocDichVu() != null && pl.getGoiCuocDichVu().getId() != 0 &&
                !goiCuocDichVuRepository.existsById(pl.getGoiCuocDichVu().getId()))
            return "Gói cước dịch vụ không tồn tại";

        if (pl.getDonGiaCoDinh() != null && pl.getDonGiaCoDinh().compareTo(BigDecimal.ZERO) < 0)
            return "Đơn giá cố định không được âm";

        if (pl.getTrangThai() == null)
            return "Trạng thái không được để trống";

        if (pl.getNgayBatDau() == null)
            return "Ngày bắt đầu không được để trống";

        if (pl.getNgayKetThuc() == null)
            return "Ngày kết thúc không được để trống";

        if (pl.getNgayKetThuc().before(pl.getNgayBatDau()))
            return "Ngày kết thúc không được nhỏ hơn ngày bắt đầu";

        return null;
    }
}
