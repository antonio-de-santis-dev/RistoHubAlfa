package main.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * Menu digitale del ristorante.
 * Unico stile visivo: classico a tendina (accordion Bootstrap).
 * Nessuna scelta di template, colori o font.
 */
@Entity
@Table(name = "menu")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Menu implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "descrizione")
    private String descrizione;

    @NotNull
    @Column(name = "attivo", nullable = false)
    private Boolean attivo;

    @Lob
    @Column(name = "logo")
    private byte[] logo;

    @Column(name = "logo_content_type")
    private String logoContentType;

    @Column(name = "logo_nome")
    private String logoNome;

    @JsonIgnoreProperties(value = { "contattis", "menu" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(unique = true)
    private ListaContatti contatti;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "menu")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "prodottis", "menu" }, allowSetters = true)
    private Set<Portata> portates = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "menu")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "menu" }, allowSetters = true)
    private Set<TraduzioneMenu> traduzionis = new HashSet<>();

    @ManyToOne(optional = false)
    @NotNull
    private User ristoratore;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Menu id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return this.nome;
    }

    public Menu nome(String nome) {
        this.setNome(nome);
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescrizione() {
        return this.descrizione;
    }

    public Menu descrizione(String descrizione) {
        this.setDescrizione(descrizione);
        return this;
    }

    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }

    public Boolean getAttivo() {
        return this.attivo;
    }

    public Menu attivo(Boolean attivo) {
        this.setAttivo(attivo);
        return this;
    }

    public void setAttivo(Boolean attivo) {
        this.attivo = attivo;
    }

    public byte[] getLogo() {
        return this.logo;
    }

    public Menu logo(byte[] logo) {
        this.setLogo(logo);
        return this;
    }

    public void setLogo(byte[] logo) {
        this.logo = logo;
    }

    public String getLogoContentType() {
        return this.logoContentType;
    }

    public Menu logoContentType(String logoContentType) {
        this.logoContentType = logoContentType;
        return this;
    }

    public void setLogoContentType(String logoContentType) {
        this.logoContentType = logoContentType;
    }

    public String getLogoNome() {
        return this.logoNome;
    }

    public Menu logoNome(String logoNome) {
        this.setLogoNome(logoNome);
        return this;
    }

    public void setLogoNome(String logoNome) {
        this.logoNome = logoNome;
    }

    public ListaContatti getContatti() {
        return this.contatti;
    }

    public void setContatti(ListaContatti listaContatti) {
        this.contatti = listaContatti;
    }

    public Menu contatti(ListaContatti listaContatti) {
        this.setContatti(listaContatti);
        return this;
    }

    public Set<Portata> getPortates() {
        return this.portates;
    }

    public void setPortates(Set<Portata> portatas) {
        if (this.portates != null) {
            this.portates.forEach(i -> i.setMenu(null));
        }
        if (portatas != null) {
            portatas.forEach(i -> i.setMenu(this));
        }
        this.portates = portatas;
    }

    public Menu portates(Set<Portata> portatas) {
        this.setPortates(portatas);
        return this;
    }

    public Menu addPortate(Portata portata) {
        this.portates.add(portata);
        portata.setMenu(this);
        return this;
    }

    public Menu removePortate(Portata portata) {
        this.portates.remove(portata);
        portata.setMenu(null);
        return this;
    }

    public Set<TraduzioneMenu> getTraduzionis() {
        return this.traduzionis;
    }

    public void setTraduzionis(Set<TraduzioneMenu> traduzioneMenus) {
        if (this.traduzionis != null) {
            this.traduzionis.forEach(i -> i.setMenu(null));
        }
        if (traduzioneMenus != null) {
            traduzioneMenus.forEach(i -> i.setMenu(this));
        }
        this.traduzionis = traduzioneMenus;
    }

    public Menu traduzionis(Set<TraduzioneMenu> traduzioneMenus) {
        this.setTraduzionis(traduzioneMenus);
        return this;
    }

    public Menu addTraduzioni(TraduzioneMenu traduzioneMenu) {
        this.traduzionis.add(traduzioneMenu);
        traduzioneMenu.setMenu(this);
        return this;
    }

    public Menu removeTraduzioni(TraduzioneMenu traduzioneMenu) {
        this.traduzionis.remove(traduzioneMenu);
        traduzioneMenu.setMenu(null);
        return this;
    }

    public User getRistoratore() {
        return this.ristoratore;
    }

    public void setRistoratore(User user) {
        this.ristoratore = user;
    }

    public Menu ristoratore(User user) {
        this.setRistoratore(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Menu)) {
            return false;
        }
        return getId() != null && getId().equals(((Menu) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Menu{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", descrizione='" + getDescrizione() + "'" +
            ", attivo='" + getAttivo() + "'" +
            ", logo='" + getLogo() + "'" +
            ", logoContentType='" + getLogoContentType() + "'" +
            ", logoNome='" + getLogoNome() + "'" +
            "}";
    }
}
