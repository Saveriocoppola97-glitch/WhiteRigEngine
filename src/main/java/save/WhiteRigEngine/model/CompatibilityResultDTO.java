package save.WhiteRigEngine.model;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class CompatibilityResultDTO {
    private boolean compatible = true;
    private int estimatedWattage = 0;
    private List<String> errors = new ArrayList<>();
    private List<String> warnings = new ArrayList<>();

    public void addError(String error) {
        this.errors.add(error);
        this.compatible = false;
    }

    public void addWarning(String warning) {
        this.warnings.add(warning);
    }
}
