package main.repository;

import java.util.List;
import main.domain.PiattoDelGiorno;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the PiattoDelGiorno entity.
 *
 * Percorso: src/main/java/main/repository/PiattoDelGiornoRepository.java
 * → SOSTITUISCE il file generato da JHipster
 */
@Repository
public interface PiattoDelGiornoRepository extends JpaRepository<PiattoDelGiorno, Long> {
    // ── Metodi aggiuntivi custom ──────────────────────────────────────────────

    /**
     * Conta i piatti del giorno totali di un utente tra tutti i suoi menu.
     * Usato da PiattoDelGiornoService per il controllo LIVELLO_2 (max 5).
     */
    @Query("SELECT COUNT(p) FROM PiattoDelGiorno p WHERE p.menu.ristoratore.login = :login")
    long countByRistoratoreLogin(@Param("login") String login);

    /**
     * Piatti del giorno attivi di un menu — usati nella vista pubblica QR.
     */
    @Query("SELECT p FROM PiattoDelGiorno p LEFT JOIN FETCH p.prodotto WHERE p.menu.id = :menuId AND p.attivo = true")
    List<PiattoDelGiorno> findAttiviByMenuId(@Param("menuId") Long menuId);

    // ── Metodi generati da JHipster (invariati) ───────────────────────────────

    @Query("select p from PiattoDelGiorno p where p.menu.ristoratore.login = ?#{authentication.name}")
    List<PiattoDelGiorno> findByMenuRistoratoreIsCurrentUser();
}
