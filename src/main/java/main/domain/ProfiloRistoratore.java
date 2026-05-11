package main.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import main.domain.enumeration.LivelloUtente;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * Profilo aggiuntivo del ristoratore, collegato 1-a-1 all'utente JHipster.
 * L'attivazione account e' gia' gestita dall'entita' User built-in di JHipster
 * (campo \"activated\" nella tabella jhi_user) — non serve duplicarla qui.
 * L'admin attiva l'utente dal pannello di amministrazione JHipster standard.
 *
 * Il campo \"livello\" determina i limiti dell'account (vedi enum LivelloUtente).
 * Il controllo viene eseguito nel MenuServiceImpl contando i Menu
 * associati all'utente corrente con findAllByRistoratoreIsCurrentUser().
 */
@Entity
@Table(name = "profilo_ristoratore")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ProfiloRistoratore implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "livello", nullable = false)
    private LivelloUtente livello;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @NotNull
    @JoinColumn(unique = true)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ProfiloRistoratore id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LivelloUtente getLivello() {
        return this.livello;
    }

    public ProfiloRistoratore livello(LivelloUtente livello) {
        this.setLivello(livello);
        return this;
    }

    public void setLivello(LivelloUtente livello) {
        this.livello = livello;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public ProfiloRistoratore user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProfiloRistoratore)) {
            return false;
        }
        return getId() != null && getId().equals(((ProfiloRistoratore) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProfiloRistoratore{" +
            "id=" + getId() +
            ", livello='" + getLivello() + "'" +
            "}";
    }
}
