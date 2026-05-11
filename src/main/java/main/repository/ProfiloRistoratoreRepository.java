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
 */
@Repository
public interface ProfiloRistoratoreRepository extends JpaRepository<ProfiloRistoratore, Long> {
    default Optional<ProfiloRistoratore> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<ProfiloRistoratore> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<ProfiloRistoratore> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select profiloRistoratore from ProfiloRistoratore profiloRistoratore left join fetch profiloRistoratore.user",
        countQuery = "select count(profiloRistoratore) from ProfiloRistoratore profiloRistoratore"
    )
    Page<ProfiloRistoratore> findAllWithToOneRelationships(Pageable pageable);

    @Query("select profiloRistoratore from ProfiloRistoratore profiloRistoratore left join fetch profiloRistoratore.user")
    List<ProfiloRistoratore> findAllWithToOneRelationships();

    @Query(
        "select profiloRistoratore from ProfiloRistoratore profiloRistoratore left join fetch profiloRistoratore.user where profiloRistoratore.id =:id"
    )
    Optional<ProfiloRistoratore> findOneWithToOneRelationships(@Param("id") Long id);
}
