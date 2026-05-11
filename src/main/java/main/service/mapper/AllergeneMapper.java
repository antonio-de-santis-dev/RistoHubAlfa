package main.service.mapper;

import java.util.Set;
import java.util.stream.Collectors;
import main.domain.Allergene;
import main.domain.Prodotto;
import main.service.dto.AllergeneDTO;
import main.service.dto.ProdottoDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Allergene} and its DTO {@link AllergeneDTO}.
 */
@Mapper(componentModel = "spring")
public interface AllergeneMapper extends EntityMapper<AllergeneDTO, Allergene> {
    @Mapping(target = "prodottis", source = "prodottis", qualifiedByName = "prodottoIdSet")
    AllergeneDTO toDto(Allergene s);

    @Mapping(target = "prodottis", ignore = true)
    @Mapping(target = "removeProdotti", ignore = true)
    Allergene toEntity(AllergeneDTO allergeneDTO);

    @Named("prodottoId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ProdottoDTO toDtoProdottoId(Prodotto prodotto);

    @Named("prodottoIdSet")
    default Set<ProdottoDTO> toDtoProdottoIdSet(Set<Prodotto> prodotto) {
        return prodotto.stream().map(this::toDtoProdottoId).collect(Collectors.toSet());
    }
}
