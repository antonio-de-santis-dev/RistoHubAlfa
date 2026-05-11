package main.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * Piatto del giorno associato a un menu.
 * Non ha una data: e' l'utente a decidere quando attivarlo/disattivarlo.
 *
 * Due modalita':
 * A) prodotto != null -> usa un prodotto gia' nel menu;
 * nome/desc/prezzo fanno override opzionale
 * B) prodotto == null -> piatto ad-hoc, mai salvato come Prodotto permanente
 *
 * Disponibilita' per livello (controllo in PiattoDelGiornoServiceImpl):
 * LIVELLO_1 -> non disponibile (il service rifiuta la creazione)
 * LIVELLO_2 -> max 5 piatti del giorno totali tra tutti i menu dell'utente
 * LIVELLO_3 -> nessun limite
 */
@Entity
@Table(name = "piatto_del_giorno")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class PiattoDelGiorno implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "attivo", nullable = false)
    private Boolean attivo;

    @Column(name = "nome")
    private String nome;

    @Column(name = "descrizione")
    private String descrizione;

    @Column(name = "prezzo", precision = 21, scale = 2)
    private BigDecimal prezzo;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "contatti", "portates", "traduzionis", "ristoratore" }, allowSetters = true)
    private Menu menu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "allergenis", "portata" }, allowSetters = true)
    private Prodotto prodotto;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public PiattoDelGiorno id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getAttivo() {
        return this.attivo;
    }

    public PiattoDelGiorno attivo(Boolean attivo) {
        this.setAttivo(attivo);
        return this;
    }

    public void setAttivo(Boolean attivo) {
        this.attivo = attivo;
    }

    public String getNome() {
        return this.nome;
    }

    public PiattoDelGiorno nome(String nome) {
        this.setNome(nome);
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescrizione() {
        return this.descrizione;
    }

    public PiattoDelGiorno descrizione(String descrizione) {
        this.setDescrizione(descrizione);
        return this;
    }

    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }

    public BigDecimal getPrezzo() {
        return this.prezzo;
    }

    public PiattoDelGiorno prezzo(BigDecimal prezzo) {
        this.setPrezzo(prezzo);
        return this;
    }

    public void setPrezzo(BigDecimal prezzo) {
        this.prezzo = prezzo;
    }

    public Menu getMenu() {
        return this.menu;
    }

    public void setMenu(Menu menu) {
        this.menu = menu;
    }

    public PiattoDelGiorno menu(Menu menu) {
        this.setMenu(menu);
        return this;
    }

    public Prodotto getProdotto() {
        return this.prodotto;
    }

    public void setProdotto(Prodotto prodotto) {
        this.prodotto = prodotto;
    }

    public PiattoDelGiorno prodotto(Prodotto prodotto) {
        this.setProdotto(prodotto);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PiattoDelGiorno)) {
            return false;
        }
        return getId() != null && getId().equals(((PiattoDelGiorno) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PiattoDelGiorno{" +
            "id=" + getId() +
            ", attivo='" + getAttivo() + "'" +
            ", nome='" + getNome() + "'" +
            ", descrizione='" + getDescrizione() + "'" +
            ", prezzo=" + getPrezzo() +
            "}";
    }
}
