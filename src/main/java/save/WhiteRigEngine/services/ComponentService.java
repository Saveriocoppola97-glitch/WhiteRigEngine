package save.WhiteRigEngine.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import save.WhiteRigEngine.entities.ComponentProduct;
import save.WhiteRigEngine.exceptions.ResourceNotFoundException;
import save.WhiteRigEngine.model.Category;
import save.WhiteRigEngine.repositories.ComponentRepository;

@Service
public class ComponentService {

    private final ComponentRepository componentRepository;

    @Autowired
    public ComponentService(ComponentRepository componentRepository) {
        this.componentRepository = componentRepository;
    }

    // Recupera tutti i componenti con paginazione
    public Page<ComponentProduct> getAllComponents(Pageable pageable) {
        return componentRepository.findAll(pageable);
    }

    // Recupera componenti per ID
    public ComponentProduct getComponentById(Long id) {
        return componentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Componente non trovato con ID: " + id));
    }

    // Recupera i componenti per categoria con paginazione
    public Page<ComponentProduct> getComponentsByCategory(Category category, Pageable pageable) {
        return componentRepository.findByCategory(category, pageable);
    }

    // Recupera componenti per nome con paginazione
    public Page<ComponentProduct> searchComponentsByName(String name, Pageable pageable) {
        return componentRepository.findByNameContainingIgnoreCase(name, pageable);
    }

    // Salva un nuovo componente o aggiorna uno esistente
    public ComponentProduct saveComponent(ComponentProduct component) {
        return componentRepository.save(component);
    }

    // Elimina componente per ID
    public void deleteComponent(Long id) {
        ComponentProduct component = getComponentById(id);
        componentRepository.delete(component);
    }
}