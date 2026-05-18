package main.service.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;
import main.domain.enumeration.NomePortataDefault;
import main.domain.enumeration.TipoPortata;

/**
 * A DTO for the {@link main.domain.Portata} entity.
 */
@Schema(
    description = "Portata (sezione) del menu.\n\nIl campo \"ordine\" e' gestito dal backend con valori fissi:\nANTIPASTO=10, PRIMO=20, SECONDO=30, CONTORNO=40,\nPERSONALIZZATA=45+ (auto-incrementale per permettere piu' portate custom),\nDOLCE=50, BEVANDA=60, VINO_ROSSO=70, VINO_BIANCO=80,\nVINO_ROSATO=90, BIRRA=100, DIGESTIVO=110\n\nCosi' le portate personalizzate si posizionano sempre\ndopo CONTORNO e prima di DOLCE, come richiesto."
)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class PortataDTO implements Serializable {

    private Long id;

    @NotNull
    private TipoPortata tipo;

    private NomePortataDefault nomeDefault;

    private String nomePersonalizzato;

    @Min(value = 0)
    private Integer ordine;

    @NotNull
    private MenuDTO menu;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TipoPortata getTipo() {
        return tipo;
    }

    public void setTipo(TipoPortata tipo) {
        this.tipo = tipo;
    }

    public NomePortataDefault getNomeDefault() {
        return nomeDefault;
    }

    public void setNomeDefault(NomePortataDefault nomeDefault) {
        this.nomeDefault = nomeDefault;
    }

    public String getNomePersonalizzato() {
        return nomePersonalizzato;
    }

    public void setNomePersonalizzato(String nomePersonalizzato) {
        this.nomePersonalizzato = nomePersonalizzato;
    }

    public Integer getOrdine() {
        return ordine;
    }

    public void setOrdine(Integer ordine) {
        this.ordine = ordine;
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
        if (!(o instanceof PortataDTO)) {
            return false;
        }

        PortataDTO portataDTO = (PortataDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, portataDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PortataDTO{" +
            "id=" + getId() +
            ", tipo='" + getTipo() + "'" +
            ", nomeDefault='" + getNomeDefault() + "'" +
            ", nomePersonalizzato='" + getNomePersonalizzato() + "'" +
            ", ordine=" + getOrdine() +
            ", menu=" + getMenu() +
            "}";
    }
}
