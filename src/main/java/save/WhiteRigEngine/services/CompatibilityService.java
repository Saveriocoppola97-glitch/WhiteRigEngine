package save.WhiteRigEngine.services;

import org.springframework.stereotype.Service;
import save.WhiteRigEngine.entities.ComponentProduct;
import save.WhiteRigEngine.model.BuildRequestDTO;
import save.WhiteRigEngine.model.CompatibilityResultDTO;
import save.WhiteRigEngine.repositories.ComponentRepository;

@Service
public class CompatibilityService {

    private final ComponentRepository componentRepository;

    public CompatibilityService(ComponentRepository componentRepository) {
        this.componentRepository = componentRepository;
    }

    public CompatibilityResultDTO validateBuild(BuildRequestDTO request) {
        CompatibilityResultDTO result = new CompatibilityResultDTO();

        ComponentProduct cpu = fetchComponent(request.getCpuId());
        ComponentProduct gpu = fetchComponent(request.getGpuId());
        ComponentProduct motherboard = fetchComponent(request.getMotherboardId());
        ComponentProduct ram = fetchComponent(request.getRamId());
        ComponentProduct psu = fetchComponent(request.getPsuId());
        ComponentProduct pcCase = fetchComponent(request.getCaseId());

        // 1. VERIFICA SOCKET CPU vs Motherboard
        if (cpu != null && motherboard != null) {
            if (cpu.getSocket() != null && motherboard.getSocket() != null) {
                if (!cpu.getSocket().equalsIgnoreCase(motherboard.getSocket())) {
                    result.addError("Incompatibilità Socket: La CPU ha socket " + cpu.getSocket()
                            + " ma la Scheda Madre richiede socket " + motherboard.getSocket() + ".");
                }
            }
        }

        // 2. VERIFICA RAM RAM vs Motherboard
        if (ram != null && motherboard != null) {
            if (ram.getRamType() != null && motherboard.getRamType() != null) {
                if (!ram.getRamType().equalsIgnoreCase(motherboard.getRamType())) {
                    result.addError("Incompatibilità RAM: La RAM è " + ram.getRamType()
                            + " ma la Scheda Madre supporta " + motherboard.getRamType() + ".");
                }
            }
        }

        // 3. VERIFICA FORM FACTOR Motherboard vs Case
        if (motherboard != null && pcCase != null) {
            if (motherboard.getFormFactor() != null && pcCase.getFormFactor() != null) {
                if (!motherboard.getFormFactor().equalsIgnoreCase(pcCase.getFormFactor())) {
                    result.addWarning("Attenzione Form Factor: La scheda madre è " + motherboard.getFormFactor()
                            + " mentre il case dichiara formato " + pcCase.getFormFactor() + ". Verifica lo spazio a disposizione.");
                }
            }
        }

        // 4. CALCOLO CONSUMO ENERGETICO (WATT)
        int estimatedWattage = 100; // Margine base
        if (cpu != null && cpu.getWattage() != null) estimatedWattage += cpu.getWattage();
        if (gpu != null && gpu.getWattage() != null) estimatedWattage += gpu.getWattage();

        result.setEstimatedWattage(estimatedWattage);

        if (psu != null && psu.getWattage() != null) {
            if (psu.getWattage() < estimatedWattage) {
                result.addError("Alimentatore Insufficiente: Il sistema stimato richiede almeno "
                        + estimatedWattage + "W, ma la PSU scelta eroga " + psu.getWattage() + "W.");
            } else if (psu.getWattage() < estimatedWattage + 50) {
                result.addWarning("Alimentatore al limite: Si consiglia una PSU con un margine superiore di Watt.");
            }
        }

        return result;
    }

    private ComponentProduct fetchComponent(Long id) {
        if (id == null) return null;
        return componentRepository.findById(id).orElse(null);
    }
}
