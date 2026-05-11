package main.service.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import main.domain.enumeration.NomeAllergeneDefault;
import main.domain.enumeration.TipoAllergene;

/**
 * A DTO for the {@link main.domain.Allergene} entity.
 */
@Schema(
    description = "Allergene associabile ai prodotti.\n\ntipo = DEFAULT:\n- nomeDefault valorizzato con uno dei 14 EU\n- nome pre-compilato col nome italiano (es. \"Glutine\")\n- icona: /assets/images/allergeni/{nomeDefault_minuscolo}.png\n\ntipo = PERSONALIZZATO:\n- nomeDefault e' null\n- nome libero inserito dal ristoratore (es. \"Ananas\", \"Cannella\")\n- icona: /assets/images/allergeni/custom.png (universale)"
)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AllergeneDTO implements Serializable {

    private Long id;

    @NotNull
    private String nome;

    @NotNull
    private TipoAllergene tipo;

    private NomeAllergeneDefault nomeDefault;

    private Set<ProdottoDTO> prodottis = new HashSet<>();

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

    public TipoAllergene getTipo() {
        return tipo;
    }

    public void setTipo(TipoAllergene tipo) {
        this.tipo = tipo;
    }

    public NomeAllergeneDefault getNomeDefault() {
        return nomeDefault;
    }

    public void setNomeDefault(NomeAllergeneDefault nomeDefault) {
        this.nomeDefault = nomeDefault;
    }

    public Set<ProdottoDTO> getProdottis() {
        return prodottis;
    }

    public void setProdottis(Set<ProdottoDTO> prodottis) {
        this.prodottis = prodottis;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AllergeneDTO)) {
            return false;
        }

        AllergeneDTO allergeneDTO = (AllergeneDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, allergeneDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AllergeneDTO{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", tipo='" + getTipo() + "'" +
            ", nomeDefault='" + getNomeDefault() + "'" +
            ", prodottis=" + getProdottis() +
            "}";
    }
}
