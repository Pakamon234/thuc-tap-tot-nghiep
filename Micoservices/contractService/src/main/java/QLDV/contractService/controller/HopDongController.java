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
import lombok.Data;

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

    // Thêm hợp đồng với phụ lục dịch vụ
    @Transactional
    @PostMapping("/add-full")
    public ResponseEntity<?> addHopDongWithPhuLuc(@RequestBody HopDongWithPhuLucDTO request) {
        logger.info("🔔 Nhận yêu cầu tạo hợp đồng kèm phụ lục");

        HopDongCreateDTO hopDongDTO = request.getHopDong();
        List<PhuLucDichVuDTO> phuLucList = request.getPhuLucList();

        logger.debug("➡️ Dữ liệu hợp đồng: {}", hopDongDTO);
        logger.debug("➡️ Số lượng phụ lục: {}", phuLucList.size());

        // Validate HopDong
        if (hopDongDTO.getMaCanHo() == null || hopDongDTO.getMaCanHo().isBlank()) {
            logger.warn("❌ Mã căn hộ bị thiếu");
            return ResponseEntity.badRequest().body("Mã căn hộ không được để trống");
        }
        if (hopDongDTO.getNgayKy() == null) {
            logger.warn("❌ Ngày ký bị thiếu");
            return ResponseEntity.badRequest().body("Ngày ký không được để trống");
        }
        if (hopDongDTO.getMauHopDongId() == null) {
            logger.warn("❌ Mẫu hợp đồng bị thiếu");
            return ResponseEntity.badRequest().body("Vui lòng chọn mẫu hợp đồng");
        }

        // Tạo hợp đồng mới
        String newMaHopDong = generateNewMaHopDong();
        logger.info("✅ Sinh mã hợp đồng mới: {}", newMaHopDong);

        HopDong hopDong = new HopDong();
        hopDong.setMaHopDong(newMaHopDong);
        hopDong.setMaCuDan(hopDongDTO.getMaCuDan());
        hopDong.setMaCanHo(hopDongDTO.getMaCanHo());
        hopDong.setMauHopDongId(hopDongDTO.getMauHopDongId());
        hopDong.setNgayKy(hopDongDTO.getNgayKy());
        hopDong.setNgayKetThuc(hopDongDTO.getNgayKetThuc());
        hopDong.setTrangThai(HopDong.TrangThaiHopDong.Chờ_duyệt);

        HopDong savedHopDong = hopDongRepository.save(hopDong);
        logger.info("✅ Hợp đồng đã lưu: {}", savedHopDong.getMaHopDong());

        // Gửi từng phụ lục
        for (PhuLucDichVuDTO dto : phuLucList) {
            dto.setMaHopDong(newMaHopDong);
            logger.debug("📦 Gửi phụ lục: {}", dto);

            String response = webClientBuilder.build()
                .post()
                .uri("http://localhost:8080/api/phulucdichvu/create")
                .bodyValue(dto)
                .retrieve()
                .bodyToMono(String.class)
                .block();

            logger.info("✅ Phản hồi từ addendumService: {}", response);
        }

        logger.info("🎉 Hoàn tất tạo hợp đồng và phụ lục");
        // Tạo response có thêm message
        HopDongResponseDTO responseDTO = new HopDongResponseDTO(savedHopDong, "Tạo hợp đồng thành công");

        return ResponseEntity.ok(responseDTO);

    }

    // Hàm sinh mã hợp đồng tự động theo mẫu HDxxxxx
    private String generateNewMaHopDong() {
        int nextId = hopDongRepository.findAll().size() + 1; // Đếm số lượng hợp đồng hiện có và cộng thêm 1
        return "HD" + String.format("%05d", nextId); // Tạo mã hợp đồng theo mẫu HDxxxxx
    }

    //DTO class
    public static class HopDongCreateDTO {
        private int maCuDan;
        private String maCanHo;
        private Integer mauHopDongId;
        private LocalDate ngayKy;
        private LocalDate ngayKetThuc;

        // Getters and Setters
        public int getMaCuDan() {
            return maCuDan;
        }
        public void setMaCuDan(int maCuDan) {
            this.maCuDan = maCuDan;
        }
        public String getMaCanHo() {
            return maCanHo;
        }
        public void setMaCanHo(String maCanHo) {
            this.maCanHo = maCanHo;
        }
        public Integer getMauHopDongId() {
            return mauHopDongId;
        }
        public void setMauHopDongId(Integer mauHopDongId) {
            this.mauHopDongId = mauHopDongId;
        }
        public LocalDate getNgayKy() {
            return ngayKy;
        }
        public void setNgayKy(LocalDate ngayKy) {
            this.ngayKy = ngayKy;
        }
        public LocalDate getNgayKetThuc() {
            return ngayKetThuc;
        }
        public void setNgayKetThuc(LocalDate ngayKetThuc) {
            this.ngayKetThuc = ngayKetThuc;
        }
        @Override
        public String toString() {
            return "HopDongCreateDTO{" +
                    "maCuDan=" + maCuDan +
                    ", maCanHo='" + maCanHo + '\'' +
                    ", mauHopDongId=" + mauHopDongId +
                    ", ngayKy=" + ngayKy +
                    ", ngayKetThuc=" + ngayKetThuc +
                    '}';
        }
    }

    // DTO class for creating PhuLucDichVu
    public static class PhuLucDichVuDTO {
        private String maHopDong;
        private String maDichVu;           // Thay vì truyền DichVu object
        private int cauHinhId;          // Thay vì truyền CauHinhDichVu object
        private int goiCuocId;          // Thay vì truyền GoiCuocDichVu object
        private BigDecimal donGiaCoDinh;
        private String trangThai;       // Enum dưới dạng String
        private Date ngayBatDau;
        private Date ngayKetThuc;
        private String thongTinThem;

        // Getters and Setters
        public String getMaHopDong() {
            return maHopDong;
        }
        public void setMaHopDong(String maHopDong) {
            this.maHopDong = maHopDong;
        }
        public String getMaDichVu() {
            return maDichVu;
        }
        public void setMaDichVu(String maDichVu) {
            this.maDichVu = maDichVu;
        }
        public int getCauHinhId() {
            return cauHinhId;
        }
        public void setCauHinhId(int cauHinhId) {
            this.cauHinhId = cauHinhId;
        }
        public int getGoiCuocId() {
            return goiCuocId;
        }
        public void setGoiCuocId(int goiCuocId) {
            this.goiCuocId = goiCuocId;
        }
        public BigDecimal getDonGiaCoDinh() {
            return donGiaCoDinh;
        }
        public void setDonGiaCoDinh(BigDecimal donGiaCoDinh) {
            this.donGiaCoDinh = donGiaCoDinh;
        }
        public String getTrangThai() {
            return trangThai;
        }
        public void setTrangThai(String trangThai) {
            this.trangThai = trangThai;
        }
        public Date getNgayBatDau() {
            return ngayBatDau;
        }
        public void setNgayBatDau(Date ngayBatDau) {
            this.ngayBatDau = ngayBatDau;
        }
        public Date getNgayKetThuc() {
            return ngayKetThuc;
        }
        public void setNgayKetThuc(Date ngayKetThuc) {
            this.ngayKetThuc = ngayKetThuc;
        }
        public String getThongTinThem() {
            return thongTinThem;
        }
        public void setThongTinThem(String thongTinThem) {
            this.thongTinThem = thongTinThem;
        }
    }

    public static class HopDongWithPhuLucDTO {
        private HopDongCreateDTO hopDong;
        private List<PhuLucDichVuDTO> phuLucList; // ✅ sửa từ 1 → danh sách

        // Getters and Setters
        public HopDongCreateDTO getHopDong() {
            return hopDong;
        }
        public void setHopDong(HopDongCreateDTO hopDong) {
            this.hopDong = hopDong;
        }
        public List<PhuLucDichVuDTO> getPhuLucList() {
            return phuLucList;
        }
        public void setPhuLucList(List<PhuLucDichVuDTO> phuLucList) {
            this.phuLucList = phuLucList;
        }
    }

    public static class HopDongResponseDTO {
    private HopDong hopDong;
    private String message;

    public HopDongResponseDTO(HopDong hopDong, String message) {
        this.hopDong = hopDong;
        this.message = message;
    }

    // Getters và setters
}
}