package main.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * Traduzione automatica del menu in una lingua specifica.
 * Generata via API esterna al salvataggio del menu.
 * modificata=true -> l'utente ha editato la traduzione automatica.
 * Il campo lingua usa codici ISO 639-1: \"en\", \"fr\", \"de\", \"es\"
 */
@Entity
@Table(name = "traduzione_menu")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class TraduzioneMenu implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 5)
    @Column(name = "lingua", length = 5, nullable = false)
    private String lingua;

    @Lob
    @Column(name = "contenuto_json", nullable = false)
    private String contenutoJson;

    @NotNull
    @Column(name = "modificata", nullable = false)
    private Boolean modificata;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "contatti", "portates", "traduzionis", "ristoratore" }, allowSetters = true)
    private Menu menu;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public TraduzioneMenu id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLingua() {
        return this.lingua;
    }

    public TraduzioneMenu lingua(String lingua) {
        this.setLingua(lingua);
        return this;
    }

    public void setLingua(String lingua) {
        this.lingua = lingua;
    }

    public String getContenutoJson() {
        return this.contenutoJson;
    }

    public TraduzioneMenu contenutoJson(String contenutoJson) {
        this.setContenutoJson(contenutoJson);
        return this;
    }

    public void setContenutoJson(String contenutoJson) {
        this.contenutoJson = contenutoJson;
    }

    public Boolean getModificata() {
        return this.modificata;
    }

    public TraduzioneMenu modificata(Boolean modificata) {
        this.setModificata(modificata);
        return this;
    }

    public void setModificata(Boolean modificata) {
        this.modificata = modificata;
    }

    public Menu getMenu() {
        return this.menu;
    }

    public void setMenu(Menu menu) {
        this.menu = menu;
    }

    public TraduzioneMenu menu(Menu menu) {
        this.setMenu(menu);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TraduzioneMenu)) {
            return false;
        }
        return getId() != null && getId().equals(((TraduzioneMenu) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TraduzioneMenu{" +
            "id=" + getId() +
            ", lingua='" + getLingua() + "'" +
            ", contenutoJson='" + getContenutoJson() + "'" +
            ", modificata='" + getModificata() + "'" +
            "}";
    }
}
