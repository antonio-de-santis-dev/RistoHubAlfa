package main.service.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Lob;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link main.domain.Menu} entity.
 * Include i campi stile (colorePrimario, coloreSecondario, fontMenu)
 * impostati dal menu-wizard e menu-wizard-edit.
 */
@Schema(description = "Menu digitale del ristorante con stile visivo configurabile.")
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

    /** Colore principale hex (es. #C8102E) */
    private String colorePrimario;

    /** Colore secondario hex (es. #F5E6C8) */
    private String coloreSecondario;

    /** Nome font Google Fonts (es. "Playfair Display") */
    private String fontMenu;

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

    public String getColorePrimario() {
        return colorePrimario;
    }

    public void setColorePrimario(String colorePrimario) {
        this.colorePrimario = colorePrimario;
    }

    public String getColoreSecondario() {
        return coloreSecondario;
    }

    public void setColoreSecondario(String coloreSecondario) {
        this.coloreSecondario = coloreSecondario;
    }

    public String getFontMenu() {
        return fontMenu;
    }

    public void setFontMenu(String fontMenu) {
        this.fontMenu = fontMenu;
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
        if (this == o) return true;
        if (!(o instanceof MenuDTO)) return false;
        MenuDTO menuDTO = (MenuDTO) o;
        if (this.id == null) return false;
        return Objects.equals(this.id, menuDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    @Override
    public String toString() {
        return (
            "MenuDTO{" +
            "id=" +
            getId() +
            ", nome='" +
            getNome() +
            "'" +
            ", attivo='" +
            getAttivo() +
            "'" +
            ", colorePrimario='" +
            getColorePrimario() +
            "'" +
            ", coloreSecondario='" +
            getColoreSecondario() +
            "'" +
            ", fontMenu='" +
            getFontMenu() +
            "'" +
            ", contatti=" +
            getContatti() +
            ", ristoratore=" +
            getRistoratore() +
            "}"
        );
    }
}
