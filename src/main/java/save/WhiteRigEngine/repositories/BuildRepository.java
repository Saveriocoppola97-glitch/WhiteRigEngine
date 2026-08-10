package save.WhiteRigEngine.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import save.WhiteRigEngine.entities.CustomBuild;

import java.util.List;

@Repository
public interface BuildRepository extends JpaRepository<CustomBuild, Long> {
    List<CustomBuild> findByUserId(Long userId);
}
