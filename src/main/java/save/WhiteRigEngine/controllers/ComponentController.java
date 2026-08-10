package save.WhiteRigEngine.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import save.WhiteRigEngine.entities.ComponentProduct;
import save.WhiteRigEngine.model.Category;
import save.WhiteRigEngine.services.ComponentService;

import java.util.List;

@RestController
@RequestMapping("/api/components")
public class ComponentController {

    private final ComponentService componentService;

    @Autowired
    public ComponentController(ComponentService componentService) {
        this.componentService = componentService;
    }

    // GET che restituisce tutti i componenti o li filtra per categoria
    @GetMapping
    public ResponseEntity<List<ComponentProduct>> getAllComponents(
            @RequestParam(required = false) Category category,
            @RequestParam(required = false) String search) {

        if (category != null) {
            return ResponseEntity.ok(componentService.getComponentsByCategory(category));
        }
        if (search != null && !search.trim().isEmpty()) {
            return ResponseEntity.ok(componentService.searchComponentsByName(search));
        }

        return ResponseEntity.ok(componentService.getAllComponents());
    }

    // GET che restituisce i dettagli di un singolo componente
    @GetMapping("/{id}")
    public ResponseEntity<ComponentProduct> getComponentById(@PathVariable Long id) {
        return ResponseEntity.ok(componentService.getComponentById(id));
    }

    // POST che ne aggiunge uno nuovo
    @PostMapping
    public ResponseEntity<ComponentProduct> createComponent(@RequestBody ComponentProduct component) {
        ComponentProduct created = componentService.saveComponent(component);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // PUT che aggiorna uno già esistente
    @PutMapping("/{id}")
    public ResponseEntity<ComponentProduct> updateComponent(
            @PathVariable Long id,
            @RequestBody ComponentProduct componentDetails) {

        ComponentProduct existingComponent = componentService.getComponentById(id);

        existingComponent.setName(componentDetails.getName());
        existingComponent.setBrand(componentDetails.getBrand());
        existingComponent.setPrice(componentDetails.getPrice());
        existingComponent.setCategory(componentDetails.getCategory());
        existingComponent.setDescription(componentDetails.getDescription());
        existingComponent.setImageUrl(componentDetails.getImageUrl());
        existingComponent.setStockQuantity(componentDetails.getStockQuantity());

        return ResponseEntity.ok(componentService.saveComponent(existingComponent));
    }

    // DELETE che elimina il componente
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComponent(@PathVariable Long id) {
        componentService.deleteComponent(id);
        return ResponseEntity.noContent().build();
    }
}
