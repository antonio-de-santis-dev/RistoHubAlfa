package main.service;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import main.domain.ProfiloRistoratore;
import main.repository.ProfiloRistoratoreRepository;
import main.service.dto.ProfiloRistoratoreDTO;
import main.service.mapper.ProfiloRistoratoreMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link main.domain.ProfiloRistoratore}.
 */
@Service
@Transactional
public class ProfiloRistoratoreService {

    private static final Logger LOG = LoggerFactory.getLogger(ProfiloRistoratoreService.class);

    private final ProfiloRistoratoreRepository profiloRistoratoreRepository;

    private final ProfiloRistoratoreMapper profiloRistoratoreMapper;

    public ProfiloRistoratoreService(
        ProfiloRistoratoreRepository profiloRistoratoreRepository,
        ProfiloRistoratoreMapper profiloRistoratoreMapper
    ) {
        this.profiloRistoratoreRepository = profiloRistoratoreRepository;
        this.profiloRistoratoreMapper = profiloRistoratoreMapper;
    }

    /**
     * Save a profiloRistoratore.
     *
     * @param profiloRistoratoreDTO the entity to save.
     * @return the persisted entity.
     */
    public ProfiloRistoratoreDTO save(ProfiloRistoratoreDTO profiloRistoratoreDTO) {
        LOG.debug("Request to save ProfiloRistoratore : {}", profiloRistoratoreDTO);
        ProfiloRistoratore profiloRistoratore = profiloRistoratoreMapper.toEntity(profiloRistoratoreDTO);
        profiloRistoratore = profiloRistoratoreRepository.save(profiloRistoratore);
        return profiloRistoratoreMapper.toDto(profiloRistoratore);
    }

    /**
     * Update a profiloRistoratore.
     *
     * @param profiloRistoratoreDTO the entity to save.
     * @return the persisted entity.
     */
    public ProfiloRistoratoreDTO update(ProfiloRistoratoreDTO profiloRistoratoreDTO) {
        LOG.debug("Request to update ProfiloRistoratore : {}", profiloRistoratoreDTO);
        ProfiloRistoratore profiloRistoratore = profiloRistoratoreMapper.toEntity(profiloRistoratoreDTO);
        profiloRistoratore = profiloRistoratoreRepository.save(profiloRistoratore);
        return profiloRistoratoreMapper.toDto(profiloRistoratore);
    }

    /**
     * Partially update a profiloRistoratore.
     *
     * @param profiloRistoratoreDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ProfiloRistoratoreDTO> partialUpdate(ProfiloRistoratoreDTO profiloRistoratoreDTO) {
        LOG.debug("Request to partially update ProfiloRistoratore : {}", profiloRistoratoreDTO);

        return profiloRistoratoreRepository
            .findById(profiloRistoratoreDTO.getId())
            .map(existingProfiloRistoratore -> {
                profiloRistoratoreMapper.partialUpdate(existingProfiloRistoratore, profiloRistoratoreDTO);

                return existingProfiloRistoratore;
            })
            .map(profiloRistoratoreRepository::save)
            .map(profiloRistoratoreMapper::toDto);
    }

    /**
     * Get all the profiloRistoratores.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<ProfiloRistoratoreDTO> findAll() {
        LOG.debug("Request to get all ProfiloRistoratores");
        return profiloRistoratoreRepository
            .findAll()
            .stream()
            .map(profiloRistoratoreMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get all the profiloRistoratores with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<ProfiloRistoratoreDTO> findAllWithEagerRelationships(Pageable pageable) {
        return profiloRistoratoreRepository.findAllWithEagerRelationships(pageable).map(profiloRistoratoreMapper::toDto);
    }

    /**
     * Get one profiloRistoratore by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ProfiloRistoratoreDTO> findOne(Long id) {
        LOG.debug("Request to get ProfiloRistoratore : {}", id);
        return profiloRistoratoreRepository.findOneWithEagerRelationships(id).map(profiloRistoratoreMapper::toDto);
    }

    /**
     * Delete the profiloRistoratore by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete ProfiloRistoratore : {}", id);
        profiloRistoratoreRepository.deleteById(id);
    }
}
