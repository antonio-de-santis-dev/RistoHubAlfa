package main.repository;

import main.domain.ListaContatti;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ListaContatti entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ListaContattiRepository extends JpaRepository<ListaContatti, Long> {}
