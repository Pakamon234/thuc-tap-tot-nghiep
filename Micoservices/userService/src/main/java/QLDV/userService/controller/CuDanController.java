package QLDV.userService.controller;

import QLDV.userService.model.CuDan;
import QLDV.userService.model.CanHo;
import QLDV.userService.repository.CuDanRepository;
import QLDV.userService.repository.CanHoRepository;
import QLDV.userService.dto.CuDanDTO;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;
import org.springframework.http.HttpStatus;



import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/cudan")
public class CuDanController {

    @Autowired
    private CuDanRepository cuDanRepository;

    @Autowired
    private CanHoRepository canHoRepository;

    @GetMapping("/{id}")
    public ResponseEntity<?> getThongTinCuDanVaCanHo(@PathVariable Long id) {
        CuDan cuDan = cuDanRepository.findById(id).orElse(null);

        if (cuDan == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Không tìm thấy cư dân với ID: " + id));
        }

        CanHo canHo = cuDan.getCanHo(); // vì đã có mapping @ManyToOne

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Lấy thông tin thành công");

        // Dữ liệu cư dân
        Map<String, Object> cuDanData = new HashMap<>();
        cuDanData.put("id", cuDan.getId());
        cuDanData.put("hoTen", cuDan.getHoTen());
        cuDanData.put("email", cuDan.getEmail());
        cuDanData.put("soDienThoai", cuDan.getSoDienThoai());
        cuDanData.put("ngaySinh", cuDan.getNgaySinh());
        cuDanData.put("diaChi", cuDan.getDiaChi());
        cuDanData.put("cccd", cuDan.getCCCD());
        cuDanData.put("trangThai", cuDan.getTrangThai());

        // Dữ liệu căn hộ
        Map<String, Object> canHoData = new HashMap<>();
        canHoData.put("maCanHo", canHo.getMaCanHo());
        canHoData.put("toaNha", canHo.getToaNha());
        canHoData.put("tang", canHo.getTang());
        canHoData.put("dienTich", canHo.getDienTich());

        response.put("cuDan", cuDanData);
        response.put("canHo", canHoData);

        return ResponseEntity.ok(response);
    }

   @PutMapping("/api/cudan/{id}")
    public ResponseEntity<?> updateCuDan(@PathVariable Long id, @RequestBody CuDanDTO dto) {
        Optional<CuDan> optionalCuDan = cuDanRepository.findById(id);
        if (optionalCuDan.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Không tìm thấy cư dân với id: " + id));
        }

        CuDan cuDan = optionalCuDan.get();

        // Cập nhật thông tin cơ bản
        cuDan.setHoTen(dto.getHoTen());
        cuDan.setEmail(dto.getEmail());
        cuDan.setSoDienThoai(dto.getSoDienThoai());
        cuDan.setCCCD(dto.getCccd());
        cuDan.setDiaChi(dto.getDiaChi());

        // Chuyển đổi String -> Enum (có xử lý lỗi)
        try {
            CuDan.TrangThaiCuDan trangThai = CuDan.TrangThaiCuDan.valueOf(dto.getTrangThai());
            cuDan.setTrangThai(trangThai);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Giá trị trạng thái không hợp lệ (ở | không_ở_nữa)"));
        }

        // Convert ngày sinh (có xử lý lỗi)
        try {
            LocalDate localDate = LocalDate.parse(dto.getNgaySinh());
            Date date = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
            cuDan.setNgaySinh(date);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Ngày sinh không hợp lệ. Định dạng yyyy-MM-dd"));
        }


        // Kiểm tra mã căn hộ
        Optional<CanHo> optionalCanHo = canHoRepository.findById(dto.getMaCanHo());
        if (optionalCanHo.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Không tìm thấy căn hộ với mã: " + dto.getMaCanHo()));
        }

        cuDan.setCanHo(optionalCanHo.get());

        // Lưu thay đổi
        cuDanRepository.save(cuDan);

        return ResponseEntity.ok(Map.of("message", "Cập nhật thông tin cư dân thành công"));
    }

    
}
