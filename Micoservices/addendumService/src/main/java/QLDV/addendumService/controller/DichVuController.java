package QLDV.addendumService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import QLDV.addendumService.model.CauHinhDichVu;
import QLDV.addendumService.model.DichVu;
import QLDV.addendumService.model.GoiCuocDichVu;
import QLDV.addendumService.model.DichVu.TrangThai;
import QLDV.addendumService.repository.CauHinhDichVuRepository;
import QLDV.addendumService.repository.DichVuRepository;
import QLDV.addendumService.repository.GoiCuocDichVuRepository;
import QLDV.addendumService.repository.MauHopDongDichVuRepository;
import QLDV.addendumService.repository.PhuLucDichVuRepository;
import QLDV.addendumService.model.ThamSoPhi;
import QLDV.addendumService.repository.ThamSoPhiRepository;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

// @RestController
// @RequestMapping("/api/dichvu")
// public class DichVuController {

//     @Autowired
//     private DichVuRepository dichVuRepository;

//     // Lấy tất cả dịch vụ
//     @GetMapping
//     public List<DichVu> getAllDichVu() {
//         return dichVuRepository.findAll();
//     }

//     // Lấy dịch vụ theo mã
//     @GetMapping("/{maDichVu}")
//     public DichVu getDichVuByMaDichVu(@PathVariable String maDichVu) {
//         return dichVuRepository.findById(maDichVu).orElse(null);
//     }

//     // Thêm dịch vụ mới
//     @PostMapping
//     public DichVu addDichVu(@RequestBody DichVu dichVu) {
//         return dichVuRepository.save(dichVu);
//     }
// }
@RestController
@RequestMapping("/api/dichvu")
public class DichVuController {

    @Autowired
    private DichVuRepository dichVuRepository;
    @Autowired
    private PhuLucDichVuRepository phuLucDichVuRepository;
    @Autowired
    private MauHopDongDichVuRepository mauHopDongDichVuRepository;
    @Autowired
    private GoiCuocDichVuRepository goiCuocDichVuRepository;
    @Autowired
    private CauHinhDichVuRepository cauHinhDichVuRepository;
    @Autowired
    private ThamSoPhiRepository thamSoPhiRepository;


    // Lấy tất cả dịch vụ
    @GetMapping
    public ResponseEntity<List<DichVu>> getAllDichVu() {
        List<DichVu> services = dichVuRepository.findAll();
        return ResponseEntity.ok(services); // Return 200 OK with the list of services
    }

