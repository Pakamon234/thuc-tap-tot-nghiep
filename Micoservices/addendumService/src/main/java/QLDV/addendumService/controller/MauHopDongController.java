package QLDV.addendumService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import QLDV.addendumService.model.MauHopDong;
import QLDV.addendumService.repository.MauHopDongDichVuRepository;
import QLDV.addendumService.repository.MauHopDongRepository;

import java.util.List;

// @RestController
// @RequestMapping("/api/mauhopdong")
// public class MauHopDongController {

//     @Autowired
//     private MauHopDongRepository mauHopDongRepository;

//     // Lấy tất cả mẫu hợp đồng
//     @GetMapping
//     public List<MauHopDong> getAllMauHopDong() {
//         return mauHopDongRepository.findAll();
//     }

//     // Lấy mẫu hợp đồng theo id
//     @GetMapping("/{id}")
//     public MauHopDong getMauHopDongById(@PathVariable int id) {
//         return mauHopDongRepository.findById(id).orElse(null);
//     }

//     // Thêm mẫu hợp đồng mới
//     @PostMapping
//     public MauHopDong addMauHopDong(@RequestBody MauHopDong mauHopDong) {
//         return mauHopDongRepository.save(mauHopDong);
//     }
// }
@RestController
@RequestMapping("/api/mauhopdong")
public class MauHopDongController {

    @Autowired
    private MauHopDongRepository mauHopDongRepository;

    @Autowired
    private MauHopDongDichVuRepository mauHopDongDichVuRepository;

    // Lấy tất cả
    @GetMapping
    public List<MauHopDong> getAll() {
        return mauHopDongRepository.findAll();
    }

    // Lấy theo ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable int id) {
        return mauHopDongRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy mẫu hợp đồng"));
    }

    // Thêm mới
    @PostMapping
    public ResponseEntity<?> create(@RequestBody MauHopDong mau) {
        if (mau.getTenMau() == null || mau.getTenMau().isBlank()) {
            return ResponseEntity.badRequest().body("Tên mẫu hợp đồng không được để trống");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(mauHopDongRepository.save(mau));
    }

    // Cập nhật
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable int id, @RequestBody MauHopDong mau) {
        return mauHopDongRepository.findById(id).map(existing -> {
            if (mau.getTenMau() == null || mau.getTenMau().isBlank()) {
                return ResponseEntity.badRequest().body("Tên mẫu hợp đồng không được để trống");
            }

            existing.setTenMau(mau.getTenMau());
            existing.setMoTa(mau.getMoTa());
            existing.setDieuKhoanChinh(mau.getDieuKhoanChinh());

            return ResponseEntity.ok(mauHopDongRepository.save(existing));
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy mẫu hợp đồng để cập nhật"));
    }

    // Xoá (có kiểm tra liên kết với dịch vụ)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable int id) {
        return mauHopDongRepository.findById(id).map(mau -> {
            boolean isUsed = mauHopDongDichVuRepository.existsById_MauId(id);
            if (isUsed) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Không thể xóa vì mẫu hợp đồng đang được liên kết với dịch vụ");
            }

            mauHopDongRepository.deleteById(id);
            return ResponseEntity.ok("Xóa mẫu hợp đồng thành công");
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy mẫu hợp đồng để xóa"));
    }
}


