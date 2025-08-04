package QLDV.addendumService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import QLDV.addendumService.model.MauHopDong;
import QLDV.addendumService.repository.MauHopDongRepository;

import java.util.List;

@RestController
@RequestMapping("/api/mauhopdong")
public class MauHopDongController {

    @Autowired
    private MauHopDongRepository mauHopDongRepository;

    // Lấy tất cả mẫu hợp đồng
    @GetMapping
    public List<MauHopDong> getAllMauHopDong() {
        return mauHopDongRepository.findAll();
    }

    // Lấy mẫu hợp đồng theo id
    @GetMapping("/{id}")
    public MauHopDong getMauHopDongById(@PathVariable int id) {
        return mauHopDongRepository.findById(id).orElse(null);
    }

    // Thêm mẫu hợp đồng mới
    @PostMapping
    public MauHopDong addMauHopDong(@RequestBody MauHopDong mauHopDong) {
        return mauHopDongRepository.save(mauHopDong);
    }
}

