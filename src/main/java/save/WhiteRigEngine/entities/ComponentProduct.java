package save.WhiteRigEngine.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import save.WhiteRigEngine.model.Category;

import java.math.BigDecimal;

@Entity
@Table(name = "components")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComponentProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Column(length = 1000)
    private String description;

    @Column(name = "wattage")
    private Integer wattage;

    @Column(name = "socket", length = 10)
    private String socket;

    @Column(name = "ram_type", length = 10)
    private String ramType;

    @Column(name = "form_factor", length = 10)
    private String formFactor;

    private String imageUrl;

    private Integer stockQuantity;
}