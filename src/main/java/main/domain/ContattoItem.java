package main.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import main.domain.enumeration.TipoContatto;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * Singolo recapito (telefono, email, social, sito web).
 *
 * Il campo \"tipo\" (enum TipoContatto) determina quale icona mostrare:
 * - TELEFONO / EMAIL / SITO_WEB -> icone Tabler (ti-phone, ti-mail, ti-world)
 * - Social (FACEBOOK..TRIPADVISOR) -> SVG inline da social-icons.ts
 *
 * Il frontend usa getSocialIconSvg(tipo) per iniettare la SVG,
 * senza dover gestire file PNG o asset aggiuntivi.
 */
@Entity
@Table(name = "contatto_item")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ContattoItem implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false)
    private TipoContatto tipo;

    @NotNull
    @Column(name = "valore", nullable = false)
    private String valore;

    @Column(name = "etichetta")
    private String etichetta;

    @NotNull
    @Min(value = 0)
    @Column(name = "ordine", nullable = false)
    private Integer ordine;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "contattis", "menu" }, allowSetters = true)
    private ListaContatti lista;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ContattoItem id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TipoContatto getTipo() {
        return this.tipo;
    }

    public ContattoItem tipo(TipoContatto tipo) {
        this.setTipo(tipo);
        return this;
    }

    public void setTipo(TipoContatto tipo) {
        this.tipo = tipo;
    }

    public String getValore() {
        return this.valore;
    }

    public ContattoItem valore(String valore) {
        this.setValore(valore);
        return this;
    }

    public void setValore(String valore) {
        this.valore = valore;
    }

    public String getEtichetta() {
        return this.etichetta;
    }

    public ContattoItem etichetta(String etichetta) {
        this.setEtichetta(etichetta);
        return this;
    }

    public void setEtichetta(String etichetta) {
        this.etichetta = etichetta;
    }

    public Integer getOrdine() {
        return this.ordine;
    }

    public ContattoItem ordine(Integer ordine) {
        this.setOrdine(ordine);
        return this;
    }

    public void setOrdine(Integer ordine) {
        this.ordine = ordine;
    }

    public ListaContatti getLista() {
        return this.lista;
    }

    public void setLista(ListaContatti listaContatti) {
        this.lista = listaContatti;
    }

    public ContattoItem lista(ListaContatti listaContatti) {
        this.setLista(listaContatti);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ContattoItem)) {
            return false;
        }
        return getId() != null && getId().equals(((ContattoItem) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ContattoItem{" +
            "id=" + getId() +
            ", tipo='" + getTipo() + "'" +
            ", valore='" + getValore() + "'" +
            ", etichetta='" + getEtichetta() + "'" +
            ", ordine=" + getOrdine() +
            "}";
    }
}
