package main.service.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Lob;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link main.domain.Menu} entity.
 */
@Schema(
    description = "Menu digitale del ristorante.\nUnico stile visivo: classico a tendina (accordion Bootstrap).\nNessuna scelta di template, colori o font."
)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class MenuDTO implements Serializable {

    private Long id;

    @NotNull
    private String nome;

    private String descrizione;

    @NotNull
    private Boolean attivo;

    @Lob
    private byte[] logo;

    private String logoContentType;

    private String logoNome;

    private ListaContattiDTO contatti;

    @NotNull
    private UserDTO ristoratore;

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

    public Boolean getAttivo() {
        return attivo;
    }

    public void setAttivo(Boolean attivo) {
        this.attivo = attivo;
    }

    public byte[] getLogo() {
        return logo;
    }

    public void setLogo(byte[] logo) {
        this.logo = logo;
    }

    public String getLogoContentType() {
        return logoContentType;
    }

    public void setLogoContentType(String logoContentType) {
        this.logoContentType = logoContentType;
    }

    public String getLogoNome() {
        return logoNome;
    }

    public void setLogoNome(String logoNome) {
        this.logoNome = logoNome;
    }

    public ListaContattiDTO getContatti() {
        return contatti;
    }

    public void setContatti(ListaContattiDTO contatti) {
        this.contatti = contatti;
    }

    public UserDTO getRistoratore() {
        return ristoratore;
    }

    public void setRistoratore(UserDTO ristoratore) {
        this.ristoratore = ristoratore;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof MenuDTO)) {
            return false;
        }

        MenuDTO menuDTO = (MenuDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, menuDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "MenuDTO{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", descrizione='" + getDescrizione() + "'" +
            ", attivo='" + getAttivo() + "'" +
            ", logo='" + getLogo() + "'" +
            ", logoNome='" + getLogoNome() + "'" +
            ", contatti=" + getContatti() +
            ", ristoratore=" + getRistoratore() +
            "}";
    }
}
