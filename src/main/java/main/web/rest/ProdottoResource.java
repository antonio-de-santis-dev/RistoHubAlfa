package main.web.rest;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import main.repository.ProdottoRepository;
import main.security.AuthoritiesConstants;
import main.service.ProdottoService;
import main.service.dto.ProdottoDTO;
import main.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * PERCORSO: src/main/java/main/web/rest/ProdottoResource.java
 * → SOSTITUISCE il file generato da JHipster
 *   Aggiunge:
 *   - GET /api/prodottos/by-portata/{portataId}  → usato dal menu-editor
 *   - GET /api/menus/{menuId}/prodotti-completi   → usato da piatti-giorno-gestione
 */
@RestController
@RequestMapping("/api")
public class ProdottoResource {

    private static final Logger LOG = LoggerFactory.getLogger(ProdottoResource.class);
    private static final String ENTITY_NAME = "prodotto";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProdottoService prodottoService;
    private final ProdottoRepository prodottoRepository;

    public ProdottoResource(ProdottoService prodottoService, ProdottoRepository prodottoRepository) {
        this.prodottoService = prodottoService;
        this.prodottoRepository = prodottoRepository;
    }

    // ── CRUD standard JHipster ─────────────────────────────────────────────────

    @PostMapping("/prodottos")
    @Secured(AuthoritiesConstants.USER)
    public ResponseEntity<ProdottoDTO> createProdotto(@Valid @RequestBody ProdottoDTO prodottoDTO) throws URISyntaxException {
        LOG.debug("REST request to save Prodotto : {}", prodottoDTO);
        if (prodottoDTO.getId() != null) {
            throw new BadRequestAlertException("Un nuovo prodotto non può avere un ID", ENTITY_NAME, "idexists");
        }
        ProdottoDTO result = prodottoService.save(prodottoDTO);
        return ResponseEntity.created(new URI("/api/prodottos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @PutMapping("/prodottos/{id}")
    @Secured(AuthoritiesConstants.USER)
    public ResponseEntity<ProdottoDTO> updateProdotto(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ProdottoDTO prodottoDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Prodotto : {}, {}", id, prodottoDTO);
        if (prodottoDTO.getId() == null) {
            throw new BadRequestAlertException("ID mancante", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, prodottoDTO.getId())) {
            throw new BadRequestAlertException("ID non coincide", ENTITY_NAME, "idinvalid");
        }
        if (!prodottoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entità non trovata", ENTITY_NAME, "idnotfound");
        }
        ProdottoDTO result = prodottoService.update(prodottoDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, prodottoDTO.getId().toString()))
            .body(result);
    }

    @PatchMapping(value = "/prodottos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    @Secured(AuthoritiesConstants.USER)
    public ResponseEntity<ProdottoDTO> partialUpdateProdotto(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ProdottoDTO prodottoDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Prodotto : {}, {}", id, prodottoDTO);
        if (prodottoDTO.getId() == null) {
            throw new BadRequestAlertException("ID mancante", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, prodottoDTO.getId())) {
            throw new BadRequestAlertException("ID non coincide", ENTITY_NAME, "idinvalid");
        }
        if (!prodottoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entità non trovata", ENTITY_NAME, "idnotfound");
        }
        Optional<ProdottoDTO> result = prodottoService.partialUpdate(prodottoDTO);
        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, prodottoDTO.getId().toString())
        );
    }

    @GetMapping("/prodottos")
    public ResponseEntity<List<ProdottoDTO>> getAllProdottos(
        @RequestParam(required = false) Long portataId,
        @RequestParam(required = false) Long menuId
    ) {
        LOG.debug("REST request to get Prodottos. portataId={}, menuId={}", portataId, menuId);
        if (portataId != null) {
            return ResponseEntity.ok(prodottoService.findByPortataId(portataId));
        }
        if (menuId != null) {
            return ResponseEntity.ok(prodottoService.findByMenuId(menuId));
        }
        return ResponseEntity.ok(prodottoService.findAll());
    }

    @GetMapping("/prodottos/{id}")
    public ResponseEntity<ProdottoDTO> getProdotto(@PathVariable Long id) {
        LOG.debug("REST request to get Prodotto : {}", id);
        Optional<ProdottoDTO> prodottoDTO = prodottoService.findOne(id);
        return ResponseUtil.wrapOrNotFound(prodottoDTO);
    }

    @DeleteMapping("/prodottos/{id}")
    @Secured(AuthoritiesConstants.USER)
    public ResponseEntity<Void> deleteProdotto(@PathVariable Long id) {
        LOG.debug("REST request to delete Prodotto : {}", id);
        prodottoService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    // ── Endpoint custom ────────────────────────────────────────────────────────

    /**
     * GET /api/prodottos/by-portata/{portataId}
     *
     * Tutti i prodotti (visibili e non) di una portata con allergeni.
     * Usato dal menu-editor per mostrare la lista completa al ristoratore.
     */
    @GetMapping("/prodottos/by-portata/{portataId}")
    @Secured(AuthoritiesConstants.USER)
    public ResponseEntity<List<ProdottoDTO>> getProdottiByPortata(@PathVariable Long portataId) {
        LOG.debug("REST request to get Prodotti by portata {}", portataId);
        return ResponseEntity.ok(prodottoService.findByPortataId(portataId));
    }

    /**
     * GET /api/menus/{menuId}/prodotti-completi
     *
     * Tutti i prodotti del menu con allergeni già caricati.
     * Usato da piatti-giorno-gestione per la selezione del prodotto.
     */
    @GetMapping("/menus/{menuId}/prodotti-completi")
    @Secured(AuthoritiesConstants.USER)
    public ResponseEntity<List<ProdottoDTO>> getProdottiCompletiByMenu(@PathVariable Long menuId) {
        LOG.debug("REST request to get tutti i prodotti del menu {}", menuId);
        return ResponseEntity.ok(prodottoService.findByMenuId(menuId));
    }
}
