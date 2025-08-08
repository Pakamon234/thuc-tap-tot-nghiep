package QLDV.contractService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import QLDV.contractService.model.YeuCauThayDoiHopDong;
import QLDV.contractService.repository.YeuCauThayDoiHopDongRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/yeucauthaydoihopdong")
public class YeuCauThayDoiHopDongController {

    @Autowired
    private YeuCauThayDoiHopDongRepository yeuCauThayDoiHopDongRepository;

    @GetMapping
    public ResponseEntity<?> getAllYeuCauThayDoiHopDong() {
        return ResponseEntity.ok(yeuCauThayDoiHopDongRepository.findAll());
    }
    // Thêm yêu cầu thay đổi hợp đồng
    @PostMapping
    public ResponseEntity<?> addYeuCauThayDoiHopDong(@RequestBody YeuCauThayDoiHopDong yeuCau) {
        if (yeuCau.getHopDong() == null || yeuCau.getHopDong().getMaHopDong() == null) {
            return ResponseEntity.badRequest().body("Mã hợp đồng không được để trống");
        }

        yeuCau.setTrangThai(YeuCauThayDoiHopDong.TrangThaiYeuCau.Chờ_duyệt); // Mặc định là "Chờ duyệt"
        YeuCauThayDoiHopDong savedRequest = yeuCauThayDoiHopDongRepository.save(yeuCau);
        return ResponseEntity.ok(savedRequest);
    }

    // Lấy yêu cầu thay đổi hợp đồng theo trạng thái
    @GetMapping("/trangthai/{trangThai}")
    public ResponseEntity<List<YeuCauThayDoiHopDong>> getYeuCauByTrangThai(@PathVariable YeuCauThayDoiHopDong.TrangThaiYeuCau trangThai) {
        List<YeuCauThayDoiHopDong> requests = yeuCauThayDoiHopDongRepository.findByTrangThai(trangThai);
        if (requests.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(requests);
    }

    // Duyệt yêu cầu thay đổi hợp đồng
    @PutMapping("/duyet/{id}")
    public ResponseEntity<?> approveYeuCauThayDoi(@PathVariable int id) {
        Optional<YeuCauThayDoiHopDong> yeuCauOpt = yeuCauThayDoiHopDongRepository.findById(id);

        if (!yeuCauOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Yêu cầu thay đổi hợp đồng không tồn tại");
        }

        YeuCauThayDoiHopDong yeuCau = yeuCauOpt.get();

        // Kiểm tra trạng thái yêu cầu phải là "Chờ duyệt"
        if (!yeuCau.getTrangThai().equals(YeuCauThayDoiHopDong.TrangThaiYeuCau.Chờ_duyệt)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Chỉ yêu cầu có trạng thái 'Chờ duyệt' mới có thể duyệt");
        }

        // Cập nhật trạng thái yêu cầu thành "Đã duyệt"
        yeuCau.setTrangThai(YeuCauThayDoiHopDong.TrangThaiYeuCau.Đã_duyệt);
        yeuCauThayDoiHopDongRepository.save(yeuCau);

        return ResponseEntity.ok("Yêu cầu thay đổi hợp đồng đã được duyệt");
    }
        @PutMapping("/tuchoi/{id}")
    public ResponseEntity<?> ejectYeuCauThayDoi(@PathVariable int id) {
        Optional<YeuCauThayDoiHopDong> yeuCauOpt = yeuCauThayDoiHopDongRepository.findById(id);

        if (!yeuCauOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Yêu cầu thay đổi hợp đồng không tồn tại");
        }

        YeuCauThayDoiHopDong yeuCau = yeuCauOpt.get();

        // Kiểm tra trạng thái yêu cầu phải là "Chờ duyệt"
        if (!yeuCau.getTrangThai().equals(YeuCauThayDoiHopDong.TrangThaiYeuCau.Chờ_duyệt)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Chỉ yêu cầu có trạng thái 'Chờ duyệt' mới có thể duyệt");
        }

        // Cập nhật trạng thái yêu cầu thành "Đã duyệt"
        yeuCau.setTrangThai(YeuCauThayDoiHopDong.TrangThaiYeuCau.Từ_chối);
        yeuCauThayDoiHopDongRepository.save(yeuCau);

        return ResponseEntity.ok("Yêu cầu thay đổi hợp đồng đã được duyệt");
    }

    // Lấy yêu cầu thay đổi hợp đồng theo mã hợp đồng
    @GetMapping("/hopdong/{maHopDong}")
    public ResponseEntity<List<YeuCauThayDoiHopDong>> getYeuCauByHopDong(@PathVariable String maHopDong) {
        List<YeuCauThayDoiHopDong> requests = yeuCauThayDoiHopDongRepository.findByHopDongMaHopDong(maHopDong);
        if (requests.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(requests);
    }
}
