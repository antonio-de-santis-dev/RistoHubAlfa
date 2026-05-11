package main.service.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Lob;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link main.domain.TraduzioneMenu} entity.
 */
@Schema(
    description = "Traduzione automatica del menu in una lingua specifica.\nGenerata via API esterna al salvataggio del menu.\nmodificata=true -> l'utente ha editato la traduzione automatica.\nIl campo lingua usa codici ISO 639-1: \"en\", \"fr\", \"de\", \"es\""
)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class TraduzioneMenuDTO implements Serializable {

    private Long id;

    @NotNull
    @Size(max = 5)
    private String lingua;

    @Lob
    private String contenutoJson;

    @NotNull
    private Boolean modificata;

    @NotNull
    private MenuDTO menu;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLingua() {
        return lingua;
    }

    public void setLingua(String lingua) {
        this.lingua = lingua;
    }

    public String getContenutoJson() {
        return contenutoJson;
    }

    public void setContenutoJson(String contenutoJson) {
        this.contenutoJson = contenutoJson;
    }

    public Boolean getModificata() {
        return modificata;
    }

    public void setModificata(Boolean modificata) {
        this.modificata = modificata;
    }

    public MenuDTO getMenu() {
        return menu;
    }

    public void setMenu(MenuDTO menu) {
        this.menu = menu;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TraduzioneMenuDTO)) {
            return false;
        }

        TraduzioneMenuDTO traduzioneMenuDTO = (TraduzioneMenuDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, traduzioneMenuDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TraduzioneMenuDTO{" +
            "id=" + getId() +
            ", lingua='" + getLingua() + "'" +
            ", contenutoJson='" + getContenutoJson() + "'" +
            ", modificata='" + getModificata() + "'" +
            ", menu=" + getMenu() +
            "}";
    }
}
