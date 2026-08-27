package save.WhiteRigEngine.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import save.WhiteRigEngine.entities.CustomBuild;
import save.WhiteRigEngine.entities.User;
import save.WhiteRigEngine.model.BuildRequestDTO;
import save.WhiteRigEngine.repositories.UserRepository;
import save.WhiteRigEngine.services.BuildService;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/builds")
public class BuildController {

    private final BuildService buildService;
    private final UserRepository userRepository;

    @Autowired
    public BuildController(BuildService buildService, UserRepository userRepository) {
        this.buildService = buildService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<CustomBuild>> getAllBuilds() {
        return ResponseEntity.ok(buildService.getAllBuilds());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomBuild> getBuildById(@PathVariable Long id) {
        return ResponseEntity.ok(buildService.getBuildById(id));
    }

    @GetMapping("/my-builds")
    public ResponseEntity<List<CustomBuild>> getMyBuilds(Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Utente non trovato"));
        return ResponseEntity.ok(buildService.getBuildsByUserId(user.getId()));
    }

    @PostMapping
    public ResponseEntity<CustomBuild> createBuild(@RequestBody BuildRequestDTO buildDTO, Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Utente non trovato"));

        buildDTO.setUserId(user.getId());
        CustomBuild created = buildService.createBuild(buildDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBuild(@PathVariable Long id) {
        buildService.deleteBuild(id);
        return ResponseEntity.noContent().build();
    }
}