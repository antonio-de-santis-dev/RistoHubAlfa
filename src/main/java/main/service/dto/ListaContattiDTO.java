package main.service.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link main.domain.ListaContatti} entity.
 */
@Schema(description = "Lista dei recapiti del ristorante, collegata al menu.\nVisualizzata come card nella pagina pubblica QR.")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ListaContattiDTO implements Serializable {

    private Long id;

    private String note;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ListaContattiDTO)) {
            return false;
        }

        ListaContattiDTO listaContattiDTO = (ListaContattiDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, listaContattiDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ListaContattiDTO{" +
            "id=" + getId() +
            ", note='" + getNote() + "'" +
            "}";
    }
}
