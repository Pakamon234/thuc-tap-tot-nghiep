package QLDV.contractService;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableFeignClients(basePackages = "QLDV.contractService.trong_client")
@SpringBootApplication
public class ContractServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ContractServiceApplication.class, args);
	}

}
