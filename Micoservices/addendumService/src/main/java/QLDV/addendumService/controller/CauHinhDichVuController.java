package QLDV.addendumService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import QLDV.addendumService.model.CauHinhDichVu;
import QLDV.addendumService.repository.CauHinhDichVuRepository;

import java.util.List;

@RestController
@RequestMapping("/api/cauhinhdichvu")
public class CauHinhDichVuController {

    @Autowired
    private CauHinhDichVuRepository cauHinhDichVuRepository;

    // Lấy tất cả cấu hình dịch vụ
    @GetMapping
    public List<CauHinhDichVu> getAllCauHinhDichVu() {
        return cauHinhDichVuRepository.findAll();
    }

    // Lấy cấu hình dịch vụ theo id
    @GetMapping("/{id}")
    public CauHinhDichVu getCauHinhDichVuById(@PathVariable int id) {
        return cauHinhDichVuRepository.findById(id).orElse(null);
    }

    // Thêm cấu hình dịch vụ mới
    @PostMapping
    public CauHinhDichVu addCauHinhDichVu(@RequestBody CauHinhDichVu cauHinhDichVu) {
        return cauHinhDichVuRepository.save(cauHinhDichVu);
    }
}
