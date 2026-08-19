package save.WhiteRigEngine.model;

import lombok.Data;

@Data
public class RegisterDTO {
    private String username;
    private String email;
    private String password;
    private String name;
    private String surname;
}