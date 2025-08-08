package QLDV.contractService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import QLDV.contractService.model.HopDong;
import QLDV.contractService.repository.HopDongRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/hopdong")
public class HopDongController {

    @Autowired
    private HopDongRepository hopDongRepository;

    // Lấy tất cả hợp đồng
    @GetMapping
    public ResponseEntity<?> getAllHopDong() {
        return ResponseEntity.ok(hopDongRepository.findAll());
    }

    // Lấy hợp đồng theo mã hợp đồng
    @GetMapping("/{maHopDong}")
    public ResponseEntity<?> getHopDongById(@PathVariable String maHopDong) {
        Optional<HopDong> hopDong = hopDongRepository.findById(maHopDong);
        if (hopDong.isPresent()) {
            return ResponseEntity.ok(hopDong.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Hợp đồng không tồn tại");
        }
    }

    // Lấy hợp đồng theo mã cư dân
    @GetMapping("/byCuDan/{maCuDan}")
    public ResponseEntity<?> getHopDongByCuDan(@PathVariable int maCuDan) {
        List<HopDong> hopDongs = hopDongRepository.findByMaCuDan(maCuDan);
        if (!hopDongs.isEmpty()) {
            return ResponseEntity.ok(hopDongs);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy hợp đồng cho cư dân có mã: " + maCuDan);
        }
    }

    // Thêm hợp đồng mới
    @PostMapping
    public ResponseEntity<?> addHopDong(@RequestBody HopDong hopDong) {
        // Kiểm tra các trường bắt buộc
        if (hopDong.getMaCanHo() == null || hopDong.getMaCanHo().isBlank()) {
            return ResponseEntity.badRequest().body("Mã căn hộ không được để trống");
        }
        if (hopDong.getNgayKy() == null) {
            return ResponseEntity.badRequest().body("Ngày ký không được để trống");
        }
        if (hopDong.getMauHopDongId() == null) {
            return ResponseEntity.badRequest().body("Vui lòng chọn mẫu hợp đồng");
        }

        // Tạo mã hợp đồng mới theo mẫu HDxxxxx (xxxx là số tự động tăng)
        String newMaHopDong = generateNewMaHopDong();
        hopDong.setMaHopDong(newMaHopDong);

        // Lưu hợp đồng mới
        hopDong.setTrangThai(HopDong.TrangThaiHopDong.Chờ_duyệt); // Mặc định hợp đồng có trạng thái "Hiệu lực"
        HopDong savedHopDong = hopDongRepository.save(hopDong);
        return ResponseEntity.ok(savedHopDong);
    }

    // Cập nhật hợp đồng
    @PutMapping("/{maHopDong}")
    public ResponseEntity<?> updateHopDong(@PathVariable String maHopDong, @RequestBody HopDong updatedHopDong) {
        Optional<HopDong> existingHopDongOpt = hopDongRepository.findById(maHopDong);
        if (!existingHopDongOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Hợp đồng không tồn tại");
        }

        HopDong existingHopDong = existingHopDongOpt.get();
        System.out.println(existingHopDong.getMaHopDong());
        System.out.println(updatedHopDong.getMaHopDong());

        // Kiểm tra mã hợp đồng không được phép thay đổi
        if (!existingHopDong.getMaHopDong().equals(updatedHopDong.getMaHopDong())) {
            return ResponseEntity.badRequest().body("Mã hợp đồng không được sửa");
        }

        // Kiểm tra dữ liệu
        if (updatedHopDong.getMaCanHo() == null || updatedHopDong.getMaCanHo().isEmpty()) {
            return ResponseEntity.badRequest().body("Mã căn hộ không được để trống");
        }
        if (updatedHopDong.getNgayKy() == null || updatedHopDong.getTrangThai() == null) {
            return ResponseEntity.badRequest().body("Ngày ký và trạng thái hợp đồng không được để trống");
        }

        // Cập nhật thông tin hợp đồng
        existingHopDong.setMaCanHo(updatedHopDong.getMaCanHo());
        existingHopDong.setMauHopDongId(updatedHopDong.getMauHopDongId());
        existingHopDong.setNgayKy(updatedHopDong.getNgayKy());
        existingHopDong.setTrangThai(updatedHopDong.getTrangThai());
        if (updatedHopDong.getNgayKetThuc() != null) {
            existingHopDong.setNgayKetThuc(updatedHopDong.getNgayKetThuc());
        }

        hopDongRepository.save(existingHopDong);
        return ResponseEntity.ok(existingHopDong);
    }

    // Xóa hợp đồng
    @DeleteMapping("/{maHopDong}")
    public ResponseEntity<?> deleteHopDong(@PathVariable String maHopDong) {
        Optional<HopDong> hopDongOpt = hopDongRepository.findById(maHopDong);

        if (!hopDongOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Hợp đồng không tồn tại");
        }

        HopDong hopDong = hopDongOpt.get();

        // Kiểm tra nếu hợp đồng còn thời hạn thì không được xóa
        if (hopDong.getTrangThai() == HopDong.TrangThaiHopDong.Hiệu_lực && hopDong.getNgayKetThuc().isAfter(java.time.LocalDate.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Không thể xóa hợp đồng khi còn thời hạn.");
        }

        hopDongRepository.delete(hopDong);
        return ResponseEntity.ok("Hợp đồng đã được xóa.");
    }
    // API duyệt hợp đồng với JSON trong body
    @PutMapping("/duyet/{maHopDong}")
    public ResponseEntity<?> duyetHopDong(@PathVariable String maHopDong, @RequestBody DuyetHopDongRequest request) {
        Optional<HopDong> hopDongOpt = hopDongRepository.findById(maHopDong);

        if (!hopDongOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Hợp đồng không tồn tại");
        }

        HopDong hopDong = hopDongOpt.get();

        // Kiểm tra hợp đồng phải có trạng thái "Chờ duyệt"
        if (!hopDong.getTrangThai().equals(HopDong.TrangThaiHopDong.Chờ_duyệt)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Chỉ hợp đồng có trạng thái 'Chờ duyệt' mới có thể duyệt");
        }

        // Cập nhật thông tin khi duyệt
        hopDong.setMaNguoiKyBQL(request.getMaNguoiKyBQL());  // Ghi mã BQL
        hopDong.setMaCanHo(request.getMaCanHo());            // Ghi mã căn hộ
        hopDong.setTrangThai(HopDong.TrangThaiHopDong.Hiệu_lực);  // Chuyển trạng thái thành "Hiệu lực"

        hopDongRepository.save(hopDong);

        return ResponseEntity.ok("Hợp đồng đã được duyệt và chuyển sang trạng thái 'Hiệu lực'");
    }
    
    // Lớp yêu cầu JSON (Request body)
    public static class DuyetHopDongRequest {
        private int maNguoiKyBQL;
        private String maCanHo;

        // Getters and Setters
        public int getMaNguoiKyBQL() {
            return maNguoiKyBQL;
        }

        public void setMaNguoiKyBQL(int maNguoiKyBQL) {
            this.maNguoiKyBQL = maNguoiKyBQL;
        }

        public String getMaCanHo() {
            return maCanHo;
        }

        public void setMaCanHo(String maCanHo) {
            this.maCanHo = maCanHo;
        }
    }

    // Hàm sinh mã hợp đồng tự động theo mẫu HDxxxxx
    private String generateNewMaHopDong() {
        int nextId = hopDongRepository.findAll().size() + 1; // Đếm số lượng hợp đồng hiện có và cộng thêm 1
        return "HD" + String.format("%05d", nextId); // Tạo mã hợp đồng theo mẫu HDxxxxx
    }
}