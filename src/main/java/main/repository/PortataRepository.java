package main.repository;

import java.util.List;
import main.domain.Portata;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Portata entity.
 *
 * Percorso: src/main/java/main/repository/PortataRepository.java
 * → SOSTITUISCE il file generato da JHipster
 */
@Repository
public interface PortataRepository extends JpaRepository<Portata, Long> {
    /**
     * Portate di un menu ordinate per ordine crescente.
     * Usato da MenuPublicResource per la vista QR.
     */
    @Query("SELECT p FROM Portata p WHERE p.menu.id = :menuId ORDER BY p.ordine ASC")
    List<Portata> findByMenuIdOrdered(@Param("menuId") Long menuId);

    /**
     * Ordine massimo tra le portate personalizzate di un menu.
     * Usato dal service per assegnare ordine auto-incrementale (45+).
     */
    @Query("SELECT COALESCE(MAX(p.ordine), 44) FROM Portata p WHERE p.menu.id = :menuId AND p.ordine >= 45 AND p.ordine < 50")
    int findMaxOrdinePersonalizzato(@Param("menuId") Long menuId);
}
