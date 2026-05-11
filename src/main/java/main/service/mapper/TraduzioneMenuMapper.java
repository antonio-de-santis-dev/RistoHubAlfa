package main.service.mapper;

import main.domain.Menu;
import main.domain.TraduzioneMenu;
import main.service.dto.MenuDTO;
import main.service.dto.TraduzioneMenuDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link TraduzioneMenu} and its DTO {@link TraduzioneMenuDTO}.
 */
@Mapper(componentModel = "spring")
public interface TraduzioneMenuMapper extends EntityMapper<TraduzioneMenuDTO, TraduzioneMenu> {
    @Mapping(target = "menu", source = "menu", qualifiedByName = "menuId")
    TraduzioneMenuDTO toDto(TraduzioneMenu s);

    @Named("menuId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    MenuDTO toDtoMenuId(Menu menu);
}
