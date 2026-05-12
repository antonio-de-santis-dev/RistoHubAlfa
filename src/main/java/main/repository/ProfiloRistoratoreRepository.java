package main.repository;

import java.util.List;
import java.util.Optional;
import main.domain.ProfiloRistoratore;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ProfiloRistoratore entity.
 *
 * Percorso: src/main/java/main/repository/ProfiloRistoratoreRepository.java
 * → SOSTITUISCE il file generato da JHipster
 */
@Repository
public interface ProfiloRistoratoreRepository extends JpaRepository<ProfiloRistoratore, Long> {
    // ── Metodi aggiuntivi custom ──────────────────────────────────────────────

    /**
     * Trova il profilo per login utente.
     * Usato da MenuService e PiattoDelGiornoService per leggere il livello.
     */
    Optional<ProfiloRistoratore> findOneByUserLogin(String login);

    // ── Metodi generati da JHipster (invariati) ───────────────────────────────

    default Optional<ProfiloRistoratore> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<ProfiloRistoratore> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<ProfiloRistoratore> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(value = "select p from ProfiloRistoratore p left join fetch p.user", countQuery = "select count(p) from ProfiloRistoratore p")
    Page<ProfiloRistoratore> findAllWithToOneRelationships(Pageable pageable);

    @Query("select p from ProfiloRistoratore p left join fetch p.user")
    List<ProfiloRistoratore> findAllWithToOneRelationships();

    @Query("select p from ProfiloRistoratore p left join fetch p.user where p.id =:id")
    Optional<ProfiloRistoratore> findOneWithToOneRelationships(@Param("id") Long id);
}
