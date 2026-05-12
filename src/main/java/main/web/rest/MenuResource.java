// PERCORSO: src/main/java/main/web/rest/MenuResource.java
// ISTRUZIONE: Sostituisce integralmente il file esistente.
// Aggiunge: endpoint GET /api/menus/current-user e usa createMenu() con controllo livello.

package main.web.rest;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import main.repository.MenuRepository;
import main.service.MaxMenuRaggiuntoException;
import main.service.MenuService;
import main.service.dto.MenuDTO;
import main.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller per la gestione dei Menu.
 */
@RestController
@RequestMapping("/api/menus")
public class MenuResource {

    private static final Logger LOG = LoggerFactory.getLogger(MenuResource.class);
    private static final String ENTITY_NAME = "menu";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MenuService menuService;
    private final MenuRepository menuRepository;

    public MenuResource(MenuService menuService, MenuRepository menuRepository) {
        this.menuService = menuService;
        this.menuRepository = menuRepository;
    }

    /**
     * POST /menus : Crea un nuovo menu.
     * Applica il controllo del livello utente tramite MenuService.createMenu().
     */
    @PostMapping("")
    public ResponseEntity<?> createMenu(@Valid @RequestBody MenuDTO menuDTO) throws URISyntaxException {
        LOG.debug("REST request to save Menu : {}", menuDTO);
        if (menuDTO.getId() != null) {
            throw new BadRequestAlertException("A new menu cannot already have an ID", ENTITY_NAME, "idexists");
        }
        try {
            menuDTO = menuService.createMenu(menuDTO);
        } catch (MaxMenuRaggiuntoException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
        return ResponseEntity.created(new URI("/api/menus/" + menuDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, menuDTO.getId().toString()))
            .body(menuDTO);
    }

    /**
     * PUT /menus/:id : Aggiorna un menu esistente.
     */
    @PutMapping("/{id}")
    public ResponseEntity<MenuDTO> updateMenu(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody MenuDTO menuDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Menu : {}, {}", id, menuDTO);
        if (menuDTO.getId() == null) throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        if (!Objects.equals(id, menuDTO.getId())) throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        if (!menuRepository.existsById(id)) throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");

        menuDTO = menuService.update(menuDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, menuDTO.getId().toString()))
            .body(menuDTO);
    }

    /**
     * PATCH /menus/:id : Aggiornamento parziale.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<MenuDTO> partialUpdateMenu(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody MenuDTO menuDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Menu : {}, {}", id, menuDTO);
        if (menuDTO.getId() == null) throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        if (!Objects.equals(id, menuDTO.getId())) throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        if (!menuRepository.existsById(id)) throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");

        Optional<MenuDTO> result = menuService.partialUpdate(menuDTO);
        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, menuDTO.getId().toString())
        );
    }

    /**
     * GET /menus : Restituisce tutti i menu (solo admin).
     */
    @GetMapping("")
    public List<MenuDTO> getAllMenus() {
        LOG.debug("REST request to get all Menus");
        return menuService.findAll();
    }

    /**
     * GET /menus/current-user : Restituisce i menu dell'utente corrente.
     * Usato dalla Home page e dal componente MenuList.
     */
    @GetMapping("/current-user")
    public List<MenuDTO> getMenusCurrentUser() {
        LOG.debug("REST request to get Menus of current user");
        return menuService.findAllCurrentUser();
    }

    /**
     * GET /menus/:id : Restituisce un menu specifico.
     */
    @GetMapping("/{id}")
    public ResponseEntity<MenuDTO> getMenu(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Menu : {}", id);
        Optional<MenuDTO> menuDTO = menuService.findOne(id);
        return ResponseUtil.wrapOrNotFound(menuDTO);
    }

    /**
     * DELETE /menus/:id : Elimina un menu.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenu(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Menu : {}", id);
        menuService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
