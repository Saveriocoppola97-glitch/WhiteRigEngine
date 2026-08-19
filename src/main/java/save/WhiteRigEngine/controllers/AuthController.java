package save.WhiteRigEngine.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import save.WhiteRigEngine.config.JwtUtils;
import save.WhiteRigEngine.entities.User;
import save.WhiteRigEngine.model.AuthResponseDTO;
import save.WhiteRigEngine.model.LoginDTO;
import save.WhiteRigEngine.model.RegisterDTO;
import save.WhiteRigEngine.model.Role;
import save.WhiteRigEngine.repositories.UserRepository;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegisterDTO registerDTO) {
        if (userRepository.findByUsername(registerDTO.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username già in uso!");
        }

        if (userRepository.findByEmail(registerDTO.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email già in uso!");
        }

        User user = new User();
        user.setUsername(registerDTO.getUsername());
        user.setEmail(registerDTO.getEmail());
        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        user.setName(registerDTO.getName());
        user.setSurname(registerDTO.getSurname());
        user.setRole(Role.USER);

        userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED).body("Utente registrato con successo!");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> authenticateUser(@RequestBody LoginDTO loginDTO) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDTO.getUsername(), loginDTO.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        User user = userRepository.findByUsername(loginDTO.getUsername()).orElseThrow();

        return ResponseEntity.ok(new AuthResponseDTO(jwt, "Bearer", user.getUsername(), user.getRole().name()));
    }
}
