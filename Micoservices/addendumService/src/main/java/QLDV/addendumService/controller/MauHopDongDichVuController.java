package QLDV.addendumService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import QLDV.addendumService.model.MauHopDongDichVu;
import QLDV.addendumService.repository.DichVuRepository;
import QLDV.addendumService.repository.MauHopDongDichVuRepository;
import QLDV.addendumService.repository.MauHopDongRepository;
import QLDV.addendumService.util.MauHopDongDichVuId;

import java.util.List;

// @RestController
// @RequestMapping("/api/mauhopdongdichvu")
// public class MauHopDongDichVuController {

//     @Autowired
//     private MauHopDongDichVuRepository mauHopDongDichVuRepository;

//     // Lấy tất cả mẫu hợp đồng dịch vụ
//     @GetMapping
//     public List<MauHopDongDichVu> getAllMauHopDongDichVu() {
//         return mauHopDongDichVuRepository.findAll();
//     }

//     // Lấy mẫu hợp đồng dịch vụ theo mauId và maDichVu
//     @GetMapping("/{mauId}/{maDichVu}")
//     public MauHopDongDichVu getMauHopDongDichVuById(@PathVariable int mauId, @PathVariable String maDichVu) {
//         MauHopDongDichVuId id = new MauHopDongDichVuId();
//         id.setMauHopDong(mauId);
//         id.setMaDichVu(maDichVu);
//         return mauHopDongDichVuRepository.findById(id).orElse(null);
//     }

//     // Thêm mẫu hợp đồng dịch vụ mới
//     @PostMapping
//     public MauHopDongDichVu addMauHopDongDichVu(@RequestBody MauHopDongDichVu mauHopDongDichVu) {
//         return mauHopDongDichVuRepository.save(mauHopDongDichVu);
//     }
// }
@RestController
@RequestMapping("/api/mauhopdongdichvu")
public class MauHopDongDichVuController {

    @Autowired
    private MauHopDongDichVuRepository repository;

    @Autowired
    private MauHopDongRepository mauHopDongRepository;

    @Autowired
    private DichVuRepository dichVuRepository;

    // Lấy tất cả
    @GetMapping
    public List<MauHopDongDichVu> getAll() {
        return repository.findAll();
    }

    // Lấy theo ID (mauId + maDichVu)
    @GetMapping("/{mauId}/{maDichVu}")
    public ResponseEntity<?> getById(@PathVariable int mauId, @PathVariable String maDichVu) {
        MauHopDongDichVuId id = new MauHopDongDichVuId();
        id.setMauHopDong(mauId);
        id.setMaDichVu(maDichVu);

        return repository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy liên kết mẫu - dịch vụ"));
    }

    // Thêm liên kết mẫu - dịch vụ
    @PostMapping
    public ResponseEntity<?> add(@RequestBody MauHopDongDichVu entity) {
        if (entity.getId() == null || entity.getId().getMauId() == 0 || entity.getId().getMaDichVu() == null) {
            return ResponseEntity.badRequest().body("Vui lòng cung cấp đầy đủ mã mẫu hợp đồng và mã dịch vụ");
        }

        MauHopDongDichVuId id = entity.getId();

        if (!mauHopDongRepository.existsById(id.getMauId())) {
            return ResponseEntity.badRequest().body("Mẫu hợp đồng không tồn tại");
        }

        if (!dichVuRepository.existsById(id.getMaDichVu())) {
            return ResponseEntity.badRequest().body("Dịch vụ không tồn tại");
        }

        if (repository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Liên kết đã tồn tại");
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(entity));
    }

    // Xoá liên kết mẫu - dịch vụ
    @DeleteMapping("/{mauId}/{maDichVu}")
    public ResponseEntity<?> delete(@PathVariable int mauId, @PathVariable String maDichVu) {
        MauHopDongDichVuId id = new MauHopDongDichVuId();
        id.setMauHopDong(mauId);
        id.setMaDichVu(maDichVu);

        if (!repository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy liên kết để xoá");
        }

        repository.deleteById(id);
        return ResponseEntity.ok("Xoá liên kết thành công");
    }
}

