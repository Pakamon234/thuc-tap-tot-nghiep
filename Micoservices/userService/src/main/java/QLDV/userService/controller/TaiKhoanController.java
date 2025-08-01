package QLDV.userService.controller;

import QLDV.userService.model.TaiKhoan;
import QLDV.userService.repository.TaiKhoanRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;
import java.util.Map; // cho Map.of(...)

import org.springframework.http.HttpStatus; // cho HttpStatus


@RestController
@RequestMapping("/api/taikhoan")
@RequiredArgsConstructor
public class TaiKhoanController {

    private final TaiKhoanRepository taiKhoanRepository;

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
