package main.service;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import main.domain.PiattoDelGiorno;
import main.domain.enumeration.LivelloUtente;
import main.repository.PiattoDelGiornoRepository;
import main.repository.ProfiloRistoratoreRepository;
import main.security.SecurityUtils;
import main.service.dto.PiattoDelGiornoDTO;
import main.service.mapper.PiattoDelGiornoMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service per la gestione dei Piatti del Giorno.
 * Estende il service JHipster con il controllo del livello utente.
 *
 * LIVELLO_1 → piatti del giorno NON disponibili
 * LIVELLO_2 → max 5 piatti del giorno totali tra tutti i menu dell'utente
 * LIVELLO_3 → nessun limite
 *
 * Percorso: src/main/java/main/service/PiattoDelGiornoService.java
 * → SOSTITUISCE il file generato da JHipster
 */
@Service
@Transactional
public class PiattoDelGiornoService {

    private static final Logger LOG = LoggerFactory.getLogger(PiattoDelGiornoService.class);

    private static final int MAX_PIATTI_LIVELLO_2 = 5;

    private final PiattoDelGiornoRepository piattoDelGiornoRepository;
    private final PiattoDelGiornoMapper piattoDelGiornoMapper;
    private final ProfiloRistoratoreRepository profiloRistoratoreRepository;

    public PiattoDelGiornoService(
        PiattoDelGiornoRepository piattoDelGiornoRepository,
        PiattoDelGiornoMapper piattoDelGiornoMapper,
        ProfiloRistoratoreRepository profiloRistoratoreRepository
    ) {
        this.piattoDelGiornoRepository = piattoDelGiornoRepository;
        this.piattoDelGiornoMapper = piattoDelGiornoMapper;
        this.profiloRistoratoreRepository = profiloRistoratoreRepository;
    }

    /**
     * Crea un nuovo piatto del giorno dopo aver verificato il livello utente.
     *
     * @param piattoDelGiornoDTO il DTO da salvare
     * @return il piatto salvato
     * @throws PiattoDelGiornoNonDisponibileException se il livello non consente l'operazione
     */
    public PiattoDelGiornoDTO createPiattoDelGiorno(PiattoDelGiornoDTO piattoDelGiornoDTO) {
        LOG.debug("Request to create PiattoDelGiorno with livello check: {}", piattoDelGiornoDTO);

        String currentLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("Utente non autenticato"));

        LivelloUtente livello = profiloRistoratoreRepository
            .findOneByUserLogin(currentLogin)
            .map(p -> p.getLivello())
            .orElse(LivelloUtente.LIVELLO_1);

        switch (livello) {
            case LIVELLO_1 -> throw new PiattoDelGiornoNonDisponibileException();
            case LIVELLO_2 -> {
                long totale = piattoDelGiornoRepository.countByRistoratoreLogin(currentLogin);
                if (totale >= MAX_PIATTI_LIVELLO_2) {
                    throw new PiattoDelGiornoNonDisponibileException(MAX_PIATTI_LIVELLO_2);
                }
            }
            case LIVELLO_3 -> {
                /* nessun limite */
            }
        }

        PiattoDelGiorno piatto = piattoDelGiornoMapper.toEntity(piattoDelGiornoDTO);
        piatto = piattoDelGiornoRepository.save(piatto);
        LOG.debug("PiattoDelGiorno creato (livello={}): {}", livello, piatto);
        return piattoDelGiornoMapper.toDto(piatto);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Metodi standard JHipster (invariati)
    // ─────────────────────────────────────────────────────────────────────────

    public PiattoDelGiornoDTO save(PiattoDelGiornoDTO piattoDelGiornoDTO) {
        LOG.debug("Request to save PiattoDelGiorno : {}", piattoDelGiornoDTO);
        PiattoDelGiorno p = piattoDelGiornoMapper.toEntity(piattoDelGiornoDTO);
        p = piattoDelGiornoRepository.save(p);
        return piattoDelGiornoMapper.toDto(p);
    }

    public PiattoDelGiornoDTO update(PiattoDelGiornoDTO piattoDelGiornoDTO) {
        LOG.debug("Request to update PiattoDelGiorno : {}", piattoDelGiornoDTO);
        PiattoDelGiorno p = piattoDelGiornoMapper.toEntity(piattoDelGiornoDTO);
        p = piattoDelGiornoRepository.save(p);
        return piattoDelGiornoMapper.toDto(p);
    }

    public Optional<PiattoDelGiornoDTO> partialUpdate(PiattoDelGiornoDTO piattoDelGiornoDTO) {
        LOG.debug("Request to partially update PiattoDelGiorno : {}", piattoDelGiornoDTO);
        return piattoDelGiornoRepository
            .findById(piattoDelGiornoDTO.getId())
            .map(existing -> {
                piattoDelGiornoMapper.partialUpdate(existing, piattoDelGiornoDTO);
                return existing;
            })
            .map(piattoDelGiornoRepository::save)
            .map(piattoDelGiornoMapper::toDto);
    }

    @Transactional(readOnly = true)
    public List<PiattoDelGiornoDTO> findAll() {
        LOG.debug("Request to get all PiattoDelGiornos");
        return piattoDelGiornoRepository
            .findAll()
            .stream()
            .map(piattoDelGiornoMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    @Transactional(readOnly = true)
    public Optional<PiattoDelGiornoDTO> findOne(Long id) {
        LOG.debug("Request to get PiattoDelGiorno : {}", id);
        return piattoDelGiornoRepository.findById(id).map(piattoDelGiornoMapper::toDto);
    }

    public void delete(Long id) {
        LOG.debug("Request to delete PiattoDelGiorno : {}", id);
        piattoDelGiornoRepository.deleteById(id);
    }
}
