package QLDV.addendumService.controller;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import QLDV.addendumService.model.DichVu;
import QLDV.addendumService.model.MauHopDong;
import QLDV.addendumService.model.MauHopDongDichVu;
import QLDV.addendumService.model.PhuLucDichVu;
import QLDV.addendumService.repository.MauHopDongDichVuRepository;
import QLDV.addendumService.repository.MauHopDongRepository;
import QLDV.addendumService.repository.PhuLucDichVuRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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

    @Autowired
    private PhuLucDichVuRepository phuLucDichVuRepository;

    // Lấy mẫu hợp đồng mới nhất
    @GetMapping("/latest")
    public Map<String, Object> getLatestMauHopDongWithServices() {
        // 1. Lấy mẫu hợp đồng mới nhất
        MauHopDong latestMau = mauHopDongRepository.findTopByOrderByIdDesc();
        if (latestMau == null) {
            throw new RuntimeException("Không tìm thấy mẫu hợp đồng");
        }

        // 2. Lấy danh sách dịch vụ kèm theo
        List<MauHopDongDichVu> dichVuList = mauHopDongDichVuRepository.findById_MauId(latestMau.getId());

        List<DichVu> dsDichVu = new ArrayList<>();
        for (MauHopDongDichVu mhdDv : dichVuList) {
            dsDichVu.add(mhdDv.getDichVu());
        }

        // 3. Ghép thành response JSON
        Map<String, Object> response = new HashMap<>();
        response.put("mauHopDong", latestMau);
        response.put("danhSachDichVu", dsDichVu);

        return response;
    }

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

    private static final Logger logger = LoggerFactory.getLogger(MauHopDongController.class);
    
    // Lấy chi tiết hợp đồng theo ID mẫu và mã hợp đồng
    @GetMapping("/detail")
    public ResponseEntity<?> getHopDongChiTiet(
            @RequestParam int idMauHopDong,
            @RequestParam String maHopDong) {

        // Lấy mẫu hợp đồng
        Optional<MauHopDong> mauOpt = mauHopDongRepository.findById(idMauHopDong);
        if (mauOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Không tìm thấy mẫu hợp đồng id: " + idMauHopDong);
        }
        MauHopDong mau = mauOpt.get();

        // Lấy danh sách phụ lục dịch vụ của hợp đồng
        List<PhuLucDichVu> dsPhuLuc = phuLucDichVuRepository.findByMaHopDongWithDichVu(maHopDong);

        // Kiểm tra danh sách PhuLucDichVu lấy được
        logger.info("Số phụ lục dịch vụ tìm thấy: {}", dsPhuLuc.size());

        // Phân loại dịch vụ dựa vào trường batBuoc trong DichVu
        List<DichVu> dichVuBatBuoc = dsPhuLuc.stream()
            .map(PhuLucDichVu::getDichVu)
            .filter(dv -> {
                logger.info("Dịch vụ: {} - bắt buộc: {}", dv.getMaDichVu(), dv.isBatBuoc());
                return dv.isBatBuoc();
            })
            .distinct()
            .collect(Collectors.toList());

        List<DichVu> dichVuThuyChon = dsPhuLuc.stream()
            .map(PhuLucDichVu::getDichVu)
            .filter(dv -> !dv.isBatBuoc())
            .distinct()
            .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("mauHopDong", mau);
        response.put("dichVuBatBuoc", dichVuBatBuoc);
        response.put("dichVuThuyChon", dichVuThuyChon);

        return ResponseEntity.ok(response);
    }
}


