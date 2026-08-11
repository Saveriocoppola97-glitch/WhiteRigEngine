package save.WhiteRigEngine.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import save.WhiteRigEngine.model.BuildRequestDTO;
import save.WhiteRigEngine.model.CompatibilityResultDTO;
import save.WhiteRigEngine.services.CompatibilityService;

@RestController
@RequestMapping("/api/builds")
public class CompatibilityController {

    private final CompatibilityService compatibilityService;

    public CompatibilityController(CompatibilityService compatibilityService) {
        this.compatibilityService = compatibilityService;
    }

    @PostMapping("/check-compatibility")
    public ResponseEntity<CompatibilityResultDTO> checkCompatibility(@RequestBody BuildRequestDTO request) {
        CompatibilityResultDTO result = compatibilityService.validateBuild(request);
        return ResponseEntity.ok(result);
    }
}