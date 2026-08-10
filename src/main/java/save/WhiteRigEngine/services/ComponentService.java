package save.WhiteRigEngine.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import save.WhiteRigEngine.entities.ComponentProduct;
import save.WhiteRigEngine.model.Category;
import save.WhiteRigEngine.repositories.ComponentRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ComponentService {

    private final ComponentRepository componentRepository;

    @Autowired
    public ComponentService(ComponentRepository componentRepository) {
        this.componentRepository = componentRepository;
    }

    // Recupera tutti i componenti
    public List<ComponentProduct> getAllComponents() {
        return componentRepository.findAll();
    }

    // Recupera componente per ID
    public Optional<ComponentProduct> getComponentById(Long id) {
        return componentRepository.findById(id);
    }

    // Recupera componenti per categoria
    public List<ComponentProduct> getComponentsByCategory(Category category) {
        return componentRepository.findByCategory(category);
    }

    // Cerca componenti per nome
    public List<ComponentProduct> searchComponentsByName(String name) {
        return componentRepository.findByNameContainingIgnoreCase(name);
    }

    // Salva un nuovo componente o aggiorna uno esistente
    public ComponentProduct saveComponent(ComponentProduct component) {
        return componentRepository.save(component);
    }

    // Elimina componente per ID
    public void deleteComponent(Long id) {
        componentRepository.deleteById(id);
    }
}