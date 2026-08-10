package save.WhiteRigEngine.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import save.WhiteRigEngine.entities.ComponentProduct;
import save.WhiteRigEngine.model.Category;
import save.WhiteRigEngine.repositories.ComponentRepository;

import java.math.BigDecimal;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final ComponentRepository componentRepository;

    @Autowired
    public DatabaseSeeder(ComponentRepository componentRepository) {
        this.componentRepository = componentRepository;
    }

    @Override
    public void run(String... args) {
        if (componentRepository.count() == 0) {
            componentRepository.save(new ComponentProduct(
                    null,
                    "Ryzen 7 7800X3D",
                    "AMD",
                    new BigDecimal("389.99"),
                    Category.CPU,
                    "Processore da gioco a 8 core e 16 thread con tecnologia 3D V-Cache.",
                    "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500",
                    15
            ));

            componentRepository.save(new ComponentProduct(
                    null,
                    "GeForce RTX 4070 Ti Super",
                    "NVIDIA",
                    new BigDecimal("849.00"),
                    Category.GPU,
                    "Scheda video da 16GB GDDR6X eccellente per gaming 1440p e 4K.",
                    "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500",
                    8
            ));

            componentRepository.save(new ComponentProduct(
                    null,
                    "Vengeance DDR5 32GB (2x16GB) 6000MHz",
                    "Corsair",
                    new BigDecimal("125.50"),
                    Category.RAM,
                    "Kit di memoria RAM DDR5 ad alte prestazioni con supporto EXPO/XMP.",
                    "https://images.unsplash.com/photo-1562976540-1502c2145186?w=500",
                    25
            ));

            System.out.println("Dati iniziali caricati con successo!");
        }
    }
}
