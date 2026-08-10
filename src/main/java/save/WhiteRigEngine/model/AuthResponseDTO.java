package save.WhiteRigEngine.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponseDTO {
    private String token;
    private String tokenType;
    private String username;
    private String role;
}
