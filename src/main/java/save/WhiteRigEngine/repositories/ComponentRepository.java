package save.WhiteRigEngine.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import save.WhiteRigEngine.entities.ComponentProduct;
import save.WhiteRigEngine.model.Category;

import java.util.List;

@Repository
public interface ComponentRepository extends JpaRepository<ComponentProduct, Long> {

    // Trova componenti per categoria con paginazione
    Page<ComponentProduct> findByCategory(Category category, Pageable pageable);

    // Cerca componenti per nome con paginazione
    Page<ComponentProduct> findByNameContainingIgnoreCase(String name, Pageable pageable);

    // Trova componenti per categoria
    List<ComponentProduct> findByCategory(Category category);

    // Cerca componenti per marca
    List<ComponentProduct> findByBrandIgnoreCase(String brand);

    // Ricerca per nome
    List<ComponentProduct> findByNameContainingIgnoreCase(String name);
}
