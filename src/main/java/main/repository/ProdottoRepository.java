package main.repository;

import java.util.List;
import java.util.Optional;
import main.domain.Prodotto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * PERCORSO: src/main/java/main/repository/ProdottoRepository.java
 * → SOSTITUISCE il file generato da JHipster (aggiunge i metodi custom)
 *
 * When extending this class, extend ProdottoRepositoryWithBagRelationships too.
 */
@Repository
public interface ProdottoRepository extends ProdottoRepositoryWithBagRelationships, JpaRepository<Prodotto, Long> {
    // ── Metodi generati da JHipster ────────────────────────────────────────────

    default Optional<Prodotto> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findById(id));
    }

    default List<Prodotto> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAll());
    }

    default Page<Prodotto> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAll(pageable));
    }

    // ── Metodi custom aggiunti ─────────────────────────────────────────────────

    /**
     * Prodotti di una portata filtrati per visibilità.
     * Usato da MenuPublicResource per restituire solo i prodotti visibili al cliente.
     *
     * @param portataId ID della portata
     * @param visibile  true = solo visibili, false = solo nascosti
     */
    @Query("SELECT p FROM Prodotto p LEFT JOIN FETCH p.allergenis WHERE p.portata.id = :portataId AND p.visibile = :visibile")
    List<Prodotto> findByPortataIdAndVisibile(@Param("portataId") Long portataId, @Param("visibile") boolean visibile);

    /**
     * Tutti i prodotti di una portata (con allergeni in JOIN FETCH).
     * Usato dal menu-editor per mostrare anche i prodotti nascosti al ristoratore.
     */
    @Query("SELECT p FROM Prodotto p LEFT JOIN FETCH p.allergenis WHERE p.portata.id = :portataId ORDER BY p.nome ASC")
    List<Prodotto> findByPortataIdWithAllergeni(@Param("portataId") Long portataId);

    /**
     * Tutti i prodotti di un menu (via portata → menu).
     * Usato da PiattiGiornoGestione per la selezione del prodotto esistente.
     */
    @Query("SELECT p FROM Prodotto p LEFT JOIN FETCH p.allergenis WHERE p.portata.menu.id = :menuId")
    List<Prodotto> findByMenuIdWithAllergeni(@Param("menuId") Long menuId);
}
