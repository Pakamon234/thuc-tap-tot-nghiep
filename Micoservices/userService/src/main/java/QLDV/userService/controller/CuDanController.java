package QLDV.userService.controller;

import QLDV.userService.model.CuDan;
import QLDV.userService.model.CuDan.TrangThaiCuDan;
import QLDV.userService.model.CanHo;
import QLDV.userService.repository.CuDanRepository;
import jakarta.transaction.Transactional;
import QLDV.userService.repository.CanHoRepository;
import QLDV.userService.dto.CuDanDTO;
import QLDV.userService.dto.ResidentListItemDTO;
import QLDV.userService.dto.ThongTinCuDanDTO;
import QLDV.userService.dto.ThongTinCuDanDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

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
// GET /api/cudan?search=&trangThai=&maCanHo=&page=&limit=
    @GetMapping
    public ResponseEntity<?> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false, name = "trangThai") String trangThaiParam, // 'ở' | 'không ở nữa'
            @RequestParam(required = false) String maCanHo,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit
    ) {
        TrangThaiCuDan trangThai = parseTrangThai(trangThaiParam);

        Pageable pageable = PageRequest.of(Math.max(0, page - 1), Math.max(1, limit), Sort.by(Sort.Direction.DESC, "id"));
        Page<CuDan> result = cuDanRepository.searchResidents(
                isBlank(search) ? null : search.trim(),
                isBlank(maCanHo) ? null : maCanHo.trim(),
                trangThai,
                pageable
        );

        List<ResidentListItemDTO> items = result.getContent().stream().map(cd -> {
            String ma = (cd.getCanHo() != null) ? cd.getCanHo().getMaCanHo() : null;
            String tenDN = (cd.getTaiKhoan() != null) ? cd.getTaiKhoan().getUsername() : null;
            String tkt = (cd.getTaiKhoan() != null) ? cd.getTaiKhoan().getStatus() : null;
            Date ngayDK = (cd.getTaiKhoan() != null) ? cd.getTaiKhoan().getNgayDangKy() : null;

            // Hiển thị thân thiện cho enum
            String ttView = (cd.getTrangThai() == TrangThaiCuDan.không_ở_nữa) ? "không ở nữa" : "ở";

            return new ResidentListItemDTO(
                    cd.getId(), cd.getHoTen(), cd.getEmail(), cd.getSoDienThoai(),
                    ma, ttView, tenDN, tkt, ngayDK
            );
        }).toList();

        Map<String, Object> body = new HashMap<>();
        body.put("data", items);
        body.put("pagination", Map.of(
                "page", page,
                "limit", limit,
                "totalPages", result.getTotalPages(),
                "totalItems", result.getTotalElements()
        ));
        return ResponseEntity.ok(body);
    }

    // GET /api/cudan/stats
    @GetMapping("/stats")
    public ResponseEntity<?> stats() {
        long total = cuDanRepository.count();
        long dangO = cuDanRepository.countByTrangThai(TrangThaiCuDan.ở);
        long khongONua = cuDanRepository.countByTrangThai(TrangThaiCuDan.không_ở_nữa);
        long choDuyet = cuDanRepository.countByTaiKhoan_TrangThaiIgnoreCase("Chờ duyệt");
        return ResponseEntity.ok(Map.of(
                "total", total, "dangO", dangO, "khongONua", khongONua, "choDuyet", choDuyet
        ));
    }

    private boolean isBlank(String s) { return s == null || s.trim().isEmpty(); }

    // Map chuỗi từ FE sang enum trong entity (vd: "không ở nữa" -> "không_ở_nữa")
    private TrangThaiCuDan parseTrangThai(String input) {
        if (isBlank(input)) return null;
        String normalized = input.trim().toLowerCase().replace(' ', '_');
        for (TrangThaiCuDan v : TrangThaiCuDan.values()) {
            if (v.name().equalsIgnoreCase(normalized)) return v;
        }
        return null; // nếu không khớp, bỏ qua filter
    }
    // Lấy thông tin cư dân và căn hộ theo ID
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

    // Cập nhật thông tin cư dân
    @PutMapping("/{id}")
    @Transactional
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

        // Kiểm tra nếu mã căn hộ thay đổi
        if (!cuDan.getCanHo().getMaCanHo().equals(dto.getMaCanHo())) {
            // Cập nhật trạng thái tài khoản thành "Chờ duyệt"
            cuDan.getTaiKhoan().setStatus("Chờ duyệt");
        }

        cuDan.setCanHo(optionalCanHo.get());

        // Lưu thay đổi
        cuDanRepository.save(cuDan);

        return ResponseEntity.ok(Map.of("message", "Cập nhật thông tin cư dân thành công"));
    }    

    // Lấy danh sách thông tin cư dân
    @GetMapping("/thong-tin")
    public ResponseEntity<?> getThongTinCuDan() {
        List<CuDan> cuDanList = cuDanRepository.findAll();

        List<ThongTinCuDanDTO> dtoList = cuDanList.stream().map(cd -> {
            String canHoStr = cd.getCanHo().getMaCanHo();
            String email = cd.getTaiKhoan().getUsername();
            String trangThai = cd.getTaiKhoan().getStatus();
            return new ThongTinCuDanDTO(
                    cd.getId(),
                    cd.getHoTen(),
                    canHoStr,
                    email,
                    cd.getSoDienThoai(),
                    trangThai,
                    cd.getTaiKhoan().getNgayDangKy()
            );
        }).toList();

        return ResponseEntity.ok(dtoList);  // Trả về JSON như cũ, nhưng bao trong ResponseEntity
    }

}
