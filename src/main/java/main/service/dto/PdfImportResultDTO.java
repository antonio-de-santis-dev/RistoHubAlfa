package main.service.dto;

import java.io.Serializable;
import java.util.List;

/**
 * PERCORSO: src/main/java/main/service/dto/PdfImportResultDTO.java
 * → FILE NUOVO da creare
 *
 * DTO restituito da PdfImportService sia per la preview che per il confirm.
 */
public class PdfImportResultDTO implements Serializable {

    private List<PortataImportDTO> portate;
    private int totaleProdotti;
    private List<String> avvisi;

    public PdfImportResultDTO() {}

    public PdfImportResultDTO(List<PortataImportDTO> portate, int totaleProdotti, List<String> avvisi) {
        this.portate = portate;
        this.totaleProdotti = totaleProdotti;
        this.avvisi = avvisi;
    }

    public List<PortataImportDTO> getPortate() {
        return portate;
    }

    public void setPortate(List<PortataImportDTO> portate) {
        this.portate = portate;
    }

    public int getTotaleProdotti() {
        return totaleProdotti;
    }

    public void setTotaleProdotti(int totaleProdotti) {
        this.totaleProdotti = totaleProdotti;
    }

    public List<String> getAvvisi() {
        return avvisi;
    }

    public void setAvvisi(List<String> avvisi) {
        this.avvisi = avvisi;
    }

    // ── Inner classes ──────────────────────────────────────────────────────────

    public static class PortataImportDTO implements Serializable {

        private String nomePortata;
        private List<ProdottoImportDTO> prodotti;

        public PortataImportDTO() {}

        public PortataImportDTO(String nomePortata, List<ProdottoImportDTO> prodotti) {
            this.nomePortata = nomePortata;
            this.prodotti = prodotti;
        }

        public String getNomePortata() {
            return nomePortata;
        }

        public void setNomePortata(String nomePortata) {
            this.nomePortata = nomePortata;
        }

        public List<ProdottoImportDTO> getProdotti() {
            return prodotti;
        }

        public void setProdotti(List<ProdottoImportDTO> prodotti) {
            this.prodotti = prodotti;
        }
    }

    public static class ProdottoImportDTO implements Serializable {

        private String nome;
        private String descrizione;
        private String prezzo;

        public ProdottoImportDTO() {}

        public ProdottoImportDTO(String nome, String descrizione, String prezzo) {
            this.nome = nome;
            this.descrizione = descrizione;
            this.prezzo = prezzo;
        }

        public String getNome() {
            return nome;
        }

        public void setNome(String nome) {
            this.nome = nome;
        }

        public String getDescrizione() {
            return descrizione;
        }

        public void setDescrizione(String descrizione) {
            this.descrizione = descrizione;
        }

        public String getPrezzo() {
            return prezzo;
        }

        public void setPrezzo(String prezzo) {
            this.prezzo = prezzo;
        }
    }
}
