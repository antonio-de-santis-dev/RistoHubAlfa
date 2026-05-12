package main.service.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

/**
 * DTO aggregato per la vista pubblica QR.
 * Restituito da GET /api/public/menu/{id}
 * Contiene tutto il necessario in una sola chiamata REST.
 *
 * Percorso: src/main/java/main/service/dto/MenuCompletoDTO.java
 * → FILE NUOVO da creare
 */
public class MenuCompletoDTO implements Serializable {

    private Long id;
    private String nome;
    private String descrizione;
    private List<PortataConProdottiDTO> portate;
    private List<PiattoDelGiornoPublicDTO> piattiDelGiorno;
    private ListaContattiPublicDTO contatti;

    // ── Getters / Setters ─────────────────────────────────────────────────────

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public List<PortataConProdottiDTO> getPortate() {
        return portate;
    }

    public void setPortate(List<PortataConProdottiDTO> portate) {
        this.portate = portate;
    }

    public List<PiattoDelGiornoPublicDTO> getPiattiDelGiorno() {
        return piattiDelGiorno;
    }

    public void setPiattiDelGiorno(List<PiattoDelGiornoPublicDTO> piattiDelGiorno) {
        this.piattiDelGiorno = piattiDelGiorno;
    }

    public ListaContattiPublicDTO getContatti() {
        return contatti;
    }

    public void setContatti(ListaContattiPublicDTO contatti) {
        this.contatti = contatti;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Classi interne
    // ─────────────────────────────────────────────────────────────────────────

    public static class PortataConProdottiDTO implements Serializable {

        private Long id;
        /** nomePersonalizzato se presente, altrimenti il nome dell'enum tradotto */
        private String nomeVisualizzato;
        private Integer ordine;
        private List<ProdottoPublicDTO> prodotti;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getNomeVisualizzato() {
            return nomeVisualizzato;
        }

        public void setNomeVisualizzato(String nomeVisualizzato) {
            this.nomeVisualizzato = nomeVisualizzato;
        }

        public Integer getOrdine() {
            return ordine;
        }

        public void setOrdine(Integer ordine) {
            this.ordine = ordine;
        }

        public List<ProdottoPublicDTO> getProdotti() {
            return prodotti;
        }

        public void setProdotti(List<ProdottoPublicDTO> prodotti) {
            this.prodotti = prodotti;
        }
    }

    public static class ProdottoPublicDTO implements Serializable {

        private Long id;
        private String nome;
        private String descrizione;
        private BigDecimal prezzo;
        private List<AllergenePublicDTO> allergeni;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
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

        public BigDecimal getPrezzo() {
            return prezzo;
        }

        public void setPrezzo(BigDecimal prezzo) {
            this.prezzo = prezzo;
        }

        public List<AllergenePublicDTO> getAllergeni() {
            return allergeni;
        }

        public void setAllergeni(List<AllergenePublicDTO> allergeni) {
            this.allergeni = allergeni;
        }
    }

    public static class AllergenePublicDTO implements Serializable {

        private Long id;
        private String nome;
        private String tipo; // "DEFAULT" | "PERSONALIZZATO"
        private String nomeDefault; // valore enum, usato dal frontend per costruire /assets/images/allergeni/{nomeDefault}.png

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getNome() {
            return nome;
        }

        public void setNome(String nome) {
            this.nome = nome;
        }

        public String getTipo() {
            return tipo;
        }

        public void setTipo(String tipo) {
            this.tipo = tipo;
        }

        public String getNomeDefault() {
            return nomeDefault;
        }

        public void setNomeDefault(String nomeDefault) {
            this.nomeDefault = nomeDefault;
        }
    }

    public static class PiattoDelGiornoPublicDTO implements Serializable {

        private Long id;
        private String nome;
        private String descrizione;
        private BigDecimal prezzo;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
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

        public BigDecimal getPrezzo() {
            return prezzo;
        }

        public void setPrezzo(BigDecimal prezzo) {
            this.prezzo = prezzo;
        }
    }

    public static class ListaContattiPublicDTO implements Serializable {

        private String note;
        private List<ContattoItemPublicDTO> contatti;

        public String getNote() {
            return note;
        }

        public void setNote(String note) {
            this.note = note;
        }

        public List<ContattoItemPublicDTO> getContatti() {
            return contatti;
        }

        public void setContatti(List<ContattoItemPublicDTO> contatti) {
            this.contatti = contatti;
        }
    }

    public static class ContattoItemPublicDTO implements Serializable {

        private String tipo; // valore enum TipoContatto — usato dal frontend per l'icona
        private String valore;
        private String etichetta;
        private Integer ordine;

        public String getTipo() {
            return tipo;
        }

        public void setTipo(String tipo) {
            this.tipo = tipo;
        }

        public String getValore() {
            return valore;
        }

        public void setValore(String valore) {
            this.valore = valore;
        }

        public String getEtichetta() {
            return etichetta;
        }

        public void setEtichetta(String etichetta) {
            this.etichetta = etichetta;
        }

        public Integer getOrdine() {
            return ordine;
        }

        public void setOrdine(Integer ordine) {
            this.ordine = ordine;
        }
    }
}
