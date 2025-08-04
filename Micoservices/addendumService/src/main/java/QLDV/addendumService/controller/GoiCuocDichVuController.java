package QLDV.addendumService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import QLDV.addendumService.model.GoiCuocDichVu;
import QLDV.addendumService.repository.GoiCuocDichVuRepository;

import java.util.List;

@RestController
@RequestMapping("/api/goicuocdichvu")
public class GoiCuocDichVuController {

    @Autowired
    private GoiCuocDichVuRepository goiCuocDichVuRepository;

    // Lấy tất cả gói cước dịch vụ
    @GetMapping
    public List<GoiCuocDichVu> getAllGoiCuocDichVu() {
        return goiCuocDichVuRepository.findAll();
    }

    // Lấy gói cước dịch vụ theo id
    @GetMapping("/{id}")
    public GoiCuocDichVu getGoiCuocDichVuById(@PathVariable int id) {
        return goiCuocDichVuRepository.findById(id).orElse(null);
    }

    // Thêm gói cước dịch vụ mới
    @PostMapping
    public GoiCuocDichVu addGoiCuocDichVu(@RequestBody GoiCuocDichVu goiCuocDichVu) {
        return goiCuocDichVuRepository.save(goiCuocDichVu);
    }
}
