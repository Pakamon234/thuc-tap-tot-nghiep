package QLDV.addendumService.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import QLDV.addendumService.model.MauHopDong;

public interface MauHopDongRepository extends JpaRepository<MauHopDong, Integer> {
    MauHopDong findTopByOrderByIdDesc();
}

