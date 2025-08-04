package QLDV.addendumService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import QLDV.addendumService.model.PhuLucDichVu;
import QLDV.addendumService.repository.PhuLucDichVuRepository;

import java.util.List;

@RestController
@RequestMapping("/api/phulucdichvu")
public class PhuLucDichVuController {

    @Autowired
    private PhuLucDichVuRepository phuLucDichVuRepository;

    // Lấy tất cả phụ lục dịch vụ
    @GetMapping
    public List<PhuLucDichVu> getAllPhuLucDichVu() {
        return phuLucDichVuRepository.findAll();
    }

    // Lấy phụ lục dịch vụ theo id
    @GetMapping("/{id}")
    public PhuLucDichVu getPhuLucDichVuById(@PathVariable int id) {
        return phuLucDichVuRepository.findById(id).orElse(null);
    }

    // Thêm phụ lục dịch vụ mới
    @PostMapping
    public PhuLucDichVu addPhuLucDichVu(@RequestBody PhuLucDichVu phuLucDichVu) {
        return phuLucDichVuRepository.save(phuLucDichVu);
    }
}
