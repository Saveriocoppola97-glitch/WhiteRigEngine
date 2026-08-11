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
        }

        if (userRepository.count() == 0) {
            userRepository.save(new User(
                    null,
                    adminUsername,
                    adminEmail,
                    passwordEncoder.encode(adminPassword),
                    Role.ADMIN
            ));
        }

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

        System.out.println("Dati iniziali (Componenti, User, Blog) caricati con successo!");
    }
}