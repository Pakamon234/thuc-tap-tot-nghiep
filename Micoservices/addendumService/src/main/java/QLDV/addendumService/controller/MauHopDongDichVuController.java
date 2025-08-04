package QLDV.addendumService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import QLDV.addendumService.model.MauHopDongDichVu;
import QLDV.addendumService.repository.MauHopDongDichVuRepository;
import QLDV.addendumService.util.MauHopDongDichVuId;

import java.util.List;

@RestController
@RequestMapping("/api/mauhopdongdichvu")
public class MauHopDongDichVuController {

    @Autowired
    private MauHopDongDichVuRepository mauHopDongDichVuRepository;

    // Lấy tất cả mẫu hợp đồng dịch vụ
    @GetMapping
    public List<MauHopDongDichVu> getAllMauHopDongDichVu() {
        return mauHopDongDichVuRepository.findAll();
    }

    // Lấy mẫu hợp đồng dịch vụ theo mauId và maDichVu
    @GetMapping("/{mauId}/{maDichVu}")
    public MauHopDongDichVu getMauHopDongDichVuById(@PathVariable int mauId, @PathVariable String maDichVu) {
        MauHopDongDichVuId id = new MauHopDongDichVuId();
        id.setMauHopDong(mauId);
        id.setMaDichVu(maDichVu);
        return mauHopDongDichVuRepository.findById(id).orElse(null);
    }

    // Thêm mẫu hợp đồng dịch vụ mới
    @PostMapping
    public MauHopDongDichVu addMauHopDongDichVu(@RequestBody MauHopDongDichVu mauHopDongDichVu) {
        return mauHopDongDichVuRepository.save(mauHopDongDichVu);
    }
}
