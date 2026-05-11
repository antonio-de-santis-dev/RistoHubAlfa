package main.repository;

import main.domain.Allergene;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Allergene entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AllergeneRepository extends JpaRepository<Allergene, Long> {}
