package save.WhiteRigEngine.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import save.WhiteRigEngine.entities.ComponentProduct;
import save.WhiteRigEngine.model.Category;
import save.WhiteRigEngine.services.CloudinaryService;
import save.WhiteRigEngine.services.ComponentService;

import java.util.List;

@RestController
@RequestMapping("/api/components")
public class ComponentController {

    private final ComponentService componentService;
    private final CloudinaryService cloudinaryService;

    @Autowired
    public ComponentController(ComponentService componentService, CloudinaryService cloudinaryService) {
        this.componentService = componentService;
        this.cloudinaryService = cloudinaryService;
    }

    // GET che restituisce tutti i componenti o li filtra per categoria
    @GetMapping
    public ResponseEntity<org.springframework.data.domain.Page<ComponentProduct>> getAllComponents(
            @RequestParam(required = false) Category category,
            @RequestParam(required = false) String search,
            @org.springframework.data.web.PageableDefault(page = 0, size = 20, sort = "id")
            org.springframework.data.domain.Pageable pageable) {

        if (category != null) {
            return ResponseEntity.ok(componentService.getComponentsByCategory(category, pageable));
        }
        if (search != null && !search.trim().isEmpty()) {
            return ResponseEntity.ok(componentService.searchComponentsByName(search, pageable));
        }

        return ResponseEntity.ok(componentService.getAllComponents(pageable));
    }

    // GET che restituisce i dettagli di un singolo componente
    @GetMapping("/{id}")
    public ResponseEntity<ComponentProduct> getComponentById(@PathVariable Long id) {
        return ResponseEntity.ok(componentService.getComponentById(id));
    }

    // POST per upload dell'immagine su Cloudinary tramite Multipart
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ComponentProduct> createComponentWithImage(
            @RequestParam("name") String name,
            @RequestParam("brand") String brand,
            @RequestParam("category") Category category,
            @RequestParam("price") java.math.BigDecimal price,
            @RequestParam("stockQuantity") int stockQuantity,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "wattage", required = false) Integer wattage,
            @RequestParam(value = "socket", required = false) String socket,
            @RequestParam(value = "ramType", required = false) String ramType,
            @RequestParam(value = "formFactor", required = false) String formFactor,
            @RequestParam("image") MultipartFile image) {
        ComponentProduct component = new ComponentProduct();
        component.setName(name);
        component.setBrand(brand);
        component.setCategory(category);
        component.setPrice(price);
        component.setStockQuantity(stockQuantity);
        component.setDescription(description);
        component.setWattage(wattage);
        component.setSocket(socket);
        component.setRamType(ramType);
        component.setFormFactor(formFactor);


        String imageUrl = cloudinaryService.uploadImage(image);
        component.setImageUrl(imageUrl);

        ComponentProduct created = componentService.saveComponent(component);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // POST JSON
    @PostMapping
    public ResponseEntity<ComponentProduct> createComponentJson(@RequestBody ComponentProduct component) {
        ComponentProduct created = componentService.saveComponent(component);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // PUT che aggiorna un componente esistente e opzione per aggiornare anche l'immagine
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ComponentProduct> updateComponentWithImage(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("brand") String brand,
            @RequestParam("category") Category category,
            @RequestParam("price") java.math.BigDecimal price,
            @RequestParam("stockQuantity") int stockQuantity,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "wattage", required = false) Integer wattage,
            @RequestParam(value = "socket", required = false) String socket,
            @RequestParam(value = "ramType", required = false) String ramType,
            @RequestParam(value = "formFactor", required = false) String formFactor,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        ComponentProduct existingComponent = componentService.getComponentById(id);
        existingComponent.setName(name);
        existingComponent.setBrand(brand);
        existingComponent.setCategory(category);
        existingComponent.setPrice(price);
        existingComponent.setStockQuantity(stockQuantity);
        existingComponent.setDescription(description);
        existingComponent.setWattage(wattage);
        existingComponent.setSocket(socket);
        existingComponent.setRamType(ramType);
        existingComponent.setFormFactor(formFactor);

        if (image != null && !image.isEmpty()) {
            String imageUrl = cloudinaryService.uploadImage(image);
            existingComponent.setImageUrl(imageUrl);
        }

        return ResponseEntity.ok(componentService.saveComponent(existingComponent));
    }

    // PUT JSON
    @PutMapping("/{id}")
    public ResponseEntity<ComponentProduct> updateComponentJson(
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
        existingComponent.setWattage(componentDetails.getWattage());
        existingComponent.setSocket(componentDetails.getSocket());
        existingComponent.setRamType(componentDetails.getRamType());
        existingComponent.setFormFactor(componentDetails.getFormFactor());

        return ResponseEntity.ok(componentService.saveComponent(existingComponent));
    }
    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComponent(@PathVariable Long id) {
        componentService.deleteComponent(id);
        return ResponseEntity.noContent().build();
    }
}
