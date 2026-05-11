package main.service.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;
import main.domain.enumeration.TipoContatto;

/**
 * A DTO for the {@link main.domain.ContattoItem} entity.
 */
@Schema(
    description = "Singolo recapito (telefono, email, social, sito web).\n\nIl campo \"tipo\" (enum TipoContatto) determina quale icona mostrare:\n- TELEFONO / EMAIL / SITO_WEB -> icone Tabler (ti-phone, ti-mail, ti-world)\n- Social (FACEBOOK..TRIPADVISOR) -> SVG inline da social-icons.ts\n\nIl frontend usa getSocialIconSvg(tipo) per iniettare la SVG,\nsenza dover gestire file PNG o asset aggiuntivi."
)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ContattoItemDTO implements Serializable {

    private Long id;

    @NotNull
    private TipoContatto tipo;

    @NotNull
    private String valore;

    private String etichetta;

    @NotNull
    @Min(value = 0)
    private Integer ordine;

    @NotNull
    private ListaContattiDTO lista;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TipoContatto getTipo() {
        return tipo;
    }

    public void setTipo(TipoContatto tipo) {
        this.tipo = tipo;
    }

    public String getValore() {
        return valore;
    }

    public void setValore(String valore) {
        this.valore = valore;
    }

    public String getEtichetta() {
        return etichetta;
    }

    public void setEtichetta(String etichetta) {
        this.etichetta = etichetta;
    }

    public Integer getOrdine() {
        return ordine;
    }

    public void setOrdine(Integer ordine) {
        this.ordine = ordine;
    }

    public ListaContattiDTO getLista() {
        return lista;
    }

    public void setLista(ListaContattiDTO lista) {
        this.lista = lista;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ContattoItemDTO)) {
            return false;
        }

        ContattoItemDTO contattoItemDTO = (ContattoItemDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, contattoItemDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ContattoItemDTO{" +
            "id=" + getId() +
            ", tipo='" + getTipo() + "'" +
            ", valore='" + getValore() + "'" +
            ", etichetta='" + getEtichetta() + "'" +
            ", ordine=" + getOrdine() +
            ", lista=" + getLista() +
            "}";
    }
}
