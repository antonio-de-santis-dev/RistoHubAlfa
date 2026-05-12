package main.service;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import main.domain.Portata;
import main.repository.MenuRepository;
import main.repository.PortataRepository;
import main.security.SecurityUtils;
import main.service.dto.PdfImportResultDTO;
import main.service.dto.PdfImportResultDTO.PortataImportDTO;
import main.service.dto.PdfImportResultDTO.ProdottoImportDTO;
import main.service.dto.PortataDTO;
import main.service.dto.ProdottoDTO;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

/**
 * PERCORSO: src/main/java/main/service/PdfImportService.java
 * → FILE NUOVO da creare
 *
 * Service per il parsing di PDF di importazione prodotti.
 *
 * Formato atteso nel PDF (generato dal template allegato):
 *
 *   PORTATA: Antipasto
 *   - Bruschetta al pomodoro | Con pomodorini freschi | 6.00
 *   - Tagliere di salumi | Selezione di salumi locali | 12.00
 *
 *   PORTATA: Primo
 *   - Orecchiette alle cime di rapa | | 10.00
 *
 * Regole di parsing:
 *   • La riga "PORTATA: NomePortata" identifica la sezione
 *   • Le righe prodotto iniziano con "- " e hanno 3 campi separati da "|"
 *     [nome] | [descrizione (vuota ok)] | [prezzo]
 *   • Righe vuote e righe che iniziano con "#" vengono ignorate
 *
 * NOTA: richiede la dipendenza Maven:
 *   <dependency>
 *     <groupId>org.apache.pdfbox</groupId>
 *     <artifactId>pdfbox</artifactId>
 *     <version>3.0.3</version>
 *   </dependency>
 */
@Service
@Transactional
public class PdfImportService {

    private static final Logger LOG = LoggerFactory.getLogger(PdfImportService.class);

    private final PortataRepository portataRepository;
    private final ProdottoService prodottoService;
    private final MenuRepository menuRepository;

    public PdfImportService(PortataRepository portataRepository, ProdottoService prodottoService, MenuRepository menuRepository) {
        this.portataRepository = portataRepository;
        this.prodottoService = prodottoService;
        this.menuRepository = menuRepository;
    }

    // ── STEP 1: analisi senza scrittura su DB ──────────────────────────────────

    /**
     * Analizza il PDF e restituisce la struttura estratta senza salvare nulla.
     * Usato per la preview nel frontend prima della conferma.
     */
    public PdfImportResultDTO analizzaPdf(MultipartFile file) throws IOException {
        String testo = estraiTesto(file.getInputStream());
        return parseTesto(testo);
    }

    // ── STEP 2: import effettivo ───────────────────────────────────────────────

    /**
     * Analizza il PDF e salva i prodotti in una specifica portata.
     * Tutti i prodotti importati finiscono nella portata indicata, indipendentemente
     * dal nome scritto nel PDF (modalità semplificata per import rapido).
     *
     * @param file      file PDF caricato
     * @param portataId ID della portata in cui inserire i prodotti
     * @return struttura con prodotti inseriti e avvisi
     */
    public PdfImportResultDTO importaInPortata(MultipartFile file, Long portataId) throws IOException {
        LOG.debug("Import PDF in portata id={}", portataId);

        Portata portata = portataRepository
            .findById(portataId)
            .orElseThrow(() -> new RuntimeException("Portata non trovata: " + portataId));

        // Verifica ownership tramite il menu della portata
        String login = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("Utente non autenticato"));
        if (!portata.getMenu().getRistoratore().getLogin().equals(login)) {
            throw new RuntimeException("Accesso negato: questa portata non appartiene all'utente corrente");
        }

        String testo = estraiTesto(file.getInputStream());
        PdfImportResultDTO parsed = parseTesto(testo);

        List<String> avvisi = new ArrayList<>(parsed.getAvvisi());
        int inseriti = 0;

        // Raccoglie tutti i prodotti da tutte le portate trovate nel PDF
        for (PortataImportDTO portataImport : parsed.getPortate()) {
            for (ProdottoImportDTO pi : portataImport.getProdotti()) {
                try {
                    ProdottoDTO dto = new ProdottoDTO();
                    dto.setNome(pi.getNome().trim());
                    dto.setDescrizione(pi.getDescrizione() != null && !pi.getDescrizione().isBlank() ? pi.getDescrizione().trim() : null);
                    dto.setPrezzo(parsePrezzo(pi.getPrezzo()));
                    dto.setVisibile(true);

                    PortataDTO portataRef = new PortataDTO();
                    portataRef.setId(portataId);
                    dto.setPortata(portataRef);

                    prodottoService.save(dto);
                    inseriti++;
                } catch (Exception e) {
                    LOG.warn("Errore salvataggio prodotto '{}': {}", pi.getNome(), e.getMessage());
                    avvisi.add("Prodotto ignorato: \"" + pi.getNome() + "\" — " + e.getMessage());
                }
            }
        }

        return new PdfImportResultDTO(parsed.getPortate(), inseriti, avvisi);
    }

    // ── Parsing ────────────────────────────────────────────────────────────────

    private String estraiTesto(InputStream inputStream) throws IOException {
        try (PDDocument document = Loader.loadPDF(inputStream.readAllBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);
            return stripper.getText(document);
        }
    }

    private PdfImportResultDTO parseTesto(String testo) {
        List<PortataImportDTO> portate = new ArrayList<>();
        List<String> avvisi = new ArrayList<>();

        String portataCorrente = null;
        List<ProdottoImportDTO> prodottiCorrenti = new ArrayList<>();

        for (String riga : testo.split("\\r?\\n")) {
            String rigaTrim = riga.trim();

            if (rigaTrim.isBlank() || rigaTrim.startsWith("#")) continue;

            if (rigaTrim.toUpperCase().startsWith("PORTATA:")) {
                if (portataCorrente != null && !prodottiCorrenti.isEmpty()) {
                    portate.add(new PortataImportDTO(portataCorrente, new ArrayList<>(prodottiCorrenti)));
                }
                portataCorrente = rigaTrim.substring("PORTATA:".length()).trim();
                prodottiCorrenti = new ArrayList<>();
                continue;
            }

            if (rigaTrim.startsWith("- ")) {
                String contenuto = rigaTrim.substring(2).trim();
                String[] parti = contenuto.split("\\|", -1);
                String nome = parti[0].trim();
                String descrizione = parti.length >= 2 ? parti[1].trim() : "";
                String prezzo = parti.length >= 3 ? parti[2].trim() : "0";
                if (!nome.isBlank()) {
                    if (portataCorrente == null) {
                        portataCorrente = "Prodotti";
                        prodottiCorrenti = new ArrayList<>();
                    }
                    prodottiCorrenti.add(new ProdottoImportDTO(nome, descrizione, prezzo));
                }
            }
        }

        if (portataCorrente != null && !prodottiCorrenti.isEmpty()) {
            portate.add(new PortataImportDTO(portataCorrente, new ArrayList<>(prodottiCorrenti)));
        }

        int totale = portate.stream().mapToInt(p -> p.getProdotti().size()).sum();
        return new PdfImportResultDTO(portate, totale, avvisi);
    }

    private BigDecimal parsePrezzo(String prezzoStr) {
        if (prezzoStr == null || prezzoStr.isBlank()) return BigDecimal.ZERO;
        try {
            String cleaned = prezzoStr.replace("€", "").replace(",", ".").trim();
            return new BigDecimal(cleaned);
        } catch (NumberFormatException e) {
            LOG.warn("Prezzo non parsabile: '{}' → 0", prezzoStr);
            return BigDecimal.ZERO;
        }
    }
}