    // Lấy dịch vụ theo mã
    @GetMapping("/{maDichVu}")
    public ResponseEntity<?> getDichVuByMaDichVu(@PathVariable String maDichVu) {
        Optional<DichVu> optional = dichVuRepository.findById(maDichVu);
        if (optional.isPresent()) {
            return ResponseEntity.ok(optional.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Dịch vụ không tồn tại");
        }
    }

    // Thêm dịch vụ mới (check trùng mã và các trường bắt buộc)
    @PostMapping
    public ResponseEntity<?> addDichVu(@RequestBody DichVu dichVu) {
        if (dichVu.getMaDichVu() == null || dichVu.getMaDichVu().isBlank()) {
            return ResponseEntity.badRequest().body("Mã dịch vụ không được để trống");
        }
        if (dichVuRepository.existsById(dichVu.getMaDichVu())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Mã dịch vụ đã tồn tại");
        }
        if (dichVu.getTenDichVu() == null || dichVu.getTenDichVu().isBlank()) {
            return ResponseEntity.badRequest().body("Tên dịch vụ là bắt buộc");
        }
        if (dichVu.getLoaiTinhPhi() == null) {
            return ResponseEntity.badRequest().body("Loại tính phí là bắt buộc");
        }
        if (dichVu.getTrangThai() == null) {
            return ResponseEntity.badRequest().body("Trạng thái là bắt buộc");
        }

        DichVu saved = dichVuRepository.save(dichVu);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{maDichVu}")
    public ResponseEntity<?> updateDichVu(
            @PathVariable String maDichVu,
            @RequestBody DichVu updatedDichVu,
            @RequestParam(name = "override", defaultValue = "false") boolean override) {
        return dichVuRepository.findById(maDichVu).map(existing -> {
            if (updatedDichVu.getTenDichVu() == null || updatedDichVu.getTenDichVu().isBlank()) {
                return ResponseEntity.badRequest().body("Tên dịch vụ là bắt buộc");
            }
            if (updatedDichVu.getLoaiTinhPhi() == null) {
                return ResponseEntity.badRequest().body("Loại tính phí là bắt buộc");
            }
            if (updatedDichVu.getTrangThai() == null) {
                return ResponseEntity.badRequest().body("Trạng thái là bắt buộc");
            }

            boolean isChangingTrangThai = !updatedDichVu.getTrangThai().equals(existing.getTrangThai());
            if (isChangingTrangThai) {
                boolean hasActivePhuLuc = phuLucDichVuRepository
                        .existsByDichVu_MaDichVuAndNgayKetThucAfter(maDichVu, new Date());

                if (hasActivePhuLuc && !override) {
                    return ResponseEntity.status(HttpStatus.CONFLICT)
                            .body("⚠ Dịch vụ còn phụ lục đang hiệu lực. Bạn không có quyền thay đổi trạng thái. Hãy xác nhận override nếu bạn là quản trị viên.");
                }
            }

            // Cho cập nhật toàn bộ
            existing.setTenDichVu(updatedDichVu.getTenDichVu());
            existing.setDonViTinh(updatedDichVu.getDonViTinh());
            existing.setMoTa(updatedDichVu.getMoTa());
            existing.setLoaiTinhPhi(updatedDichVu.getLoaiTinhPhi());
            existing.setBatBuoc(updatedDichVu.isBatBuoc());
            existing.setTrangThai(updatedDichVu.getTrangThai());

            return ResponseEntity.ok(dichVuRepository.save(existing));
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy dịch vụ cần cập nhật"));
    }

    // Xóa dịch vụ (chỉ khi không bắt buộc)
    @DeleteMapping("/{maDichVu}")
    public ResponseEntity<?> deleteDichVu(@PathVariable String maDichVu) {
        Optional<DichVu> optional = dichVuRepository.findById(maDichVu);

        // Kiểm tra nếu dịch vụ tồn tại
        if (optional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Dịch vụ không tồn tại");
        }

        // Kiểm tra nếu dịch vụ là bắt buộc
        DichVu dichVu = optional.get();

        if (dichVu.isBatBuoc()) {
            return ResponseEntity.badRequest().body("Không thể xoá dịch vụ bắt buộc");
        }

        // Kiểm tra tồn tại khóa ngoại
        boolean isReferenced = phuLucDichVuRepository.existsByDichVu_MaDichVu(maDichVu) ||
                cauHinhDichVuRepository.existsByDichVu_MaDichVu(maDichVu) ||
                goiCuocDichVuRepository.existsByDichVu_MaDichVu(maDichVu) ||
                mauHopDongDichVuRepository.existsById_MaDichVu(maDichVu);

        if (isReferenced) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Không thể xoá dịch vụ vì đang được liên kết sử dụng");
        }

        dichVuRepository.deleteById(maDichVu);
        return ResponseEntity.ok("Xoá dịch vụ thành công");
    }

    // Lấy chi tiết dịch vụ theo mã
    @GetMapping("/chitiet/{maDichVu}")
    public ResponseEntity<?> getChiTietDichVu(@PathVariable String maDichVu) {
        Optional<DichVu> dvoptional = dichVuRepository.findById(maDichVu);
        if(dvoptional.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy dịch vụ với mã: " + maDichVu);
        }
        DichVu dichVu = dvoptional.get();

        // Lấy danh sách gói cước liên quan
        List<GoiCuocDichVu> dsGoiCuoc = goiCuocDichVuRepository.findByDichVu_MaDichVu(maDichVu);
        // if (dsGoiCuoc.isEmpty()) {
        //     return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy gói cước cho dịch vụ: " + maDichVu);
        // }

        // Lấy danh sách cấu hình dịch vụ liên quan
        List<CauHinhDichVu> dsCauHinh = cauHinhDichVuRepository.findByDichVu_MaDichVu(maDichVu);
        // if (dsCauHinh.isEmpty()) {
        //     return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy cấu hình dịch vụ cho dịch vụ: " + maDichVu);
        // }

        // Lấy danh sách tham số phí liên quan
        List<ThamSoPhi> dsThamSoPhi = new ArrayList<>();
        for (CauHinhDichVu cauHinh : dsCauHinh) {
            List<ThamSoPhi> thamSoList = thamSoPhiRepository.findByCauHinhDichVu_Id(cauHinh.getId());
            dsThamSoPhi.addAll(thamSoList);
        }

        // Trả về thông tin dịch vụ cùng với các liên kết dạng json
        Map<String, Object> response = new HashMap<>();
        response.put("dichVu", dichVu);
        response.put("goiCuoc", dsGoiCuoc);
        response.put("cauHinh", dsCauHinh);
        response.put("thamSoPhi", dsThamSoPhi);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/stats")
    public ResponseEntity<?> getServiceStats() {
        try {
            // Calculate total number of services
            long totalServices = dichVuRepository.count();

            // Calculate number of active services
            long activeServices = dichVuRepository.countByTrangThai(TrangThai.HoatDong);

            // Calculate number of inactive services
            long inactiveServices = dichVuRepository.countByTrangThai(TrangThai.NgungHoatDong);

            // You can also add more statistics like the number of configurations, etc.
            long totalConfigurations = cauHinhDichVuRepository.count(); // Example for configurations

            // Prepare statistics object
            ServiceStats stats = new ServiceStats(totalServices, activeServices, inactiveServices, totalConfigurations);

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching stats");
        }
    }

    // Create a custom stats class to hold the statistics
    public static class ServiceStats {
        private long totalServices;
        private long activeServices;
        private long inactiveServices;
        private long totalConfigurations;

        // Constructor, getters, and setters
        public ServiceStats(long totalServices, long activeServices, long inactiveServices, long totalConfigurations) {
            this.totalServices = totalServices;
            this.activeServices = activeServices;
            this.inactiveServices = inactiveServices;
            this.totalConfigurations = totalConfigurations;
        }

        public long getTotalServices() {
            return totalServices;
        }

        public void setTotalServices(long totalServices) {
            this.totalServices = totalServices;
        }

        public long getActiveServices() {
            return activeServices;
        }

        public void setActiveServices(long activeServices) {
            this.activeServices = activeServices;
        }

        public long getInactiveServices() {
            return inactiveServices;
        }

        public void setInactiveServices(long inactiveServices) {
            this.inactiveServices = inactiveServices;
        }

        public long getTotalConfigurations() {
            return totalConfigurations;
        }

        public void setTotalConfigurations(long totalConfigurations) {
            this.totalConfigurations = totalConfigurations;
        }
    }

}
