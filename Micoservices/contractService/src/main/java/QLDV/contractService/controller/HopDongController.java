package QLDV.contractService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import QLDV.contractService.model.HopDong;
import QLDV.contractService.repository.HopDongRepository;
import jakarta.transaction.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/hopdong")
public class HopDongController {
    private final WebClient.Builder webClientBuilder;
    private static final Logger logger = LoggerFactory.getLogger(HopDongController.class);

    @Autowired
    public HopDongController(WebClient.Builder webClientBuilder) {
        this.webClientBuilder = webClientBuilder;
    }

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
        if (hopDong.getMaCanHo() == null || hopDong.getMaCanHo().isBlank()) {
            return ResponseEntity.badRequest().body("Mã căn hộ không được để trống");
        }
        if (hopDong.getNgayKy() == null) {
            return ResponseEntity.badRequest().body("Ngày ký không được để trống");
        }
        if (hopDong.getMauHopDongId() == null) {
            return ResponseEntity.badRequest().body("Vui lòng chọn mẫu hợp đồng");
        }

        String newMaHopDong = generateNewMaHopDong();
        hopDong.setMaHopDong(newMaHopDong);
        hopDong.setTrangThai(HopDong.TrangThaiHopDong.Chờ_duyệt);
        HopDong savedHopDong = hopDongRepository.save(hopDong);

        return ResponseEntity.ok(savedHopDong);
    }

    // Duyệt hợp đồng
    @PutMapping("/duyet/{maHopDong}")
    public ResponseEntity<?> duyetHopDong(@PathVariable String maHopDong, @RequestBody DuyetHopDongRequest request) {
        Optional<HopDong> hopDongOpt = hopDongRepository.findById(maHopDong);

        if (!hopDongOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Hợp đồng không tồn tại");
        }

        HopDong hopDong = hopDongOpt.get();

        if (!hopDong.getTrangThai().equals(HopDong.TrangThaiHopDong.Chờ_duyệt)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Chỉ hợp đồng có trạng thái 'Chờ duyệt' mới có thể duyệt");
        }

        hopDong.setMaNguoiKyBQL(request.getMaNguoiKyBQL());
        hopDong.setTrangThai(HopDong.TrangThaiHopDong.Hiệu_lực);
        hopDongRepository.save(hopDong);

        return ResponseEntity.ok("Hợp đồng đã được duyệt và chuyển sang trạng thái 'Hiệu lực'");
    }

    // Giả sử phương thức generateNewMaHopDong
    private String generateNewMaHopDong() {
        long count = hopDongRepository.count();
        return String.format("HD%05d", count + 1);
    }

    // DTO for approving contract
    public static class DuyetHopDongRequest {
        private int maNguoiKyBQL;

        public int getMaNguoiKyBQL() {
            return maNguoiKyBQL;
        }

        public void setMaNguoiKyBQL(int maNguoiKyBQL) {
            this.maNguoiKyBQL = maNguoiKyBQL;
        }
    }

    // Other DTOs (unchanged from your code)
    public static class PhuLucDichVuDTO {
        private String maHopDong;
        private String maDichVu;
        private int cauHinhId;
        private int goiCuocId;
        private BigDecimal donGiaCoDinh;
        private String trangThai;
        private Date ngayBatDau;
        private Date ngayKetThuc;
        private String thongTinThem;

        public String getMaHopDong() { return maHopDong; }
        public void setMaHopDong(String maHopDong) { this.maHopDong = maHopDong; }
        public String getMaDichVu() { return maDichVu; }
        public void setMaDichVu(String maDichVu) { this.maDichVu = maDichVu; }
        public int getCauHinhId() { return cauHinhId; }
        public void setCauHinhId(int cauHinhId) { this.cauHinhId = cauHinhId; }
        public int getGoiCuocId() { return goiCuocId; }
        public void setGoiCuocId(int goiCuocId) { this.goiCuocId = goiCuocId; }
        public BigDecimal getDonGiaCoDinh() { return donGiaCoDinh; }
        public void setDonGiaCoDinh(BigDecimal donGiaCoDinh) { this.donGiaCoDinh = donGiaCoDinh; }
        public String getTrangThai() { return trangThai; }
        public void setTrangThai(String trangThai) { this.trangThai = trangThai; }
        public Date getNgayBatDau() { return ngayBatDau; }
        public void setNgayBatDau(Date ngayBatDau) { this.ngayBatDau = ngayBatDau; }
        public Date getNgayKetThuc() { return ngayKetThuc; }
        public void setNgayKetThuc(Date ngayKetThuc) { this.ngayKetThuc = ngayKetThuc; }
        public String getThongTinThem() { return thongTinThem; }
        public void setThongTinThem(String thongTinThem) { this.thongTinThem = thongTinThem; }
    }

    public static class HopDongWithPhuLucDTO {
        private HopDongResponseDTO hopDong;
        private List<PhuLucDichVuDTO> phuLucList;

        public HopDongResponseDTO getHopDong() { return hopDong; }
        public void setHopDong(HopDongResponseDTO hopDong) { this.hopDong = hopDong; }
        public List<PhuLucDichVuDTO> getPhuLucList() { return phuLucList; }
        public void setPhuLucList(List<PhuLucDichVuDTO> phuLucList) { this.phuLucList = phuLucList; }
    }

    public static class HopDongResponseDTO {
        private HopDong hopDong;
        private String message;

        public HopDongResponseDTO(HopDong hopDong, String message) {
            this.hopDong = hopDong;
            this.message = message;
        }

        public HopDong getHopDong() { return hopDong; }
        public void setHopDong(HopDong hopDong) { this.hopDong = hopDong; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}