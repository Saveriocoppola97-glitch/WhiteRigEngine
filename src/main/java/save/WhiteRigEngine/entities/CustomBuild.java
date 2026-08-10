package save.WhiteRigEngine.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "custom_builds")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomBuild {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String buildName;

    // Relazioni con le varie componenti hardware
    @ManyToOne
    @JoinColumn(name = "cpu_id")
    private ComponentProduct cpu;

    @ManyToOne
    @JoinColumn(name = "gpu_id")
    private ComponentProduct gpu;

    @ManyToOne
    @JoinColumn(name = "ram_id")
    private ComponentProduct ram;

    @ManyToOne
    @JoinColumn(name = "motherboard_id")
    private ComponentProduct motherboard;

    @ManyToOne
    @JoinColumn(name = "storage_id")
    private ComponentProduct storage;

    @ManyToOne
    @JoinColumn(name = "psu_id")
    private ComponentProduct psu;

    @ManyToOne
    @JoinColumn(name = "case_id")
    private ComponentProduct pcCase;

    @Column(nullable = false)
    private BigDecimal totalPrice;

    private Long userId;
}
