package QLDV.addendumService.trong_controller;

import QLDV.addendumService.trong_dto.MauHopDongDTO;
import QLDV.addendumService.trong_model.MauHopDong;
import QLDV.addendumService.trong_repo.MauHopDongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;


@RestController
@RequestMapping("/api/contract-templates")
@RequiredArgsConstructor
public class MauHopDongController {

    private final MauHopDongRepository repository;

    @GetMapping("/{id}")
    public ResponseEntity<MauHopDongDTO> getMauHopDong(@PathVariable Integer id) {
        MauHopDong entity = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy mẫu hợp đồng"));

        MauHopDongDTO dto = new MauHopDongDTO(entity.getId(), entity.getTenMau());
        return ResponseEntity.ok(dto);
    }
}

