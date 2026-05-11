package main.web.rest;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import main.repository.ContattoItemRepository;
import main.service.ContattoItemService;
import main.service.dto.ContattoItemDTO;
import main.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link main.domain.ContattoItem}.
 */
@RestController
@RequestMapping("/api/contatto-items")
public class ContattoItemResource {

    private static final Logger LOG = LoggerFactory.getLogger(ContattoItemResource.class);

    private static final String ENTITY_NAME = "contattoItem";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ContattoItemService contattoItemService;

    private final ContattoItemRepository contattoItemRepository;

    public ContattoItemResource(ContattoItemService contattoItemService, ContattoItemRepository contattoItemRepository) {
        this.contattoItemService = contattoItemService;
        this.contattoItemRepository = contattoItemRepository;
    }

    /**
     * {@code POST  /contatto-items} : Create a new contattoItem.
     *
     * @param contattoItemDTO the contattoItemDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new contattoItemDTO, or with status {@code 400 (Bad Request)} if the contattoItem has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ContattoItemDTO> createContattoItem(@Valid @RequestBody ContattoItemDTO contattoItemDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save ContattoItem : {}", contattoItemDTO);
        if (contattoItemDTO.getId() != null) {
            throw new BadRequestAlertException("A new contattoItem cannot already have an ID", ENTITY_NAME, "idexists");
        }
        contattoItemDTO = contattoItemService.save(contattoItemDTO);
        return ResponseEntity.created(new URI("/api/contatto-items/" + contattoItemDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, contattoItemDTO.getId().toString()))
            .body(contattoItemDTO);
    }

    /**
     * {@code PUT  /contatto-items/:id} : Updates an existing contattoItem.
     *
     * @param id the id of the contattoItemDTO to save.
     * @param contattoItemDTO the contattoItemDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated contattoItemDTO,
     * or with status {@code 400 (Bad Request)} if the contattoItemDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the contattoItemDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ContattoItemDTO> updateContattoItem(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ContattoItemDTO contattoItemDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update ContattoItem : {}, {}", id, contattoItemDTO);
        if (contattoItemDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, contattoItemDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!contattoItemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        contattoItemDTO = contattoItemService.update(contattoItemDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, contattoItemDTO.getId().toString()))
            .body(contattoItemDTO);
    }

    /**
     * {@code PATCH  /contatto-items/:id} : Partial updates given fields of an existing contattoItem, field will ignore if it is null
     *
     * @param id the id of the contattoItemDTO to save.
     * @param contattoItemDTO the contattoItemDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated contattoItemDTO,
     * or with status {@code 400 (Bad Request)} if the contattoItemDTO is not valid,
     * or with status {@code 404 (Not Found)} if the contattoItemDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the contattoItemDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ContattoItemDTO> partialUpdateContattoItem(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ContattoItemDTO contattoItemDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update ContattoItem partially : {}, {}", id, contattoItemDTO);
        if (contattoItemDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, contattoItemDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!contattoItemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ContattoItemDTO> result = contattoItemService.partialUpdate(contattoItemDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, contattoItemDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /contatto-items} : get all the contattoItems.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of contattoItems in body.
     */
    @GetMapping("")
    public List<ContattoItemDTO> getAllContattoItems() {
        LOG.debug("REST request to get all ContattoItems");
        return contattoItemService.findAll();
    }

    /**
     * {@code GET  /contatto-items/:id} : get the "id" contattoItem.
     *
     * @param id the id of the contattoItemDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the contattoItemDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ContattoItemDTO> getContattoItem(@PathVariable("id") Long id) {
        LOG.debug("REST request to get ContattoItem : {}", id);
        Optional<ContattoItemDTO> contattoItemDTO = contattoItemService.findOne(id);
        return ResponseUtil.wrapOrNotFound(contattoItemDTO);
    }

    /**
     * {@code DELETE  /contatto-items/:id} : delete the "id" contattoItem.
     *
     * @param id the id of the contattoItemDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContattoItem(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete ContattoItem : {}", id);
        contattoItemService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
