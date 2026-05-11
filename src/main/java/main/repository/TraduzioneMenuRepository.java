package main.repository;

import main.domain.TraduzioneMenu;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the TraduzioneMenu entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TraduzioneMenuRepository extends JpaRepository<TraduzioneMenu, Long> {}
