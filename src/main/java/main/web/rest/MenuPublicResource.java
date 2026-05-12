package main.web.rest;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import main.domain.Allergene;
import main.domain.ContattoItem;
import main.domain.ListaContatti;
import main.domain.Menu;
import main.domain.PiattoDelGiorno;
import main.domain.Portata;
import main.domain.Prodotto;
import main.domain.enumeration.NomePortataDefault;
import main.domain.enumeration.TipoPortata;
import main.repository.MenuRepository;
import main.repository.PiattoDelGiornoRepository;
import main.repository.PortataRepository;
import main.repository.ProdottoRepository;
import main.service.dto.MenuCompletoDTO;
import main.service.dto.MenuCompletoDTO.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller REST PUBBLICO per la visualizzazione del menu tramite QR code.
 *
 * Tutti gli endpoint di questo controller sono accessibili senza autenticazione.
 * L'URL /api/public/** è dichiarato .permitAll() in SecurityConfiguration.
 *
 * Nessun link al login o ad aree protette viene esposto da questi endpoint.
 *
 * Percorso: src/main/java/main/web/rest/MenuPublicResource.java
 * → FILE NUOVO da creare
 */
@RestController
@RequestMapping("/api/public")
public class MenuPublicResource {

    private static final Logger LOG = LoggerFactory.getLogger(MenuPublicResource.class);

    // Nomi italiani delle portate default (usati come nomeVisualizzato)
    private static final java.util.Map<NomePortataDefault, String> NOMI_PORTATE = java.util.Map.ofEntries(
        java.util.Map.entry(NomePortataDefault.ANTIPASTO, "Antipasti"),
        java.util.Map.entry(NomePortataDefault.PRIMO, "Primi Piatti"),
        java.util.Map.entry(NomePortataDefault.SECONDO, "Secondi Piatti"),
        java.util.Map.entry(NomePortataDefault.CONTORNO, "Contorni"),
        java.util.Map.entry(NomePortataDefault.DOLCE, "Dolci"),
        java.util.Map.entry(NomePortataDefault.BEVANDA, "Bevande"),
        java.util.Map.entry(NomePortataDefault.VINO_ROSSO, "Vini Rossi"),
        java.util.Map.entry(NomePortataDefault.VINO_BIANCO, "Vini Bianchi"),
        java.util.Map.entry(NomePortataDefault.VINO_ROSATO, "Vini Rosati"),
        java.util.Map.entry(NomePortataDefault.BIRRA, "Birre"),
        java.util.Map.entry(NomePortataDefault.DIGESTIVO, "Digestivi")
    );

    private final MenuRepository menuRepository;
    private final PortataRepository portataRepository;
    private final ProdottoRepository prodottoRepository;
    private final PiattoDelGiornoRepository piattoDelGiornoRepository;

    public MenuPublicResource(
        MenuRepository menuRepository,
        PortataRepository portataRepository,
        ProdottoRepository prodottoRepository,
        PiattoDelGiornoRepository piattoDelGiornoRepository
    ) {
        this.menuRepository = menuRepository;
        this.portataRepository = portataRepository;
        this.prodottoRepository = prodottoRepository;
        this.piattoDelGiornoRepository = piattoDelGiornoRepository;
    }

