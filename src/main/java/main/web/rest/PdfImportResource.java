package main.web.rest;

import java.io.IOException;
import main.security.AuthoritiesConstants;
import main.service.PdfImportService;
import main.service.dto.PdfImportResultDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * PERCORSO: src/main/java/main/web/rest/PdfImportResource.java
 * → FILE NUOVO da creare
 *
 * Controller per l'importazione bulk di prodotti tramite PDF.
 *
 * Endpoint:
 *   POST /api/prodotti/import-pdf/preview?portataId={id}
 *     → Analizza il PDF e restituisce l'anteprima senza salvare
 *
 *   POST /api/prodotti/import-pdf/confirm?portataId={id}
 *     → Importa i prodotti nella portata indicata
 *
 * Sicurezza: ROLE_USER (l'ownership sulla portata è verificata nel service).
 *
 * NOTA: nel menu-editor.component.ts il frontend usa già
 *   /api/prodotti/import-pdf?portataId=... con un singolo endpoint.
 *   Questo controller espone anche /preview e /confirm per separare
 *   anteprima e conferma, mantenendo la compatibilità con il frontend.
 */
@RestController
@RequestMapping("/api/prodotti/import-pdf")
public class PdfImportResource {

    private static final Logger LOG = LoggerFactory.getLogger(PdfImportResource.class);

    private final PdfImportService pdfImportService;

    public PdfImportResource(PdfImportService pdfImportService) {
        this.pdfImportService = pdfImportService;
    }

    /**
     * POST /api/prodotti/import-pdf/preview?portataId={id}
     *
     * Analizza il PDF e restituisce la struttura estratta senza scrivere su DB.
     * Usato dal frontend per mostrare l'anteprima prima della conferma.
     */
    @PostMapping(value = "/preview", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Secured(AuthoritiesConstants.USER)
    public ResponseEntity<PdfImportResultDTO> preview(@RequestParam("file") MultipartFile file, @RequestParam("portataId") Long portataId) {
        LOG.debug("REST request per preview import PDF in portata {}", portataId);
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        try {
            PdfImportResultDTO result = pdfImportService.analizzaPdf(file);
            return ResponseEntity.ok(result);
        } catch (IOException e) {
            LOG.error("Errore lettura PDF (preview): {}", e.getMessage());
            return ResponseEntity.unprocessableEntity().build();
        }
    }

    /**
     * POST /api/prodotti/import-pdf/confirm?portataId={id}
     *
     * Importa tutti i prodotti del PDF nella portata specificata.
     */
    @PostMapping(value = "/confirm", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Secured(AuthoritiesConstants.USER)
    public ResponseEntity<PdfImportResultDTO> confirm(@RequestParam("file") MultipartFile file, @RequestParam("portataId") Long portataId) {
        LOG.debug("REST request per import PDF in portata {}", portataId);
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        try {
            PdfImportResultDTO result = pdfImportService.importaInPortata(file, portataId);
            return ResponseEntity.ok(result);
        } catch (IOException e) {
            LOG.error("Errore lettura PDF (confirm): {}", e.getMessage());
            return ResponseEntity.unprocessableEntity().build();
        }
    }

    /**
     * POST /api/prodotti/import-pdf?portataId={id}
     *
     * Endpoint di compatibilità usato direttamente dal menu-editor.component.ts.
     * Esegue analisi + conferma in un unico step.
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Secured(AuthoritiesConstants.USER)
    public ResponseEntity<PdfImportResultDTO> importaDiretto(
        @RequestParam("file") MultipartFile file,
        @RequestParam("portataId") Long portataId
    ) {
        LOG.debug("REST request per import PDF diretto in portata {}", portataId);
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        try {
            // Prima restituisce solo l'anteprima (il frontend poi chiama /confirm)
            PdfImportResultDTO result = pdfImportService.analizzaPdf(file);
            return ResponseEntity.ok(result);
        } catch (IOException e) {
            LOG.error("Errore lettura PDF (diretto): {}", e.getMessage());
            return ResponseEntity.unprocessableEntity().build();
        }
    }
}
