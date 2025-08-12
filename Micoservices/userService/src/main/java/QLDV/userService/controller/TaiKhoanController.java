package QLDV.userService.controller;

import QLDV.userService.model.TaiKhoan;
import QLDV.userService.repository.TaiKhoanRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;
import java.util.HashMap;
import java.util.Map; // cho Map.of(...)

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus; // cho HttpStatus


@RestController
@RequestMapping("/api/taikhoan")
@RequiredArgsConstructor
public class TaiKhoanController {

    private final TaiKhoanRepository taiKhoanRepository;

// GET /api/taikhoan?search=&loaiTaiKhoan=&trangThai=&page=&limit=
    @GetMapping
    public ResponseEntity<?> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false, name = "loaiTaiKhoan") String loaiTaiKhoan,
            @RequestParam(required = false, name = "trangThai") String trangThai,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit
    ) {
        Pageable pageable = PageRequest.of(Math.max(0, page - 1), Math.max(1, limit),
                Sort.by(Sort.Direction.DESC, "ngayDangKy")); // đổi lại "id" nếu entity không có field này

        Page<TaiKhoan> result = taiKhoanRepository.searchAccounts(
                isBlank(search) ? null : search.trim(),
                isBlank(loaiTaiKhoan) ? null : loaiTaiKhoan.trim(),
                isBlank(trangThai) ? null : trangThai.trim(),
                pageable
        );

        Map<String, Object> body = new HashMap<>();
        body.put("data", result.getContent());
        body.put("pagination", Map.of(
                "page", page,
                "limit", limit,
                "totalPages", result.getTotalPages(),
                "totalItems", result.getTotalElements()
        ));
        return ResponseEntity.ok(body);
    }

    // GET /api/taikhoan/stats
    @GetMapping("/stats")
    public ResponseEntity<?> stats() {
        long total         = taiKhoanRepository.count();
        long choDuyet     = taiKhoanRepository.countByTrangThaiIgnoreCase("Chờ duyệt");
        long dangHoatDong = taiKhoanRepository.countByTrangThaiIgnoreCase("Đang hoạt động");
        long daKhoa       = taiKhoanRepository.countByTrangThaiIgnoreCase("Đã khóa");
        return ResponseEntity.ok(Map.of(
                "total", total,
                "choDuyet", choDuyet,
                "dangHoatDong", dangHoatDong,
                "daKhoa", daKhoa
        ));
    }

    // PATCH /api/taikhoan/{id}/status { "trangThai": "..." }
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newStatus = Optional.ofNullable(body.get("trangThai")).orElse("").trim();
        if (newStatus.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Thiếu 'trangThai'"));
        }
        return taiKhoanRepository.findById(id)
                .map(tk -> {
                    // ⬇⬇⬇ nếu entity có setter là setTrangThai
                    tk.setStatus(newStatus);
                    taiKhoanRepository.save(tk);
                    return ResponseEntity.ok(Map.of("message", "OK", "trangThai", tk.getStatus()));
                })
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("message", "Không tìm thấy tài khoản")));
    }

    private boolean isBlank(String s) { return s == null || s.trim().isEmpty(); }

    @PutMapping("/duyet/{id}")
    @Transactional
    public ResponseEntity<?> xuLyTaiKhoan(@PathVariable Long id, @RequestParam("action") String action) {
        Optional<TaiKhoan> optionalTaiKhoan = taiKhoanRepository.findById(id);

        if (optionalTaiKhoan.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Không tìm thấy tài khoản với ID: " + id));
        }

        TaiKhoan taiKhoan = optionalTaiKhoan.get();

        if (!"Chờ duyệt".equalsIgnoreCase(taiKhoan.getStatus())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Tài khoản không ở trạng thái 'Chờ duyệt', không thể xử lý."));
        }

        if ("duyet".equalsIgnoreCase(action)) {
            taiKhoan.setStatus("Đang hoạt động");
            taiKhoanRepository.save(taiKhoan);
            return ResponseEntity.ok(Map.of("message", "Duyệt tài khoản thành công."));
        } else if ("huy".equalsIgnoreCase(action)) {
            taiKhoan.setStatus("Đã khóa");
            taiKhoanRepository.save(taiKhoan);
            return ResponseEntity.ok(Map.of("message", "Hủy duyệt tài khoản (chuyển sang 'Đã khóa') thành công."));
        } else {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Giá trị action không hợp lệ. Chỉ chấp nhận 'duyet' hoặc 'huy'."));
        }
    }


    // Khóa hoặc mở khóa tài khoản
    @PutMapping("/toggle-khoa/{id}")
    @Transactional
    public ResponseEntity<?> toggleTrangThaiTaiKhoan(@PathVariable Long id) {
        Optional<TaiKhoan> optionalTaiKhoan = taiKhoanRepository.findById(id);

        if (optionalTaiKhoan.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Không tìm thấy tài khoản với ID: " + id));
        }

        TaiKhoan taiKhoan = optionalTaiKhoan.get();
        String currentStatus = taiKhoan.getStatus();

        if ("Đang hoạt động".equalsIgnoreCase(currentStatus)) {
            taiKhoan.setStatus("Đã khóa");
        } else {
            taiKhoan.setStatus("Đang hoạt động");
        }

        taiKhoanRepository.save(taiKhoan);

        return ResponseEntity.ok(Map.of(
                "message", "Cập nhật trạng thái tài khoản thành công",
                "trangThaiMoi", taiKhoan.getStatus()
        ));
    }
}
