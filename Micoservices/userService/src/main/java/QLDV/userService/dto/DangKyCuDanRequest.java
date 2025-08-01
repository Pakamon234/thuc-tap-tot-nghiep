package QLDV.userService.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class DangKyCuDanRequest {
    private String tenDangNhap;
    private String matKhau;
    private String hoTen;
    private String email;
    private String soDienThoai;
    private String canHoId;
    private LocalDate ngaySinh;
}
