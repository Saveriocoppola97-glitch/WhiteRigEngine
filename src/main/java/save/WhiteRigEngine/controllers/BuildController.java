package save.WhiteRigEngine.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import save.WhiteRigEngine.entities.CustomBuild;
import save.WhiteRigEngine.model.BuildRequestDTO;
import save.WhiteRigEngine.services.BuildService;

import java.util.List;

@RestController
@RequestMapping("/api/builds")
public class BuildController {

    private final BuildService buildService;

    @Autowired
    public BuildController(BuildService buildService) {
        this.buildService = buildService;
    }

    @GetMapping
    public ResponseEntity<List<CustomBuild>> getAllBuilds() {
        return ResponseEntity.ok(buildService.getAllBuilds());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomBuild> getBuildById(@PathVariable Long id) {
        return buildService.getBuildById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CustomBuild>> getBuildsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(buildService.getBuildsByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<CustomBuild> createBuild(@RequestBody BuildRequestDTO buildDTO) {
        CustomBuild created = buildService.createBuild(buildDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBuild(@PathVariable Long id) {
        if (buildService.getBuildById(id).isPresent()) {
            buildService.deleteBuild(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
