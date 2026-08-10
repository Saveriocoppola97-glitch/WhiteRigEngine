package save.WhiteRigEngine.model;

import lombok.Data;

@Data
public class BuildRequestDTO {
    private String buildName;
    private Long cpuId;
    private Long gpuId;
    private Long ramId;
    private Long motherboardId;
    private Long storageId;
    private Long psuId;
    private Long caseId;
    private Long userId;
}
