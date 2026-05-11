package main.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import main.domain.enumeration.NomeAllergeneDefault;
import main.domain.enumeration.TipoAllergene;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * Allergene associabile ai prodotti.
 *
 * tipo = DEFAULT:
 * - nomeDefault valorizzato con uno dei 14 EU
 * - nome pre-compilato col nome italiano (es. \"Glutine\")
 * - icona: /assets/images/allergeni/{nomeDefault_minuscolo}.png
 *
 * tipo = PERSONALIZZATO:
 * - nomeDefault e' null
 * - nome libero inserito dal ristoratore (es. \"Ananas\", \"Cannella\")
 * - icona: /assets/images/allergeni/custom.png (universale)
 */
@Entity
@Table(name = "allergene")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Allergene implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "nome", nullable = false)
    private String nome;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false)
    private TipoAllergene tipo;

    @Enumerated(EnumType.STRING)
    @Column(name = "nome_default")
    private NomeAllergeneDefault nomeDefault;

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "allergenis")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "allergenis", "portata" }, allowSetters = true)
    private Set<Prodotto> prodottis = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Allergene id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return this.nome;
    }

    public Allergene nome(String nome) {
        this.setNome(nome);
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public TipoAllergene getTipo() {
        return this.tipo;
    }

    public Allergene tipo(TipoAllergene tipo) {
        this.setTipo(tipo);
        return this;
    }

    public void setTipo(TipoAllergene tipo) {
        this.tipo = tipo;
    }

    public NomeAllergeneDefault getNomeDefault() {
        return this.nomeDefault;
    }

    public Allergene nomeDefault(NomeAllergeneDefault nomeDefault) {
        this.setNomeDefault(nomeDefault);
        return this;
    }

    public void setNomeDefault(NomeAllergeneDefault nomeDefault) {
        this.nomeDefault = nomeDefault;
    }

    public Set<Prodotto> getProdottis() {
        return this.prodottis;
    }

    public void setProdottis(Set<Prodotto> prodottos) {
        if (this.prodottis != null) {
            this.prodottis.forEach(i -> i.removeAllergeni(this));
        }
        if (prodottos != null) {
            prodottos.forEach(i -> i.addAllergeni(this));
        }
        this.prodottis = prodottos;
    }

    public Allergene prodottis(Set<Prodotto> prodottos) {
        this.setProdottis(prodottos);
        return this;
    }

    public Allergene addProdotti(Prodotto prodotto) {
        this.prodottis.add(prodotto);
        prodotto.getAllergenis().add(this);
        return this;
    }

    public Allergene removeProdotti(Prodotto prodotto) {
        this.prodottis.remove(prodotto);
        prodotto.getAllergenis().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Allergene)) {
            return false;
        }
        return getId() != null && getId().equals(((Allergene) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Allergene{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", tipo='" + getTipo() + "'" +
            ", nomeDefault='" + getNomeDefault() + "'" +
            "}";
    }
}
