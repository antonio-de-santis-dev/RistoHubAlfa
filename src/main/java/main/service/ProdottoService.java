package main.service;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import main.domain.Prodotto;
import main.repository.ProdottoRepository;
import main.service.dto.ProdottoDTO;
import main.service.mapper.ProdottoMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * PERCORSO: src/main/java/main/service/ProdottoService.java
 * → SOSTITUISCE il file generato da JHipster (aggiunge metodi custom)
 */
@Service
@Transactional
public class ProdottoService {

    private static final Logger LOG = LoggerFactory.getLogger(ProdottoService.class);

    private final ProdottoRepository prodottoRepository;
    private final ProdottoMapper prodottoMapper;

    public ProdottoService(ProdottoRepository prodottoRepository, ProdottoMapper prodottoMapper) {
        this.prodottoRepository = prodottoRepository;
        this.prodottoMapper = prodottoMapper;
    }

    public ProdottoDTO save(ProdottoDTO prodottoDTO) {
        LOG.debug("Request to save Prodotto : {}", prodottoDTO);
        Prodotto prodotto = prodottoMapper.toEntity(prodottoDTO);
        prodotto = prodottoRepository.save(prodotto);
        return prodottoMapper.toDto(prodotto);
    }

    public ProdottoDTO update(ProdottoDTO prodottoDTO) {
        LOG.debug("Request to update Prodotto : {}", prodottoDTO);
        Prodotto prodotto = prodottoMapper.toEntity(prodottoDTO);
        prodotto = prodottoRepository.save(prodotto);
        return prodottoMapper.toDto(prodotto);
    }

    public Optional<ProdottoDTO> partialUpdate(ProdottoDTO prodottoDTO) {
        LOG.debug("Request to partially update Prodotto : {}", prodottoDTO);
        return prodottoRepository
            .findById(prodottoDTO.getId())
            .map(existing -> {
                prodottoMapper.partialUpdate(existing, prodottoDTO);
                return existing;
            })
            .map(prodottoRepository::save)
            .map(prodottoMapper::toDto);
    }

    @Transactional(readOnly = true)
    public List<ProdottoDTO> findAll() {
        LOG.debug("Request to get all Prodotti");
        return prodottoRepository
            .findAllWithEagerRelationships()
            .stream()
            .map(prodottoMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    public Page<ProdottoDTO> findAllWithEagerRelationships(Pageable pageable) {
        return prodottoRepository.findAllWithEagerRelationships(pageable).map(prodottoMapper::toDto);
    }

    @Transactional(readOnly = true)
    public Optional<ProdottoDTO> findOne(Long id) {
        LOG.debug("Request to get Prodotto : {}", id);
        return prodottoRepository.findOneWithEagerRelationships(id).map(prodottoMapper::toDto);
    }

    public void delete(Long id) {
        LOG.debug("Request to delete Prodotto : {}", id);
        prodottoRepository.deleteById(id);
    }

    // ── Metodi custom ──────────────────────────────────────────────────────────

    /**
     * Prodotti di una portata con allergeni, visibili e non visibili.
     * Usato dal menu-editor per mostrare tutti i prodotti al ristoratore.
     */
    @Transactional(readOnly = true)
    public List<ProdottoDTO> findByPortataId(Long portataId) {
        LOG.debug("Request to get Prodotti by portata id={}", portataId);
        return prodottoRepository.findByPortataIdWithAllergeni(portataId).stream().map(prodottoMapper::toDto).collect(Collectors.toList());
    }

    /**
     * Prodotti di un intero menu con allergeni.
     * Usato dalla gestione piatti del giorno per la selezione.
     */
    @Transactional(readOnly = true)
    public List<ProdottoDTO> findByMenuId(Long menuId) {
        LOG.debug("Request to get Prodotti by menu id={}", menuId);
        return prodottoRepository.findByMenuIdWithAllergeni(menuId).stream().map(prodottoMapper::toDto).collect(Collectors.toList());
    }
}
