package main.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import main.repository.ListaContattiRepository;
import main.service.ListaContattiService;
import main.service.dto.ListaContattiDTO;
import main.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link main.domain.ListaContatti}.
 */
@RestController
@RequestMapping("/api/lista-contattis")
public class ListaContattiResource {

    private static final Logger LOG = LoggerFactory.getLogger(ListaContattiResource.class);

    private static final String ENTITY_NAME = "listaContatti";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ListaContattiService listaContattiService;

    private final ListaContattiRepository listaContattiRepository;

    public ListaContattiResource(ListaContattiService listaContattiService, ListaContattiRepository listaContattiRepository) {
        this.listaContattiService = listaContattiService;
        this.listaContattiRepository = listaContattiRepository;
    }

    /**
     * {@code POST  /lista-contattis} : Create a new listaContatti.
     *
     * @param listaContattiDTO the listaContattiDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new listaContattiDTO, or with status {@code 400 (Bad Request)} if the listaContatti has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ListaContattiDTO> createListaContatti(@RequestBody ListaContattiDTO listaContattiDTO) throws URISyntaxException {
        LOG.debug("REST request to save ListaContatti : {}", listaContattiDTO);
        if (listaContattiDTO.getId() != null) {
            throw new BadRequestAlertException("A new listaContatti cannot already have an ID", ENTITY_NAME, "idexists");
        }
        listaContattiDTO = listaContattiService.save(listaContattiDTO);
        return ResponseEntity.created(new URI("/api/lista-contattis/" + listaContattiDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, listaContattiDTO.getId().toString()))
            .body(listaContattiDTO);
    }

    /**
     * {@code PUT  /lista-contattis/:id} : Updates an existing listaContatti.
     *
     * @param id the id of the listaContattiDTO to save.
     * @param listaContattiDTO the listaContattiDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated listaContattiDTO,
     * or with status {@code 400 (Bad Request)} if the listaContattiDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the listaContattiDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ListaContattiDTO> updateListaContatti(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ListaContattiDTO listaContattiDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update ListaContatti : {}, {}", id, listaContattiDTO);
        if (listaContattiDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, listaContattiDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!listaContattiRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        listaContattiDTO = listaContattiService.update(listaContattiDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, listaContattiDTO.getId().toString()))
            .body(listaContattiDTO);
    }

    /**
     * {@code PATCH  /lista-contattis/:id} : Partial updates given fields of an existing listaContatti, field will ignore if it is null
     *
     * @param id the id of the listaContattiDTO to save.
     * @param listaContattiDTO the listaContattiDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated listaContattiDTO,
     * or with status {@code 400 (Bad Request)} if the listaContattiDTO is not valid,
     * or with status {@code 404 (Not Found)} if the listaContattiDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the listaContattiDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ListaContattiDTO> partialUpdateListaContatti(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ListaContattiDTO listaContattiDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update ListaContatti partially : {}, {}", id, listaContattiDTO);
        if (listaContattiDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, listaContattiDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!listaContattiRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ListaContattiDTO> result = listaContattiService.partialUpdate(listaContattiDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, listaContattiDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /lista-contattis} : get all the listaContattis.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of listaContattis in body.
     */
    @GetMapping("")
    public List<ListaContattiDTO> getAllListaContattis(@RequestParam(name = "filter", required = false) String filter) {
        if ("menu-is-null".equals(filter)) {
            LOG.debug("REST request to get all ListaContattis where menu is null");
            return listaContattiService.findAllWhereMenuIsNull();
        }
        LOG.debug("REST request to get all ListaContattis");
        return listaContattiService.findAll();
    }

    /**
     * {@code GET  /lista-contattis/:id} : get the "id" listaContatti.
     *
     * @param id the id of the listaContattiDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the listaContattiDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ListaContattiDTO> getListaContatti(@PathVariable("id") Long id) {
        LOG.debug("REST request to get ListaContatti : {}", id);
        Optional<ListaContattiDTO> listaContattiDTO = listaContattiService.findOne(id);
        return ResponseUtil.wrapOrNotFound(listaContattiDTO);
    }

    /**
     * {@code DELETE  /lista-contattis/:id} : delete the "id" listaContatti.
     *
     * @param id the id of the listaContattiDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteListaContatti(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete ListaContatti : {}", id);
        listaContattiService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
