package main.service;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import main.domain.ContattoItem;
import main.repository.ContattoItemRepository;
import main.service.dto.ContattoItemDTO;
import main.service.mapper.ContattoItemMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link main.domain.ContattoItem}.
 */
@Service
@Transactional
public class ContattoItemService {

    private static final Logger LOG = LoggerFactory.getLogger(ContattoItemService.class);

    private final ContattoItemRepository contattoItemRepository;

    private final ContattoItemMapper contattoItemMapper;

    public ContattoItemService(ContattoItemRepository contattoItemRepository, ContattoItemMapper contattoItemMapper) {
        this.contattoItemRepository = contattoItemRepository;
        this.contattoItemMapper = contattoItemMapper;
    }

    /**
     * Save a contattoItem.
     *
     * @param contattoItemDTO the entity to save.
     * @return the persisted entity.
     */
    public ContattoItemDTO save(ContattoItemDTO contattoItemDTO) {
        LOG.debug("Request to save ContattoItem : {}", contattoItemDTO);
        ContattoItem contattoItem = contattoItemMapper.toEntity(contattoItemDTO);
        contattoItem = contattoItemRepository.save(contattoItem);
        return contattoItemMapper.toDto(contattoItem);
    }

    /**
     * Update a contattoItem.
     *
     * @param contattoItemDTO the entity to save.
     * @return the persisted entity.
     */
    public ContattoItemDTO update(ContattoItemDTO contattoItemDTO) {
        LOG.debug("Request to update ContattoItem : {}", contattoItemDTO);
        ContattoItem contattoItem = contattoItemMapper.toEntity(contattoItemDTO);
        contattoItem = contattoItemRepository.save(contattoItem);
        return contattoItemMapper.toDto(contattoItem);
    }

    /**
     * Partially update a contattoItem.
     *
     * @param contattoItemDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ContattoItemDTO> partialUpdate(ContattoItemDTO contattoItemDTO) {
        LOG.debug("Request to partially update ContattoItem : {}", contattoItemDTO);

        return contattoItemRepository
            .findById(contattoItemDTO.getId())
            .map(existingContattoItem -> {
                contattoItemMapper.partialUpdate(existingContattoItem, contattoItemDTO);

                return existingContattoItem;
            })
            .map(contattoItemRepository::save)
            .map(contattoItemMapper::toDto);
    }

    /**
     * Get all the contattoItems.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<ContattoItemDTO> findAll() {
        LOG.debug("Request to get all ContattoItems");
        return contattoItemRepository.findAll().stream().map(contattoItemMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one contattoItem by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ContattoItemDTO> findOne(Long id) {
        LOG.debug("Request to get ContattoItem : {}", id);
        return contattoItemRepository.findById(id).map(contattoItemMapper::toDto);
    }

    /**
     * Delete the contattoItem by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete ContattoItem : {}", id);
        contattoItemRepository.deleteById(id);
    }
}
