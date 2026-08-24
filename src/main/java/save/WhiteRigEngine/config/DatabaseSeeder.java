package save.WhiteRigEngine.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import save.WhiteRigEngine.entities.BlogPost;
import save.WhiteRigEngine.entities.ComponentProduct;
import save.WhiteRigEngine.entities.User;
import save.WhiteRigEngine.model.Role;
import save.WhiteRigEngine.repositories.BlogPostRepository;
import save.WhiteRigEngine.repositories.ComponentRepository;
import save.WhiteRigEngine.repositories.UserRepository;

import java.io.InputStream;
import java.util.List;

@Component
@Order(1)
public class DatabaseSeeder implements CommandLineRunner {

    @Value("${app.admin.username}")
    private String adminUsername;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    private final UserRepository userRepository;
    private final BlogPostRepository blogPostRepository;
    private final ComponentRepository componentRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;

    @Autowired
    public DatabaseSeeder(UserRepository userRepository,
                          BlogPostRepository blogPostRepository,
                          ComponentRepository componentRepository,
                          PasswordEncoder passwordEncoder,
                          ObjectMapper objectMapper) {
        this.userRepository = userRepository;
        this.blogPostRepository = blogPostRepository;
        this.componentRepository = componentRepository;
        this.passwordEncoder = passwordEncoder;
        this.objectMapper = objectMapper;
    }

    @Override
    public void run(String @NonNull ... args) throws Exception {
        // Inserisco Componenti da JSON
        if (componentRepository.count() == 0) {
            try {
                InputStream inputStream = new ClassPathResource("components.json").getInputStream();
                List<ComponentProduct> components = objectMapper.readValue(
                        inputStream,
                        new TypeReference<List<ComponentProduct>>() {}
                );
                componentRepository.saveAll(components);
                System.out.println(">>> " + components.size() + " componenti caricati con successo da components.json!");
            } catch (Exception e) {
                System.err.println("Errore durante il caricamento dei componenti dal JSON: " + e.getMessage());
            }
        }

        // Inserisco dati Admin
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

        // 3. Blog d'esempio
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

        System.out.println("Dati iniziali inseriti con successo!");
    }
}