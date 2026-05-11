package main.service.mapper;

import main.domain.ListaContatti;
import main.service.dto.ListaContattiDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link ListaContatti} and its DTO {@link ListaContattiDTO}.
 */
@Mapper(componentModel = "spring")
public interface ListaContattiMapper extends EntityMapper<ListaContattiDTO, ListaContatti> {}
