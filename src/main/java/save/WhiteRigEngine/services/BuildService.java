package save.WhiteRigEngine.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import save.WhiteRigEngine.entities.ComponentProduct;
import save.WhiteRigEngine.entities.CustomBuild;
import save.WhiteRigEngine.exceptions.ResourceNotFoundException;
import save.WhiteRigEngine.model.BuildRequestDTO;
import save.WhiteRigEngine.repositories.BuildRepository;
import save.WhiteRigEngine.repositories.ComponentRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

@Service
public class BuildService {

    private final BuildRepository buildRepository;
    private final ComponentRepository componentRepository;

    @Autowired
    public BuildService(BuildRepository buildRepository, ComponentRepository componentRepository) {
        this.buildRepository = buildRepository;
        this.componentRepository = componentRepository;
    }

    public List<CustomBuild> getAllBuilds() {
        return buildRepository.findAll();
    }

    public CustomBuild getBuildById(Long id) {
        return buildRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Configurazione PC non trovata con ID: " + id));
    }

    public List<CustomBuild> getBuildsByUserId(Long userId) {
        return buildRepository.findByUserId(userId);
    }

    public CustomBuild createBuild(BuildRequestDTO dto) {
        CustomBuild build = new CustomBuild();
        build.setBuildName(dto.getBuildName());
        build.setUserId(dto.getUserId());

        build.setCpu(fetchComponent(dto.getCpuId()));
        build.setGpu(fetchComponent(dto.getGpuId()));
        build.setRam(fetchComponent(dto.getRamId()));
        build.setMotherboard(fetchComponent(dto.getMotherboardId()));
        build.setStorage(fetchComponent(dto.getStorageId()));
        build.setCooling(fetchComponent(dto.getCoolingId()));
        build.setPsu(fetchComponent(dto.getPsuId()));
        build.setPcCase(fetchComponent(dto.getCaseId()));

        BigDecimal totalPrice = Stream.of(
                        build.getCpu(),
                        build.getGpu(),
                        build.getRam(),
                        build.getMotherboard(),
                        build.getStorage(),
                        build.getCooling(),
                        build.getPsu(),
                        build.getPcCase()
                )
                .filter(Objects::nonNull)
                .map(ComponentProduct::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        build.setTotalPrice(totalPrice);
        return buildRepository.save(build);
    }

    public void deleteBuild(Long id) {
        CustomBuild build = getBuildById(id);
        buildRepository.delete(build);
    }

    private ComponentProduct fetchComponent(Long id) {
        return (id != null) ? componentRepository.findById(id).orElse(null) : null;
    }
}