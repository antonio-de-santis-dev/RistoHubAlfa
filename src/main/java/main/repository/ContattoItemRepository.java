package main.repository;

import main.domain.ContattoItem;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ContattoItem entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ContattoItemRepository extends JpaRepository<ContattoItem, Long> {}
