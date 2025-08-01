package QLDV.userService.controller;

import QLDV.userService.model.TaiKhoan;
import QLDV.userService.repository.TaiKhoanRepository;
import QLDV.userService.util.PasswordUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private TaiKhoanRepository taiKhoanRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        System.out.println("==> Bắt đầu xử lý đăng nhập");
        System.out.println("Tên đăng nhập: " + request.getUsername());
        System.out.println("Mật khẩu nhập vào (raw): " + request.getPassword());

        TaiKhoan user = taiKhoanRepository.findByTenDangNhap(request.getUsername());

        if (user == null) {
            System.out.println("Không tìm thấy tài khoản!");
            return ResponseEntity.status(401).body(Map.of("message", "Tên đăng nhập/mật khẩu sai"));
        }

        System.out.println("Tài khoản tìm được: " + user.getUsername());
        System.out.println("Hash trong DB: " + user.getPassword());

        boolean passwordMatch = PasswordUtil.matches(request.getPassword(), user.getPassword());
        System.out.println("Kết quả kiểm tra mật khẩu khớp: " + passwordMatch);

        if (!passwordMatch) {
            System.out.println("Mật khẩu không đúng!");
            return ResponseEntity.status(401).body(Map.of("message", "Tên đăng nhập/mật khẩu sai"));
        }

        if (user.isLocked()) {
            System.out.println("🔒ài khoản đã bị khóa (trạng thái: " + user.getStatus() + ")");
            return ResponseEntity.status(403).body(Map.of("message", "Tài khoản bị khóa"));
        }

        System.out.println("Đăng nhập thành công!");

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Đăng nhập thành công");
        response.put("id", user.getId());
        response.put("loaiTaiKhoan", user.getLoaiTaiKhoan());

        return ResponseEntity.ok(response);
    }

    // DTO cho request đăng nhập
    public static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}
