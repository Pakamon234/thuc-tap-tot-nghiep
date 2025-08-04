package QLDV.addendumService.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import QLDV.addendumService.model.MauHopDong;
import QLDV.addendumService.model.MauHopDongDichVu;
import QLDV.addendumService.util.MauHopDongDichVuId;


public interface MauHopDongDichVuRepository extends JpaRepository<MauHopDongDichVu, MauHopDongDichVuId> {
}
