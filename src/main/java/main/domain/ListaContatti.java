package main.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * Lista dei recapiti del ristorante, collegata al menu.
 * Visualizzata come card nella pagina pubblica QR.
 */
@Entity
@Table(name = "lista_contatti")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ListaContatti implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "note")
    private String note;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "lista")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "lista" }, allowSetters = true)
    private Set<ContattoItem> contattis = new HashSet<>();

    @JsonIgnoreProperties(value = { "contatti", "portates", "traduzionis", "ristoratore" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "contatti")
    private Menu menu;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ListaContatti id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNote() {
        return this.note;
    }

    public ListaContatti note(String note) {
        this.setNote(note);
        return this;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public Set<ContattoItem> getContattis() {
        return this.contattis;
    }

    public void setContattis(Set<ContattoItem> contattoItems) {
        if (this.contattis != null) {
            this.contattis.forEach(i -> i.setLista(null));
        }
        if (contattoItems != null) {
            contattoItems.forEach(i -> i.setLista(this));
        }
        this.contattis = contattoItems;
    }

    public ListaContatti contattis(Set<ContattoItem> contattoItems) {
        this.setContattis(contattoItems);
        return this;
    }

    public ListaContatti addContatti(ContattoItem contattoItem) {
        this.contattis.add(contattoItem);
        contattoItem.setLista(this);
        return this;
    }

    public ListaContatti removeContatti(ContattoItem contattoItem) {
        this.contattis.remove(contattoItem);
        contattoItem.setLista(null);
        return this;
    }

    public Menu getMenu() {
        return this.menu;
    }

    public void setMenu(Menu menu) {
        if (this.menu != null) {
            this.menu.setContatti(null);
        }
        if (menu != null) {
            menu.setContatti(this);
        }
        this.menu = menu;
    }

    public ListaContatti menu(Menu menu) {
        this.setMenu(menu);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ListaContatti)) {
            return false;
        }
        return getId() != null && getId().equals(((ListaContatti) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ListaContatti{" +
            "id=" + getId() +
            ", note='" + getNote() + "'" +
            "}";
    }
}
