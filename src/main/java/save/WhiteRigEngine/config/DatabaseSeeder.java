package save.WhiteRigEngine.config;

import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import save.WhiteRigEngine.entities.BlogPost;
import save.WhiteRigEngine.entities.ComponentProduct;
import save.WhiteRigEngine.entities.User;
import save.WhiteRigEngine.model.Category;
import save.WhiteRigEngine.model.Role;
import save.WhiteRigEngine.repositories.BlogPostRepository;
import save.WhiteRigEngine.repositories.ComponentRepository;
import save.WhiteRigEngine.repositories.UserRepository;

import java.math.BigDecimal;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Value("${app.admin.username}")
    private String adminUsername;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    private final ComponentRepository componentRepository;
    private final UserRepository userRepository;
    private final BlogPostRepository blogPostRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DatabaseSeeder(ComponentRepository componentRepository,
                          UserRepository userRepository,
                          BlogPostRepository blogPostRepository,
                          PasswordEncoder passwordEncoder) {
        this.componentRepository = componentRepository;
        this.userRepository = userRepository;
        this.blogPostRepository = blogPostRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String @NonNull ... args) {
        if (componentRepository.count() == 0) {

            // 1. CPU
            componentRepository.save(new ComponentProduct(
                    null,
                    "Ryzen 7 7800X3D",
                    "AMD",
                    new BigDecimal("389.99"),
                    Category.CPU,
                    "Processore da gioco a 8 core e 16 thread con tecnologia 3D V-Cache.",
                    120, "AM5", null, null,
                    "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500",
                    15
            ));

            // 2. GPU
            componentRepository.save(new ComponentProduct(
                    null,
                    "GeForce RTX 4070 Ti Super",
                    "NVIDIA",
                    new BigDecimal("849.00"),
                    Category.GPU,
                    "Scheda video da 16GB GDDR6X eccellente per gaming 1440p e 4K.",
                    285, null, null, null,
                    "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500",
                    8
            ));

            // 3. RAM
            componentRepository.save(new ComponentProduct(
                    null,
                    "Vengeance DDR5 32GB (2x16GB) 6000MHz",
                    "Corsair",
                    new BigDecimal("124.99"),
                    Category.RAM,
                    "Kit di memoria RAM ad alte prestazioni ottimizzato per profili AMD EXPO e Intel XMP.",
                    null, null, "DDR5", null,
                    "https://images.unsplash.com/photo-1562976540-1502c2145186?w=500",
                    20
            ));

            // 4. MOTHERBOARD
            componentRepository.save(new ComponentProduct(
                    null,
                    "ROG Strix B650-A Gaming WiFi",
                    "ASUS",
                    new BigDecimal("239.50"),
                    Category.MOTHERBOARD,
                    "Scheda madre ATX socket AM5 con supporto PCIe 5.0 e WiFi 6E.",
                    null, "AM5", "DDR5", "ATX",
                    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500",
                    10
            ));

            // 5. STORAGE
            componentRepository.save(new ComponentProduct(
                    null,
                    "990 PRO NVMe M.2 SSD 2TB",
                    "Samsung",
                    new BigDecimal("179.90"),
                    Category.STORAGE,
                    "Unità SSD M.2 PCIe 4.0 con velocità di lettura fino a 7450 MB/s.",
                    null, null, null, null,
                    "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500",
                    25
            ));

            // 6. PSU
            componentRepository.save(new ComponentProduct(
                    null,
                    "RM850e 850W 80 Plus Gold",
                    "Corsair",
                    new BigDecimal("119.00"),
                    Category.PSU,
                    "Alimentatore completamente modulare con certificazione 80 Plus Gold e supporto ATX 3.0.",
                    850, null, null, null,
                    "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=500",
                    12
            ));

            // 7. CASE
            componentRepository.save(new ComponentProduct(
                    null,
                    "H9 Flow Mid-Tower",
                    "NZXT",
                    new BigDecimal("159.90"),
                    Category.CASE,
                    "Case per PC a doppia camera con vetro temperato panoramico.",
                    null, null, null, "ATX",
                    "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500",
                    7
            ));

            // 8. COOLING
            componentRepository.save(new ComponentProduct(
                    null,
                    "Kraken Elite 360 RGB White",
                    "NZXT",
                    new BigDecimal("289.00"),
                    Category.COOLING,
                    "Dissipatore a liquido AIO per CPU con display LCD personalizzabile.",
                    null, null, null, null,
                    "https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=500",
                    5
            ));
        }

        if (userRepository.count() == 0) {
            userRepository.save(new User(
                    null,
                    "Saverio",
                    "Casabianca",
                    adminUsername,
                    adminEmail,
                    passwordEncoder.encode(adminPassword),
                    Role.ADMIN
            ));
        }

        // Blog d'esempio
        if (blogPostRepository.count() == 0) {
            blogPostRepository.save(new BlogPost(
                    null,
                    "Benvenuti su WhiteRig Engine!",
                    "Questo blog racchiude la mia passione per l'hardware e il mondo dei PC Custom.",
                    adminUsername,
                    "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500",
                    null
            ));
        }
        System.out.println("Dati iniziali caricati con successo!");
    }
}