package main.service.mapper;

import main.domain.Menu;
import main.domain.PiattoDelGiorno;
import main.domain.Prodotto;
import main.service.dto.MenuDTO;
import main.service.dto.PiattoDelGiornoDTO;
import main.service.dto.ProdottoDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link PiattoDelGiorno} and its DTO {@link PiattoDelGiornoDTO}.
 */
@Mapper(componentModel = "spring")
public interface PiattoDelGiornoMapper extends EntityMapper<PiattoDelGiornoDTO, PiattoDelGiorno> {
    @Mapping(target = "menu", source = "menu", qualifiedByName = "menuId")
    @Mapping(target = "prodotto", source = "prodotto", qualifiedByName = "prodottoId")
    PiattoDelGiornoDTO toDto(PiattoDelGiorno s);

    @Named("menuId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    MenuDTO toDtoMenuId(Menu menu);

    @Named("prodottoId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ProdottoDTO toDtoProdottoId(Prodotto prodotto);
}
