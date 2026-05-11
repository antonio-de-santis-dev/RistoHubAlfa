package main.service.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

/**
 * A DTO for the {@link main.domain.PiattoDelGiorno} entity.
 */
@Schema(
    description = "Piatto del giorno associato a un menu.\nNon ha una data: e' l'utente a decidere quando attivarlo/disattivarlo.\n\nDue modalita':\nA) prodotto != null -> usa un prodotto gia' nel menu;\nnome/desc/prezzo fanno override opzionale\nB) prodotto == null -> piatto ad-hoc, mai salvato come Prodotto permanente\n\nDisponibilita' per livello (controllo in PiattoDelGiornoServiceImpl):\nLIVELLO_1 -> non disponibile (il service rifiuta la creazione)\nLIVELLO_2 -> max 5 piatti del giorno totali tra tutti i menu dell'utente\nLIVELLO_3 -> nessun limite"
)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class PiattoDelGiornoDTO implements Serializable {

    private Long id;

    @NotNull
    private Boolean attivo;

    private String nome;

    private String descrizione;

    private BigDecimal prezzo;

    @NotNull
    private MenuDTO menu;

    private ProdottoDTO prodotto;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getAttivo() {
        return attivo;
    }

    public void setAttivo(Boolean attivo) {
        this.attivo = attivo;
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

    public MenuDTO getMenu() {
        return menu;
    }

    public void setMenu(MenuDTO menu) {
        this.menu = menu;
    }

    public ProdottoDTO getProdotto() {
        return prodotto;
    }

    public void setProdotto(ProdottoDTO prodotto) {
        this.prodotto = prodotto;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PiattoDelGiornoDTO)) {
            return false;
        }

        PiattoDelGiornoDTO piattoDelGiornoDTO = (PiattoDelGiornoDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, piattoDelGiornoDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PiattoDelGiornoDTO{" +
            "id=" + getId() +
            ", attivo='" + getAttivo() + "'" +
            ", nome='" + getNome() + "'" +
            ", descrizione='" + getDescrizione() + "'" +
            ", prezzo=" + getPrezzo() +
            ", menu=" + getMenu() +
            ", prodotto=" + getProdotto() +
            "}";
    }
}
