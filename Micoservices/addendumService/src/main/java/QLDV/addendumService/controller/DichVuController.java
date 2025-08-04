package QLDV.addendumService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import QLDV.addendumService.model.DichVu;
import QLDV.addendumService.repository.DichVuRepository;

import java.util.List;

@RestController
@RequestMapping("/api/dichvu")
public class DichVuController {

    @Autowired
    private DichVuRepository dichVuRepository;

    // Lấy tất cả dịch vụ
    @GetMapping
    public List<DichVu> getAllDichVu() {
        return dichVuRepository.findAll();
    }

    // Lấy dịch vụ theo mã
    @GetMapping("/{maDichVu}")
    public DichVu getDichVuByMaDichVu(@PathVariable String maDichVu) {
        return dichVuRepository.findById(maDichVu).orElse(null);
    }

    // Thêm dịch vụ mới
    @PostMapping
    public DichVu addDichVu(@RequestBody DichVu dichVu) {
        return dichVuRepository.save(dichVu);
    }
}
