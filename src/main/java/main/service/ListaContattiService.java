package main.service;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import main.domain.ListaContatti;
import main.repository.ListaContattiRepository;
import main.service.dto.ListaContattiDTO;
import main.service.mapper.ListaContattiMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link main.domain.ListaContatti}.
 */
@Service
@Transactional
public class ListaContattiService {

    private static final Logger LOG = LoggerFactory.getLogger(ListaContattiService.class);

    private final ListaContattiRepository listaContattiRepository;

    private final ListaContattiMapper listaContattiMapper;

    public ListaContattiService(ListaContattiRepository listaContattiRepository, ListaContattiMapper listaContattiMapper) {
        this.listaContattiRepository = listaContattiRepository;
        this.listaContattiMapper = listaContattiMapper;
    }

    /**
     * Save a listaContatti.
     *
     * @param listaContattiDTO the entity to save.
     * @return the persisted entity.
     */
    public ListaContattiDTO save(ListaContattiDTO listaContattiDTO) {
        LOG.debug("Request to save ListaContatti : {}", listaContattiDTO);
        ListaContatti listaContatti = listaContattiMapper.toEntity(listaContattiDTO);
        listaContatti = listaContattiRepository.save(listaContatti);
        return listaContattiMapper.toDto(listaContatti);
    }

    /**
     * Update a listaContatti.
     *
     * @param listaContattiDTO the entity to save.
     * @return the persisted entity.
     */
    public ListaContattiDTO update(ListaContattiDTO listaContattiDTO) {
        LOG.debug("Request to update ListaContatti : {}", listaContattiDTO);
        ListaContatti listaContatti = listaContattiMapper.toEntity(listaContattiDTO);
        listaContatti = listaContattiRepository.save(listaContatti);
        return listaContattiMapper.toDto(listaContatti);
    }

    /**
     * Partially update a listaContatti.
     *
     * @param listaContattiDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ListaContattiDTO> partialUpdate(ListaContattiDTO listaContattiDTO) {
        LOG.debug("Request to partially update ListaContatti : {}", listaContattiDTO);

        return listaContattiRepository
            .findById(listaContattiDTO.getId())
            .map(existingListaContatti -> {
                listaContattiMapper.partialUpdate(existingListaContatti, listaContattiDTO);

                return existingListaContatti;
            })
            .map(listaContattiRepository::save)
            .map(listaContattiMapper::toDto);
    }

    /**
     * Get all the listaContattis.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<ListaContattiDTO> findAll() {
        LOG.debug("Request to get all ListaContattis");
        return listaContattiRepository.findAll().stream().map(listaContattiMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     *  Get all the listaContattis where Menu is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<ListaContattiDTO> findAllWhereMenuIsNull() {
        LOG.debug("Request to get all listaContattis where Menu is null");
        return StreamSupport.stream(listaContattiRepository.findAll().spliterator(), false)
            .filter(listaContatti -> listaContatti.getMenu() == null)
            .map(listaContattiMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one listaContatti by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ListaContattiDTO> findOne(Long id) {
        LOG.debug("Request to get ListaContatti : {}", id);
        return listaContattiRepository.findById(id).map(listaContattiMapper::toDto);
    }

    /**
     * Delete the listaContatti by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete ListaContatti : {}", id);
        listaContattiRepository.deleteById(id);
    }
}
