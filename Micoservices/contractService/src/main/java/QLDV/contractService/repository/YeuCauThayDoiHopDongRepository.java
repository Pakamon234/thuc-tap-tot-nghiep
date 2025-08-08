package QLDV.contractService.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import QLDV.contractService.model.YeuCauThayDoiHopDong;
import QLDV.contractService.model.YeuCauThayDoiHopDong.TrangThaiYeuCau;

@Repository
public interface YeuCauThayDoiHopDongRepository extends JpaRepository<YeuCauThayDoiHopDong, Integer> {
    List<YeuCauThayDoiHopDong> findByTrangThai(TrangThaiYeuCau trangThai);
List<YeuCauThayDoiHopDong> findByHopDongMaHopDong(String maHopDong);

}