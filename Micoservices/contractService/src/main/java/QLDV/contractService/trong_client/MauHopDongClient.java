package QLDV.contractService.trong_client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import QLDV.contractService.trong_dto.MauHopDongDTO;


@FeignClient(name = "addendumService")
public interface MauHopDongClient {

    @GetMapping("/api/contract-templates/{id}")
    MauHopDongDTO getMauHopDong(@PathVariable("id") Integer id);

    default String getTenMauHopDong(Integer id) {
        try {
            return getMauHopDong(id).getTenMau();
        } catch (Exception e) {
            return "Không xác định";
        }
    }
}
