// QLDV.userService.dto.ThongTinCuDanDTO.java
package QLDV.userService.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;

@Data
@AllArgsConstructor
public class ThongTinCuDanDTO {
    private Long id;
    private String hoTen;
    private String canHo;
    private String email;
    private String soDienThoai;
    private String trangThaiTaiKhoan;
    private Date ngayDangKy;
}
