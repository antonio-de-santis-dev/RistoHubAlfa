package main.service;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import main.domain.Portata;
import main.domain.enumeration.NomePortataDefault;
import main.domain.enumeration.TipoPortata;
import main.repository.PortataRepository;
import main.service.dto.PortataDTO;
import main.service.mapper.PortataMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * PERCORSO: src/main/java/main/service/PortataService.java
 * → SOSTITUISCE il file generato da JHipster
 *
 * Aggiunge la logica di calcolo automatico del campo "ordine" per le portate.
 *
 * Ordini fissi per portate DEFAULT:
 *   ANTIPASTO=10, PRIMO=20, SECONDO=30, CONTORNO=40,
 *   DOLCE=50, BEVANDA=60, VINO_ROSSO=70, VINO_BIANCO=80,
 *   VINO_ROSATO=90, BIRRA=100, DIGESTIVO=110
 *
 * Portate PERSONALIZZATE:
 *   ordine 45-49 (slot tra CONTORNO e DOLCE).
 *   Se il ristoratore ha già occupato tutti gli slot 45-49,
 *   si usa 49 (ultime arrivate si sovrappongono visivamente — caso raro).
 */
@Service
@Transactional
public class PortataService {

    private static final Logger LOG = LoggerFactory.getLogger(PortataService.class);

    private final PortataRepository portataRepository;
    private final PortataMapper portataMapper;

    public PortataService(PortataRepository portataRepository, PortataMapper portataMapper) {
        this.portataRepository = portataRepository;
        this.portataMapper = portataMapper;
    }

    /**
     * Salva una nuova portata, calcolando automaticamente il campo "ordine"
     * in base al tipo e al nomeDefault.
     */
    public PortataDTO save(PortataDTO portataDTO) {
        LOG.debug("Request to save Portata : {}", portataDTO);
        // Calcola ordine automaticamente se non è già settato dal client
        if (portataDTO.getOrdine() == null || portataDTO.getOrdine() == 0) {
            portataDTO.setOrdine(calcolaOrdine(portataDTO));
        }
        Portata portata = portataMapper.toEntity(portataDTO);
        portata = portataRepository.save(portata);
        return portataMapper.toDto(portata);
    }

    public PortataDTO update(PortataDTO portataDTO) {
        LOG.debug("Request to update Portata : {}", portataDTO);
        Portata portata = portataMapper.toEntity(portataDTO);
        portata = portataRepository.save(portata);
        return portataMapper.toDto(portata);
    }

    public Optional<PortataDTO> partialUpdate(PortataDTO portataDTO) {
        LOG.debug("Request to partially update Portata : {}", portataDTO);
        return portataRepository
            .findById(portataDTO.getId())
            .map(existing -> {
                portataMapper.partialUpdate(existing, portataDTO);
                return existing;
            })
            .map(portataRepository::save)
            .map(portataMapper::toDto);
    }

    @Transactional(readOnly = true)
    public List<PortataDTO> findAll() {
        LOG.debug("Request to get all Portate");
        return portataRepository.findAll().stream().map(portataMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    @Transactional(readOnly = true)
    public Optional<PortataDTO> findOne(Long id) {
        LOG.debug("Request to get Portata : {}", id);
        return portataRepository.findById(id).map(portataMapper::toDto);
    }

    public void delete(Long id) {
        LOG.debug("Request to delete Portata : {}", id);
        portataRepository.deleteById(id);
    }

    // ── Calcolo ordine automatico ──────────────────────────────────────────────

    private int calcolaOrdine(PortataDTO dto) {
        if (dto.getTipo() == TipoPortata.PERSONALIZZATA) {
            // Slot 45-49 per portate personalizzate
            Long menuId = dto.getMenu() != null ? dto.getMenu().getId() : null;
            if (menuId != null) {
                int maxAttuale = portataRepository.findMaxOrdinePersonalizzato(menuId);
                return Math.min(maxAttuale + 1, 49);
            }
            return 45;
        }
        // Portata DEFAULT: ordine fisso
        return ordinePerNomeDefault(dto.getNomeDefault());
    }

    /**
     * Mappa ogni valore di NomePortataDefault al suo ordine di visualizzazione.
     */
    public static int ordinePerNomeDefault(NomePortataDefault nome) {
        if (nome == null) return 45;
        return switch (nome) {
            case ANTIPASTO -> 10;
            case PRIMO -> 20;
            case SECONDO -> 30;
            case CONTORNO -> 40;
            case DOLCE -> 50;
            case BEVANDA -> 60;
            case VINO_ROSSO -> 70;
            case VINO_BIANCO -> 80;
            case VINO_ROSATO -> 90;
            case BIRRA -> 100;
            case DIGESTIVO -> 110;
        };
    }
}
