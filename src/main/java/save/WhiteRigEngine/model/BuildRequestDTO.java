package save.WhiteRigEngine.model;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BuildRequestDTO {

    @NotBlank(message = "Il nome della build non può essere vuoto")
    private String buildName;

    private Long cpuId;
    private Long gpuId;
    private Long ramId;
    private Long motherboardId;
    private Long storageId;
    private Long psuId;
    private Long coolingId;
    private Long caseId;
    private Long userId;
}