    /**
     * GET /api/public/menu/{id}
     *
     * Restituisce il menu completo per la visualizzazione pubblica QR.
     * Nessun logo incluso per ottimizzare il payload.
     * Solo prodotti con visibile=true vengono inclusi.
     */
    @GetMapping("/menu/{id}")
    public ResponseEntity<MenuCompletoDTO> getMenuPubblico(@PathVariable Long id) {
        LOG.debug("REST request to get public Menu : {}", id);

        Menu menu = menuRepository.findById(id).orElse(null);
        if (menu == null || !Boolean.TRUE.equals(menu.getAttivo())) {
            return ResponseEntity.notFound().build();
        }

        MenuCompletoDTO dto = new MenuCompletoDTO();
        dto.setId(menu.getId());
        dto.setNome(menu.getNome());
        dto.setDescrizione(menu.getDescrizione());

        // ── Portate + prodotti ────────────────────────────────────────────────
        List<Portata> portate = portataRepository.findByMenuIdOrdered(id);
        List<PortataConProdottiDTO> portateDTO = portate
            .stream()
            .map(portata -> {
                PortataConProdottiDTO p = new PortataConProdottiDTO();
                p.setId(portata.getId());
                p.setOrdine(portata.getOrdine());

                String nome = portata.getTipo() == TipoPortata.PERSONALIZZATA && portata.getNomePersonalizzato() != null
                    ? portata.getNomePersonalizzato()
                    : NOMI_PORTATE.getOrDefault(
                        portata.getNomeDefault(),
                        portata.getNomeDefault() != null ? portata.getNomeDefault().name() : ""
                    );
                p.setNomeVisualizzato(nome);

                // Solo prodotti visibili
                List<Prodotto> prodotti = prodottoRepository.findByPortataIdAndVisibile(portata.getId(), true);
                List<ProdottoPublicDTO> prodottiDTO = prodotti
                    .stream()
                    .map(prod -> {
                        ProdottoPublicDTO pd = new ProdottoPublicDTO();
                        pd.setId(prod.getId());
                        pd.setNome(prod.getNome());
                        pd.setDescrizione(prod.getDescrizione());
                        pd.setPrezzo(prod.getPrezzo());
                        List<AllergenePublicDTO> allergeni = prod
                            .getAllergeni()
                            .stream()
                            .map(a -> {
                                AllergenePublicDTO ad = new AllergenePublicDTO();
                                ad.setId(a.getId());
                                ad.setNome(a.getNome());
                                ad.setTipo(a.getTipo() != null ? a.getTipo().name() : null);
                                ad.setNomeDefault(a.getNomeDefault() != null ? a.getNomeDefault().name().toLowerCase() : null);
                                return ad;
                            })
                            .collect(Collectors.toList());
                        pd.setAllergeni(allergeni);
                        return pd;
                    })
                    .collect(Collectors.toList());

                p.setProdotti(prodottiDTO);
                return p;
            })
            .collect(Collectors.toList());
        dto.setPortate(portateDTO);

        // ── Piatti del giorno attivi ──────────────────────────────────────────
        List<PiattoDelGiorno> piatti = piattoDelGiornoRepository.findAttiviByMenuId(id);
        List<PiattoDelGiornoPublicDTO> piattiDTO = piatti
            .stream()
            .map(piatto -> {
                PiattoDelGiornoPublicDTO pd = new PiattoDelGiornoPublicDTO();
                pd.setId(piatto.getId());
                // Se collegato a un prodotto esistente, usa i valori del piatto come override
                String nome = piatto.getNome() != null
                    ? piatto.getNome()
                    : (piatto.getProdotto() != null ? piatto.getProdotto().getNome() : null);
                String desc = piatto.getDescrizione() != null
                    ? piatto.getDescrizione()
                    : (piatto.getProdotto() != null ? piatto.getProdotto().getDescrizione() : null);
                java.math.BigDecimal prezzo = piatto.getPrezzo() != null
                    ? piatto.getPrezzo()
                    : (piatto.getProdotto() != null ? piatto.getProdotto().getPrezzo() : null);
                pd.setNome(nome);
                pd.setDescrizione(desc);
                pd.setPrezzo(prezzo);
                return pd;
            })
            .collect(Collectors.toList());
        dto.setPiattiDelGiorno(piattiDTO);

        // ── Contatti ─────────────────────────────────────────────────────────
        ListaContatti lc = menu.getContatti();
        if (lc != null) {
            ListaContattiPublicDTO lcDTO = new ListaContattiPublicDTO();
            lcDTO.setNote(lc.getNote());
            List<ContattoItemPublicDTO> items = lc
                .getContatti()
                .stream()
                .sorted(Comparator.comparingInt(ContattoItem::getOrdine))
                .map(item -> {
                    ContattoItemPublicDTO ci = new ContattoItemPublicDTO();
                    ci.setTipo(item.getTipo() != null ? item.getTipo().name() : null);
                    ci.setValore(item.getValore());
                    ci.setEtichetta(item.getEtichetta());
                    ci.setOrdine(item.getOrdine());
                    return ci;
                })
                .collect(Collectors.toList());
            lcDTO.setContatti(items);
            dto.setContatti(lcDTO);
        }

        return ResponseEntity.ok(dto);
    }
}
