package QLDV.userService.controller;

import QLDV.userService.dto.DangKyCuDanRequest;
import QLDV.userService.model.CuDan;
import QLDV.userService.model.TaiKhoan;
import QLDV.userService.model.CanHo;
import QLDV.userService.repository.CuDanRepository;
import QLDV.userService.repository.TaiKhoanRepository;
import QLDV.userService.repository.CanHoRepository;
import QLDV.userService.util.PasswordUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import java.time.ZoneId;
import java.util.Date;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dangky")
@RequiredArgsConstructor
public class DangKyController {

    private final TaiKhoanRepository taiKhoanRepository;
    private final CuDanRepository cuDanRepository;
    private final CanHoRepository canHoRepository;

    @PostMapping
    @Transactional
    public ResponseEntity<?> dangKyCuDan(@RequestBody DangKyCuDanRequest req) {
        if (taiKhoanRepository.existsByTenDangNhap(req.getTenDangNhap())) {
            return ResponseEntity.badRequest().body("Tên đăng nhập đã tồn tại.");
        }

        // Tạo tài khoản
        TaiKhoan tk = new TaiKhoan();
        tk.setUsername(req.getTenDangNhap());
        tk.setPassword(PasswordUtil.hashPassword(req.getMatKhau()));  // ← dùng PasswordUtil ở đây
        tk.setLoaiTaiKhoan("CuDan");
        tk.setStatus("Chờ duyệt");
        tk.setNgayDangKy(new Date());

        // Lưu tài khoản trước để có ID
        TaiKhoan taiKhoanSaved = taiKhoanRepository.save(tk);

        // Kiểm tra mã căn hộ
        CanHo canHo = canHoRepository.findById(req.getCanHoId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy căn hộ"));

        if (cuDanRepository.existsByCccd(req.getCccd())) {
            return ResponseEntity.badRequest().body("CCCD đã được đăng ký.");
        }

        // Kiểm tra định dạng email
        if (req.getEmail() == null || !req.getEmail().matches("^[A-Za-z0-9._%+-]+@gmail\\.com$")) {
            return ResponseEntity.badRequest().body("Email không hợp lệ. Chỉ chấp nhận địa chỉ @gmail.com");
        }


        // Tạo cư dân
        CuDan cd = new CuDan();
        cd.setTaiKhoan(taiKhoanSaved);
        cd.setHoTen(req.getHoTen());
        cd.setEmail(req.getEmail());
        cd.setCCCD(req.getCccd());          // ← thêm dòng này
        cd.setDiaChi(req.getDiaChi());      // ← và dòng này
        cd.setSoDienThoai(req.getSoDienThoai());
        cd.setNgaySinh(Date.from(req.getNgaySinh().atStartOfDay(ZoneId.systemDefault()).toInstant()));
        cd.setTrangThai(CuDan.TrangThaiCuDan.ở);  // ← enum cần viết hoa nếu đúng theo định nghĩa
        cd.setCanHo(canHo);

        cuDanRepository.save(cd);

        return ResponseEntity.ok("Đăng ký thành công. Vui lòng chờ duyệt.");
    }
}
