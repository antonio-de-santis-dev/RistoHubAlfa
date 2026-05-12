// PERCORSO: src/main/java/main/service/MenuService.java
package main.service;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import main.domain.Menu;
import main.domain.ProfiloRistoratore;
import main.domain.enumeration.LivelloUtente;
import main.repository.MenuRepository;
import main.repository.ProfiloRistoratoreRepository;
import main.repository.UserRepository;
import main.security.SecurityUtils;
import main.service.dto.MenuDTO;
import main.service.mapper.MenuMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service per la gestione dei Menu.
 *
 * Il metodo createMenu() applica le regole di business per livello:
 *   LIVELLO_1 → max 1 menu esistente
 *   LIVELLO_2 → max 2 menu esistenti
 *   LIVELLO_3 → illimitati
 *
 * Il conteggio si basa sui menu ESISTENTI (non storici):
 * se un utente elimina un menu, il posto si libera.
 */
@Service
@Transactional
public class MenuService {

    private static final Logger LOG = LoggerFactory.getLogger(MenuService.class);

    private final MenuRepository menuRepository;
    private final MenuMapper menuMapper;
    private final ProfiloRistoratoreRepository profiloRistoratoreRepository;
    private final UserRepository userRepository;

    public MenuService(
        MenuRepository menuRepository,
        MenuMapper menuMapper,
        ProfiloRistoratoreRepository profiloRistoratoreRepository,
        UserRepository userRepository
    ) {
        this.menuRepository = menuRepository;
        this.menuMapper = menuMapper;
        this.profiloRistoratoreRepository = profiloRistoratoreRepository;
        this.userRepository = userRepository;
    }

    /**
     * Crea un nuovo menu per l'utente corrente, verificando i limiti del suo livello.
     * Il ristoratore viene impostato automaticamente sull'utente loggato.
     *
     * @param menuDTO i dati del menu da creare
     * @return il menu creato
     * @throws MaxMenuRaggiuntoException se l'utente ha raggiunto il limite del suo livello
     */
    public MenuDTO createMenu(MenuDTO menuDTO) {
        LOG.debug("Request to create Menu with livello check: {}", menuDTO);

        String login = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("Utente non autenticato"));

        // Recupera il profilo per verificare il livello
        ProfiloRistoratore profilo = profiloRistoratoreRepository
            .findOneByUserLogin(login)
            .orElseThrow(() -> new RuntimeException("ProfiloRistoratore non trovato per l'utente: " + login));

        // Conta i menu esistenti dell'utente
        long menuEsistenti = menuRepository.findByRistoratoreIsCurrentUser().size();

        // Applica le regole per livello
        LivelloUtente livello = profilo.getLivello();
        if (livello == LivelloUtente.LIVELLO_1 && menuEsistenti >= 1) {
            throw new MaxMenuRaggiuntoException(
                "Con il piano Livello 1 puoi avere al massimo 1 menu. Elimina il menu esistente o aggiorna il tuo piano."
            );
        }
        if (livello == LivelloUtente.LIVELLO_2 && menuEsistenti >= 2) {
            throw new MaxMenuRaggiuntoException(
                "Con il piano Livello 2 puoi avere al massimo 2 menu. Elimina un menu esistente o aggiorna il tuo piano."
            );
        }
        // LIVELLO_3: nessun limite

        // Imposta il ristoratore sull'utente corrente
        userRepository
            .findOneByLogin(login)
            .ifPresent(user -> {
                // Il mapper usa menuDTO.ristoratore, lo settiamo via ID
                menuDTO.setRistoratore(new main.service.dto.UserDTO(user));
            });

        Menu menu = menuMapper.toEntity(menuDTO);
        menu = menuRepository.save(menu);
        LOG.info("Menu '{}' creato per utente '{}' (livello: {})", menu.getNome(), login, livello);
        return menuMapper.toDto(menu);
    }

    /**
     * Salva un menu (aggiornamento).
     */
    public MenuDTO save(MenuDTO menuDTO) {
        LOG.debug("Request to save Menu : {}", menuDTO);
        Menu menu = menuMapper.toEntity(menuDTO);
        menu = menuRepository.save(menu);
        return menuMapper.toDto(menu);
    }

    /**
     * Aggiornamento completo di un menu.
     */
    public MenuDTO update(MenuDTO menuDTO) {
        LOG.debug("Request to update Menu : {}", menuDTO);
        Menu menu = menuMapper.toEntity(menuDTO);
        menu = menuRepository.save(menu);
        return menuMapper.toDto(menu);
    }

    /**
     * Aggiornamento parziale (PATCH).
     */
    public Optional<MenuDTO> partialUpdate(MenuDTO menuDTO) {
        LOG.debug("Request to partially update Menu : {}", menuDTO);
        return menuRepository
            .findById(menuDTO.getId())
            .map(existingMenu -> {
                menuMapper.partialUpdate(existingMenu, menuDTO);
                return existingMenu;
            })
            .map(menuRepository::save)
            .map(menuMapper::toDto);
    }

    /**
     * Restituisce tutti i menu (solo admin).
     */
    @Transactional(readOnly = true)
    public List<MenuDTO> findAll() {
        LOG.debug("Request to get all Menus");
        return menuRepository.findAll().stream().map(menuMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Restituisce i menu dell'utente corrente.
     */
    @Transactional(readOnly = true)
    public List<MenuDTO> findAllCurrentUser() {
        LOG.debug("Request to get Menus of current user");
        return menuRepository
            .findByRistoratoreIsCurrentUser()
            .stream()
            .map(menuMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    public Page<MenuDTO> findAllWithEagerRelationships(Pageable pageable) {
        return menuRepository.findAllWithEagerRelationships(pageable).map(menuMapper::toDto);
    }

    @Transactional(readOnly = true)
    public Optional<MenuDTO> findOne(Long id) {
        LOG.debug("Request to get Menu : {}", id);
        return menuRepository.findOneWithEagerRelationships(id).map(menuMapper::toDto);
    }

    public void delete(Long id) {
        LOG.debug("Request to delete Menu : {}", id);
        menuRepository.deleteById(id);
    }
}
