package main.service.mapper;

import main.domain.ContattoItem;
import main.domain.ListaContatti;
import main.service.dto.ContattoItemDTO;
import main.service.dto.ListaContattiDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link ContattoItem} and its DTO {@link ContattoItemDTO}.
 */
@Mapper(componentModel = "spring")
public interface ContattoItemMapper extends EntityMapper<ContattoItemDTO, ContattoItem> {
    @Mapping(target = "lista", source = "lista", qualifiedByName = "listaContattiId")
    ContattoItemDTO toDto(ContattoItem s);

    @Named("listaContattiId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ListaContattiDTO toDtoListaContattiId(ListaContatti listaContatti);
}
