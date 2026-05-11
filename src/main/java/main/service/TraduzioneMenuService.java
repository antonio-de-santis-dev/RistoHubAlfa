package main.service;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import main.domain.TraduzioneMenu;
import main.repository.TraduzioneMenuRepository;
import main.service.dto.TraduzioneMenuDTO;
import main.service.mapper.TraduzioneMenuMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link main.domain.TraduzioneMenu}.
 */
@Service
@Transactional
public class TraduzioneMenuService {

    private static final Logger LOG = LoggerFactory.getLogger(TraduzioneMenuService.class);

    private final TraduzioneMenuRepository traduzioneMenuRepository;

    private final TraduzioneMenuMapper traduzioneMenuMapper;

    public TraduzioneMenuService(TraduzioneMenuRepository traduzioneMenuRepository, TraduzioneMenuMapper traduzioneMenuMapper) {
        this.traduzioneMenuRepository = traduzioneMenuRepository;
        this.traduzioneMenuMapper = traduzioneMenuMapper;
    }

    /**
     * Save a traduzioneMenu.
     *
     * @param traduzioneMenuDTO the entity to save.
     * @return the persisted entity.
     */
    public TraduzioneMenuDTO save(TraduzioneMenuDTO traduzioneMenuDTO) {
        LOG.debug("Request to save TraduzioneMenu : {}", traduzioneMenuDTO);
        TraduzioneMenu traduzioneMenu = traduzioneMenuMapper.toEntity(traduzioneMenuDTO);
        traduzioneMenu = traduzioneMenuRepository.save(traduzioneMenu);
        return traduzioneMenuMapper.toDto(traduzioneMenu);
    }

    /**
     * Update a traduzioneMenu.
     *
     * @param traduzioneMenuDTO the entity to save.
     * @return the persisted entity.
     */
    public TraduzioneMenuDTO update(TraduzioneMenuDTO traduzioneMenuDTO) {
        LOG.debug("Request to update TraduzioneMenu : {}", traduzioneMenuDTO);
        TraduzioneMenu traduzioneMenu = traduzioneMenuMapper.toEntity(traduzioneMenuDTO);
        traduzioneMenu = traduzioneMenuRepository.save(traduzioneMenu);
        return traduzioneMenuMapper.toDto(traduzioneMenu);
    }

    /**
     * Partially update a traduzioneMenu.
     *
     * @param traduzioneMenuDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<TraduzioneMenuDTO> partialUpdate(TraduzioneMenuDTO traduzioneMenuDTO) {
        LOG.debug("Request to partially update TraduzioneMenu : {}", traduzioneMenuDTO);

        return traduzioneMenuRepository
            .findById(traduzioneMenuDTO.getId())
            .map(existingTraduzioneMenu -> {
                traduzioneMenuMapper.partialUpdate(existingTraduzioneMenu, traduzioneMenuDTO);

                return existingTraduzioneMenu;
            })
            .map(traduzioneMenuRepository::save)
            .map(traduzioneMenuMapper::toDto);
    }

    /**
     * Get all the traduzioneMenus.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<TraduzioneMenuDTO> findAll() {
        LOG.debug("Request to get all TraduzioneMenus");
        return traduzioneMenuRepository
            .findAll()
            .stream()
            .map(traduzioneMenuMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one traduzioneMenu by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<TraduzioneMenuDTO> findOne(Long id) {
        LOG.debug("Request to get TraduzioneMenu : {}", id);
        return traduzioneMenuRepository.findById(id).map(traduzioneMenuMapper::toDto);
    }

    /**
     * Delete the traduzioneMenu by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete TraduzioneMenu : {}", id);
        traduzioneMenuRepository.deleteById(id);
    }
}
