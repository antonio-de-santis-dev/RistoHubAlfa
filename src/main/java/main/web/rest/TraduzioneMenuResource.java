package main.web.rest;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import main.repository.TraduzioneMenuRepository;
import main.service.TraduzioneMenuService;
import main.service.dto.TraduzioneMenuDTO;
import main.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link main.domain.TraduzioneMenu}.
 */
@RestController
@RequestMapping("/api/traduzione-menus")
public class TraduzioneMenuResource {

    private static final Logger LOG = LoggerFactory.getLogger(TraduzioneMenuResource.class);

    private static final String ENTITY_NAME = "traduzioneMenu";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TraduzioneMenuService traduzioneMenuService;

    private final TraduzioneMenuRepository traduzioneMenuRepository;

    public TraduzioneMenuResource(TraduzioneMenuService traduzioneMenuService, TraduzioneMenuRepository traduzioneMenuRepository) {
        this.traduzioneMenuService = traduzioneMenuService;
        this.traduzioneMenuRepository = traduzioneMenuRepository;
    }

    /**
     * {@code POST  /traduzione-menus} : Create a new traduzioneMenu.
     *
     * @param traduzioneMenuDTO the traduzioneMenuDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new traduzioneMenuDTO, or with status {@code 400 (Bad Request)} if the traduzioneMenu has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<TraduzioneMenuDTO> createTraduzioneMenu(@Valid @RequestBody TraduzioneMenuDTO traduzioneMenuDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save TraduzioneMenu : {}", traduzioneMenuDTO);
        if (traduzioneMenuDTO.getId() != null) {
            throw new BadRequestAlertException("A new traduzioneMenu cannot already have an ID", ENTITY_NAME, "idexists");
        }
        traduzioneMenuDTO = traduzioneMenuService.save(traduzioneMenuDTO);
        return ResponseEntity.created(new URI("/api/traduzione-menus/" + traduzioneMenuDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, traduzioneMenuDTO.getId().toString()))
            .body(traduzioneMenuDTO);
    }

    /**
     * {@code PUT  /traduzione-menus/:id} : Updates an existing traduzioneMenu.
     *
     * @param id the id of the traduzioneMenuDTO to save.
     * @param traduzioneMenuDTO the traduzioneMenuDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated traduzioneMenuDTO,
     * or with status {@code 400 (Bad Request)} if the traduzioneMenuDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the traduzioneMenuDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<TraduzioneMenuDTO> updateTraduzioneMenu(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody TraduzioneMenuDTO traduzioneMenuDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update TraduzioneMenu : {}, {}", id, traduzioneMenuDTO);
        if (traduzioneMenuDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, traduzioneMenuDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!traduzioneMenuRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        traduzioneMenuDTO = traduzioneMenuService.update(traduzioneMenuDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, traduzioneMenuDTO.getId().toString()))
            .body(traduzioneMenuDTO);
    }

    /**
     * {@code PATCH  /traduzione-menus/:id} : Partial updates given fields of an existing traduzioneMenu, field will ignore if it is null
     *
     * @param id the id of the traduzioneMenuDTO to save.
     * @param traduzioneMenuDTO the traduzioneMenuDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated traduzioneMenuDTO,
     * or with status {@code 400 (Bad Request)} if the traduzioneMenuDTO is not valid,
     * or with status {@code 404 (Not Found)} if the traduzioneMenuDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the traduzioneMenuDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TraduzioneMenuDTO> partialUpdateTraduzioneMenu(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody TraduzioneMenuDTO traduzioneMenuDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update TraduzioneMenu partially : {}, {}", id, traduzioneMenuDTO);
        if (traduzioneMenuDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, traduzioneMenuDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!traduzioneMenuRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TraduzioneMenuDTO> result = traduzioneMenuService.partialUpdate(traduzioneMenuDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, traduzioneMenuDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /traduzione-menus} : get all the traduzioneMenus.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of traduzioneMenus in body.
     */
    @GetMapping("")
    public List<TraduzioneMenuDTO> getAllTraduzioneMenus() {
        LOG.debug("REST request to get all TraduzioneMenus");
        return traduzioneMenuService.findAll();
    }

    /**
     * {@code GET  /traduzione-menus/:id} : get the "id" traduzioneMenu.
     *
     * @param id the id of the traduzioneMenuDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the traduzioneMenuDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<TraduzioneMenuDTO> getTraduzioneMenu(@PathVariable("id") Long id) {
        LOG.debug("REST request to get TraduzioneMenu : {}", id);
        Optional<TraduzioneMenuDTO> traduzioneMenuDTO = traduzioneMenuService.findOne(id);
        return ResponseUtil.wrapOrNotFound(traduzioneMenuDTO);
    }

    /**
     * {@code DELETE  /traduzione-menus/:id} : delete the "id" traduzioneMenu.
     *
     * @param id the id of the traduzioneMenuDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTraduzioneMenu(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete TraduzioneMenu : {}", id);
        traduzioneMenuService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
