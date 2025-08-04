package QLDV.addendumService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import QLDV.addendumService.model.ThamSoPhi;
import QLDV.addendumService.repository.ThamSoPhiRepository;

import java.util.List;

@RestController
@RequestMapping("/api/thamsophi")
public class ThamSoPhiController {

    @Autowired
    private ThamSoPhiRepository thamSoPhiRepository;

    // Lấy tất cả tham số phí
    @GetMapping
    public List<ThamSoPhi> getAllThamSoPhi() {
        return thamSoPhiRepository.findAll();
    }

    // Lấy tham số phí theo id
    @GetMapping("/{id}")
    public ThamSoPhi getThamSoPhiById(@PathVariable int id) {
        return thamSoPhiRepository.findById(id).orElse(null);
    }

    // Thêm tham số phí mới
    @PostMapping
    public ThamSoPhi addThamSoPhi(@RequestBody ThamSoPhi thamSoPhi) {
        return thamSoPhiRepository.save(thamSoPhi);
    }
}

