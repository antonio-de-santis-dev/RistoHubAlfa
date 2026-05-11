package main.service.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;
import main.domain.enumeration.LivelloUtente;

/**
 * A DTO for the {@link main.domain.ProfiloRistoratore} entity.
 */
@Schema(
    description = "Profilo aggiuntivo del ristoratore, collegato 1-a-1 all'utente JHipster.\nL'attivazione account e' gia' gestita dall'entita' User built-in di JHipster\n(campo \"activated\" nella tabella jhi_user) — non serve duplicarla qui.\nL'admin attiva l'utente dal pannello di amministrazione JHipster standard.\n\nIl campo \"livello\" determina i limiti dell'account (vedi enum LivelloUtente).\nIl controllo viene eseguito nel MenuServiceImpl contando i Menu\nassociati all'utente corrente con findAllByRistoratoreIsCurrentUser()."
)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ProfiloRistoratoreDTO implements Serializable {

    private Long id;

    @NotNull
    private LivelloUtente livello;

    @NotNull
    private UserDTO user;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LivelloUtente getLivello() {
        return livello;
    }

    public void setLivello(LivelloUtente livello) {
        this.livello = livello;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProfiloRistoratoreDTO)) {
            return false;
        }

        ProfiloRistoratoreDTO profiloRistoratoreDTO = (ProfiloRistoratoreDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, profiloRistoratoreDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProfiloRistoratoreDTO{" +
            "id=" + getId() +
            ", livello='" + getLivello() + "'" +
            ", user=" + getUser() +
            "}";
    }
}
